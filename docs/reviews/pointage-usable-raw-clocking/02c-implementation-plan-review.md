Change: pointage-usable-raw-clocking
Gate: SENSITIVE DESIGN / TASK 2.8 ALIGNMENT REVIEW
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-08T20:50:10.952Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

## Current review — planning only, no Apply

Status: AWAITING_HUMAN_REVIEW
APPLY: PAUSED
Tasks: 15/32
Task 2.8: NOT_STARTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

Explicit current-user architecture clarification in attachment
0923ddfa-b339-460e-bc6c-bea293bcfad1 authorizes bounded alignment only.
The prior 15/32 execution checkpoint stays unchanged. The old 02c approval
and blocked execution snapshots below are preserved history; they do not
authorize this revised task 2.8. Need explicit human approval before resuming.

### Exact before/after artifacts and changed sections

| Artifact | Before SHA-256                                                   | After SHA-256                                                    |
| -------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Design   | a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361 | 9a50dd1e76ce950b137d107ad66cb8e56fcb541ec882ef002379f26207606197 |
| Tasks    | 7bf96f696edc16578e36e157fc6b3a2d2390b461898077be633f2c810d79bbe8 | 7488d05ebc11dce56f64de5c21f6f6866a01893f53c532d14be5efaf35996574 |

Current [02b Design review](02b-design-review.md) contains the full exact Design
and column/table privilege inventory; current SHA-256:
e26f506559f7fac1bda8a01a282250d355cc582afdb538538b38f85a22b2b09e.
Prior 02b hash: 00661679c3682679a0d0a31eb8b21c2f34248544f85c9cbc7730a5b243adb116.
Prior 02c hash: 66720cc6515033cc999c157192f1fec25c866117cd8e2a87bfef277424a37d88.
Both old packets remain verbatim below their respective historical boundaries.

Exact four-file write set:

- openspec/changes/pointage-usable-raw-clocking/design.md
- openspec/changes/pointage-usable-raw-clocking/tasks.md
- docs/reviews/pointage-usable-raw-clocking/02b-design-review.md
- docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md

Design additions: D1a; D4b clarification cross-reference; Migration Plan note
for future task 2.8 synthetic harness, NOT migration 0021.
Tasks changes: current alignment metadata; Service/TIC scope sentence;
S9 row; detailed S9/2.8 proof/regression section; related beyond-D1a
grant/owner stop condition; existing task 2.8 text only.
All other planning regions and all 32 checkbox states preserved byte-for-byte
by reverse-reconstruction against the pre-edit artifacts. No extra task/phase.

### Same-database clients and exact least privilege

Two independently authenticated injected clients on the SAME D1 verified
raw-clocking disposable database:

- foundationClient -> yuta_pointage_foundation_runtime, validation-only.
- rawClient -> unchanged yuta_pointage_raw_writer, D4b/F8.

CLOUD_DATABASE_URL is target authority, not bootstrap runtime credentials.
Sources must match target hostname/port/name; each actual connection proves
current_database(), session_user and current_user independently. Both DB names
must equal the exact D1 name and independently pass its whole-string rule.
No C17 target, another DB, SET ROLE, swapped/merged clients, owner fallback
or generic service locator. No production credential/provider contract.

Foundation role: LOGIN/NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOREPLICATION/
NOBYPASSRLS/NOINHERIT; no other-role membership/SET path, object ownership,
GRANT OPTION, DDL, source/credential/attendance mutation or continuation access.
D1a lists six exact tables and every SELECT/INSERT/UPDATE column, including
predicates: trusted scope; Personnel lifecycle only; current credential
candidate; seven-column limiter read/eight-column INSERT/four-column UPDATE;
twelve-column audit INSERT only. No table-wide privilege, audit SELECT or helper
EXECUTE. The seven allowed repository methods need no DELETE or forbidden
source/credential write. That conclusion is current-source inspection, not
execution proof of the new role.

Required startup order: D1 -> foundation target/role -> raw target/role ->
same actual DB -> foundation exact effective privileges -> raw F8 ->
approved injected synthetic provider -> foundation service/raw runtime.
Every negative in the exact S9 section below fails before usable credential
processing. Actual least-privilege positive and alternate-SQL negatives remain
future Apply work, not satisfied by old tests.

No shared PostgreSQL transaction: foundation prevalidation/limiter/minimized
audit remain separate; final acceptance stays on raw transaction with locks,
current credential/Personnel/continuation/operation/time rechecks, stateGuard
and raw+receipt atomic commit. No stale foundation read authorizes mutation.

### Exact revised S9 and task 2.8

```text
| S9  | D1a dual-client SAME-DATABASE synthetic runtime: exact foundation validation-only and unchanged raw writer identities/column privileges, both-source/actual-target proof before provider or credential processing. No merged pool, SET ROLE, owner fallback or runtime repair; existing limiter and generic failures unchanged.                               | Ordered admission spies; seven-method footprint, forbidden writes/reads/EXECUTE, wrong/missing/swapped clients, C17/other target, admin/membership/ACL/provenance denials; independent clients after Apply approval.        |
- [ ] 2.8 Compose D1a/S9 dual-client same-database test-only runtime and S8 minimized denial/audit handling; verify ordered D1 target, both exact role identities/same-DB/effective-privilege proofs before synthetic provider and credential processing, all S9 negative cases, existing distributed limits and no secret/identity leak. No 0021 edit or owner fallback.
```

### Exact related TIC authority/stop wording

```text
Design D1a, D2-D10; all A1-A7 and raw R1-R10. No new shared package or Product
grant; only the test-only database role/column grants explicitly bounded by D1a.

cannot coordinate existing reset/lifecycle writers, or grant/owner beyond D1a needed:
STOP at Design/Control Tower; no silent Spec edits.
```

### Exact S9 / regression planning addition

```markdown
### S9 / task 2.8 — bounded dual-client alignment

Current-user approved architecture: DUAL-CLIENT / SAME-DATABASE SYNTHETIC RUNTIME.
Đây chỉ là planning alignment; APPLY PAUSED, Tasks 15/32 và checkbox 2.8 giữ
NOT_STARTED. Không re-run/claim lại completed 1.1-1.8 hoặc 2.1-2.7.

Technical authority và exact column/table grants: Design D1a. Existing D1,
D4a/D4b, F8 và S1-S8 giữ nguyên. `foundationClient` xác thực độc lập dưới
`yuta_pointage_foundation_runtime`; `rawClient` dưới
`yuta_pointage_raw_writer`, SAME exact verified raw-clocking DB. Role mới chỉ
validation DB execution identity, không Product/employee/manager/production role.
Không dùng C17 foundation DB hoặc bootstrap/migration identity cho runtime.

Future 2.8 phải thực hiện đủ thứ tự: D1 environment/target guard; foundation
source tuple + actual DB/session_user/current_user proof; raw source tuple +
independent actual DB/session_user/current_user proof; SAME database equality và
cả hai actual names pass exact D1 regex; foundation exact effective privileges;
unchanged raw F8 proof; injected synthetic trusted-address provider; chỉ sau đó
create foundation service và raw runtime. Không SET ROLE, merge pools/untyped
handles, shared transaction, production credential contract hoặc .env fallback.

Allowed foundation methods chỉ resolveActiveEntryScope, findCredentialCandidate,
findPersonnelEmploymentPeriod, isRateLimitBlocked, recordRateLimitFailure,
resetCandidateRateLimit, appendAudit. D1a inventory bao gồm predicate columns,
limiter INSERT tám / UPDATE bốn cột, audit INSERT mười hai cột; không whole-table
grants hoặc credential/Personnel/Tenancy mutation. Existing limiter reset dùng
UPDATE, không DELETE; existing limiter row lock không cần source UPDATE.
Foundation validation/audit transactions không thay final raw transaction checks.

Test-only harness có thể provision role D1a và ephemeral injected connections
sau D1 target proof, chỉ khi future Apply được authorize. Không sửa migration
0021 để provision role mới; không mở rộng raw writer hoặc role/ownership ngoài
D1a. Existing role/ACL bất ngờ -> STOP, không automatic repair. Dùng existing
DOMAIN/SERVICE_TEST/DBTEST allowlist cho integration; không dependency/package/
generic service locator mới. Bất kỳ required privilege ngoài bảy methods -> STOP.

Required tests/evidence (plans only):

- Missing foundation/raw client; another raw database; C17 database; unequal
  hostname/port/name; bootstrap/admin as either client; swapped clients;
  session_user/current_user mismatch và failed/missing target probe.
- Foundation effective privilege có raw table access, credential issue/reset/
  supersession write, helper EXECUTE, continuation access, Personnel/Tenancy
  mutation, DDL/schema CREATE/DELETE/TRUNCATE, ownership hoặc GRANT OPTION.
- Raw writer nhận foundation limiter/audit privilege; either role có membership/
  MEMBER/USAGE/SET path, PUBLIC/default ACL excess; không runtime ACL repair.
- Missing/untrusted provider. Spy trên constructor/provider/hash/lookup chứng
  minh denial ở đúng prerequisite, trước usable credential processing.
- Positive independent authenticated clients cùng exact DB; thực thi đủ bảy
  allowed methods với exact column grants, denied alternate SQL ngoài footprint;
  raw client vẫn pass unchanged F8, Foundation issue/reset không usable.
- Credential prevalidation/rate limiting/audit ở foundation connection riêng;
  raw post-lock credential/lifecycle/continuation/stateGuard re-check và paired
  commit không bypass vì stale foundation success. Existing candidate/client
  limits, audit minimization và non-enumeration vẫn phải regression-test.
- C17 8/8 giữ riêng là prior foundation regression, không runtime topology proof.
  Không tính các negative/positive plans này đã PASS từ evidence cũ.

Task 2.9 và post-Apply VERIFY phải map S9 mới tới code/test/actual-client evidence;
chưa có evidence mới thì không đánh dấu 2.8/2.9 complete. QA riêng sau VERIFY,
Browser QA không được bypass D1/D1a. UI pack/provenance/no-image và bốn Apply
phases/32 tasks không thay. Bảy production/legal/privacy blockers giữ nguyên;
real attendance và production enablement NOT_AUTHORIZED.
```

### Preserved requirement, UI and implementation evidence

Gate 1/2 hashes/path sets unchanged. Two delta Specs only:
authorization/pointage 7 requirements / 21 scenarios;
pointage/raw-clocking 13 requirements / 41 scenarios; total 20/62.
No Product/Spec rewrite or reopened Gate 1/2; P1-P14 preserved.

| Path                                                                                 | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md`                    | `ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557` |
| `docs/reviews/pointage-usable-raw-clocking/02-specs-review.md`                       | `c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566` |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md`                          | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                            | `9a50dd1e76ce950b137d107ad66cb8e56fcb541ec882ef002379f26207606197` |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md`                          | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` |
| `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md` | `1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66` |
| `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`  | `4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                             | `7488d05ebc11dce56f64de5c21f6f6866a01893f53c532d14be5efaf35996574` |

Four existing phases, 32 tasks; 15 checked. Foundation/Data 1.1-1.8 and
Service/Domain 2.1-2.7 unchanged COMPLETE. Task 2.8 NOT_STARTED, 2.9 not complete.
No role provision, migration edit, application/package code change or
implementation/test execution this turn. Future role provisioning belongs to
guarded task 2.8, not 0021 or already-completed Foundation tasks.
C17 remains prior 8/8 evidence on its own database, not a usable runtime DB.

Preflight: 2026-09-08T20:45:26.173Z, HEAD defbc50eba3952fa2e7b1c016637daf083b18c65,
2584 tracked/untracked paths hashed. All 1242
apps/packages paths are outside the write set. Exact resumed raw implementation
and test hashes remain:

| Unchanged implementation path                                                | SHA-256                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/pointage/raw-chain.ts`                           | `0b8446a543cad544614ae7c7d366cfa771d0011d16adc7bc7d1d00405731f83c` |
| `apps/backoffice/src/server/pointage/raw-clocking-manager.ts`                | `209183808c72c1a9c677d57b2603dd5030336ad864d1ff542df1f0d06f27d948` |
| `apps/backoffice/src/server/pointage/raw-clocking-service.ts`                | `a144202f2b7af2955b458fc445b699342bb4ed8cdbda33a4d46905452dcd3d37` |
| `apps/backoffice/test/pointage-raw-chain.test.ts`                            | `b0fe2395ed36d944b911bafcf6dd51d20f08e3723d772189867c4f53d4a13277` |
| `apps/backoffice/test/pointage-raw-clocking-manager.test.ts`                 | `a36e3beaf3ee38da51eae92dafdb923a2d4d7364a45e58a3d4cdf3af338d1db7` |
| `apps/backoffice/test/pointage-raw-clocking-service.test.ts`                 | `6727c34fb9659f54068eccc8bc01dbf97f837a9142695fa821a032969ccdc0d4` |
| `packages/auth/src/pointage-continuation.ts`                                 | `f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172` |
| `packages/auth/test/pointage-continuation.test.ts`                           | `6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                  | `fa73b8431af57b3f066869750350ac7f8f716b2ad0debd86ac69f4c15d43b106` |
| `packages/db-cloud/src/schema/pointage-raw-clocking.ts`                      | `d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754` |
| `packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts`      | `1b57abee9273150d828e6d9b640849ba42af459eae7d4e7dca4e523d4ee98234` |
| `packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts` | `eb5693a3ba0f907e74862fa2e26c5d39e916c38ec54d219ed652a09af0aff2cc` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`                | `d6a10caa9edb95878605e8f3d1fa439e07e2aec5c221097a2f17bdac38b2e291` |
| `packages/db-cloud/test/pointage-raw-clocking.integration.test.ts`           | `5d0ea83bacb946300030a135e2f150c5b34c4a63197d98e8f4abf8a914b82cce` |

Shared auth/db-cloud indexes, Formalités hunks, generated 0021 SQL/snapshot/
journal, all other implementation and UI pack also remain unchanged against
that full inventory. Historical apply-c17-service-checkpoint.json hash
9a42a0f9952e218842106d0d1ebc29b9a3175c11359b2640e35f1dbe7a52a4cc
and diff hash 6363a602f65dbc85df9a3da0f4e72ea1ed33540a14e9256ac142e19a7476dec4
are preserved, not regenerated to conceal implementation drift.
Main Specs and archive unchanged; no lifecycle/Knowledge update.

Final full-checkout inventory also observed 17 concurrent out-of-scope paths
changed/added in workflow/UI-reference work; preserved, not attributed to this
alignment. See the current 02b packet for the exact path list. This does not
change the 1242-file implementation/Pointage authority preservation proof.

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES. Existing UI scope, pack provenance,
no-image direction and separate QA/POST-APPLY VERIFY plans preserved. Browser
QA may never bypass D1/D1a; it was not run here.

### Planning-only validation

Cwd D:/working/yuta/yuta-resto:

- pnpm exec openspec validate pointage-usable-raw-clocking --strict: exit 0.
- pnpm docs:check: exit 0, 36 current documents.
- pnpm architecture:check: exit 0.
- pnpm -r --if-present typecheck: exit 0.
- pnpm ui:pack:check backoffice-pointage-employee: exit 0, no warnings.
- Scoped prettier --check on the exact four write paths: exit 0 after packet
  assembly; no whole-file formatter writes or unrelated edits.
- pnpm format:check: exit 1, exactly 67 pre-existing unrelated warnings retained.

SHA-256 over exact file bytes via Node createHash/fs.readFileSync and
Get-FileHash -Algorithm SHA256; exact existing output paths came from current
OpenSpec status/instructions. Repeated checks after packet assembly are
planning validation only, not formal VERIFY/QA or new SQL test evidence.
No integration/unit tests, database commands, role/harness execution, cloud/local
build, Browser QA, sync/archive, deploy, enablement or readiness promotion.

### Human stop

SENSITIVE DESIGN / TASK 2.8 ALIGNMENT REVIEW
Status: AWAITING_HUMAN_REVIEW
APPLY: PAUSED
Tasks: 15/32
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

Approve the exact revised Design and Tasks/2.8 alignment before any Apply
resume. Seven blockers remain unresolved: exact retention duration;
deletion/anonymization; legal hold; backup-retention interaction; employee notice;
detailed audit visibility; trusted production client-address provenance.
Synthetic/disposable only; real attendance remains NOT_AUTHORIZED everywhere.

## Historical 02c packet — prior approval/checkpoints preserved verbatim

The following historical packet is not approval of the current D1a/S9 alignment
and does not authorize resuming task 2.8.

Change: pointage-usable-raw-clocking
Gate: TASKS / IMPLEMENTATION PLAN ALIGNMENT REVIEW
Review status: APPROVED
Created: 2026-09-08T12:02:15.5384860+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-08T12:43:24.6112249+02:00

Decision: TASKS_IMPLEMENTATION_PLAN_ALIGNMENT_APPROVED.

Apply authorization: GRANTED — RESUME from task 1.3 only after fresh preflight.

Approved Tasks SHA-256: e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281.

Approved Design SHA-256: a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361.

Reviewed packet pre-metadata SHA-256: 4a43db85422353d37a0132a7b47362ae6fab63d15c532442016ff7a834a50f04.

Current-user boundary: finish Apply or report BLOCKED, then STOP. No automatic
formal VERIFY, Browser QA or Gate 3. Earlier planning stop markers below are
historical review snapshots, not a new refusal of the current bounded authority.

Current execution checkpoint — 2026-09-08, after explicit C17 FOUNDATION
DISPOSABLE BOOTSTRAP authorization and continued Apply:

APPLY: BLOCKED — task 2.8 synthetic runtime connection authority.
Tasks: 15/32; Foundation/Data 1.1-1.8 and Service/Domain 2.1-2.7 complete.
Task 2.8 NOT_STARTED / BLOCKED; 2.9 NOT_COMPLETE; phases 3/4 NOT_STARTED.
C17: PASS, unchanged foundation suite 8/8 on its own exact foundation database.

Raw PostgreSQL 62/62, service 52/52 (45 unit + 7 SQL), manager 16/16 and
reducer 34/34 passed. Separate F6 clean/foundation-upgrade migration 5/5 passed;
post-test guard/ledger/no-op recheck 4 pass / 1 intentionally excluded upgrade.
Docs, architecture, workspace typecheck, strict OpenSpec and UI-pack checks
passed. Global formatting still has exactly 67 existing unrelated warnings.
No test result here is formal VERIFY or Browser QA.

New mandatory stop: Design D1 configures CLOUD_DATABASE_URL while D4b requires
raw writer and foundation privileges to remain separate. Current disposable
cluster has only a bootstrap superuser, restricted raw LOGIN writer and NOLOGIN
lock owner; no separately configured non-owner foundation runtime identity.
The foundation needs credential verifier, limiter and audit access unavailable
to the raw writer. Do not widen its grants, use shared .env database, promote
the test bootstrap admin into usable app runtime, or invent a new connection/
role/secret contract. Need explicit Sensitive Design clarification of the
separate foundation client source/identity/privileges and both-client D1 proof
for local synthetic runtime. Existing injected SQL test clients are not that
runtime authorization. Product/Specs and production boundaries remain unchanged.

Current [tasks.md](../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
SHA-256: 7bf96f696edc16578e36e157fc6b3a2d2390b461898077be633f2c810d79bbe8.
[Checkpoint manifest](apply-c17-service-checkpoint.json) SHA-256:
9a42a0f9952e218842106d0d1ebc29b9a3175c11359b2640e35f1dbe7a52a4cc.
[Cumulative scoped diff](apply-c17-service-checkpoint.diff) SHA-256:
6363a602f65dbc85df9a3da0f4e72ea1ed33540a14e9256ac142e19a7476dec4.
Reverse-check passed. Twelve implementation paths: eleven change-owned
untracked cumulative snapshots (five already existed before this resume),
plus the one isolated db-cloud index export. Exact before/after hashes are in
the manifest; cumulative snapshots do not claim prior Pointage files were new.
Auth/Formalités dirty bytes, main Specs, archives, 0019/0020/0021 SQL,
snapshot/journal and locked authority/UI files remain unchanged this turn.
Concurrent unrelated ui-ux-pro-max-integration work is explicitly not attributed.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED.
VERIFY: NOT_RUN. QA: NOT_RUN. Production enablement: NOT_AUTHORIZED.
Synthetic/disposable data only; real attendance remains NOT_AUTHORIZED.
All seven legal/privacy/production provenance blockers remain unresolved.
No runtime factory, route/API/UI, Gate 3, sync/archive, deploy or enablement.
Disposable databases and synthetic evidence retained; no destructive cleanup.
Detailed commands, timestamps, cluster/database identity, errors corrected
within scope, skipped broader checks and next approval are in the Tasks appendix.

Previous execution checkpoint — 2026-09-08, sau Human Sensitive Design
clarification và bounded F4 fix: miền integer seconds [-50400, 50400] inclusive,
không step size hoặc tính lại historical offset. Chỉ sửa trigger 0021/test.
New isolated storage, clean/0020-upgrade/no-op, helper/restricted-writer và
42/42 SQL tests đạt; chưa phải full phase evidence hay formal VERIFY.
APPLY BLOCKED, Tasks 2/32, task 1.3 PARTIAL. Blocker tiếp theo: C17 cần một
foundation-only disposable target riêng; hai raw-clocking targets hiện tại
không pass foundation guard, và chưa có quyền bootstrap target ngoài miền raw.
Không nới guard hoặc dùng shared/.env.local database. C17 NOT_RUN.
Xem appendix mới trong
[tasks.md](../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
và [exact SQL/test diff](apply-f4-calendar-validation.diff). Hash Tasks hiện tại:
f41282da6265bcd347bc2701ba9b552451babf1d857a076053305f416c816eb5.
Diff SHA-256: 20247677e9606ec5ce0edda2e442f9fc10fab4960a04a3f88e3fe0def8b06c5a.
Review Design/Specs và approved planning body không thay đổi; failed F4 evidence
trước đây vẫn nguyên. TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED.
VERIFY: NOT_RUN. QA: NOT_RUN. Production enablement: NOT_AUTHORIZED.
Bảy production/legal/privacy blockers giữ nguyên. Cần configured/authorized
foundation-only disposable bootstrap/migration/test target trước C17; không cần
Product/Spec revision, không tiếp tục sang service/UI/VERIFY/QA/Gate 3 ở đây.

Previous execution checkpoint — 2026-09-08, after explicit DISPOSABLE CLUSTER
RECREATION authorization: APPLY BLOCKED, Tasks 2/32; task 1.3 remains PARTIAL.
New isolated storage/target identity, exact 22-entry clean migration, separate
0020-to-0021 upgrade, no-op and actual restricted-writer enum/helper lock proof
passed. The corrected SQL remains unchanged, but later F4 corruption testing
found that append permits invalid historical calendar context. Its unexpected
OUT was rolled back; no full migration/DB-contract PASS is claimed. Stop before
further SQL correction, Apply phases, formal VERIFY, Browser QA or Gate 3.
The latest [tasks.md](../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
appendix records exact storage identities, hashes, SQL/ACL evidence, all failed
attempts/retries, retained synthetic fixtures and outstanding proof.
Current Tasks SHA-256:
536e4c760a22f04a96c892b219db1e057d3ea28aafde494ffa43c3f85001d5fd.
Next authority: bounded F4 implementation correction and clean revalidation;
no Product/Spec/Design behavior change proposed. TECHNICAL IMPLEMENTATION
COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED; all seven existing blockers remain.

Previous execution checkpoint — 2026-09-08, after explicit EMPTY DISPOSABLE
BOOTSTRAP authorization: APPLY BLOCKED, Tasks 2/32. Exact target identity passed;
roles and the new journaled migration were created only afterwards. The actual
restricted-writer helper probe failed SQLSTATE 42883 (enum compared with text).
The two literal casts are corrected in the new SQL file but NOT applied to the
already-migrated disposable database; no unjournaled repair, database reset or
second bootstrap was performed. Clean disposable rerun authority is required.
No Product/Spec/Design revision is requested. See the latest execution appendix
in [tasks.md](../../../openspec/changes/pointage-usable-raw-clocking/tasks.md).
Current Tasks including that appendix SHA-256:
3a9f15cfd02159075a92aab3d07ddf3f2e0c15b52b1fa480b8c5a3e4470f8c6d.
All Pointage/data counts remain zero; container retained, no runtime/provider.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED; all seven existing blockers preserved.

Previous execution checkpoint (superseded): APPLY BLOCKED, Tasks 2/32; task 1.3 advanced only
its repository call/source-contract test. Required D1 disposable target is not
configured; current-user all-guards-before-database-setup ordering prevents
unapproved bootstrap. See the latest appended checkpoint in
[tasks.md](../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
for exact before/after implementation hashes, evidence and required authority.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED. No DB operation or later task executed.

# Bounded delegated-lock Tasks / TIC alignment review

Status: AWAITING_HUMAN_REVIEW

APPLY: PAUSED

Tasks: 2/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

## Exact authority and decision boundary

Explicit current-user instruction approves the reopened Sensitive Design,
Option B, and authorizes only its bounded Tasks/TIC alignment.
No Apply resume, Product/Spec/UI behavior change or Gate 1/2 reopen.
Skill yuta-run-change controls the next human gate; openspec-update-change
applies only the explicitly requested revision of existing Tasks.

Reviewed Design remains byte-identical:
`a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361`.
The approved 02b packet pre-metadata hash was
`0562bd888e90653234b14e1c888821bf21a0cc5eb114a5c9e39e046db216d979`;
current approval-metadata-only hash is
`00661679c3682679a0d0a31eb8b21c2f34248544f85c9cbc7730a5b243adb116`.
Approval recorded at 2026-09-08T12:02:15.5384860+02:00, source explicit current-user
instruction, recorded by Codex workflow. Its historical Tasks hash is the
pre-alignment checkpoint; this new packet alone reviews the corrected Tasks.

Old Tasks SHA-256:
`50135e23a7b02a509833a3a63bfaca5339281fae191ba9700deec54bf377600a`.

Revised Tasks SHA-256:
`e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281`.

Previous 02c packet SHA-256:
`00cb1f24ba28594ecba5c65a78a5098872d0da998817aae974ad1d96909b0614`.
Its entire byte content is retained after the historical-evidence marker below
to preserve old approvals, exact snapshots and pre-Apply byte baseline. That
historical packet is not current authority; do not read its old status, hashes
or snapshots as approval of this alignment. This regeneration adds the current
gate, exact current hashes, revision preimages/postimages and complete Tasks.

## Scope and checkpoint preservation

Only these three pre-existing files are edited in this planning turn:

1. openspec/changes/pointage-usable-raw-clocking/tasks.md — the 17 exact
   replacement regions below; no unrelated contract/traceability rewrite.
2. docs/reviews/pointage-usable-raw-clocking/02b-design-review.md — approval
   metadata only, original reviewed body retained.
3. docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md —
   this regenerated alignment packet with prior evidence retained.

Exactly four Apply phases and 32 checkbox tasks; only 1.1 and 1.2 checked.
1.3 remains PARTIAL / BLOCKED; 1.4–4.7 remain NOT_STARTED.
Completed checkboxes and the entire prior Apply checkpoint are unchanged.
Old baseline-era 0/32/BLOCKED prose is explicitly historical, not a reset or a
claim that revised Design was implemented. No work on task 1.3 occurred here.

The exact 20 requirements / 62 scenarios remain authorization 7/21 plus
raw-clocking 13/41. Both delta paths and full planned traceability remain
unchanged, including WHEN/THEN/AND coverage obligations. Proposal, Analysis,
Design, UI_SPEC, DATA_AND_INTERACTION_SPEC, route/copy/state design, all UI
pack/provenance bytes and UI Implementation Plan are unchanged. The UI plan
delegates DB/privilege proof to master Tasks; no materially stale DB-only
mechanism reference was found, so no UI-plan exception is used.

All eight partial implementation hashes below match the pre-turn checkpoint.
No code, SQL migration, snapshot or journal change; no PostgreSQL connection,
role provision, disposable DB, provider instantiation, fixture/attendance write,
implementation test/build, Browser QA, formal VERIFY or Gate 3 creation.
No production provider/deploy/enable, sync/archive or lifecycle promotion.

## Exact task / contract alignment

The selected mechanism remains one capability-specific lock-only function,
not a Product grant or generic executor. F3/F4/F8 plus the two bounded
Foundation subsections carry the exact D4a/D4b contract; F1/F2/F5/F6/F7 table
rows remain byte-identical, with setup/publication detail attached below them.
S5 changes only how the first three existing locks are acquired; continuation
lock and current authority/lifecycle/version re-read remain in the same outer
READ COMMITTED transaction. R2/R3/R4 retain original regression obligations
and add actual helper/privilege/coordination proof.

| Existing task | Bounded alignment / required future proof                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3           | Preserve partial continuation work; exact delegated helper before invoker continuation lock; do not complete in planning.                                                         |
| 1.4           | Static lock-only SECURITY DEFINER helper and SECURITY INVOKER raw INSERT call; no early commit/savepoint catch-and-continue; same raw/receipt atomicity.                          |
| 1.5           | Exact owner/writer attributes, source columns, EXECUTE-only runtime path, PUBLIC/default/inherited/SET ROLE denial, body/signature/properties fingerprint; runtime refusal.       |
| 1.6           | D1/F6 first, then approved test roles only in isolated disposable cluster; unexpected existing role -> STOP, no silent ALTER.                                                     |
| 1.7           | Generated journaled atomic publication of helper/properties/owner/revoke/grant/triggers/constraints; prove tooling transactionality before execution or STOP; preserve 0019/0020. |
| 1.8           | Actual restricted PostgreSQL privileges/locking, unchanged source values, held locks and existing-writer races; no mocked SQL proof.                                              |

Owner is exactly yuta_pointage_raw_lock_owner, inaccessible/non-login/
non-privileged apart from minimum source SELECT columns + UPDATE(id) for locks
and ownership of only the exact helper. Writer receives no source-table UPDATE.
The complete exact signature, fixed search_path, static full-scope predicates,
role/ACL restrictions, NULL/caller failures, same-connection catalog/body
validation and migration-owner separation are in the revised Tasks snapshot.
No advisory locks, role-repair fallback or new application permission.

Unchanged: dual identify/state.read, all Personnel eligibility, same request ID,
stale stateGuard, 2s lock/5s statement timeout, raw-only canonical evidence,
120s/60s continuation, time/DST/cross-midnight/departure, manager server read,
shared-device behavior, separate post-Apply VERIFY/QA and Gate 3 boundary.

## Exact current artifact and preserved implementation hashes

SHA-256 over exact file bytes, lowercase hex. Method:
Node crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),
cross-checked with PowerShell Get-FileHash -Algorithm SHA256.
Path sets use current OpenSpec status/instructions plus the preserved current
02b inventory; two delta spec paths checked individually. Every listed path
must remain present and match on resume. Tasks is the authorized replacement;
02b is the explicit approval-metadata exception, not unexplained drift.

| Repository-relative path                                                             | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md`                    | `ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557` |
| `docs/reviews/pointage-usable-raw-clocking/02-specs-review.md`                       | `c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566` |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`                     | `00661679c3682679a0d0a31eb8b21c2f34248544f85c9cbc7730a5b243adb116` |
| `docs/ui/pages/backoffice-pointage-employee/ACCEPTANCE_CHECKLIST.md`                 | `cbcc464c79e57f3bc34c49989d936b1dc2411839b552a159e407a407c72166ed` |
| `docs/ui/pages/backoffice-pointage-employee/DATA_AND_INTERACTION_SPEC.md`            | `25ffcdbb137b26568a01373c6a55c3ea714f97d70978c3c22310433bd40d68fd` |
| `docs/ui/pages/backoffice-pointage-employee/DESIGN_HANDOFF.md`                       | `d94fc07f4e318bda95507904640e5bd80f9f5bacc251babfbf85f7bc0fc56cae` |
| `docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md`                  | `b7dfc8937893032253f801160c1e9fa21e2c8cd34439c0b80e9eb38e7ef5606e` |
| `docs/ui/pages/backoffice-pointage-employee/PRODUCT_SCOPE.md`                        | `16a14204820f4a1b2033f26dca03494db9e5e61b28474c87216ce206062582d8` |
| `docs/ui/pages/backoffice-pointage-employee/README.md`                               | `77377af7a5f09d4884541e3a90de151e0ae11223b73e66f2dc57cfb08765d902` |
| `docs/ui/pages/backoffice-pointage-employee/UI_SPEC.md`                              | `cd109fb341545a280189d92b891506b9211134600720cf5d2b9b107563aacb45` |
| `docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json`                  | `04c6c99bf8067e848cc4df1f0f871fd43bdf1ec964d786f2617dcca4692b8a61` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/00_REPOSITORY_ANALYSIS.md`       | `7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/01_VISUAL_BASELINE.md`           | `d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/02_COMPONENT_REFACTOR.md`        | `8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/03_INTERACTIONS.md`              | `e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/04_DATA_INTEGRATION.md`          | `f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/05_VISUAL_QA.md`                 | `5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0` |
| `docs/ui/pages/backoffice-pointage-employee/references/README.md`                    | `e2ddabc5a6a004441847e71629b84281eeac075c41a195eea8955f5d30a72a45` |
| `openspec/changes/pointage-usable-raw-clocking/.openspec.yaml`                       | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md`                          | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                            | `a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361` |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md`                          | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` |
| `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md` | `1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66` |
| `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`  | `4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                             | `e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281` |
| `packages/auth/src/index.ts`                                                         | `464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a` |
| `packages/auth/src/pointage-continuation.ts`                                         | `f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172` |
| `packages/auth/test/pointage-continuation.test.ts`                                   | `6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                          | `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb` |
| `packages/db-cloud/src/schema/index.ts`                                              | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |
| `packages/db-cloud/src/schema/pointage-raw-clocking.ts`                              | `d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754` |
| `packages/db-cloud/src/schema/pointage.ts`                                           | `8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`                        | `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158` |

Fresh scoped Git/byte baseline: 2026-09-08T11:59:18.1354301+02:00;
HEAD defbc50eba3952fa2e7b1c016637daf083b18c65. Checkout is dirty. Earlier approved Gate 1/2 hashes/path sets
and the 30 preserved 02b paths matched before edits. Existing Formalités and
other dirty work are excluded; specifically auth/src/index.ts and db schema
exports retain their exact checkpoint bytes. Before any future code edit,
repeat fresh artifact/path/implementation preflight; this planning gate is
not permission to overwrite unrelated hunks or absorb concurrent work.

## Planning-only validation

| Exact command                                                                                                                                                                                                                | Result                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| pnpm exec openspec status --change pointage-usable-raw-clocking --json                                                                                                                                                       | Exit 0; local yuta-spec-driven, existing paths. Raw planning-complete is not Apply authorization. |
| pnpm exec openspec instructions tasks --change pointage-usable-raw-clocking --json                                                                                                                                           | Exit 0; existing tasks.md, Specs/Design dependencies, vi context.                                 |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                            | Exit 0; valid.                                                                                    |
| pnpm docs:check                                                                                                                                                                                                              | Exit 0; 36 current documents.                                                                     |
| pnpm architecture:check                                                                                                                                                                                                      | Exit 0.                                                                                           |
| pnpm -r --if-present typecheck                                                                                                                                                                                               | Exit 0; all applicable workspace packages/apps passed.                                            |
| pnpm ui:pack:check backoffice-pointage-employee                                                                                                                                                                              | Exit 0; 1 package, 0 warnings; not Browser QA.                                                    |
| pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/tasks.md docs/reviews/pointage-usable-raw-clocking/02b-design-review.md docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md | Exit 0; all three changed planning/review files formatted.                                        |
| pnpm format:check                                                                                                                                                                                                            | Exit 1; 67 pre-existing unrelated warnings. Check-only, no unrelated formatter write.             |

No database/runtime proof is inferred from these checks. Future 1.8 evidence
must connect with actual restricted writer in a separately authorized D1-safe
disposable environment; mocks/skipped SQL tests cannot count as proof.
POST-APPLY VERIFY reevaluates F1-F8/S1-S9/U1-U8/R1-R7 after all Apply work;
only a separate passing VERIFY permits required real-route Browser QA.

## Final bounded preservation checks

At 2026-09-08T12:05:43.1842999+02:00, all 33 current hash-table entries
matched. All 17 exact Before sequences matched once; substitutions reconstruct
the complete current Tasks bytes. Checkbox identities/states remain 32/2;
the complete 20/62 traceability and historical Apply section are byte-identical.
The exact current Tasks snapshot equals tasks.md. Removing only the 02b approval
metadata restores its reviewed preimage hash; the retained historical 02c suffix
matches its old hash exactly. No implementation/migration bytes changed.

Read-only inventory observed concurrent unrelated changes to
docs/reviews/formalites-legal-template-foundation/03-final-review.md and
openspec/specs/formalites/legal-template-foundation/spec.md. These are external
work, not attributed to this revision; no edits or reversions here. The three
Pointage planning/review paths listed above are this turn's entire write scope.

## Preserved unresolved blockers and next gate

All seven remain unresolved: exact retention duration; deletion/anonymization;
legal hold; backup-retention interaction; employee notice; detailed audit
visibility; trusted production client-address provenance.
Synthetic/disposable attendance only. Real employee attendance NOT_AUTHORIZED
in development, staging or production. No production provider authorized or
implemented; production enablement NOT_AUTHORIZED.

The only next approval requested is this bounded Tasks/TIC alignment on exact
current bytes. No task 1.3 or later Apply resumes until explicit human approval.
No formal Technical Compliance, VERIFY, QA, release, sync or readiness result
is granted by this packet.

## Exact ordered Tasks replacements

Each Before matched exactly once in the pre-correction Tasks bytes.
Applying these 17 substitutions reconstructs the complete revised Tasks;
all other bytes, checkbox states, 20/62 mapping, UI phase, VERIFY/QA plans
and historical Apply evidence are preserved. No whole-file formatter rewrite.

### 1. Current checkpoint

Before:

```text
Kế hoạch này chỉ chuẩn bị Apply. Không checkbox nào được đánh dấu hoàn tất.
```

After:

```text
Kế hoạch này chỉ điều chỉnh Tasks/TIC theo approved reopened Design.
APPLY: PAUSED; giữ 1.1/1.2 COMPLETE, 1.3 PARTIAL / BLOCKED,
1.4–4.7 NOT_STARTED; Tasks: 2/32. Không resume implementation.
Historical planning/Apply checkpoint ở cuối giữ nguyên làm provenance;
status hiện hành là alignment review này, không approval Apply mới.
```

### 2. Design reference

Before:

```text
không thay đổi. Design D1-D12 và revised D4/D6 là technical authority.
```

After:

```text
không thay đổi. Design D1-D12 và approved D4a/D4b/D5/D6 là technical authority.
```

### 3. Foundation sources

Before:

```text
D1, D2, D5-D7, Migration Plan; raw R3/R5 and auth A6. No framework or DB in auth.
```

After:

```text
D1, D2, D4a/D4b, D5-D7, Migration Plan; raw R3/R5 and auth A6.
No framework or DB in auth.
```

### 4. TIC F3

Before:

```text
| F3  | Event/receipt mutual scoped FKs INITIALLY DEFERRED NO ACTION, non-deferred unique keys; same transaction must insert both. Raw/receipt UPDATE/DELETE and TRUNCATE rejected by database enforcement.                                                                                                                                                                                                                                                      | Raw-only/receipt-only COMMIT fails; valid pair commits once; direct SQL with actual writer cannot alter/delete/truncate or cross scope.                                                                                                                                                                                   |
```

After:

```text
| F3  | Event/receipt mutual scoped FKs INITIALLY DEFERRED NO ACTION, non-deferred unique keys; same outer transaction inserts both and retains delegated locks. Raw/receipt UPDATE/DELETE and TRUNCATE rejected by database enforcement; helper never accepts evidence or commits.                                                                                                                                                                              | Raw-only/receipt-only COMMIT fails; valid pair commits once; direct SQL with actual writer cannot alter/delete/truncate or cross scope. Helper return retains locks; whole-operation rollback, no savepoint catch-and-continue.                                                                                           |
```

### 5. TIC F4

Before:

```text
| F4  | Raw INSERT trigger takes scoped dossier lock, validates complete chain/next kind/ordinal, captures one DB clock instant and current lifecycle/calendar; no caller time/ordinal authority.                                                                                                                                                                                                                                                                | Invalid alternation/gap/cross-dossier/corrupt chain/backward clock denial; microsecond preservation and accepted-time lifecycle assertion.                                                                                                                                                                                |
```

After:

```text
| F4  | SECURITY INVOKER raw INSERT trigger calls exact D4a public.pointage_raw_lock_dossier(uuid,uuid,uuid) with NEW full scope before chain validation; organization FOR SHARE, establishment FOR SHARE, dossier FOR UPDATE. Validates complete chain/next kind/ordinal and one DB clock instant/current lifecycle/calendar; no caller time/ordinal authority.                                                                                                 | Actual restricted writer/alternate INSERT takes same locks; invalid alternation/gap/cross-dossier/corrupt chain/backward clock denial, microseconds and accepted-time lifecycle assertions. Static non-mutating helper contract below.                                                                                    |
```

### 6. TIC F8

Before:

```text
| F8  | Dedicated disposable non-owner/non-superuser writer: only required SELECT/INSERT and continuation UPDATE(idle_expires_at, ended_at); no broad/inherited/PUBLIC/SET ROLE/DDL or destructive grants. No owner fallback; bounded repo touch/end only.                                                                                                                                                                                                       | Catalog/effective privilege probes plus actual writer negative SQL; owner/writer identities distinct; inability to prove privileges blocks runtime/test composition. No production role claims.                                                                                                                           |
```

After:

```text
| F8  | Dedicated yuta_pointage_raw_writer: required SELECT/INSERT, continuation UPDATE(idle_expires_at, ended_at), EXECUTE only exact reviewed public.pointage_raw_lock_dossier(uuid,uuid,uuid). No source-table UPDATE, broad continuation UPDATE, ownership or privilege-escalation paths; exact D4b role/ACL boundary below.                                                                                                                                 | Catalog/effective privilege and actual SQL proof for owner/writer separation, source column privileges, exact helper properties/body/ACL and all forbidden paths. Misconfiguration refuses composition/operation; no repair/fallback/production-role claim.                                                               |
```

### 7. Delegated boundary and atomic publication

Before:

```text
Rollback/recovery: stop/disable synthetic composition; rollback uncommitted
```

After:

```text
#### Delegated lock boundary — F3/F4/F8, approved D4a/D4b

Exact helper:
`public.pointage_raw_lock_dossier(p_organization_id pg_catalog.uuid,
p_establishment_id pg_catalog.uuid, p_personnel_dossier_id pg_catalog.uuid)
RETURNS pg_catalog.void`.

- Một signature, không overload/default/variadic/generic identifier arguments;
  LANGUAGE plpgsql, VOLATILE, PARALLEL UNSAFE, SECURITY DEFINER,
  CALLED ON NULL INPUT và explicit NULL rejection, không STRICT bypass.
- Static PERFORM theo thứ tự: public.organizations id + active FOR SHARE;
  public.establishments organization_id + id + active FOR SHARE;
  public.personnel_employee_dossiers organization_id + establishment_id + id
  FOR UPDATE; mỗi statement require FOUND. Inputs từ trusted server scope/
  verified dossier, không browser/GUC claims. Không employment filter trong
  helper; own-end exception và lifecycle checks vẫn thuộc invoker.
- Require session_user = yuta_pointage_raw_writer; caller/null/missing/inactive/
  mismatched tuple dùng P0001 / POINTAGE_LOCK_UNAVAILABLE, không sensitive
  DETAIL/HINT. Public response vẫn generic. Coherent foreign tuple không tự
  chứng minh tenant authority: server guards chặn trước call; helper không RLS.
- Fixed search_path = pg_catalog, pg_temp. Public tables/helper schema-qualified;
  types/functions/operators resolve tới pg_catalog-qualified identities.
  Static SQL only: no dynamic EXECUTE, arbitrary identifiers, callbacks,
  external I/O, SET ROLE / SESSION AUTHORIZATION hoặc request-controlled config.
- Chỉ acquire locks, return void, không sensitive row/context data. Không
  authorize Pointage operation, issue/reset credential, touch/end continuation,
  mutate application rows, accept command/insert evidence, commit/rollback.
  Helper EXECUTE là DB execution privilege, không Product permission.
- Repository gọi helper trong same outer READ COMMITTED transaction/connection;
  sau ba locks, invoker re-read current scope/Personnel/credential version,
  rồi continuation FOR UPDATE bằng full org+est+dossier+continuation key.
  Trigger raw INSERT là SECURITY INVOKER, gọi lại exact helper trước chain
  validation; không delegated write executor. Locks tồn tại tới outer
  COMMIT/ROLLBACK. Không catch-and-continue hoặc savepoint rollback rồi tiếp tục.
  Giữ lock timeout 2s, statement timeout 5s, rollback toàn operation;
  unknown COMMIT/retry giữ exact request identity và stateGuard.

Owner: yuta_pointage_raw_lock_owner — NOLOGIN, NOSUPERUSER, NOCREATEDB,
NOCREATEROLE, NOREPLICATION, NOBYPASSRLS, NOINHERIT; không role membership,
inheritance/SET ROLE path; không database/schema/table ownership; chỉ owns exact
helper. Ngoài inherent helper ownership, chỉ có:

- public schema USAGE, không persistent CREATE;
- public.organizations SELECT(id,status), UPDATE(id);
- public.establishments SELECT(id,organization_id,status), UPDATE(id);
- public.personnel_employee_dossiers SELECT(id,organization_id,establishment_id),
  UPDATE(id);
- không extra grants trên application tables/functions.

UPDATE(id) chỉ ở inaccessible helper owner để đáp ứng row-lock privilege;
runtime không inherit/use trực tiếp, không WITH GRANT OPTION. NOLOGIN alone
không đủ: prove membership/ownership/schema/ACL paths cùng fixed non-mutating
body. Không sửa existing credential issue/reset, Personnel hoặc Formalités
writers; actual row locks phối hợp tự nhiên, không advisory protocol mới.

Runtime writer giữ SELECT/INSERT cần thiết và đúng hai continuation UPDATE
columns cùng exact helper EXECUTE. Deny UPDATE trên organizations,
establishments, personnel_employee_dossiers; broad continuation UPDATE;
database/schema/table ownership, schema CREATE, ALTER/DROP/TRUNCATE/DELETE,
trigger-disable, GRANT OPTION, role membership/inheritance, SET ROLE hoặc
SESSION AUTHORIZATION path, SUPERUSER/BYPASSRLS/CREATEROLE/CREATEDB/REPLICATION,
migration-owner fallback. Không hợp nhất raw writer với privileged foundation/
Personnel connection. PUBLIC/non-owner/non-writer EXECUTE bị revoke; không
default/inherited/PUBLIC grants mở rộng quyền. Owner inherent EXECUTE không
phải runtime grant.

Trước instantiate provider/runtime và trước mỗi raw dossier transaction trên
chính connection, prove session/current user, exact function OID/signature,
owner/language/security/volatility/parallel/null/search_path/body fingerprint
khớp reviewed generated migration; pg_proc/pg_roles/pg_auth_members/pg_class/
pg_namespace/pg_default_acl và effective table/column/function/schema privileges,
pg_has_role MEMBER/USAGE/SET. Missing/extra grant, unsafe owner/schema/body hoặc
không chứng minh được -> fail closed trước credential/protected processing,
helper/attendance writes; không runtime auto-repair, fallback hoặc bypass.
Fingerprint lấy từ reviewed journaled migration, không browser/env input.
Privileged migration/admin không chạy song song synthetic runtime; không claim
catalog checks đánh bại malicious DBA.

#### Guarded role setup and atomic publication — F6/F7/F8

Chỉ future approved DBTEST harness, sau toàn bộ D1/F6 guard, được provision
approved test roles trong isolated disposable PostgreSQL cluster; không
production setup. Unexpected existing role attributes/grants/membership ->
STOP, không ALTER silently. D1 exact `NODE_ENV`, loopback/name/probe guards
không đổi và không bị Browser QA bypass.

Migration owner tách khỏi helper owner/runtime; owns schema/tables/triggers,
không runtime fallback. Một generated/journaled migration transaction publish
helper creation/properties/search_path, ownership transfer, PUBLIC/non-writer
EXECUTE revoke, writer exact EXECUTE grant, helper-related triggers cùng
raw/receipt/continuation constraints. Temporary CREATE/membership nếu cần
ownership transfer chỉ trong migration transaction, revoke trước COMMIT;
runtime không nhận quyền này. Verify migration tooling thật sự atomic publish
trước execution; nếu không chứng minh được -> STOP trước migration execution.
Missing roles -> migration fail closed, không tự provision production roles.
Không sửa migrations 0019/0020 hoặc previous snapshots/journal entries.
Không pin tên next migration trước fresh generation/path-set review.

Rollback/recovery: stop/disable synthetic composition; rollback uncommitted
```

### 8. Task 1.3

Before:

```text
- [ ] 1.3 Add F5 continuation schema/credential tuple key and bounded repository methods; verify immutable-field and TTL/end method contracts in tests.
```

After:

```text
- [ ] 1.3 Add F5 continuation schema/credential tuple key and bounded repository methods; preserve existing partial continuation work and add exact D4a delegated-lock call before invoker continuation lock in the same outer transaction. Verify immutable-field, TTL/end and post-lock current scope/version/lifecycle contracts; keep PARTIAL / BLOCKED until real evidence, never complete during planning.
```

### 9. Task 1.4

Before:

```text
- [ ] 1.4 Add F3/F4 database enforcement and transaction support; verify raw-only/receipt-only commit, invalid chain and raw/receipt mutation rejection on PostgreSQL.
```

After:

```text
- [ ] 1.4 Add F3/F4 database enforcement and exact D4a SECURITY DEFINER helper with static scoped locks; SECURITY INVOKER raw INSERT trigger calls the same helper inside the outer transaction. Verify no catch-and-continue/savepoint lock release, unchanged raw/receipt atomicity, raw-only/receipt-only COMMIT denial, invalid chain and mutation rejection on PostgreSQL.
```

### 10. Task 1.5

Before:

```text
- [ ] 1.5 Enforce F5 continuation triggers and F8 writer boundary; verify each immutable column, effective privileges, monotonic idle/cap and no ended/expired revival with the runtime writer.
```

After:

```text
- [ ] 1.5 Enforce F5 continuation triggers and F8/D4b writer/lock-owner boundary; verify each immutable column, monotonic idle/cap, no revival, exact role attributes/source-column grants, no writer source UPDATE, exact EXECUTE/PUBLIC revoke, no default/inherited/SET ROLE paths, owner/runtime separation and function signature/properties/body fingerprint. Misconfiguration must refuse runtime without repair.
```

### 11. Task 1.6

Before:

```text
- [ ] 1.6 Implement F6 reusable synthetic test-boundary validation and disposable harness; verify parsed/actual name equality and full unsafe-environment rejection before provider/write.
```

After:

```text
- [ ] 1.6 Implement F6 reusable synthetic boundary and disposable harness; after every D1 guard, provision only approved test roles in an isolated disposable cluster. Verify parsed/actual database name equality and full unsafe-environment rejection before provider/write; unexpected existing role attributes/grants/membership -> STOP, not silent ALTER or production setup.
```

### 12. Task 1.7

Before:

```text
- [ ] 1.7 Generate F7 next additive journaled migration after fresh journal review; verify exact generated path set, unchanged foundation history and empty/upgrade/no-op disposable migration proof.
```

After:

```text
- [ ] 1.7 Generate F7 next additive journaled migration after fresh journal review; include helper creation/properties/search_path, ownership transfer, PUBLIC revoke/writer EXECUTE and helper triggers plus raw/receipt/continuation constraints in one transaction. Prove tooling atomic publication before execution or STOP. Verify exact generated paths, unchanged 0019/0020/history, revoked temporary transfer privileges and empty/upgrade/no-op disposable proof.
```

### 13. Task 1.8

Before:

```text
- [ ] 1.8 Complete F2-F8 database integration regressions using separate connections and actual restricted writer; collect command exits, schema/privilege/migration proof without claiming formal VERIFY.
```

After:

```text
- [ ] 1.8 Complete F2-F8 real PostgreSQL regressions with separate connections and actual restricted writer; direct source FOR SHARE/FOR UPDATE -> 42501, helper succeeds without changing source bytes/values and holds locks until outer COMMIT/ROLLBACK. Prove actual issue/reset, Personnel lifecycle UPDATE (both orders), parent status/timezone UPDATE and Formalités dossier FOR UPDATE coordination; wrong/mixed/missing/inactive tuples roll back, PUBLIC/non-writer EXECUTE denied, poisoned search_path/temp cannot redirect, role/body/ACL misconfiguration refuses runtime, lock timeout/deadlock aborts whole operation. No mocks for SQL proof; collect evidence, no formal VERIFY claim.
```

### 14. TIC S5

Before:

```text
| S5  | READ COMMITTED; organization FOR SHARE → establishment FOR SHARE → scoped Personnel FOR UPDATE → continuation FOR UPDATE; validate current scope/version/lifecycle and reread chain after lock. Receipt lookup before new transition; guard protects exact observed head, no auto-rebase. Lock 2s, statement 5s.                                              | Multi-connection competing IN/OUT; reset/lifecycle/end serialization; stale OUT of A cannot close later B; rollback all writes on final lifecycle/TTL failure at actual accepted instant.                                   |
```

After:

```text
| S5  | READ COMMITTED; exact D4a helper obtains organization FOR SHARE → establishment FOR SHARE → scoped Personnel FOR UPDATE, then same-transaction invoker continuation FOR UPDATE. Current scope/version/lifecycle and chain re-read after locks; receipt before transition; exact stateGuard, no rebase. Lock 2s, statement 5s.                                 | Multi-connection IN/OUT, helper vs reset/lifecycle/end; stale OUT A cannot close B; rollback on final lifecycle/TTL or lock/timeout failure. Same request ID/unknown COMMIT; no advisory lock.                              |
```

### 15. TIC R2

Before:

```text
| R2  | Multi-connection database concurrency covers distinct IN/OUT, same-ID submit, stale OUT A→B, reset/lifecycle/end races and unknown COMMIT recovery.                                                         | Barrier-controlled competing writers; SQL raw/receipt counts/linkage and original instants, no accepted duplicates/orphans.                         |
```

After:

```text
| R2  | Keep distinct IN/OUT, same-ID, stale OUT A→B, unknown COMMIT/end races; add helper vs actual issue/reset, lifecycle UPDATE both orders, parent status/timezone and Formalités dossier locks.                | Real barriers; locks survive return until COMMIT/ROLLBACK; exact raw/receipt counts/linkage/instants; whole rollback on timeout/deadlock.           |
```

### 16. TIC R3

Before:

```text
| R3  | Adversarial current-authority tests cover three employee operations, dual identify, manager grants, org/est/dossier/credential binding, missing/untrusted provider and both distributed limiter dimensions. | Denials produce no protected payload/illegal side effect; spoofed headers and unsafe environment rejected before credential work.                   |
```

After:

```text
| R3  | Keep three-operation/dual-identify/manager/tenancy/binding/provider/distributed-limiter adversarial tests; add exact helper owner/ACL/body/OID SQL proof and runtime refusal on privilege misconfiguration. | No protected payload/side effect; unsafe environment denied before credential work; role/ACL/body misconfiguration refuses runtime, no repair.      |
```

### 17. TIC R4

Before:

```text
| R4  | Real disposable migration/writer/trigger proof plus microseconds/DST/timezone/departure and corrupt-chain denial.                                                                                           | Fresh+upgrade migration results, privilege inspection and real SQL denials, exact database identity; deterministic clock helper isolated/restored.  |
```

After:

```text
| R4  | Real disposable migration/writer/trigger proof plus unchanged microseconds/DST/timezone/departure/corrupt-chain checks; direct source row-lock/mutation denial and exact helper success.                    | Real source-lock/UPDATE denials, helper/owner/ACL/body/temp-path proof; unchanged rows; atomic migrations; exact DB identity, restored clock.       |
```

## Exact revised Tasks snapshot

```text
# Pointage usable raw clocking — Tasks and Implementation Plan

Change: pointage-usable-raw-clocking

Schema: yuta-spec-driven

Status: AWAITING_HUMAN_REVIEW

Sensitive Design: APPROVED — exact reviewed bytes, not implementation approval.

Apply authorization: NOT_GRANTED

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Production enablement: NOT_AUTHORIZED

## Authority and planning boundary

Kế hoạch này chỉ điều chỉnh Tasks/TIC theo approved reopened Design.
APPLY: PAUSED; giữ 1.1/1.2 COMPLETE, 1.3 PARTIAL / BLOCKED,
1.4–4.7 NOT_STARTED; Tasks: 2/32. Không resume implementation.
Historical planning/Apply checkpoint ở cuối giữ nguyên làm provenance;
status hiện hành là alignment review này, không approval Apply mới.
Approved [Proposal](proposal.md), [Analysis](analysis.md), hai delta Specs và
[Design](design.md) giữ nguyên bytes; P1-P14, 20 requirements / 62 scenarios
không thay đổi. Design D1-D12 và approved D4a/D4b/D5/D6 là technical authority.
Gate 2b approval và metadata-only README exception được ghi tại
[review](../../../docs/reviews/pointage-usable-raw-clocking/02b-design-review.md).
[UI Implementation Plan](../../../docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md)
chuyên biệt phase 3, không tạo kế hoạch Product hoặc attendance source thứ hai.

Synthetic/disposable-only là current change authorization cho development,
tests và Browser QA; không là domain invariant, field, enum, employee category,
permission hoặc runtime employee classifier. Real attendance:
NOT_AUTHORIZED ở development, staging và production. Không production
TrustedPointageClientAddressProvider/default. Giữ cả bảy blockers: exact
retention duration; deletion/anonymization; legal hold; backup-retention
interaction; employee notice; detailed audit visibility; trusted production
client-address provenance. Production runtime-role proof chưa có và không
được suy ra từ disposable tests.

Explicit non-scope giữ nguyên toàn bộ Proposal và R13: không manager hoặc
credential-management UI, history/totals/prior clock-out, monthly dashboard,
break/pause/meal/manual adjustment/correction/auto-close/weekly acknowledgement,
Planning/Today/reconciliation/rounding/anomalies, day/payroll allocation,
HS/HC, absences, jours fériés, avantages en nature, payroll/TESE/closure/PDF/export,
session/materialized projection table, credential crypto/grant redesign,
standalone revoke/suspend, upcoming-issuance rule, global identity, Personnel
write-back, new app/topology, POS/Site Agent/Display/db-pos/offline queue/sync.
Không deploy, enable, sync/archive hoặc promote lifecycle/readiness.

## Implementation sequence and repository reality

Chỉ bốn Apply phases được user yêu cầu, theo dependency 1 → 2 → 3 → 4.
Foundation hiện có credential primitives, scoped issue/reset repository,
candidate/client limiter, audit và exact six-operation service. Chưa có raw
tables, continuation consumer, employee route/API hoặc reducer. Vì vậy cả Data,
Domain, Transport/UI và Integration đều cần; không thêm phase theo template.
UI prompts 00-05 là checkpoints của UI workflow, không sáu Apply phases mới.
Phase 00 là read-only preflight; 01-04 thuộc phase 3 khi có approval tương ứng;
05 chỉ sau formal VERIFY trong QA. Giữ các human stop của prompts; không coi
approval kế hoạch này là approval tự động cho checkpoint execution.

Repository root: D:/working/yuta/yuta-resto. Nearest instructions:
AGENTS.md; packages/auth/AGENTS.md; packages/contracts/AGENTS.md;
packages/db-cloud/AGENTS.md; apps/backoffice/AGENTS.md.
Không có scoped AGENTS sâu hơn tại planned Pointage boundaries khi lập kế hoạch.

Authorities cần đọc lại trước Apply: docs/README.md, docs/CURRENT_STATE.md,
docs/AUTHORITY_MODEL.md, docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md,
docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md,
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/architecture/AUTHENTICATION.md,
docs/architecture/TENANCY.md, docs/architecture/DATABASE_BOUNDARIES.md,
docs/decisions/ADR-003-database-ownership-boundaries.md,
docs/features/personnel/README.md, normative pointage/authority-foundation
và authorization/pointage. UI: docs/ui/README.md, YUTA_FRONTEND_RULES.md,
BACKOFFICE_FRONTEND_RULES.md, DESIGN_TO_CODE_WORKFLOW.md,
DELIVERY_WORKFLOW_MODES.md, PAGE_PACK_PROTOCOL.md và stable page pack.
Post-Apply QA: docs/YUTA_QA_PROTOCOL.md.
Các paths UI vừa nêu nằm dưới docs/ui/, không phải root. Không copy toàn bộ rules.

### Dirty-worktree preflight — mandatory before any future code edit

Planning baseline HEAD: defbc50eba3952fa2e7b1c016637daf083b18c65.
Fresh status/hash evidence nằm trong planning review. Đây không phải clean
checkout. Foundation implementation còn untracked; auth export có Formalités
hunk; db-cloud exports/schema journal và nhiều unrelated files dirty.
Trước Apply phải recompute từng approved artifact hash/path set, fresh Git
status và exact bytes cho tất cả intended existing/new paths.

Đặc biệt packages/auth/src/index.ts: giữ nguyên unrelated Formalités export
hunk; chỉ thêm isolated Pointage export sau khi đối chiếu byte/hunk baseline.
packages/db-cloud/src/index.ts, src/schema/index.ts, drizzle/meta/\_journal.json
cũng phải preserve existing foundation/unrelated content, không regenerate
hoặc overwrite history. Existing untracked foundation files thuộc user, không
được coi là new files của raw-clocking. Nếu intended path đã xuất hiện/đổi,
hunk không isolate được, hoặc cannot produce exact attributable diff: STOP
trước edit; không reset/checkout/stash/format toàn repo.

Mọi paths bên dưới là allowlist dự kiến, không blanket permission cho directory.
Generated migration names chỉ được resolve từ current Drizzle output sau Apply
approval: một next journal entry, SQL và snapshot tương ứng; không pin sequence
0020 hoặc rewrite migration 0019. Nếu output cần thêm unrelated schema changes,
STOP thay vì tự absorb chúng. Không thêm dependency/package script/framework.
Điều chỉnh file ownership hoặc technical behavior ngoài allowlist cần review.

### Planned path keys

Các keys dưới đây rút gọn traceability, không che file scope.

| Key          | Exact expected paths / ownership                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH         | New packages/auth/src/pointage-continuation.ts; packages/auth/test/pointage-continuation.test.ts. Modify packages/auth/src/index.ts for isolated exports only. Preserve pointage-credential.ts crypto.                                                                                                                                                                 |
| DATA         | New packages/db-cloud/src/schema/pointage-raw-clocking.ts; packages/db-cloud/src/pointage-raw-clocking-repository.ts. Modify packages/db-cloud/src/schema/pointage.ts only required credential composite unique key; src/schema/index.ts and src/index.ts isolated exports.                                                                                            |
| DBTEST       | New packages/db-cloud/test/pointage-raw-clocking-schema.test.ts; packages/db-cloud/test/pointage-raw-clocking.integration.test.ts; packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts; packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts.                                                                                  |
| MIGRATION    | Future generated packages/db-cloud/drizzle/<next-generated>.sql, drizzle/meta/<next-generated>\_snapshot.json and one additive drizzle/meta/\_journal.json entry. Exact names/hash set must be recorded from actual generation before migration execution. No migration created during planning.                                                                       |
| DOMAIN       | New apps/backoffice/src/server/pointage/raw-chain.ts; raw-clocking-service.ts; raw-clocking-runtime.ts; raw-clocking-test-boundary.ts; raw-clocking-manager.ts. Existing service.ts, authorization.ts and index.ts only bounded foundation integration/exports if needed; six-operation catalog unchanged.                                                             |
| SERVICE_TEST | New apps/backoffice/test/pointage-raw-chain.test.ts; pointage-raw-clocking-service.test.ts; pointage-raw-clocking-runtime.test.ts; pointage-raw-clocking-manager.test.ts.                                                                                                                                                                                              |
| DTO          | New packages/contracts/src/pointage/index.ts and packages/contracts/test/pointage.test.ts; isolated export in packages/contracts/src/index.ts, no manifest/subpath addition.                                                                                                                                                                                           |
| HTTP         | New apps/backoffice/src/server/pointage/raw-clocking-http.ts; apps/backoffice/src/app/api/pointage/[establishmentSlug]/context/route.ts; identify/route.ts; state/route.ts; clock-in/route.ts; clock-out/route.ts; recover/route.ts; end/route.ts under the same API prefix.                                                                                           |
| PAGE         | New apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx; \_components/pointage-employee.tsx; \_components/pointage-credential-entry.tsx; \_components/pointage-active-interaction.tsx; \_lib/pointage-interaction.ts; \_lib/pointage-client.ts under the same page prefix.                                                                                   |
| HEADERS      | New apps/backoffice/src/proxy.ts with matcher limited to Pointage page/API; no current proxy/middleware found. Compose route nonce/security headers without changing other routes or root/authenticated layouts.                                                                                                                                                       |
| UI_TEST      | New apps/backoffice/test/pointage-raw-clocking-http.test.ts; pointage-interaction.test.ts; pointage-raw-clocking-inventory.test.ts. Existing test/pointage-foundation-inventory.test.ts may receive only historical-foundation versus bounded-new-consumer assertions; never remove security denials.                                                                  |
| DOC          | Existing docs/architecture/AUTHENTICATION.md, docs/architecture/DATABASE_BOUNDARIES.md and stable page pack for eventual accurate implementation/QA notes only. No Product Knowledge/Registry/Current State/Personnel lifecycle promotion; preserve dirty hunks. Approved five UI documents stay byte-locked unless later review explicitly authorizes as-built edits. |

Future code/tests use English identifiers/comments. OpenSpec task explanations
use Vietnamese per schema; UI pack and technical docs use English; employee
copy remains approved French.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

Owner: Pointage raw evidence; @yuta/db-cloud persistence/transactions;
@yuta/auth portable crypto only. Boundaries: AUTH, DATA, DBTEST, MIGRATION.
Sources: scoped auth/db-cloud AGENTS; DATABASE_BOUNDARIES/TENANCY; Design
D1, D2, D4a/D4b, D5-D7, Migration Plan; raw R3/R5 and auth A6.
No framework or DB in auth.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                                                                                                                                                            | Required evidence                                                                                                                                                                                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Add opaque 32-byte CSPRNG continuation, ptc1\_ plus 43 base64url chars, SHA-256 digest and timing-safe checks; isolated HKDF stateGuard key label yuta/pointage/raw-state-guard/v1, length-delimited org/est/dossier/head-or-START HMAC; no existing credential crypto redesign or secret output.                                                                                                                                                        | AUTH vectors, malformed input/collision injection, scope separation, timingSafeEqual call/length paths; no plaintext persistence/logging.                                                                                                                                                                                 |
| F2  | Exactly three new tables. Raw UUIDv7, full scoped dossier FK, contiguous bigint ordinal, CLOCK_IN/OUT, DB instant microseconds and calendar context. Receipt scoped UUIDv4 request key, version-1 intent fingerprint and event link only, no duplicate canonical attendance facts.                                                                                                                                                                       | DBTEST shape, keys/FKs/indexes; no session/projection/correction/Planning/classifier fields.                                                                                                                                                                                                                              |
| F3  | Event/receipt mutual scoped FKs INITIALLY DEFERRED NO ACTION, non-deferred unique keys; same outer transaction inserts both and retains delegated locks. Raw/receipt UPDATE/DELETE and TRUNCATE rejected by database enforcement; helper never accepts evidence or commits.                                                                                                                                                                              | Raw-only/receipt-only COMMIT fails; valid pair commits once; direct SQL with actual writer cannot alter/delete/truncate or cross scope. Helper return retains locks; whole-operation rollback, no savepoint catch-and-continue.                                                                                           |
| F4  | SECURITY INVOKER raw INSERT trigger calls exact D4a public.pointage_raw_lock_dossier(uuid,uuid,uuid) with NEW full scope before chain validation; organization FOR SHARE, establishment FOR SHARE, dossier FOR UPDATE. Validates complete chain/next kind/ordinal and one DB clock instant/current lifecycle/calendar; no caller time/ordinal authority.                                                                                                 | Actual restricted writer/alternate INSERT takes same locks; invalid alternation/gap/cross-dossier/corrupt chain/backward clock denial, microseconds and accepted-time lifecycle assertions. Static non-mutating helper contract below.                                                                                    |
| F5  | Continuation fields/keys exactly D6, including credential full tuple unique/FK. Immutable binding/digest/version/issued/absolute columns; NOT NULL/CHECK and OLD/NEW IS DISTINCT FROM trigger; only live monotonic idle and one-way DB-timestamp end update.                                                                                                                                                                                             | Every immutable column denied; idle decrease/over-cap, expired/ended revival denied; repeated end preserves timestamp; concurrent touch/end serializes.                                                                                                                                                                   |
| F6  | Before provider instantiation or fixture/migration/attendance write: flag true, `NODE_ENV` development/test, VERCEL absent, configured loopback origin/server; URL hostname allowlist `localhost`, `127.0.0.1`, `[::1]`. Exact case-sensitive whole-string match `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$` consumes the entire parsed name; `SELECT current_database()` must return that exact name and independently pass the same exact rule. | Reject `yuta_cloud`, staging/production, non-loopback, malformed/prefix/suffix/whitespace/newline/encoded aliases, query/fragment override, name mismatch or missing probe; no normalization. No browser/environment-derived synthetic employee classifier. Integration and Browser QA cannot bypass/weaken these guards. |
| F7  | Generated/journaled additive migration and exact SQL for approved triggers/constraints only. Existing foundation migration/journal bytes preserved except one new entry; no backfill/seed, no db:push/manual alternate history.                                                                                                                                                                                                                          | Review generated SQL/snapshot/journal and clean-base plus foundation-upgrade disposable migration; rerun migration no-op; clock test override removed before proof.                                                                                                                                                       |
| F8  | Dedicated yuta_pointage_raw_writer: required SELECT/INSERT, continuation UPDATE(idle_expires_at, ended_at), EXECUTE only exact reviewed public.pointage_raw_lock_dossier(uuid,uuid,uuid). No source-table UPDATE, broad continuation UPDATE, ownership or privilege-escalation paths; exact D4b role/ACL boundary below.                                                                                                                                 | Catalog/effective privilege and actual SQL proof for owner/writer separation, source column privileges, exact helper properties/body/ACL and all forbidden paths. Misconfiguration refuses composition/operation; no repair/fallback/production-role claim.                                                               |

#### Delegated lock boundary — F3/F4/F8, approved D4a/D4b

Exact helper:
`public.pointage_raw_lock_dossier(p_organization_id pg_catalog.uuid,
p_establishment_id pg_catalog.uuid, p_personnel_dossier_id pg_catalog.uuid)
RETURNS pg_catalog.void`.

- Một signature, không overload/default/variadic/generic identifier arguments;
  LANGUAGE plpgsql, VOLATILE, PARALLEL UNSAFE, SECURITY DEFINER,
  CALLED ON NULL INPUT và explicit NULL rejection, không STRICT bypass.
- Static PERFORM theo thứ tự: public.organizations id + active FOR SHARE;
  public.establishments organization_id + id + active FOR SHARE;
  public.personnel_employee_dossiers organization_id + establishment_id + id
  FOR UPDATE; mỗi statement require FOUND. Inputs từ trusted server scope/
  verified dossier, không browser/GUC claims. Không employment filter trong
  helper; own-end exception và lifecycle checks vẫn thuộc invoker.
- Require session_user = yuta_pointage_raw_writer; caller/null/missing/inactive/
  mismatched tuple dùng P0001 / POINTAGE_LOCK_UNAVAILABLE, không sensitive
  DETAIL/HINT. Public response vẫn generic. Coherent foreign tuple không tự
  chứng minh tenant authority: server guards chặn trước call; helper không RLS.
- Fixed search_path = pg_catalog, pg_temp. Public tables/helper schema-qualified;
  types/functions/operators resolve tới pg_catalog-qualified identities.
  Static SQL only: no dynamic EXECUTE, arbitrary identifiers, callbacks,
  external I/O, SET ROLE / SESSION AUTHORIZATION hoặc request-controlled config.
- Chỉ acquire locks, return void, không sensitive row/context data. Không
  authorize Pointage operation, issue/reset credential, touch/end continuation,
  mutate application rows, accept command/insert evidence, commit/rollback.
  Helper EXECUTE là DB execution privilege, không Product permission.
- Repository gọi helper trong same outer READ COMMITTED transaction/connection;
  sau ba locks, invoker re-read current scope/Personnel/credential version,
  rồi continuation FOR UPDATE bằng full org+est+dossier+continuation key.
  Trigger raw INSERT là SECURITY INVOKER, gọi lại exact helper trước chain
  validation; không delegated write executor. Locks tồn tại tới outer
  COMMIT/ROLLBACK. Không catch-and-continue hoặc savepoint rollback rồi tiếp tục.
  Giữ lock timeout 2s, statement timeout 5s, rollback toàn operation;
  unknown COMMIT/retry giữ exact request identity và stateGuard.

Owner: yuta_pointage_raw_lock_owner — NOLOGIN, NOSUPERUSER, NOCREATEDB,
NOCREATEROLE, NOREPLICATION, NOBYPASSRLS, NOINHERIT; không role membership,
inheritance/SET ROLE path; không database/schema/table ownership; chỉ owns exact
helper. Ngoài inherent helper ownership, chỉ có:

- public schema USAGE, không persistent CREATE;
- public.organizations SELECT(id,status), UPDATE(id);
- public.establishments SELECT(id,organization_id,status), UPDATE(id);
- public.personnel_employee_dossiers SELECT(id,organization_id,establishment_id),
  UPDATE(id);
- không extra grants trên application tables/functions.

UPDATE(id) chỉ ở inaccessible helper owner để đáp ứng row-lock privilege;
runtime không inherit/use trực tiếp, không WITH GRANT OPTION. NOLOGIN alone
không đủ: prove membership/ownership/schema/ACL paths cùng fixed non-mutating
body. Không sửa existing credential issue/reset, Personnel hoặc Formalités
writers; actual row locks phối hợp tự nhiên, không advisory protocol mới.

Runtime writer giữ SELECT/INSERT cần thiết và đúng hai continuation UPDATE
columns cùng exact helper EXECUTE. Deny UPDATE trên organizations,
establishments, personnel_employee_dossiers; broad continuation UPDATE;
database/schema/table ownership, schema CREATE, ALTER/DROP/TRUNCATE/DELETE,
trigger-disable, GRANT OPTION, role membership/inheritance, SET ROLE hoặc
SESSION AUTHORIZATION path, SUPERUSER/BYPASSRLS/CREATEROLE/CREATEDB/REPLICATION,
migration-owner fallback. Không hợp nhất raw writer với privileged foundation/
Personnel connection. PUBLIC/non-owner/non-writer EXECUTE bị revoke; không
default/inherited/PUBLIC grants mở rộng quyền. Owner inherent EXECUTE không
phải runtime grant.

Trước instantiate provider/runtime và trước mỗi raw dossier transaction trên
chính connection, prove session/current user, exact function OID/signature,
owner/language/security/volatility/parallel/null/search_path/body fingerprint
khớp reviewed generated migration; pg_proc/pg_roles/pg_auth_members/pg_class/
pg_namespace/pg_default_acl và effective table/column/function/schema privileges,
pg_has_role MEMBER/USAGE/SET. Missing/extra grant, unsafe owner/schema/body hoặc
không chứng minh được -> fail closed trước credential/protected processing,
helper/attendance writes; không runtime auto-repair, fallback hoặc bypass.
Fingerprint lấy từ reviewed journaled migration, không browser/env input.
Privileged migration/admin không chạy song song synthetic runtime; không claim
catalog checks đánh bại malicious DBA.

#### Guarded role setup and atomic publication — F6/F7/F8

Chỉ future approved DBTEST harness, sau toàn bộ D1/F6 guard, được provision
approved test roles trong isolated disposable PostgreSQL cluster; không
production setup. Unexpected existing role attributes/grants/membership ->
STOP, không ALTER silently. D1 exact `NODE_ENV`, loopback/name/probe guards
không đổi và không bị Browser QA bypass.

Migration owner tách khỏi helper owner/runtime; owns schema/tables/triggers,
không runtime fallback. Một generated/journaled migration transaction publish
helper creation/properties/search_path, ownership transfer, PUBLIC/non-writer
EXECUTE revoke, writer exact EXECUTE grant, helper-related triggers cùng
raw/receipt/continuation constraints. Temporary CREATE/membership nếu cần
ownership transfer chỉ trong migration transaction, revoke trước COMMIT;
runtime không nhận quyền này. Verify migration tooling thật sự atomic publish
trước execution; nếu không chứng minh được -> STOP trước migration execution.
Missing roles -> migration fail closed, không tự provision production roles.
Không sửa migrations 0019/0020 hoặc previous snapshots/journal entries.
Không pin tên next migration trước fresh generation/path-set review.

Rollback/recovery: stop/disable synthetic composition; rollback uncommitted
transaction, retain committed raw evidence. No DROP/truncate/down migration
or destructive cleanup of evidence in an existing database. Disposable fixture
lifecycle only within verified newly provisioned test database, never shared
volumes/databases. No production provisioning. Missing safe disposable resource,
unexpected generated schema or inability to enforce trigger/privilege/paired
commit semantics: STOP; don't weaken enforcement to pass.

- [x] 1.1 Implement F1 portable primitives and isolated export; verify AUTH unit vectors, invalid token lengths, digest/guard separation and no secret persistence.
- [x] 1.2 Add F2 raw/receipt schema and scoped keys/indexes; verify DBTEST shape and cross-scope FK assertions without session or classifier tables.
- [ ] 1.3 Add F5 continuation schema/credential tuple key and bounded repository methods; preserve existing partial continuation work and add exact D4a delegated-lock call before invoker continuation lock in the same outer transaction. Verify immutable-field, TTL/end and post-lock current scope/version/lifecycle contracts; keep PARTIAL / BLOCKED until real evidence, never complete during planning.
- [ ] 1.4 Add F3/F4 database enforcement and exact D4a SECURITY DEFINER helper with static scoped locks; SECURITY INVOKER raw INSERT trigger calls the same helper inside the outer transaction. Verify no catch-and-continue/savepoint lock release, unchanged raw/receipt atomicity, raw-only/receipt-only COMMIT denial, invalid chain and mutation rejection on PostgreSQL.
- [ ] 1.5 Enforce F5 continuation triggers and F8/D4b writer/lock-owner boundary; verify each immutable column, monotonic idle/cap, no revival, exact role attributes/source-column grants, no writer source UPDATE, exact EXECUTE/PUBLIC revoke, no default/inherited/SET ROLE paths, owner/runtime separation and function signature/properties/body fingerprint. Misconfiguration must refuse runtime without repair.
- [ ] 1.6 Implement F6 reusable synthetic boundary and disposable harness; after every D1 guard, provision only approved test roles in an isolated disposable cluster. Verify parsed/actual database name equality and full unsafe-environment rejection before provider/write; unexpected existing role attributes/grants/membership -> STOP, not silent ALTER or production setup.
- [ ] 1.7 Generate F7 next additive journaled migration after fresh journal review; include helper creation/properties/search_path, ownership transfer, PUBLIC revoke/writer EXECUTE and helper triggers plus raw/receipt/continuation constraints in one transaction. Prove tooling atomic publication before execution or STOP. Verify exact generated paths, unchanged 0019/0020/history, revoked temporary transfer privileges and empty/upgrade/no-op disposable proof.
- [ ] 1.8 Complete F2-F8 real PostgreSQL regressions with separate connections and actual restricted writer; direct source FOR SHARE/FOR UPDATE -> 42501, helper succeeds without changing source bytes/values and holds locks until outer COMMIT/ROLLBACK. Prove actual issue/reset, Personnel lifecycle UPDATE (both orders), parent status/timezone UPDATE and Formalités dossier FOR UPDATE coordination; wrong/mixed/missing/inactive tuples roll back, PUBLIC/non-writer EXECUTE denied, poisoned search_path/temp cannot redirect, role/body/ACL misconfiguration refuses runtime, lock timeout/deadlock aborts whole operation. No mocks for SQL proof; collect evidence, no formal VERIFY claim.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

Owner: Backoffice Pointage server; Personnel retains dossier/name/lifecycle;
DB repository owns storage/locks, auth owns portable primitives. Paths DOMAIN,
SERVICE_TEST, DATA and DBTEST bounded methods/tests, AUTH consumed not redesigned.
Sources: Backoffice/db-cloud AGENTS, AUTHENTICATION/TENANCY, Personnel authority,
Design D2-D10; all A1-A7 and raw R1-R10. No new shared package or grant.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                                                                 | Required evidence                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Pure full-chain reducer validates scope, contiguous ordinal, alternating kinds, nondecreasing instants/calendar/linkage; derives sessions/state only, max one open, sequential sessions unlimited, no fabricated close or cache/table authority.                                                                                                              | SERVICE_TEST raw-chain cases for all four transitions, multiple sessions, absent OUT and every corruption category; 503 on impossible persisted chain.                                                                      |
| S2  | Accepted instant = single post-lock DB clock_timestamp(), timestamptz(6), lossless UTC text/epoch microseconds; equal instants ordered by ordinal, backwards denied not clamped. Retain IANA zone/offset/business date; group by IN business date across midnight and later timezone/tzdb changes.                                                            | Microsecond round-trip, equal/backward instants, DST repeated local labels, zone-change historical stability; no Date truncation/browser backdate/Planning rounding.                                                        |
| S3  | Successful identify: verified credential → exact identify → current scoped Personnel eligibility → memory candidate → separate exact state.read plus current scope/lifecycle/version → raw-chain validation/derive → final dual checks → continuation INSERT/COMMIT → combined token/state. No partial protected payload or identify-only persisted issuance. | Deny state.read after identify succeeds; scope/lifecycle/chain/DB faults at each boundary; no exposed token/name/state or partial continuation commit. Unknown COMMIT may leave only fully dual-authorized expiring orphan. |
| S4  | Continuation bound to current credential version, 120s absolute/60s idle, no heartbeat/mid-interaction rotation; all three exact employee operations check current eligibility and trusted scope. Fresh token on fresh identify; own end is continuation termination, no new catalog operation/grant/revoke.                                                  | TTL/end/reset rejection on state/mutation/replay; inclusive entry/final departure, before/after/missing lifecycle denial; no generic cookie/cloud/Personnel/POS authority.                                                  |
| S5  | READ COMMITTED; exact D4a helper obtains organization FOR SHARE → establishment FOR SHARE → scoped Personnel FOR UPDATE, then same-transaction invoker continuation FOR UPDATE. Current scope/version/lifecycle and chain re-read after locks; receipt before transition; exact stateGuard, no rebase. Lock 2s, statement 5s.                                 | Multi-connection IN/OUT, helper vs reset/lifecycle/end; stale OUT A cannot close B; rollback on final lifecycle/TTL or lock/timeout failure. Same request ID/unknown COMMIT; no advisory lock.                              |
| S6  | UUIDv4 request + exact kind/guard fingerprint version 1 (D6 ordered JSON array); same ID/intent joins original immutable raw receipt after current authority, different intent 409; scope/request identity not authority. Recovery only known tuple, UNCONFIRMED not failure proof.                                                                           | Same-ID double submit one pair; replay after current state changes; unknown commit + same tuple returns original instant; old credential denied; newly identified current credential may recover known own tuple.           |
| S7  | Manager read is server function only, exact establishment.read with fresh active matching OWNER/MANAGER membership; STAFF/employee denied. REPEATABLE READ snapshot + fresh authorization after read. Only current-day raw events and current open session, including earlier-day opening.                                                                    | Cross-tenant/sibling-establishment/role/grant/membership-race denials; no closed history beyond day, monthly/payroll/audit or manager transport.                                                                            |
| S8  | Minimal scoped Personnel id/givenNames/familyName/entry/departure projection, trim/join name only. Audit uses existing minimized taxonomy/exact operation attribution, no credential/token/guard/name/raw/receipt body logs, no competing attendance metadata.                                                                                                | Selected/serialized field allowlists; audit/log capture negative tests and exact deny attribution; no Personnel write/list/details/history permission.                                                                      |
| S9  | Runtime composes only approved injected synthetic provider after F6 and writer proof; missing/untrusted provider before credential processing, existing distributed candidate 5/client 30 per 15min with 15min block preserved. Generic failure mappings; no forwarded/unknown-client/candidate-only default.                                                 | Spy proves no credential hash/lookup on failed provenance; distributed limiter regressions and scope isolation; no production/default provider export/composition.                                                          |

Rollback/recovery: abort whole uncommitted operation; uncertain commit stays
unknown until exact authorized receipt recovery. Never delete accepted evidence,
auto-close, replace scope, relax eligibility or reuse superseded authority.
If minimal Personnel projection conflicts with actual authority, exact locks
cannot coordinate existing reset/lifecycle writers, or new grant/owner needed:
STOP at Design/Control Tower; no silent Spec edits.

- [ ] 2.1 Implement S1 pure reducer; verify all transitions, multiple sessions, max one open, corrupt-chain fail closed and no fabricated evidence.
- [ ] 2.2 Implement S2 lossless time/calendar handling and S5 stateGuard integration; verify microseconds/equal-clock/DST/timezone/cross-midnight and stale head denial.
- [ ] 2.3 Implement S3 dual-guard identify and S8 minimal Personnel projection; verify each partial-failure point denies both protected state and usable token.
- [ ] 2.4 Implement S4 scoped continuation validation/touch/end and exact three-operation eligibility; verify expiry, end, reset and entry/departure boundaries without catalog changes.
- [ ] 2.5 Implement S5 atomic transition transaction and final accepted-instant guards; verify lock ordering, rollback, stale OUT and multi-connection competing commands.
- [ ] 2.6 Implement S6 committed replay/recover; verify same ID/intent receipt, different-intent conflict, unknown commit and current-authority recheck.
- [ ] 2.7 Implement S7 minimal manager server read; verify OWNER/MANAGER versus STAFF/employee, active membership race, bounded day/open-session projection and no manager API.
- [ ] 2.8 Compose S9 test-only runtime and S8 minimized denial/audit handling; verify prerequisite ordering, distributed candidate/client limits, generic failures and no secret/identity leak.
- [ ] 2.9 Complete SERVICE_TEST/DBTEST contract regressions for S1-S9; collect exact assertions/results and preserve all unchanged foundation security tests.

## 3. Employee Transport / UI

### TECHNICAL IMPLEMENTATION CONTRACT — Employee Transport / UI

Owner: @yuta/contracts serialization-safe strict Zod DTOs; Backoffice Node
handlers/server authority; route-local client presentation state only.
Paths DTO, HTTP, HEADERS, PAGE, UI_TEST. Sources: scoped contracts/Backoffice
AGENTS, Design D1-D4/D8-D11, approved UI_SPEC/DATA_AND_INTERACTION_SPEC,
shared/app UI rules, UI Implementation Plan. No application shell or shared UI edits.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                           | Required evidence                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| U1  | Strict 4KiB JSON allowlists: identify credential, state/end empty body, IN/OUT requestId+observedStateGuard, recover same tuple+kind. Only neutral context GET; protected data POST. No trusted IDs/roles/context, browser accepted time or extra fields.                                                               | DTO strict/unknown-key, length, UUID, token/guard/kind and bounded serialization tests; no DB import/browser secret dependency.                                    |
| U2  | Exact D8 context/identify/state/clock-in/clock-out/recover/end handlers under approved prefix, Node runtime, delegated exact operation guards. Dedicated Authorization: Pointage, credentials omit, exact configured Origin and Sec-Fetch-Site rejection; no wildcard CORS/generic session.                             | Real handler tests for methods/body/origin/cross-scope/status, 204 own end, no extra operation or route.                                                           |
| U3  | Neutral dynamic HTML/RSC; private no-store/revalidate0 page and data; route-only nonce CSP and cache headers per D10, no personal SSR/URLs/analytics/logging/service worker. No other route/header behavior changes.                                                                                                    | Header/nonce/HTML payload tests, dependency inventory, negative cookie/cache/CORS/secret diagnostics.                                                              |
| U4  | One responsive column under existing root fonts, NO_APPLICATION_SHELL; approved French copy and shared Card/Input/FormField/Button/Alert/Skeleton/StatusBadge as needed. Layout/semantic tokens/Lucide only, accessible keyboard/focus/touch.                                                                           | Route composition inspection, field/status accessible names, no sidebar/account/navigation, no horizontal overflow at QA viewports later.                          |
| U5  | Credential entry/identify pending/both states/mutation pending/both receipts/state conflict/request conflict/unknown/access failure/rate limit/unavailable/end-neutral. No optimistic success; no history/totals/prior OUT, no employee chooser. PIN clears on identify settle; receipt max10s.                         | State transition tests for all approved visible states, no protected rendering on partial identify, no duplicate submit or auto retry.                             |
| U6  | Memory-only token/identity/guard/tuple; end/hidden/pagehide/navigation/idle/absolute reset synchronously removes personal DOM/memory, aborts callbacks and increments generation; pageshow/bfcache/back/refresh/duplicate/restart neutral. Local clearing is not remote ACK; server end/expiry semantics remain honest. | Generation/late-response tests, boundary timer tests, no durable storage/URL/history/channel/cache; future real-browser adversarial navigation + sequential users. |
| U7  | Freeze request identity+kind+guard before first mutation; while live, retry/recover exact tuple only, never new ID on timeout or automatic stale rebase. After clearing forget tuple and show fresh current state only; remote outcome remains unknown without receipt.                                                 | Unknown-before/after-commit recovery, UNCONFIRMED behavior, conflict refresh explicit new action, lost tuple does not fabricate failure/event/history.             |
| U8  | UI invokes only composed cloud consumer; no DB/auth primitives/trusted context in client; integration uses real synthetic migrated DB for final evidence. Unit fixtures may isolate deterministic state logic only, not a mock usable route or final success proof.                                                     | UI_TEST route/contract/source inventory plus future real-route Browser QA; no mock-success screenshot, new library, global CSS or unrelated shell changes.         |

Rollback/recovery: fail closed to neutral/unavailable UI; end clears locally
without claiming remote end. No offline queue, token persistence, extra retry
identity or browser scope fallback. Unsupported Product/UI change, shared
primitive/global shell need, transport widening or inability to protect cached
personal DOM: STOP; no authority via visual reference.

- [ ] 3.1 Implement U1 strict DTOs and isolated contracts export; verify bounded bodies and exact response allowlists with DTO tests.
- [ ] 3.2 Implement U2 approved Node handlers and transport adapter; verify exact methods, current operation checks, origin/header validation and non-enumerating statuses.
- [ ] 3.3 Implement U3 route-scoped nonce/cache security boundary; verify neutral HTML/RSC, no-store and no effect on non-Pointage routes.
- [ ] 3.4 Compose U4 approved employee page and meaningful route-local components; verify named exports, shared primitives/French labels and no application shell.
- [ ] 3.5 Implement U5 approved visible states and receipt lifecycle; verify no optimistic success, no forbidden employee output and accessible state transitions.
- [ ] 3.6 Implement U6 memory-only clearing/generation isolation; verify late response, timers, visibility/navigation/bfcache event logic and no durable personal state.
- [ ] 3.7 Implement U7 exact-tuple mutation/recovery client; verify duplicate submit, unknown result, conflict refresh and clearing without new-ID retry.
- [ ] 3.8 Complete U8 transport/interaction integration tests on approved consumer boundaries; collect implementation evidence without declaring Browser QA/VERIFY PASS.

## 4. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

Owner: existing auth/contracts/db-cloud/Backoffice test owners; no new runtime.
Paths AUTH tests, DBTEST, SERVICE_TEST, UI_TEST; DOC bounded implementation
notes subject to exact dirty-hunk isolation. Sources: preceding contracts,
20/62 Specs traceability, Design Verification Design and QA protocol.
Contract IDs R1-R7 below are technical contract rows; Spec R1-R13 are separately
labelled as Spec IDs in traceability.

| ID  | Binding technical requirement                                                                                                                                                                               | Required evidence                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Complete all 20 requirement / 62 scenario assertions, not heading-only coverage; exercise WHEN/THEN/AND with identified code/test paths.                                                                    | No unmapped source scenario, exact future test names/locations and command results; immutable approved source hashes.                               |
| R2  | Keep distinct IN/OUT, same-ID, stale OUT A→B, unknown COMMIT/end races; add helper vs actual issue/reset, lifecycle UPDATE both orders, parent status/timezone and Formalités dossier locks.                | Real barriers; locks survive return until COMMIT/ROLLBACK; exact raw/receipt counts/linkage/instants; whole rollback on timeout/deadlock.           |
| R3  | Keep three-operation/dual-identify/manager/tenancy/binding/provider/distributed-limiter adversarial tests; add exact helper owner/ACL/body/OID SQL proof and runtime refusal on privilege misconfiguration. | No protected payload/side effect; unsafe environment denied before credential work; role/ACL/body misconfiguration refuses runtime, no repair.      |
| R4  | Real disposable migration/writer/trigger proof plus unchanged microseconds/DST/timezone/departure/corrupt-chain checks; direct source row-lock/mutation denial and exact helper success.                    | Real source-lock/UPDATE denials, helper/owner/ACL/body/temp-path proof; unchanged rows; atomic migrations; exact DB identity, restored clock.       |
| R5  | Browser interaction regression implementation tests protect every visible state, unknown-result tuple and shared-device generations; no final QA claims from unit/handler tests.                            | UI_TEST focused outputs and complete post-Apply real-route scenario plan, no mock success substituted.                                              |
| R6  | Negative-scope/dependency/audit/cache inventory and bounded accurate technical docs; preserve existing foundation tests, Formalités hunks and other modules.                                                | Exact scoped diff, no local/POS/offline/Planning/payroll/canonical-session/classifier/new-provider/grant; no lifecycle promotion or secret logging. |
| R7  | Apply completion checks/tests collect attributable evidence only; do not determine formal Technical Implementation Compliance, VERIFY or QA, and do not create Gate3 packet.                                | Completed task outcomes with commands/exits/skips, scoped code/test diff and unresolved deviations handed to separate post-Apply evaluation.        |

Rollback/recovery: fix in-scope implementation defects and rerun affected tests;
unsafe environment or changed authority → STOP. Never make a test pass by
removing required denials, downgrading DB evidence to mocks or broadening scope.
No deploy/enable/sync/archive. No legal/privacy policy execution.

- [ ] 4.1 Complete R1 test mapping for all 20 requirements/62 scenarios; verify every source assertion has actual implementation/test reference and no unmapped case.
- [ ] 4.2 Add R2 multi-connection race/recovery regressions; verify one accepted pair and original receipt for each competing/replay scenario.
- [ ] 4.3 Add R3 hostile scope/lifecycle/provider/rate-limit regressions; verify no partial authority/display and no fallback on prerequisite failure.
- [ ] 4.4 Complete R4 migrated disposable DB/runtime-writer/time/corruption proof; verify real SQL outcomes, safe database identity and restored real clock.
- [ ] 4.5 Complete R5 interaction/navigation/recovery regression code and test assertions; verify late responses cannot restore prior interaction; formal Browser QA remains later.
- [ ] 4.6 Complete R6 negative inventory and bounded accurate technical documentation; verify exact scoped diff preserves dirty foundation/Formalités/UI work and all non-scope/readiness blockers.
- [ ] 4.7 Run R7 implementation-completion checks/tests and collect evidence; verify all Apply outcomes are evidenced, without declaring TECHNICAL IMPLEMENTATION COMPLIANCE or VERIFY/QA PASS and without creating 03-final-review.md.

## Commands and evidence plan

Các commands sau tồn tại trong current manifests/CLI. Test file selectors bên
dưới là planned files sẽ được tạo trong Apply; chưa chạy, không giả rằng file
hoặc script mới đã tồn tại. CWD là repository root trừ khi ghi rõ.
Không thêm lint/e2e/db script tưởng tượng.

| Key | Exact command                                                                                                                                                                                                                                                                                                                                                                                             | Intended use / prerequisite                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | `openspec validate pointage-usable-raw-clocking --strict`                                                                                                                                                                                                                                                                                                                                                 | Planning and formal VERIFY; exact two delta paths.                                                                                           |
| C2  | `pnpm docs:check`                                                                                                                                                                                                                                                                                                                                                                                         | Planning and Apply/post-Apply docs consistency.                                                                                              |
| C3  | `pnpm architecture:check`                                                                                                                                                                                                                                                                                                                                                                                 | Planning and every affected dependency/import/environment/migration boundary.                                                                |
| C4  | `pnpm -r --if-present typecheck`                                                                                                                                                                                                                                                                                                                                                                          | Workspace diagnostics; preserve unrelated failures and report them, not silent PASS.                                                         |
| C5  | `pnpm ui:pack:check backoffice-pointage-employee`                                                                                                                                                                                                                                                                                                                                                         | Stable pack structure/lifecycle/provenance, not subjective UI or implementation PASS.                                                        |
| C6  | `pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/tasks.md docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md docs/ui/pages/backoffice-pointage-employee/README.md docs/ui/pages/backoffice-pointage-employee/references/README.md docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json "docs/ui/pages/backoffice-pointage-employee/prompts/*.md"`    | Scoped planning formatting; check only, no formatter write on byte-locked docs. Review packet checked separately by exact path.              |
| C7  | `pnpm format:check`                                                                                                                                                                                                                                                                                                                                                                                       | Broader diagnostic; pre-existing formatting failures do not authorize cleanup.                                                               |
| C8  | `pnpm --filter @yuta/auth test test/pointage-continuation.test.ts test/pointage-credential.test.ts`                                                                                                                                                                                                                                                                                                       | F1 plus unchanged foundation crypto.                                                                                                         |
| C9  | `pnpm --filter @yuta/contracts test test/pointage.test.ts`                                                                                                                                                                                                                                                                                                                                                | Strict DTO and projection contracts.                                                                                                         |
| C10 | `pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts test/pointage-raw-clocking.integration.test.ts test/pointage-raw-clocking-migration.integration.test.ts`                                                                                                                                                                                                                     | Explicitly enabled, guarded disposable DB and restricted writer; skipped tests are not proof.                                                |
| C11 | `pnpm --filter @yuta/backoffice test test/pointage-raw-chain.test.ts test/pointage-raw-clocking-service.test.ts test/pointage-raw-clocking-runtime.test.ts test/pointage-raw-clocking-manager.test.ts test/pointage-raw-clocking-http.test.ts test/pointage-interaction.test.ts test/pointage-raw-clocking-inventory.test.ts test/pointage-foundation.test.ts test/pointage-foundation-inventory.test.ts` | Service/HTTP/interaction/foundation isolation.                                                                                               |
| C12 | `pnpm test:cloud`                                                                                                                                                                                                                                                                                                                                                                                         | Broader suite without unsafe integration env; record skipped DB suites separately.                                                           |
| C13 | `pnpm build:cloud`                                                                                                                                                                                                                                                                                                                                                                                        | Broader existing cloud build and client/server dependency checks; never production enablement.                                               |
| C14 | `pnpm db:cloud:generate`                                                                                                                                                                                                                                                                                                                                                                                  | Future Apply only after fresh baseline and schema review; inspect generated output before any migration.                                     |
| C15 | `pnpm db:cloud:migrate`                                                                                                                                                                                                                                                                                                                                                                                   | Future Apply only on verified newly provisioned disposable target under owner; fresh/upgrade/no-op proof. Never general .env.local fallback. |
| C16 | `pnpm --filter @yuta/backoffice dev --hostname 127.0.0.1`                                                                                                                                                                                                                                                                                                                                                 | Future real-route QA only, explicit guarded synthetic composition/origin and restricted runtime writer.                                      |
| C17 | `pnpm --filter @yuta/db-cloud test test/pointage-repository.integration.test.ts`                                                                                                                                                                                                                                                                                                                          | Separate guarded foundation disposable DB, not raw-clocking DB; preserve existing suite's own target guard.                                  |

F6 validation/probe must precede C15 and C10 fixture writes/provider; a safe
read-only database-name probe does not authorize migration on an unsafe target.
CLOUD_DATABASE_URL is injected via an approved local test environment, never
printed/committed; YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true only after safe
selection, YUTA_POINTAGE_SYNTHETIC_TEST_MODE=true for raw runtime,
POINTAGE_TEST_ORIGIN=http://127.0.0.1:3001, `NODE_ENV` development/test, no VERCEL.
Use separate migration owner and runtime-writer connections, record identities
without credentials. Never run broad test:cloud with a shared writable database
integration opt-in: older suites have their own guards/setup/cleanup. Run C17
in its separate foundation-only disposable target or report exact blocker.
No database setup/provision/migrate/seed/test execution during this planning turn.

## POST-APPLY VERIFY PLAN

Plans only until all 32 Apply tasks complete. Formal VERIFY is a new evaluation
after Apply, using openspec-verify-change and current workflow/authority reads.
Do not promote Apply test collection directly to formal PASS without reviewing
current bytes, command results, scope and any changed code since those runs.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

Build the Technical Compliance Matrix in post-Apply VERIFY evidence with
exactly all applicable F1-F8, S1-S9, U1-U8 and R1-R7 contract rows (32 total).
For each row: constraint → authoritative Spec/Design section → actual scoped
code path/line → test assertion/command/log hash → PASS or FAIL, with deviations.
No empty row, inferred PASS or checklist-only evidence. A requirement's R label
is not a substitute for the corresponding technical contract row.

Re-evaluate the following separately:

- Recompute approved Proposal/Analysis, each Spec, Design, task/pack/provenance
  and gate hashes/path sets; check authorized metadata exceptions separately.
- Replace the planned 20/62 mapping below with actual code/test lines and exact
  assertion evidence, checking every WHEN/THEN/AND against current behavior.
- Fresh Git status, HEAD and sorted exact allowlist. Review scoped
  `git diff --no-ext-diff --binary -- <explicit tracked path list>`;
  include each new untracked implementation file using
  `git diff --no-index --binary -- /dev/null <exact new path>` on a compatible
  Git invocation, or an explicitly documented deterministic byte snapshot.
  Exit 1 for a no-index difference is expected, not a test failure.
  Exclude pre-existing untracked foundation and unrelated dirty hunks using the
  saved pre-Apply byte baseline, not HEAD alone. Hash exact attributed diff
  bytes, prove it reverses against current files to that baseline, and record
  full sorted implementation path set. Stop if attribution is not reproducible.
- Rerun focused C8-C11, C17 in separate safe target and migration/database proof
  C10/C15; record generated SQL/journal/snapshot hashes and both migration
  directions (empty→current; foundation→current), runtime role effective
  privileges, trigger denials, clock restoration and actual database identity.
  Skipped/no-database tests cannot satisfy F3-F8 or R2-R4.
- Rerun C1-C5, scoped formatting on actual changed files, C12/C13 and broader
  formatting diagnostic C7; attach exact command/cwd/exit/result/time and skips.
  Type/build cache generation is not implementation attribution.
- Record deviations, pre-existing failures and new blockers honestly. Correct
  in-scope defects then rerun impacted VERIFY evidence; changed Product,
  security/ownership or incompatible durable boundary returns to earlier gate.

Only when every matrix row passes and approved behavior matches code with no
critical unresolved issue may the later evidence record
`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and `VERIFY: PASS`.
Failure/blocked environment stays explicit; no QA progression on failed VERIFY.
Neither result grants production use or sync/archive.

## QA PLAN

Separate subsequent evaluation under docs/YUTA_QA_PROTOCOL.md, only after
formal VERIFY passes. UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES.
QA status currently NOT_RUN (planning marker, not an evaluated protocol result).
Later evaluated status must be PASS, FAIL or BLOCKED_BY_ENVIRONMENT;
NOT_APPLICABLE is invalid for this change.

Required environment: actual implemented Next route on loopback + journaled,
migrated disposable PostgreSQL + approved injected synthetic trusted-address
provider + actual restricted writer. All F6 guards apply to QA without bypass.
Only synthetic people/credentials/attendance. No mocked-success screenshot,
real employee data, production provider or staging/production enablement.
Use current available browser tooling; no new visual/e2e dependency authorized.

Run the full page-pack state matrix at 1440x900, 1024x768, 768x1024 and 390x844:
credential entry/identify pending; NOT_CLOCKED_IN/CLOCKED_IN; mutation pending;
both committed receipts; state/request conflicts; unknown-result recover/resend
same tuple; generic access failure; rate limit; unavailable; end/neutral.
Also inspect keyboard/touch/focus/labels/live announcements/long-name wrap,
zoom/reflow/overflow. Preserve French copy and NO_APPLICATION_SHELL.

Adversarial real-route scenarios: IN/OUT/re-identify multi-session;
two tabs/stale OUT across A/B; actual commit with lost response then exact
recovery; reset, expiry60/120, departure midnight; Terminer/receipt10s;
hidden/pagehide/pageshow/bfcache/back/refresh/duplicate/restart; delayed old
response after clearing; subsequent employee cannot see prior state/receipt.
Prove local clearing versus remote end ACK/lost network truthfulness, and no
personal residues in browser durable stores/HTML/RSC/cache/URLs/history/channels.
Backend manager roles/isolation need service/DB evidence, not invented manager UI.

Future evidence under docs/reviews/pointage-usable-raw-clocking/qa/:
QA_REPORT.md, screenshot-manifest.md and actual PNG captures. Manifest records
relative path, SHA-256, actual viewport, scenario/state/role, route, capture
conditions/time and synthetic-only provenance. Screenshots/logs must exclude
plaintext credential/token/guard/trusted context. Screens show observed UI;
SQL/handler/race proofs support nonvisual security claims. Link report and
manifest from eventual Gate3. No qa/ artifacts created during planning.

If environment unavailable: use only safe repository-defined recovery, record
BLOCKED_BY_ENVIRONMENT and stop; never fabricate screenshot/QA PASS. Defects
require in-scope fix then formal VERIFY and affected QA rerun.

## Gate 3 boundary

03-final-review.md may be created only after Apply complete, Technical
Implementation Compliance evaluated PASS, formal VERIFY complete PASS, and
separate mandatory QA complete PASS with hashed real-browser evidence.
Do not create/prepare an awaiting-review Gate3 packet during Apply or planning.
The user-requested planning review is not Gate3; sync authorization remains
ungranted. Do not sync/archive, deploy, enable Pointage or promote lifecycle.

## Requirement and scenario traceability — planned, not executed

A1-A7 refer to authorization/pointage; R1-R13 to pointage/raw-clocking, in exact
approved heading order as Design's mapping. Every scenario inherits its parent
task/test mapping plus its own exact WHEN/THEN/AND assertions. Test suite keys
expand to exact paths in Planned path keys; final test names must include the
scenario ID. All rows are PLANNED / NOT_RUN. Design remains authority for
mechanisms; this inventory does not rewrite either Spec.

### All 20 requirements

| Spec ID | Exact approved heading                                                         | Design        | Apply tasks                 | Planned code                           | Planned tests/evidence                                           |
| ------- | ------------------------------------------------------------------------------ | ------------- | --------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| A1      | Usable consumer dùng dedicated short-lived Pointage continuation               | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A2      | Continuation chỉ self-only trong trusted binding và closed catalog             | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A3      | Current Personnel eligibility áp dụng cho cả ba employee operations            | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A4      | Committed replay không bypass current authorization                            | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A5      | Expiry reset và interaction end không để lại stale authority                   | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A6      | Continuation không serialize trusted context hoặc persist plaintext credential | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A7      | Usable consumer giữ non-enumeration và trusted-address prerequisite            | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| R1      | Raw clocking sử dụng trusted cloud scope và online acceptance                  | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R2      | Raw command vocabulary và bốn transition outcomes là đóng                      | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R3      | Raw evidence immutable là sole canonical attendance source                     | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R4      | Sessions và current state chỉ derived và không overlap                         | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R5      | Stable request identity bảo toàn committed receipt và replay                   | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R6      | Concurrent competing requests có tối đa một acceptance                         | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R7      | Accepted event time do server quyết định và giữ historical context             | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R8      | Cross-midnight grouping không thay departure eligibility                       | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R9      | Employee chỉ thấy own minimal current state và receipt                         | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R10     | Manager read chỉ server-side và establishment-scoped                           | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R11     | Shared-device UI bảo toàn isolation và trung thực về operation state           | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R12     | Capability giữ fail-closed provenance và tách biệt production policy           | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R13     | Usable slice không mở rộng explicit non-scope                                  | D1,D12        | 3.8,4.6                     | DATA; DOMAIN; HTTP; PAGE; DOC          | DBTEST schema; UI_TEST inventory; post-Apply Browser QA          |

### All 62 scenarios

| Spec ID | Exact approved heading                                   | Design        | Apply tasks                 | Planned code                           | Planned tests/evidence                                           |
| ------- | -------------------------------------------------------- | ------------- | --------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| A1.1    | Tiếp tục own Pointage interaction                        | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A1.2    | Pointage continuation dùng ngoài domain                  | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A2.1    | Continuation được dùng cho employee khác                 | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A2.2    | Continuation yêu cầu privileged operation                | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A2.3    | Browser cung cấp trusted-context claims                  | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A3.1    | Identify trước entry hoặc sau departure                  | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.2    | State read ngoài employment period                       | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.3    | Mutation sau departure với session đang mở               | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.4    | Ngày entry hoặc final departure hợp lệ                   | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.5    | Không xác minh được lifecycle hiện tại                   | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A4.1    | Authorized replay                                        | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A4.2    | Prior success nhưng current access mất hiệu lực          | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A5.1    | Continuation hết hạn                                     | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A5.2    | Credential reset nhưng browser còn continuation cũ       | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A5.3    | Interaction đã kết thúc trên shared device               | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A6.1    | Browser nhận continuation và current-state response      | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A6.2    | Durable browser storage hoặc diagnostics                 | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A6.3    | Technical metadata được tái dùng làm evidence            | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A7.1    | Missing hoặc untrusted client-address provider           | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| A7.2    | Public access failure                                    | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| A7.3    | Provider composition cần authority riêng                 | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| R1.1    | Employee operation có đầy đủ prerequisites               | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R1.2    | Browser đổi scope hoặc dossier                           | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R1.3    | Cloud hoặc database không xác nhận được kết quả          | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R2.1    | NO_OPEN_SESSION nhận CLOCK_IN                            | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.2    | OPEN_SESSION nhận CLOCK_OUT                              | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.3    | OPEN_SESSION nhận CLOCK_IN                               | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.4    | NO_OPEN_SESSION nhận CLOCK_OUT                           | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.5    | Caller gửi event kind ngoài vocabulary                   | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R3.1    | Derived state được tái dựng                              | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R3.2    | Actor yêu cầu sửa hoặc xóa raw event                     | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R3.3    | Technical metadata được dùng làm attendance fact         | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R4.1    | Employee tạo nhiều sequential sessions                   | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R4.2    | Session thiếu clock-out                                  | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R5.1    | Cùng identity và intent sau commit                       | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.2    | Cùng identity nhưng intent khác                          | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.3    | Receipt lookup từ employee hoặc establishment khác       | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.4    | Timeout retry                                            | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.5    | Replay sau khi lifecycle hoặc authority không còn hợp lệ | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R6.1    | Hai distinct CLOCK_IN cạnh tranh từ no-open state        | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R6.2    | Hai distinct CLOCK_OUT cạnh tranh đóng cùng session      | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R6.3    | Double submit cùng request identity                      | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R7.1    | Browser gửi clock hoặc backdated timestamp khác server   | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R7.2    | Actual time lệch Planning                                | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R7.3    | Local date/time cần được diễn giải lại                   | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R8.1    | Session đi qua midnight trong employment period          | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R8.2    | CLOCK_OUT sau departure date                             | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R9.1    | Employee chưa clock-in                                   | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.2    | Employee đang clock-in                                   | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.3    | Minimal Personnel projection                             | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.4    | Employee yêu cầu lịch sử                                 | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R10.1   | Authorized manager đọc bounded state                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R10.2   | Manager thiếu scope hoặc exact grant                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R10.3   | STAFF hoặc employee xin manager read                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R11.1   | Interaction kết thúc trên shared tablet                  | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.2   | Browser khôi phục state cũ                               | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.3   | Mutation pending, success hoặc conflict                  | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.4   | Invalid credential, rate limit hoặc lifecycle denial     | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R12.1   | Thiếu trusted client-address provenance                  | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R12.2   | Production legal policy chưa được duyệt                  | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R12.3   | Capability được triển khai và kiểm tra thành công        | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R13.1   | Downstream hoặc ngoài phạm vi yêu cầu capability         | D1,D12        | 3.8,4.6                     | DATA; DOMAIN; HTTP; PAGE; DOC          | DBTEST schema; UI_TEST inventory; post-Apply Browser QA          |

Task count: 32 (8 Foundation / Data + 9 Service / Domain + 8 Employee Transport / UI + 7 Integration / Regression). Completed: 0/32.

TASKS / IMPLEMENTATION PLAN REVIEW

Status: AWAITING_HUMAN_REVIEW

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED

## Apply checkpoint — 2026-09-08, mandatory security stop

Phần này ghi execution evidence, không thay approved planning authority ở trên.
Current-user resume chấp nhận baseline lúc 2026-09-08T10:20:11.9972366+02:00,
HEAD defbc50eba3952fa2e7b1c016637daf083b18c65. Approval packet vẫn nguyên hash
a80a45fdc7889a1f68b15a9af9da95ef6695684b085ad6b394dbae53f12b0977.
Approved Tasks preimage:
8cb14531f9c230f025e460ea7f0a8b2208cee4904c789a353e12718240c6f1db.
Apply authorization được cấp bởi current user, nhưng execution hiện dừng
vì conflict D4/D6/F8; không tự sửa Design hoặc mở rộng quyền.

APPLY: BLOCKED

Tasks: 2/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

### Blocking discovery — row-lock privileges versus restricted writer

D4 bắt buộc organization FOR SHARE, establishment FOR SHARE, scoped Personnel
dossier FOR UPDATE, rồi continuation FOR UPDATE. D6/F8 chỉ cho runtime writer
SELECT/INSERT cần thiết và UPDATE hai cột continuation idle_expires_at/ended_at;
không Personnel mutations hoặc broaden grant.

PostgreSQL 17 yêu cầu UPDATE trên ít nhất một cột của từng table được SELECT
FOR SHARE/FOR UPDATE. Vì thế SELECT-only trên organizations, establishments và
personnel_employee_dossiers không đủ để thực thi đúng D4 bằng current invoker
role. Cột mutable của continuation không cấp quyền lock ba table còn lại.
Đây là platform prerequisite đã đối chiếu
[PostgreSQL 17 SELECT](https://www.postgresql.org/docs/17/sql-select.html);
chưa có reproduction trên disposable PostgreSQL, không ghi nhận SQL test giả.

Repository scan hiện không tìm thấy SECURITY DEFINER lock helper được duyệt
trong db-cloud migration history. Existing pointage-repository.ts cũng khóa
dossier trực tiếp, không cung cấp delegated locking boundary có thể tái dùng.
[SECURITY DEFINER](https://www.postgresql.org/docs/17/sql-createfunction.html)
chạy bằng quyền function owner, nên tự thêm helper như vậy sẽ thêm privileged
execution boundary chưa được Design xác định.

Không thực hiện bất kỳ workaround nào: không thêm UPDATE grant trên Tenancy/
Personnel, không owner fallback, không bỏ lock, không advisory-lock replacement,
không SECURITY DEFINER helper, không disable trigger. Theo phase stop condition
“new grant/owner needed” và skill State 5, cần review Sensitive Design/Control
Tower để quyết định cách phối hợp lock với F8 trước khi resume. Không cần
thay Product semantics hoặc Specs chỉ để che lỗi quyền.

### Task outcomes and partial implementation

- 1.1 COMPLETE: portable continuation/stateGuard primitives, isolated auth
  export; 24 passing auth tests including unchanged credential tests.
- 1.2 COMPLETE: raw/receipt shape, scoped unique/FK/index assertions,
  lossless timestamp and bigint mapping; schema unit checks pass.
- 1.3 PARTIAL / BLOCKED: continuation table, credential full-tuple unique key,
  bounded idle/end repository methods and schema/source-contract assertions
  are present. Restricted-role runtime evidence is absent. Repository is not
  exported from db-cloud root and has no runtime consumer. Not checked complete.
- 1.4–1.8 NOT_STARTED: no enforcement migration, harness, DB role provisioning
  or actual PostgreSQL proof.
- 2.1–2.9, 3.1–3.8, 4.1–4.7 NOT_STARTED. No route, UI, transport, fixture,
  service composition or attendance write.

32 checkboxes remain; only 1.1 and 1.2 are checked. The historical planning
footer's 0/32 and NOT_GRANTED describe the review snapshot, not this checkpoint.
20 requirements / 62 scenarios remain the approved plan, not completed coverage.
No claim of runtime immutability, committed raw/receipt pairing or usable clocking.

### Exact attributable implementation paths and hashes

SHA-256 over file bytes, not Git HEAD. Before values use the accepted baseline
and fresh pre-write capture; NEW means the path was confirmed absent.
Final implementation inventory captured 2026-09-08T10:43:20.2056261+02:00.

| Path                                                        | Before SHA-256                                                   | Current SHA-256                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/auth/src/index.ts                                  | b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634 | 464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a |
| packages/auth/src/pointage-continuation.ts                  | NEW / absent                                                     | f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172 |
| packages/auth/test/pointage-continuation.test.ts            | NEW / absent                                                     | 6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a |
| packages/db-cloud/src/pointage-raw-clocking-repository.ts   | NEW / absent                                                     | 2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb |
| packages/db-cloud/src/schema/index.ts                       | 1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15 | eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944 |
| packages/db-cloud/src/schema/pointage-raw-clocking.ts       | NEW / absent                                                     | d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754 |
| packages/db-cloud/src/schema/pointage.ts                    | 19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6 | 8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29 |
| packages/db-cloud/test/pointage-raw-clocking-schema.test.ts | NEW / absent                                                     | 4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158 |

Three existing-code edits were independently reconstructed in memory from
baseline base64 bytes and compared using Buffer.equals against full current
files. All three returned EXACT_ADDITIVE_HUNK_ONLY:

- auth/src/index.ts: one export for pointage-continuation immediately after
  pointage-credential; all Formalités and other export bytes retained.
- db-cloud/src/schema/index.ts: one pointage-raw-clocking export immediately
  after pointage; all Formalités and other export bytes retained.
- db-cloud/src/schema/pointage.ts: one non-deferred composite credential
  unique declaration (organizationId, establishmentId, personnelDossierId,
  id, credentialVersion); all previous definitions retained.

The other five implementation paths are entirely new files with the above
hashes. No db-cloud root export was added. Whole-checkout Git tracked/untracked
inventory compared with the 2,551-file fresh pre-write baseline found exactly
these eight implementation paths plus task checkbox progress changed; no
removed paths and no unrelated changed bytes at that comparison.

Unchanged: normative main Specs, archived changes, Proposal, Analysis, delta
Specs, Design, UI plan/pack, all review packets, existing foundation crypto,
Personnel, Formalités exports/test/SQL/snapshot, migrations 0019 and 0020 and
all previous journal entries/snapshots. No formatter wrote any shared file.

### Apply checks — not formal VERIFY

| Command                                                                                                                                                                                                                                                                                            | Result                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| pnpm --filter @yuta/auth test test/pointage-continuation.test.ts test/pointage-credential.test.ts                                                                                                                                                                                                  | Exit 0; 2 files, 24 tests passed.                                                                  |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                                                                                                                                        | Exit 0; 1 file, 5 tests passed. Includes schema/source-contract checks, not SQL enforcement proof. |
| pnpm --filter @yuta/auth typecheck                                                                                                                                                                                                                                                                 | Exit 0.                                                                                            |
| pnpm --filter @yuta/db-cloud typecheck                                                                                                                                                                                                                                                             | Exit 0.                                                                                            |
| pnpm -r --if-present typecheck                                                                                                                                                                                                                                                                     | Exit 0; all applicable workspace packages/apps passed.                                             |
| pnpm docs:check                                                                                                                                                                                                                                                                                    | Exit 0; 36 current documents.                                                                      |
| pnpm architecture:check                                                                                                                                                                                                                                                                            | Exit 0.                                                                                            |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                                                                                                  | Exit 0; change valid.                                                                              |
| pnpm exec prettier --check packages/auth/src/pointage-continuation.ts packages/auth/test/pointage-continuation.test.ts packages/db-cloud/src/schema/pointage-raw-clocking.ts packages/db-cloud/src/pointage-raw-clocking-repository.ts packages/db-cloud/test/pointage-raw-clocking-schema.test.ts | Exit 0; all five new files formatted.                                                              |
| pnpm format:check                                                                                                                                                                                                                                                                                  | Exit 1; 67 pre-existing unrelated warnings, no target warning. No global formatting write.         |

Initial local check failures were corrected before the stop: ESM crypto spy
required a Vitest module mock; timestamp SQL-type test expected an extra space;
Drizzle clock SELECT needed execute rather than a select builder without FROM;
source-contract regex needed to allow formatter whitespace. Subsequent focused
tests/typechecks passed. These fixes did not revise approved behavior.

Not run: DB integration, migrations/generation, writer privilege probe, provider
composition, cloud/local broad integration suites, builds, UI pack execution,
formal VERIFY, Browser QA and Gate 3. DB and runtime proofs cannot be counted
as passed or replaced with unit mocks. No DB connection or DB operation occurred.
Docker inspection was read-only; no container created/removed/reconfigured.
No disposable database or test role was provisioned.

### Preserved authority and resume requirement

Synthetic/disposable attendance only; real attendance NOT_AUTHORIZED in every
environment. No production provider, production enablement, deploy, sync,
archive or lifecycle/readiness promotion. All seven blockers remain unresolved:
retention; deletion/anonymization; legal hold; backup-retention interaction;
employee notice; detailed audit visibility; trusted production client-address
provenance.

Next authority: bounded Sensitive Design/Control Tower decision reconciling D4
row locks with D6/F8 least privilege, followed by any explicitly authorized
planning correction and Apply resume. Preserve the partial implementation and
recompute its hashes plus all approved baselines before further code edits.
```

## Current alignment stop

TASKS / IMPLEMENTATION PLAN ALIGNMENT REVIEW

Status: AWAITING_HUMAN_REVIEW

APPLY: PAUSED

Tasks: 2/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

---

# Historical pre-alignment packet — retained bytes, not current approval

The exact prior packet begins at the following Change line and runs to EOF.
Its SHA-256 before this regeneration is
00cb1f24ba28594ecba5c65a78a5098872d0da998817aae974ad1d96909b0614.
Only the current sections above bind the new review; old approvals do not
authorize the revised plan or resume Apply.

Change: pointage-usable-raw-clocking
Gate: TASKS / IMPLEMENTATION PLAN REVIEW
Review status: INVALIDATED_BY_ARTIFACT_CHANGE
Created: 2026-09-08T09:29:49.6417270+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

## Sensitive Design reopen — current operational stop

Current-user authority: bounded locking/privilege Design revision only.
APPLY: PAUSED. Tasks: 2/32. Task 1.3 remains PARTIAL / BLOCKED.
The prior approval below is historical and does not authorize the new delegated
database execution boundary. The 32-task plan and UI plan are unchanged.
Previous approved Design SHA-256:
`be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9`.
Reopened Design SHA-256:
`a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361`.
Pre-metadata packet SHA-256:
`a80a45fdc7889a1f68b15a9af9da95ef6695684b085ad6b394dbae53f12b0977`.
Dependency approval invalidated pending revised Sensitive Design review and
explicitly authorized corresponding Tasks/TIC planning correction. No Apply
resume, formal VERIFY, QA, migration or production action is authorized here.
See [reopened Design review](02b-design-review.md).
All snapshots, baseline evidence and approval history below are preserved.

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-08T09:43:05.4435122+02:00

Decision: TASKS_AND_IMPLEMENTATION_PLAN_APPROVED

Apply authorization: GRANTED — execution stopped by mandatory preflight drift rule.

## Baseline revalidation — current operational status

BASELINE_REVALIDATION: PASS

Authorization source: explicit current-user BASELINE REVALIDATION ONLY request.
Baseline timestamp: 2026-09-08T10:20:11.9972366+02:00.
Repository: D:/working/yuta/yuta-resto.
HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.

Lượt này chỉ nhận baseline hiện tại sau đối chiếu read-only. Không resume Apply
hoặc task 1.1. Các mục pre-Apply STOP bên dưới được giữ nguyên như lịch sử;
kết quả revalidation này thay trạng thái baseline, không sửa approval hoặc
nội dung Product/Specs/Design/Tasks/UI đã duyệt. Approval kế hoạch vẫn hợp lệ,
nhưng current-turn authority không cho phép implementation.

```text
APPLY: PAUSED_AFTER_BASELINE_REVALIDATION
Tasks: 0/32
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
```

### Approved artifacts and scope integrity

Packet trước lượt revalidation:
`e204c0eb412b32f134f662d5c8552eeba6c30c81939bab647278df5075551f50`.
Original approved packet remains
`9ba2b59a1d0075155570b72965b1107dc992a21e5c198fe466a0807d222a036a`.
Không dùng hash packet có metadata mới để thay lịch sử approval.

25 artifact hashes, 11 exact embedded snapshots và 6 canonical prompt copies
khớp; exact path set không đổi. Hai delta Specs vẫn 20 requirements / 62
scenarios; Tasks vẫn bốn phases, 32 unchecked tasks và F1-F8/S1-S9/U1-U8/R1-R7.
Các hashes hiện tại có trong full inventory bên dưới và bảng reviewed artifacts
đã có. Tasks, UI Implementation Plan, Design và mọi UI pack file không sửa.
Historical DRAFT/NOT_GRANTED labels đã được approval metadata phân biệt trước
đó; không có stale sequence/hash literal trong Tasks/UI buộc phải chỉnh.
Tasks và Design chủ động yêu cầu next generated sequence từ current journal,
không pin 0020. Không cần sửa planning behavior.

### Drift classification and exact attribution

Cả ba drift thuộc `formalites-legal-template-foundation`, capability
`formalites/legal-template-foundation`. Không phải Pointage raw-clocking.
Phân loại dựa trên byte reconstruction, schema/snapshot/SQL inspection,
dependency/authority checks và typecheck, không chỉ dựa vào diff nhỏ.

#### packages/db-cloud/src/index.ts

Classification: SAFE_NEW_BASELINE.
Previous planning SHA-256: `78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1`.
Current SHA-256: `7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0`.
Additive: YES. Independently isolatable: YES.
Approved Pointage Design/Tasks assumption invalidated: NO.

Exact Formalités addition, represented as a JSON string to preserve delimiters
and final newline (removal performed in memory only):

```text
"export {\n  createFormalitesLegalTemplateRepository,\n  type FormalitesLegalTemplateRepository,\n} from './formalites-legal-template-repository';\nexport {\n  FORMALITES_LEGAL_SOURCE_PROFILE,\n  FormalitesLegalTemplateError,\n  type FormalitesLegalTemplateErrorCode,\n  type FormalitesTemplateApplicability,\n} from './formalites-legal-template-domain';\n"
```

Exact occurrence count: 1. In-memory removal reconstructs
`78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1`, identical to the previous raw-byte hash.
No pre-existing byte outside this addition changed.

#### packages/db-cloud/src/schema/index.ts

Classification: SAFE_NEW_BASELINE.
Previous planning SHA-256: `934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264`.
Current SHA-256: `1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15`.
Additive: YES. Independently isolatable: YES.
Approved Pointage Design/Tasks assumption invalidated: NO.

Exact Formalités addition, represented as a JSON string to preserve delimiters
and final newline (removal performed in memory only):

```text
"export * from './formalites-legal-templates';\n"
```

Exact occurrence count: 1. In-memory removal reconstructs
`934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264`, identical to the previous raw-byte hash.
No pre-existing byte outside this addition changed.

#### packages/db-cloud/drizzle/meta/\_journal.json

Classification: SAFE_NEW_BASELINE.
Previous planning SHA-256: `855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665`.
Current SHA-256: `64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997`.
Additive: YES. Independently isolatable: YES.
Approved Pointage Design/Tasks assumption invalidated: NO.

Exact Formalités addition, represented as a JSON string to preserve delimiters
and final newline (removal performed in memory only):

```text
",\n    {\n      \"idx\": 20,\n      \"version\": \"7\",\n      \"when\": 1788853104815,\n      \"tag\": \"0020_formalites_legal_template_foundation\",\n      \"breakpoints\": true\n    }"
```

Exact occurrence count: 1. In-memory removal reconstructs
`855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665`, identical to the previous raw-byte hash.
No pre-existing byte outside this addition changed.

Semantic delta: root db-cloud barrel adds only the authorized Formalités facade
and named value/error/type exports. Schema barrel adds only the three-table
Formalités schema export. Journal appends one Formalités entry, retaining all
earlier bytes. Formalités repository uses its dedicated global template
tables and existing AuthService operation guards; it does not import Pointage,
rewrite Personnel, acquire Pointage dossier locks, or create an employee grant.
No manifest/runtime dependency edge was added. Future Pointage export additions
are independent; Pointage must preserve these exact existing exports.

### Migration and generator baseline — static proof only

Current journal: PostgreSQL, version 7, 21 entries, contiguous indices 0..20.
There are exactly 21 SQL files and 21 corresponding snapshots, no unjournaled
SQL and no broken snapshot prevId chain. Latest actual entry:

```text
{"idx":20,"version":"7","when":1788853104815,"tag":"0020_formalites_legal_template_foundation","breakpoints":true}
```

SQL `packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql`
and snapshot `packages/db-cloud/drizzle/meta/0020_snapshot.json` exist.
Their exact hashes are in the inventory. SQL creates only three Formalités
tables and their own restrictive FKs, unique/check constraints and active-draft
partial index. No old Pointage/Personnel table or row is altered, no seed,
backfill, DROP, trigger override or runtime enablement is introduced.

Snapshot 0019 -> 0020: 55 -> 58 tables; exactly
public.formalites_template_identities,
public.formalites_template_versions,
public.formalites_template_working_drafts added.
All 55 pre-existing table definitions are equal. All other snapshot sections
are equal except generated id/prevId. Latest prevId equals snapshot 0019 id.

Installed Drizzle read-only serialization was inspected before use.
`generateDrizzleJson` serializes exported schema in memory; no migration
generation, SQL generation, database connection or file write was invoked.
The entire current exported schema matches snapshot 0020 in every semantic
section; generated identity and bookkeeping fields are not schema differences.
Exact result:

```text
{"previousTables":55,"latestTables":58,"currentTables":58,"chainMatches":true,"currentSchemaDifferences":[],"addedTables":["public.formalites_template_identities","public.formalites_template_versions","public.formalites_template_working_drafts"],"changedExisting":[],"otherChangedSections":[]}
```

Reproducible read-only command, CWD packages/db-cloud:

```text
@'
const fs=require('node:fs'); const api=require('drizzle-kit/api'); const schema=require('./src/schema/index.ts'); const current=api.generateDrizzleJson(schema); const previous=JSON.parse(fs.readFileSync('./drizzle/meta/0019_snapshot.json','utf8')); const latest=JSON.parse(fs.readFileSync('./drizzle/meta/0020_snapshot.json','utf8')); const canon=(v)=>JSON.stringify(v, function(k,x){return x && !Array.isArray(x) && typeof x === 'object' ? Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))) : x;}); const keys=Object.keys(latest).filter(k=>!['id','prevId','_meta'].includes(k)); console.log(JSON.stringify({previousTables:Object.keys(previous.tables).length,latestTables:Object.keys(latest.tables).length,currentTables:Object.keys(current.tables).length,chainMatches:latest.prevId===previous.id,currentSchemaDifferences:keys.filter(k=>canon(latest[k])!==canon(current[k])),addedTables:Object.keys(latest.tables).filter(k=>!previous.tables[k]),changedExisting:Object.keys(previous.tables).filter(k=>canon(previous.tables[k])!==canon(latest.tables[k])),otherChangedSections:Object.keys(previous).filter(k=>!['id','prevId','tables'].includes(k)&&canon(previous[k])!==canon(latest[k]))}));
'@ | pnpm exec node --import tsx
```

An initial shell-quoted inline evaluation failed at parsing (exit 1), before
schema evaluation; the stdin form above completed with exit 0. No DB or file
write occurred in either attempt. No `generateMigration`, `db:generate`,
migration execution or disposable-database probe was run in this turn.

Current scripts remain root `pnpm db:cloud:generate` ->
@yuta/db-cloud `drizzle-kit generate`, schema entry
`src/schema/index.ts`, output `drizzle`. At this exact baseline there is no
pending unrelated schema reconciliation to absorb. Therefore one future
additive Pointage migration remains isolatable using the normal generator.
This is conditional on a fresh pre-generation comparison and review of the
actual generated SQL/snapshot/journal path set, not a generated-output promise.
No next number/name is reserved now. All current SQL/snapshot history,
including Formalités 0020 and Pointage foundation 0019, is protected.

Formalités is a partial Apply checkpoint blocked on its own disposable-DB
safety evidence; accepting its bytes as baseline does not certify completion,
VERIFY, QA, migration execution or production readiness. Pointage also still
needs its separately guarded disposable DB and restricted writer at future
Apply. No environment inspection here establishes a safe DB target.

### All intended existing modification paths

Twelve code/test/architecture paths are captured byte-exactly below. Nine are
unchanged from the original planning baseline; only the three classified
Formalités additions differ. All twelve classify SAFE_NEW_BASELINE for future
bounded Pointage modifications. This does not authorize modifying them now.

```text
apps/backoffice/src/server/pointage/authorization.ts	3956	c33a530483f76f29065729834e07b5d4512ee54255765645bece9cef8c87cc34	SAFE_NEW_BASELINE
apps/backoffice/src/server/pointage/index.ts	60	5a17ce9a793561f26e7eca9c62f7835925d54d9eba61074951d58871dd910133	SAFE_NEW_BASELINE
apps/backoffice/src/server/pointage/service.ts	19246	1e34ca92770148dbbaa9582a793de425163e89cd067d6d90e317b1fb2e2747ae	SAFE_NEW_BASELINE
apps/backoffice/test/pointage-foundation-inventory.test.ts	2001	1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa	SAFE_NEW_BASELINE
docs/architecture/AUTHENTICATION.md	12200	c92736abbc1192b18a06923e5ead5ed7416c4610f8c0dbd8ae639bc65cfdf4c8	SAFE_NEW_BASELINE
docs/architecture/DATABASE_BOUNDARIES.md	2225	833fc791ec80e487c8f079af951dd35006dc27102e2a9f8be7c4ef347a3ead5e	SAFE_NEW_BASELINE
packages/auth/src/index.ts	239	b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634	SAFE_NEW_BASELINE
packages/contracts/src/index.ts	338	ce44e688cea68cee2291db00a89207b5ae95086c3ef9de2df649858aa7378a44	SAFE_NEW_BASELINE
packages/db-cloud/drizzle/meta/_journal.json	3251	64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997	SAFE_NEW_BASELINE
packages/db-cloud/src/index.ts	1571	7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0	SAFE_NEW_BASELINE
packages/db-cloud/src/schema/index.ts	335	1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15	SAFE_NEW_BASELINE
packages/db-cloud/src/schema/pointage.ts	8900	19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6	SAFE_NEW_BASELINE
```

Auth barrel preserves the exact unrelated Formalités export and existing
credential export. Pointage schema still contains only credentials, distributed
limits and minimized security audit; the future credential composite unique
key is additive and does not rename/rewrite any current field. Backoffice
service/authorization/index and the existing inventory test are unchanged;
bounded integration and historical-foundation/new-consumer assertions remain
separately attributable. Contracts barrel needs only the planned isolated
export. Architecture files preserve their existing dirty hunks.

The stable UI pack is the additional DOC planning/evidence boundary. Every
current pack file is listed/hash-bound in the full inventory, and the 11 exact
snapshots plus sealed prompt copies remain intact. Five reviewed UI documents
stay byte-locked; no as-built or lifecycle update is authorized by revalidation.
Tasks remains unchanged. No new overlapping nested AGENTS was found.

### Intended new paths — all absent

Explicit filesystem checks, including ignored-path existence, found all 37
planned concrete new paths absent. Generated migration names remain unresolved
until future authorized generation, not treated as reserved paths.

```text
apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-in/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-out/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/context/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/end/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/identify/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/recover/route.ts	ABSENT
apps/backoffice/src/app/api/pointage/[establishmentSlug]/state/route.ts	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-active-interaction.tsx	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-credential-entry.tsx	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/_components/pointage-employee.tsx	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/_lib/pointage-client.ts	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/_lib/pointage-interaction.ts	ABSENT
apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx	ABSENT
apps/backoffice/src/proxy.ts	ABSENT
apps/backoffice/src/server/pointage/raw-chain.ts	ABSENT
apps/backoffice/src/server/pointage/raw-clocking-http.ts	ABSENT
apps/backoffice/src/server/pointage/raw-clocking-manager.ts	ABSENT
apps/backoffice/src/server/pointage/raw-clocking-runtime.ts	ABSENT
apps/backoffice/src/server/pointage/raw-clocking-service.ts	ABSENT
apps/backoffice/src/server/pointage/raw-clocking-test-boundary.ts	ABSENT
apps/backoffice/test/pointage-interaction.test.ts	ABSENT
apps/backoffice/test/pointage-raw-chain.test.ts	ABSENT
apps/backoffice/test/pointage-raw-clocking-http.test.ts	ABSENT
apps/backoffice/test/pointage-raw-clocking-inventory.test.ts	ABSENT
apps/backoffice/test/pointage-raw-clocking-manager.test.ts	ABSENT
apps/backoffice/test/pointage-raw-clocking-runtime.test.ts	ABSENT
apps/backoffice/test/pointage-raw-clocking-service.test.ts	ABSENT
packages/auth/src/pointage-continuation.ts	ABSENT
packages/auth/test/pointage-continuation.test.ts	ABSENT
packages/contracts/src/pointage/index.ts	ABSENT
packages/contracts/test/pointage.test.ts	ABSENT
packages/db-cloud/src/pointage-raw-clocking-repository.ts	ABSENT
packages/db-cloud/src/schema/pointage-raw-clocking.ts	ABSENT
packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts	ABSENT
packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts	ABSENT
packages/db-cloud/test/pointage-raw-clocking-schema.test.ts	ABSENT
packages/db-cloud/test/pointage-raw-clocking.integration.test.ts	ABSENT
```

### Authority and concurrent-work exclusions

Personnel remains canonical dossier/lifecycle/minimal scoped display owner;
Pointage owns actual-work raw evidence. Existing six-operation catalog,
credential crypto/lifecycle, independent manager grants, STAFF denial, trusted
organization/establishment/dossier isolation and all-three-operation Personnel
eligibility are unchanged. No new production provider or browser authority.
Raw events remain the planned sole canonical attendance source; sessions and
current state are derived, receipt/continuation/security audit not competing
attendance sources. Normative main Specs and archived foundation remain intact.

P13/P14 remain synthetic/disposable-only for this change. Real attendance is
NOT_AUTHORIZED in development, staging and production. Exact retention duration,
deletion/anonymization, legal hold, backup-retention interaction, employee notice,
detailed audit visibility and trusted production client-address provenance
remain unresolved. All functional non-scope, NO_APPLICATION_SHELL,
UI_AFFECTING YES and BROWSER_QA_REQUIRED YES remain unchanged.

The fresh whole-tree inventory has 2551 tracked/non-ignored untracked
existing files. It is not a clean checkout. It includes Formalités checkpoint
Tasks/review metadata, eight new Formalités implementation files, pre-existing
untracked Pointage foundation, shared async UI, auth/session, docs and lockfile
work. None is attributed to this revalidation or future Pointage implementation.
Formalités approval/checkpoint metadata is protected independently; it does not
alter Pointage approval. One new concurrent Formalités integration test appeared
after the first inventory and before final handoff:
`packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`.
It is outside every Pointage intended new/modified path. Read-only inspection
confirmed a dedicated Formalités test harness, no runtime/schema export or
Pointage implementation change. Its exact protected hash is recorded below.
Classification for baseline isolation: SAFE_NEW_BASELINE; this is not approval
of its test/DB behavior. No test or DB operation from that file was executed.
Its fixed Formalités journal expectation belongs to its separate test target;
Pointage must not run broad suites with a shared integration opt-in.
Workspace typecheck reran after its appearance and exited 0. Schema/snapshot
serialization reran with zero semantic differences. The subsequent inventory
was stable; all 12 intended existing paths and all planning hashes still matched.
No future concurrent exclusion is automatically accepted.

Full inventory below records each protected unrelated path hash, not merely
HEAD. No ignored environment/secrets, node_modules, build caches or Git metadata
are included. Ignored build/typecheck caches are not implementation evidence.
Only this review packet may differ after this turn; its inventory row is the
pre-write hash, avoiding a self-referential hash.

### Read/planning validation

All commands ran from repository root unless specified; these are baseline
diagnostics, not formal implementation VERIFY or QA.

```text
pnpm exec openspec validate pointage-usable-raw-clocking --strict
exit 0: Change 'pointage-usable-raw-clocking' is valid

pnpm docs:check
exit 0: Documentation consistency check passed (36 current documents).

pnpm architecture:check
exit 0: runtime imports, database URLs, client boundaries, migration baselines valid.

pnpm -r --if-present typecheck
exit 0: all invoked projects completed; scope 15 of 16 workspace projects.

pnpm ui:pack:check backoffice-pointage-employee
exit 0: UI page-pack validation passed (1 package, 0 warnings).

pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/tasks.md docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md docs/ui/pages/backoffice-pointage-employee/README.md docs/ui/pages/backoffice-pointage-employee/references/README.md docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json "docs/ui/pages/backoffice-pointage-employee/prompts/*.md" "docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md"
exit 0: All matched files use Prettier code style!
```

Broad `pnpm format:check` was not rerun in this bounded revalidation.
Known 67 unrelated warnings are retained, not corrected or claimed resolved.
No formatter write, new implementation test, build, provider, fixture,
migration, DB operation or Browser QA. Post-write strict OpenSpec, docs,
architecture, workspace typecheck and UI pack also completed with exit 0.
The first post-write scoped format check returned exit 1 for one unescaped
underscore in the new journal heading only. That escape was patched within
this new metadata; no formatter write or approved-content rewrite occurred.
Final scoped formatting rerun completed with exit 0 after this bounded patch.

Full inventory digest (UTF-8, path TAB hash, LF between rows, no final LF):
`29880c356265913fba99be59908a6176df31e481f32b2ea78a69ceed7a2a6e87`.
Removing only this inserted revalidation section reconstructs the exact
pre-turn packet hash recorded above. All 12 decoded preimages match current
files byte-for-byte; all 2550 other inventory files retain their baseline hashes.
The review-packet inventory row is its hash before this concurrent-exclusion
metadata amendment, not a self-hash or replacement of the original approval.

### Exact preimages — raw bytes, not implementation

Each record is path, byte length, SHA-256 and base64 of the exact pre-Apply
bytes. Decode base64 without newline/Unicode normalization; compare complete
bytes before future edits. This preserves untracked and dirty-file preimages
independently of Git HEAD. UI planning preimages are already preserved by the
approved exact snapshots and hashes; no duplicate mutable authority.

```text
{"path":"apps/backoffice/src/server/pointage/authorization.ts","byteLength":3956,"sha256":"c33a530483f76f29065729834e07b5d4512ee54255765645bece9cef8c87cc34","base64":"aW1wb3J0ICdzZXJ2ZXItb25seSc7CgppbXBvcnQgdHlwZSB7IEF1dGhlbnRpY2F0ZWRTZXNzaW9uIH0gZnJvbSAnQHl1dGEvYXV0aCc7CmltcG9ydCB0eXBlIHsgVGVuYW50Q29udGV4dCB9IGZyb20gJ0B5dXRhL3RlbmFudCc7CgpleHBvcnQgY29uc3QgUE9JTlRBR0VfT1BFUkFUSU9OUyA9IFsKICAncG9pbnRhZ2UuZW1wbG95ZWUuaWRlbnRpZnknLAogICdwb2ludGFnZS5lbXBsb3llZS5zdGF0ZS5yZWFkJywKICAncG9pbnRhZ2UuZW1wbG95ZWUub3BlcmF0aW9uLmNyZWF0ZScsCiAgJ3BvaW50YWdlLmVzdGFibGlzaG1lbnQucmVhZCcsCiAgJ3BvaW50YWdlLmNyZWRlbnRpYWwuaXNzdWUnLAogICdwb2ludGFnZS5jcmVkZW50aWFsLnJlc2V0JywKXSBhcyBjb25zdDsKCmV4cG9ydCB0eXBlIFBvaW50YWdlT3BlcmF0aW9uID0gKHR5cGVvZiBQT0lOVEFHRV9PUEVSQVRJT05TKVtudW1iZXJdOwpleHBvcnQgdHlwZSBQb2ludGFnZUVtcGxveWVlT3BlcmF0aW9uID0gRXh0cmFjdDwKICBQb2ludGFnZU9wZXJhdGlvbiwKICBgcG9pbnRhZ2UuZW1wbG95ZWUuJHtzdHJpbmd9YAo+OwpleHBvcnQgdHlwZSBQb2ludGFnZU1hbmFnZXJPcGVyYXRpb24gPSBFeGNsdWRlPAogIFBvaW50YWdlT3BlcmF0aW9uLAogIFBvaW50YWdlRW1wbG95ZWVPcGVyYXRpb24KPjsKCmV4cG9ydCB0eXBlIFZlcmlmaWVkUG9pbnRhZ2VDcmVkZW50aWFsID0gUmVhZG9ubHk8ewogIHByb29mVHlwZTogJ1ZFUklGSUVEX1BPSU5UQUdFX0NSRURFTlRJQUwnOwogIG9yZ2FuaXphdGlvbklkOiBzdHJpbmc7CiAgZXN0YWJsaXNobWVudElkOiBzdHJpbmc7CiAgcGVyc29ubmVsRG9zc2llcklkOiBzdHJpbmc7CiAgY3JlZGVudGlhbElkOiBzdHJpbmc7CiAgY3JlZGVudGlhbFZlcnNpb246IG51bWJlcjsKfT47CgpleHBvcnQgdHlwZSBQb2ludGFnZUVtcGxveWVlQ29udGV4dCA9IFJlYWRvbmx5PHsKICBhY3RvclR5cGU6ICdQT0lOVEFHRV9FTVBMT1lFRSc7CiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZzsKICBlc3RhYmxpc2htZW50SWQ6IHN0cmluZzsKICBwZXJzb25uZWxEb3NzaWVySWQ6IHN0cmluZzsKICBjcmVkZW50aWFsSWQ6IHN0cmluZzsKICBjcmVkZW50aWFsVmVyc2lvbjogbnVtYmVyOwogIG9wZXJhdGlvbjogUG9pbnRhZ2VFbXBsb3llZU9wZXJhdGlvbjsKfT47CgpleHBvcnQgdHlwZSBQb2ludGFnZU1hbmFnZXJDb250ZXh0ID0gUmVhZG9ubHk8ewogIGFjdG9yVHlwZTogJ1BPSU5UQUdFX01BTkFHRVInOwogIG9yZ2FuaXphdGlvbklkOiBzdHJpbmc7CiAgZXN0YWJsaXNobWVudElkOiBzdHJpbmc7CiAgdXNlcklkOiBzdHJpbmc7CiAgbWVtYmVyc2hpcElkOiBzdHJpbmc7CiAgcm9sZTogJ09XTkVSJyB8ICdNQU5BR0VSJzsKICBvcGVyYXRpb246IFBvaW50YWdlTWFuYWdlck9wZXJhdGlvbjsKfT47CgpleHBvcnQgY2xhc3MgUG9pbnRhZ2VBdXRob3JpemF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcignUG9pbnRhZ2Ugb3BlcmF0aW9uIGlzIG5vdCBncmFudGVkLicpOwogICAgdGhpcy5uYW1lID0gJ1BvaW50YWdlQXV0aG9yaXphdGlvbkVycm9yJzsKICB9Cn0KCmZ1bmN0aW9uIGlzUG9pbnRhZ2VPcGVyYXRpb24odmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIFBvaW50YWdlT3BlcmF0aW9uIHsKICByZXR1cm4gKFBPSU5UQUdFX09QRVJBVElPTlMgYXMgcmVhZG9ubHkgc3RyaW5nW10pLmluY2x1ZGVzKHZhbHVlKTsKfQoKZnVuY3Rpb24gaXNQb2ludGFnZU1hbmFnZXJPcGVyYXRpb24oCiAgdmFsdWU6IHN0cmluZywKKTogdmFsdWUgaXMgUG9pbnRhZ2VNYW5hZ2VyT3BlcmF0aW9uIHsKICByZXR1cm4gaXNQb2ludGFnZU9wZXJhdGlvbih2YWx1ZSkgJiYgIXZhbHVlLnN0YXJ0c1dpdGgoJ3BvaW50YWdlLmVtcGxveWVlLicpOwp9CgpleHBvcnQgZnVuY3Rpb24gY3JlYXRlUG9pbnRhZ2VNYW5hZ2VyQ29udGV4dCgKICBpbnB1dDogUmVhZG9ubHk8ewogICAgc2Vzc2lvbjogQXV0aGVudGljYXRlZFNlc3Npb247CiAgICB0ZW5hbnQ6IFRlbmFudENvbnRleHQ7CiAgICBvcGVyYXRpb246IHN0cmluZzsKICB9PiwKKTogUG9pbnRhZ2VNYW5hZ2VyQ29udGV4dCB7CiAgaWYgKAogICAgIWlzUG9pbnRhZ2VNYW5hZ2VyT3BlcmF0aW9uKGlucHV0Lm9wZXJhdGlvbikgfHwKICAgIGlucHV0LnRlbmFudC5lc3RhYmxpc2htZW50SWQgPT09IG51bGwgfHwKICAgIGlucHV0LnRlbmFudC5hY3Rvci50eXBlICE9PSAndXNlcicgfHwKICAgIChpbnB1dC50ZW5hbnQuYWN0b3Iucm9sZSAhPT0gJ09XTkVSJyAmJgogICAgICBpbnB1dC50ZW5hbnQuYWN0b3Iucm9sZSAhPT0gJ01BTkFHRVInKSB8fAogICAgaW5wdXQuc2Vzc2lvbi51c2VySWQgIT09IGlucHV0LnRlbmFudC5hY3Rvci51c2VySWQgfHwKICAgIGlucHV0LnNlc3Npb24ub3JnYW5pemF0aW9uSWQgIT09IGlucHV0LnRlbmFudC5vcmdhbml6YXRpb25JZCB8fAogICAgaW5wdXQuc2Vzc2lvbi5lc3RhYmxpc2htZW50SWQgIT09IGlucHV0LnRlbmFudC5lc3RhYmxpc2htZW50SWQKICApIHsKICAgIHRocm93IG5ldyBQb2ludGFnZUF1dGhvcml6YXRpb25FcnJvcigpOwogIH0KCiAgcmV0dXJuIE9iamVjdC5mcmVlemUoewogICAgYWN0b3JUeXBlOiAnUE9JTlRBR0VfTUFOQUdFUicsCiAgICBvcmdhbml6YXRpb25JZDogaW5wdXQudGVuYW50Lm9yZ2FuaXphdGlvbklkLAogICAgZXN0YWJsaXNobWVudElkOiBpbnB1dC50ZW5hbnQuZXN0YWJsaXNobWVudElkLAogICAgdXNlcklkOiBpbnB1dC50ZW5hbnQuYWN0b3IudXNlcklkLAogICAgbWVtYmVyc2hpcElkOiBpbnB1dC50ZW5hbnQuYWN0b3IubWVtYmVyc2hpcElkLAogICAgcm9sZTogaW5wdXQudGVuYW50LmFjdG9yLnJvbGUsCiAgICBvcGVyYXRpb246IGlucHV0Lm9wZXJhdGlvbiwKICB9KTsKfQoKZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBvaW50YWdlRW1wbG95ZWVDb250ZXh0KAogIGlucHV0OiBSZWFkb25seTx7CiAgICBjcmVkZW50aWFsOiBWZXJpZmllZFBvaW50YWdlQ3JlZGVudGlhbDsKICAgIG9wZXJhdGlvbjogUG9pbnRhZ2VFbXBsb3llZU9wZXJhdGlvbjsKICB9PiwKKTogUG9pbnRhZ2VFbXBsb3llZUNvbnRleHQgewogIGlmICgKICAgICEoCiAgICAgIFsKICAgICAgICAncG9pbnRhZ2UuZW1wbG95ZWUuaWRlbnRpZnknLAogICAgICAgICdwb2ludGFnZS5lbXBsb3llZS5zdGF0ZS5yZWFkJywKICAgICAgICAncG9pbnRhZ2UuZW1wbG95ZWUub3BlcmF0aW9uLmNyZWF0ZScsCiAgICAgIF0gYXMgcmVhZG9ubHkgc3RyaW5nW10KICAgICkuaW5jbHVkZXMoaW5wdXQub3BlcmF0aW9uKQogICkgewogICAgdGhyb3cgbmV3IFBvaW50YWdlQXV0aG9yaXphdGlvbkVycm9yKCk7CiAgfQogIHJldHVybiBPYmplY3QuZnJlZXplKHsKICAgIGFjdG9yVHlwZTogJ1BPSU5UQUdFX0VNUExPWUVFJywKICAgIG9yZ2FuaXphdGlvbklkOiBpbnB1dC5jcmVkZW50aWFsLm9yZ2FuaXphdGlvbklkLAogICAgZXN0YWJsaXNobWVudElkOiBpbnB1dC5jcmVkZW50aWFsLmVzdGFibGlzaG1lbnRJZCwKICAgIHBlcnNvbm5lbERvc3NpZXJJZDogaW5wdXQuY3JlZGVudGlhbC5wZXJzb25uZWxEb3NzaWVySWQsCiAgICBjcmVkZW50aWFsSWQ6IGlucHV0LmNyZWRlbnRpYWwuY3JlZGVudGlhbElkLAogICAgY3JlZGVudGlhbFZlcnNpb246IGlucHV0LmNyZWRlbnRpYWwuY3JlZGVudGlhbFZlcnNpb24sCiAgICBvcGVyYXRpb246IGlucHV0Lm9wZXJhdGlvbiwKICB9KTsKfQoKZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVQb2ludGFnZU1hbmFnZXJPcGVyYXRpb24oCiAgY29udGV4dDogUG9pbnRhZ2VNYW5hZ2VyQ29udGV4dCwKICBvcGVyYXRpb246IFBvaW50YWdlTWFuYWdlck9wZXJhdGlvbiwKKTogdm9pZCB7CiAgaWYgKGNvbnRleHQub3BlcmF0aW9uICE9PSBvcGVyYXRpb24pIHsKICAgIHRocm93IG5ldyBQb2ludGFnZUF1dGhvcml6YXRpb25FcnJvcigpOwogIH0KfQo="}
{"path":"apps/backoffice/src/server/pointage/index.ts","byteLength":60,"sha256":"5a17ce9a793561f26e7eca9c62f7835925d54d9eba61074951d58871dd910133","base64":"ZXhwb3J0ICogZnJvbSAnLi9hdXRob3JpemF0aW9uJzsKZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlJzsK"}
{"path":"apps/backoffice/src/server/pointage/service.ts","byteLength":19246,"sha256":"1e34ca92770148dbbaa9582a793de425163e89cd067d6d90e317b1fb2e2747ae","base64":"aW1wb3J0ICdzZXJ2ZXItb25seSc7CgppbXBvcnQgewogIFBPSU5UQUdFX0NSRURFTlRJQUxfQUxHT1JJVEhNX1ZFUlNJT04sCiAgUE9JTlRBR0VfQ1JFREVOVElBTF9GT1JNQVRfVkVSU0lPTiwKICBQT0lOVEFHRV9DUkVERU5USUFMX0tFWV9WRVJTSU9OLAogIGNyZWF0ZVBvaW50YWdlQ2FuZGlkYXRlUmF0ZUxpbWl0RGlnZXN0LAogIGNyZWF0ZVBvaW50YWdlQ2xpZW50UmF0ZUxpbWl0RGlnZXN0LAogIGNyZWF0ZVBvaW50YWdlQ3JlZGVudGlhbFZlcmlmaWVyLAogIGNyZWF0ZVBvaW50YWdlTG9va3VwRGlnZXN0LAogIGRlY29kZVBvaW50YWdlQXV0aFNlY3JldCwKICBkZXJpdmVQb2ludGFnZUNyZWRlbnRpYWxLZXlzLAogIGdlbmVyYXRlUG9pbnRhZ2VDcmVkZW50aWFsLAogIG5vcm1hbGl6ZVBvaW50YWdlQ3JlZGVudGlhbCwKICBydW5Qb2ludGFnZUR1bW15VmVyaWZpY2F0aW9uLAogIHZlcmlmeVBvaW50YWdlQ3JlZGVudGlhbCwKICB0eXBlIFBvaW50YWdlQ3JlZGVudGlhbEtleXMsCiAgdHlwZSBBdXRoZW50aWNhdGVkU2Vzc2lvbiwKfSBmcm9tICdAeXV0YS9hdXRoJzsKaW1wb3J0IHsKICBQb2ludGFnZUNyZWRlbnRpYWxBbHJlYWR5RXhpc3RzRXJyb3IsCiAgUG9pbnRhZ2VDcmVkZW50aWFsQ29sbGlzaW9uRXhoYXVzdGVkRXJyb3IsCiAgUG9pbnRhZ2VDcmVkZW50aWFsTWlzc2luZ0Vycm9yLAogIFBvaW50YWdlRG9zc2llck5vdEluU2NvcGVFcnJvciwKICB0eXBlIFBvaW50YWdlQXVkaXRSZWFzb25Db2RlLAogIHR5cGUgUG9pbnRhZ2VBdWRpdFdyaXRlLAogIHR5cGUgUG9pbnRhZ2VDcmVkZW50aWFsTWF0ZXJpYWwsCiAgdHlwZSBQb2ludGFnZVJlcG9zaXRvcnksCiAgdHlwZSBQb2ludGFnZVJlcG9zaXRvcnlTY29wZSwKfSBmcm9tICdAeXV0YS9kYi1jbG91ZCc7CmltcG9ydCB7IG5vcm1hbGl6ZVRlbmFudFNsdWcsIHR5cGUgVGVuYW50Q29udGV4dCB9IGZyb20gJ0B5dXRhL3RlbmFudCc7CmltcG9ydCB7CiAgUE9JTlRBR0VfT1BFUkFUSU9OUywKICBQb2ludGFnZUF1dGhvcml6YXRpb25FcnJvciwKICBjcmVhdGVQb2ludGFnZUVtcGxveWVlQ29udGV4dCwKICBjcmVhdGVQb2ludGFnZU1hbmFnZXJDb250ZXh0LAogIHJlcXVpcmVQb2ludGFnZU1hbmFnZXJPcGVyYXRpb24sCiAgdHlwZSBQb2ludGFnZUVtcGxveWVlQ29udGV4dCwKICB0eXBlIFBvaW50YWdlRW1wbG95ZWVPcGVyYXRpb24sCiAgdHlwZSBQb2ludGFnZU1hbmFnZXJDb250ZXh0LAogIHR5cGUgUG9pbnRhZ2VNYW5hZ2VyT3BlcmF0aW9uLAogIHR5cGUgVmVyaWZpZWRQb2ludGFnZUNyZWRlbnRpYWwsCn0gZnJvbSAnLi9hdXRob3JpemF0aW9uJzsKCmNvbnN0IFJBVEVfV0lORE9XX01TID0gMTUgKiA2MCAqIDFfMDAwOwpjb25zdCBSQVRFX0JMT0NLX01TID0gMTUgKiA2MCAqIDFfMDAwOwpjb25zdCBDQU5ESURBVEVfRkFJTFVSRV9MSU1JVCA9IDU7CmNvbnN0IENMSUVOVF9GQUlMVVJFX0xJTUlUID0gMzA7CgpleHBvcnQgdHlwZSBQb2ludGFnZUVudHJ5U2NvcGUgPSBSZWFkb25seTx7CiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZzsKICBlc3RhYmxpc2htZW50SWQ6IHN0cmluZzsKICBsb2NhbGU6IHN0cmluZzsKICB0aW1lem9uZTogc3RyaW5nOwp9PjsKCmV4cG9ydCB0eXBlIFRydXN0ZWRQb2ludGFnZUNsaWVudEFkZHJlc3MgPSBSZWFkb25seTx7CiAgYWRkcmVzczogc3RyaW5nOwogIHByb3ZlbmFuY2U6ICdTRVJWRVJfVkVSSUZJRUQnOwp9PjsKCmV4cG9ydCBpbnRlcmZhY2UgVHJ1c3RlZFBvaW50YWdlQ2xpZW50QWRkcmVzc1Byb3ZpZGVyIHsKICBnZXRUcnVzdGVkQ2xpZW50QWRkcmVzcygpOiBQcm9taXNlPFRydXN0ZWRQb2ludGFnZUNsaWVudEFkZHJlc3MgfCBudWxsPjsKfQoKZXhwb3J0IHR5cGUgUG9pbnRhZ2VWYWxpZGF0aW9uUmVzdWx0ID0KICB8IFJlYWRvbmx5PHsKICAgICAgc3RhdHVzOiAnVkVSSUZJRUQnOwogICAgICBjcmVkZW50aWFsOiBWZXJpZmllZFBvaW50YWdlQ3JlZGVudGlhbDsKICAgICAgZW50cnlTY29wZTogUG9pbnRhZ2VFbnRyeVNjb3BlOwogICAgfT4KICB8IFJlYWRvbmx5PHsKICAgICAgc3RhdHVzOgogICAgICAgIHwgJ1BPSU5UQUdFX0NSRURFTlRJQUxfSU5WQUxJRCcKICAgICAgICB8ICdQT0lOVEFHRV9UUllfTEFURVInCiAgICAgICAgfCAnUE9JTlRBR0VfVU5BVkFJTEFCTEUnOwogICAgfT47CgpleHBvcnQgdHlwZSBPbmVUaW1lUG9pbnRhZ2VDcmVkZW50aWFsUHJlc2VudGF0aW9uID0gUmVhZG9ubHk8ewogIHByZXNlbnRhdGlvblR5cGU6ICdPTkVfVElNRV9QT0lOVEFHRV9DUkVERU5USUFMJzsKICBjcmVkZW50aWFsOiBzdHJpbmc7CiAgY3JlZGVudGlhbElkOiBzdHJpbmc7CiAgY3JlZGVudGlhbFZlcnNpb246IG51bWJlcjsKfT47Cgp0eXBlIFZhbGlkYXRpb25SZXBvc2l0b3J5ID0gUGljazwKICBQb2ludGFnZVJlcG9zaXRvcnksCiAgfCAncmVzb2x2ZUFjdGl2ZUVudHJ5U2NvcGUnCiAgfCAnZmluZENyZWRlbnRpYWxDYW5kaWRhdGUnCiAgfCAnaXNSYXRlTGltaXRCbG9ja2VkJwogIHwgJ3JlY29yZFJhdGVMaW1pdEZhaWx1cmUnCiAgfCAncmVzZXRDYW5kaWRhdGVSYXRlTGltaXQnCiAgfCAnYXBwZW5kQXVkaXQnCiAgfCAnZmluZFBlcnNvbm5lbEVtcGxveW1lbnRQZXJpb2QnCj47CgpmdW5jdGlvbiBub3JtYWxpemVFc3RhYmxpc2htZW50U2x1Zyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7CiAgdHJ5IHsKICAgIHJldHVybiBub3JtYWxpemVUZW5hbnRTbHVnKHZhbHVlKTsKICB9IGNhdGNoIHsKICAgIHJldHVybiBudWxsOwogIH0KfQoKZnVuY3Rpb24gYnVzaW5lc3NEYXRlKG5vdzogRGF0ZSwgdGltZXpvbmU6IHN0cmluZyk6IHN0cmluZyB7CiAgY29uc3QgcGFydHMgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnZW4tQ0EnLCB7CiAgICB0aW1lWm9uZTogdGltZXpvbmUsCiAgICB5ZWFyOiAnbnVtZXJpYycsCiAgICBtb250aDogJzItZGlnaXQnLAogICAgZGF5OiAnMi1kaWdpdCcsCiAgfSkuZm9ybWF0VG9QYXJ0cyhub3cpOwogIGNvbnN0IHJlYWQgPSAodHlwZTogSW50bC5EYXRlVGltZUZvcm1hdFBhcnRUeXBlcykgPT4KICAgIHBhcnRzLmZpbmQoKHBhcnQpID0+IHBhcnQudHlwZSA9PT0gdHlwZSk/LnZhbHVlOwogIGNvbnN0IHllYXIgPSByZWFkKCd5ZWFyJyk7CiAgY29uc3QgbW9udGggPSByZWFkKCdtb250aCcpOwogIGNvbnN0IGRheSA9IHJlYWQoJ2RheScpOwogIGlmICh5ZWFyID09PSB1bmRlZmluZWQgfHwgbW9udGggPT09IHVuZGVmaW5lZCB8fCBkYXkgPT09IHVuZGVmaW5lZCkgewogICAgdGhyb3cgbmV3IEVycm9yKCdUcnVzdGVkIFBvaW50YWdlIGJ1c2luZXNzIGRhdGUgY291bGQgbm90IGJlIGRlcml2ZWQuJyk7CiAgfQogIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gOwp9CgpmdW5jdGlvbiBjcmVkZW50aWFsTWF0ZXJpYWwoCiAga2V5czogUG9pbnRhZ2VDcmVkZW50aWFsS2V5cywKICBzY29wZTogUG9pbnRhZ2VSZXBvc2l0b3J5U2NvcGUsCiAgY3JlZGVudGlhbDogc3RyaW5nLAogIHZlcmlmaWVyOiBBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZVBvaW50YWdlQ3JlZGVudGlhbFZlcmlmaWVyPj4sCik6IFBvaW50YWdlQ3JlZGVudGlhbE1hdGVyaWFsIHsKICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7CiAgICBsb29rdXBEaWdlc3Q6IGNyZWF0ZVBvaW50YWdlTG9va3VwRGlnZXN0KGtleXMsIHNjb3BlLCBjcmVkZW50aWFsKSwKICAgIGNyZWRlbnRpYWxGb3JtYXRWZXJzaW9uOiBQT0lOVEFHRV9DUkVERU5USUFMX0ZPUk1BVF9WRVJTSU9OLAogICAgYWxnb3JpdGhtVmVyc2lvbjogdmVyaWZpZXIuYWxnb3JpdGhtVmVyc2lvbiwKICAgIGtleVZlcnNpb246IHZlcmlmaWVyLmtleVZlcnNpb24sCiAgICBzYWx0OiB2ZXJpZmllci5zYWx0LAogICAgdmVyaWZpZXI6IHZlcmlmaWVyLnZlcmlmaWVyLAogIH0pOwp9CgpleHBvcnQgZnVuY3Rpb24gY3JlYXRlUG9pbnRhZ2VTZXJ2ZXJGb3VuZGF0aW9uKAogIGlucHV0OiBSZWFkb25seTx7CiAgICByZXBvc2l0b3J5OiBQb2ludGFnZVJlcG9zaXRvcnk7CiAgICBlbmNvZGVkQXV0aFNlY3JldDogc3RyaW5nOwogICAgY2xpZW50QWRkcmVzc1Byb3ZpZGVyOiBUcnVzdGVkUG9pbnRhZ2VDbGllbnRBZGRyZXNzUHJvdmlkZXI7CiAgICBub3c/OiAoKSA9PiBEYXRlOwogICAgZ2VuZXJhdGVDcmVkZW50aWFsPzogKCkgPT4gc3RyaW5nOwogIH0+LAopIHsKICBpZiAoCiAgICBpbnB1dC5jbGllbnRBZGRyZXNzUHJvdmlkZXIgPT09IG51bGwgfHwKICAgIHR5cGVvZiBpbnB1dC5jbGllbnRBZGRyZXNzUHJvdmlkZXI/LmdldFRydXN0ZWRDbGllbnRBZGRyZXNzICE9PSAnZnVuY3Rpb24nCiAgKSB7CiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RydXN0ZWQgUG9pbnRhZ2UgY2xpZW50LWFkZHJlc3MgcHJvdmlkZXIgaXMgcmVxdWlyZWQuJyk7CiAgfQogIGNvbnN0IGtleXMgPSBkZXJpdmVQb2ludGFnZUNyZWRlbnRpYWxLZXlzKAogICAgZGVjb2RlUG9pbnRhZ2VBdXRoU2VjcmV0KGlucHV0LmVuY29kZWRBdXRoU2VjcmV0KSwKICApOwogIGNvbnN0IG5vdyA9IGlucHV0Lm5vdyA/PyAoKCkgPT4gbmV3IERhdGUoKSk7CiAgY29uc3QgZ2VuZXJhdGVDcmVkZW50aWFsID0KICAgIGlucHV0LmdlbmVyYXRlQ3JlZGVudGlhbCA/PyBnZW5lcmF0ZVBvaW50YWdlQ3JlZGVudGlhbDsKCiAgYXN5bmMgZnVuY3Rpb24gYXBwZW5kRGVuaWVkQXVkaXQoCiAgICBzY29wZTogUG9pbnRhZ2VSZXBvc2l0b3J5U2NvcGUsCiAgICByZWFzb25Db2RlOiBQb2ludGFnZUF1ZGl0UmVhc29uQ29kZSwKICAgIGV2ZW50VHlwZTogUG9pbnRhZ2VBdWRpdFdyaXRlWydldmVudFR5cGUnXSwKICAgIGV4dHJhOiBQYXJ0aWFsPFBvaW50YWdlQXVkaXRXcml0ZT4gPSB7fSwKICApOiBQcm9taXNlPHZvaWQ+IHsKICAgIGF3YWl0IGlucHV0LnJlcG9zaXRvcnkuYXBwZW5kQXVkaXQoewogICAgICAuLi5zY29wZSwKICAgICAgLi4uZXh0cmEsCiAgICAgIGV2ZW50VHlwZSwKICAgICAgb3V0Y29tZTogJ2RlbmllZCcsCiAgICAgIHJlYXNvbkNvZGUsCiAgICAgIG9jY3VycmVkQXQ6IG5vdygpLAogICAgfSk7CiAgfQoKICBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZUNyZWRlbnRpYWxJbnRlcm5hbCgKICAgIHJlcXVlc3Q6IFJlYWRvbmx5PHsKICAgICAgZXN0YWJsaXNobWVudFNsdWc6IHN0cmluZzsKICAgICAgY3JlZGVudGlhbDogc3RyaW5nOwogICAgfT4sCiAgKTogUHJvbWlzZTxQb2ludGFnZVZhbGlkYXRpb25SZXN1bHQ+IHsKICAgIGNvbnN0IHNsdWcgPSBub3JtYWxpemVFc3RhYmxpc2htZW50U2x1ZyhyZXF1ZXN0LmVzdGFibGlzaG1lbnRTbHVnKTsKICAgIGlmIChzbHVnID09PSBudWxsKSB7CiAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHsgc3RhdHVzOiAnUE9JTlRBR0VfVU5BVkFJTEFCTEUnIH0pOwogICAgfQogICAgY29uc3QgcmVzb2x2ZWRTY29wZSA9IGF3YWl0IGlucHV0LnJlcG9zaXRvcnkucmVzb2x2ZUFjdGl2ZUVudHJ5U2NvcGUoc2x1Zyk7CiAgICBpZiAocmVzb2x2ZWRTY29wZSA9PT0gbnVsbCkgewogICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7IHN0YXR1czogJ1BPSU5UQUdFX1VOQVZBSUxBQkxFJyB9KTsKICAgIH0KICAgIGNvbnN0IGVudHJ5U2NvcGUgPSBPYmplY3QuZnJlZXplKHsgLi4ucmVzb2x2ZWRTY29wZSB9KTsKICAgIGNvbnN0IHRydXN0ZWRDbGllbnQgPQogICAgICBhd2FpdCBpbnB1dC5jbGllbnRBZGRyZXNzUHJvdmlkZXIuZ2V0VHJ1c3RlZENsaWVudEFkZHJlc3MoKTsKICAgIGlmICgKICAgICAgdHJ1c3RlZENsaWVudCA9PT0gbnVsbCB8fAogICAgICB0cnVzdGVkQ2xpZW50LnByb3ZlbmFuY2UgIT09ICdTRVJWRVJfVkVSSUZJRUQnIHx8CiAgICAgIHRydXN0ZWRDbGllbnQuYWRkcmVzcy5sZW5ndGggPT09IDAKICAgICkgewogICAgICBhd2FpdCBhcHBlbmREZW5pZWRBdWRpdCgKICAgICAgICBlbnRyeVNjb3BlLAogICAgICAgICdjbGllbnRfYWRkcmVzc191bnRydXN0ZWQnLAogICAgICAgICdwb2ludGFnZS5jcmVkZW50aWFsLmF1dGhlbnRpY2F0aW9uX2RlbmllZCcsCiAgICAgICk7CiAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHsgc3RhdHVzOiAnUE9JTlRBR0VfVU5BVkFJTEFCTEUnIH0pOwogICAgfQoKICAgIGNvbnN0IGF0dGVtcHRUaW1lID0gbm93KCk7CiAgICBjb25zdCBjbGllbnREaWdlc3QgPSBjcmVhdGVQb2ludGFnZUNsaWVudFJhdGVMaW1pdERpZ2VzdCgKICAgICAga2V5cywKICAgICAgZW50cnlTY29wZSwKICAgICAgdHJ1c3RlZENsaWVudC5hZGRyZXNzLAogICAgKTsKICAgIGlmICgKICAgICAgYXdhaXQgaW5wdXQucmVwb3NpdG9yeS5pc1JhdGVMaW1pdEJsb2NrZWQoCiAgICAgICAgZW50cnlTY29wZSwKICAgICAgICAnY2xpZW50JywKICAgICAgICBjbGllbnREaWdlc3QsCiAgICAgICAgYXR0ZW1wdFRpbWUsCiAgICAgICkKICAgICkgewogICAgICBhd2FpdCBhcHBlbmREZW5pZWRBdWRpdCgKICAgICAgICBlbnRyeVNjb3BlLAogICAgICAgICdyYXRlX2xpbWl0ZWQnLAogICAgICAgICdwb2ludGFnZS5jcmVkZW50aWFsLnJhdGVfbGltaXRlZCcsCiAgICAgICk7CiAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHsgc3RhdHVzOiAnUE9JTlRBR0VfVFJZX0xBVEVSJyB9KTsKICAgIH0KCiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplUG9pbnRhZ2VDcmVkZW50aWFsKHJlcXVlc3QuY3JlZGVudGlhbCk7CiAgICBjb25zdCBjYW5kaWRhdGVEaWdlc3QgPSBjcmVhdGVQb2ludGFnZUNhbmRpZGF0ZVJhdGVMaW1pdERpZ2VzdCgKICAgICAga2V5cywKICAgICAgZW50cnlTY29wZSwKICAgICAgbm9ybWFsaXplZCA/PyByZXF1ZXN0LmNyZWRlbnRpYWwsCiAgICApOwogICAgaWYgKAogICAgICBhd2FpdCBpbnB1dC5yZXBvc2l0b3J5LmlzUmF0ZUxpbWl0QmxvY2tlZCgKICAgICAgICBlbnRyeVNjb3BlLAogICAgICAgICdjYW5kaWRhdGUnLAogICAgICAgIGNhbmRpZGF0ZURpZ2VzdCwKICAgICAgICBhdHRlbXB0VGltZSwKICAgICAgKQogICAgKSB7CiAgICAgIGF3YWl0IGFwcGVuZERlbmllZEF1ZGl0KAogICAgICAgIGVudHJ5U2NvcGUsCiAgICAgICAgJ3JhdGVfbGltaXRlZCcsCiAgICAgICAgJ3BvaW50YWdlLmNyZWRlbnRpYWwucmF0ZV9saW1pdGVkJywKICAgICAgKTsKICAgICAgcmV0dXJuIE9iamVjdC5mcmVlemUoeyBzdGF0dXM6ICdQT0lOVEFHRV9UUllfTEFURVInIH0pOwogICAgfQoKICAgIGNvbnN0IGNhbmRpZGF0ZSA9CiAgICAgIG5vcm1hbGl6ZWQgPT09IG51bGwKICAgICAgICA/IG51bGwKICAgICAgICA6IGF3YWl0IGlucHV0LnJlcG9zaXRvcnkuZmluZENyZWRlbnRpYWxDYW5kaWRhdGUoCiAgICAgICAgICAgIGVudHJ5U2NvcGUsCiAgICAgICAgICAgIGNyZWF0ZVBvaW50YWdlTG9va3VwRGlnZXN0KGtleXMsIGVudHJ5U2NvcGUsIG5vcm1hbGl6ZWQpLAogICAgICAgICAgKTsKICAgIGNvbnN0IHN1cHBvcnRlZEN1cnJlbnQgPQogICAgICBjYW5kaWRhdGUgIT09IG51bGwgJiYKICAgICAgY2FuZGlkYXRlLnN1cGVyc2VkZWRBdCA9PT0gbnVsbCAmJgogICAgICBjYW5kaWRhdGUuY3JlZGVudGlhbEZvcm1hdFZlcnNpb24gPT09CiAgICAgICAgUE9JTlRBR0VfQ1JFREVOVElBTF9GT1JNQVRfVkVSU0lPTiAmJgogICAgICBjYW5kaWRhdGUuYWxnb3JpdGhtVmVyc2lvbiA9PT0gUE9JTlRBR0VfQ1JFREVOVElBTF9BTEdPUklUSE1fVkVSU0lPTiAmJgogICAgICBjYW5kaWRhdGUua2V5VmVyc2lvbiA9PT0gUE9JTlRBR0VfQ1JFREVOVElBTF9LRVlfVkVSU0lPTjsKICAgIGNvbnN0IHZhbGlkID0gc3VwcG9ydGVkQ3VycmVudAogICAgICA/IGF3YWl0IHZlcmlmeVBvaW50YWdlQ3JlZGVudGlhbChrZXlzLCBub3JtYWxpemVkISwgewogICAgICAgICAgYWxnb3JpdGhtVmVyc2lvbjogUE9JTlRBR0VfQ1JFREVOVElBTF9BTEdPUklUSE1fVkVSU0lPTiwKICAgICAgICAgIGtleVZlcnNpb246IFBPSU5UQUdFX0NSRURFTlRJQUxfS0VZX1ZFUlNJT04sCiAgICAgICAgICBzYWx0OiBjYW5kaWRhdGUuc2FsdCwKICAgICAgICAgIHZlcmlmaWVyOiBjYW5kaWRhdGUudmVyaWZpZXIsCiAgICAgICAgfSkKICAgICAgOiBhd2FpdCBydW5Qb2ludGFnZUR1bW15VmVyaWZpY2F0aW9uKAogICAgICAgICAga2V5cywKICAgICAgICAgIGVudHJ5U2NvcGUsCiAgICAgICAgICBub3JtYWxpemVkID8/IHJlcXVlc3QuY3JlZGVudGlhbCwKICAgICAgICApOwoKICAgIGlmICghdmFsaWQgfHwgIXN1cHBvcnRlZEN1cnJlbnQgfHwgY2FuZGlkYXRlID09PSBudWxsKSB7CiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFsKICAgICAgICBpbnB1dC5yZXBvc2l0b3J5LnJlY29yZFJhdGVMaW1pdEZhaWx1cmUoewogICAgICAgICAgc2NvcGU6IGVudHJ5U2NvcGUsCiAgICAgICAgICBrZXlLaW5kOiAnY2FuZGlkYXRlJywKICAgICAgICAgIGtleURpZ2VzdDogY2FuZGlkYXRlRGlnZXN0LAogICAgICAgICAgbm93OiBhdHRlbXB0VGltZSwKICAgICAgICAgIHdpbmRvd01zOiBSQVRFX1dJTkRPV19NUywKICAgICAgICAgIGZhaWx1cmVMaW1pdDogQ0FORElEQVRFX0ZBSUxVUkVfTElNSVQsCiAgICAgICAgICBibG9ja01zOiBSQVRFX0JMT0NLX01TLAogICAgICAgIH0pLAogICAgICAgIGlucHV0LnJlcG9zaXRvcnkucmVjb3JkUmF0ZUxpbWl0RmFpbHVyZSh7CiAgICAgICAgICBzY29wZTogZW50cnlTY29wZSwKICAgICAgICAgIGtleUtpbmQ6ICdjbGllbnQnLAogICAgICAgICAga2V5RGlnZXN0OiBjbGllbnREaWdlc3QsCiAgICAgICAgICBub3c6IGF0dGVtcHRUaW1lLAogICAgICAgICAgd2luZG93TXM6IFJBVEVfV0lORE9XX01TLAogICAgICAgICAgZmFpbHVyZUxpbWl0OiBDTElFTlRfRkFJTFVSRV9MSU1JVCwKICAgICAgICAgIGJsb2NrTXM6IFJBVEVfQkxPQ0tfTVMsCiAgICAgICAgfSksCiAgICAgIF0pOwogICAgICBjb25zdCByZWFzb25Db2RlOiBQb2ludGFnZUF1ZGl0UmVhc29uQ29kZSA9CiAgICAgICAgY2FuZGlkYXRlPy5zdXBlcnNlZGVkQXQgIT09IG51bGwgJiYKICAgICAgICBjYW5kaWRhdGU/LnN1cGVyc2VkZWRBdCAhPT0gdW5kZWZpbmVkCiAgICAgICAgICA/ICdzdXBlcnNlZGVkX2NyZWRlbnRpYWwnCiAgICAgICAgICA6IGNhbmRpZGF0ZSAhPT0gbnVsbCAmJiAhc3VwcG9ydGVkQ3VycmVudAogICAgICAgICAgICA/ICd1bnN1cHBvcnRlZF92ZXJzaW9uJwogICAgICAgICAgICA6ICdpbnZhbGlkX2NyZWRlbnRpYWwnOwogICAgICBhd2FpdCBhcHBlbmREZW5pZWRBdWRpdCgKICAgICAgICBlbnRyeVNjb3BlLAogICAgICAgIHJlYXNvbkNvZGUsCiAgICAgICAgJ3BvaW50YWdlLmNyZWRlbnRpYWwuYXV0aGVudGljYXRpb25fZGVuaWVkJywKICAgICAgICBjYW5kaWRhdGUgPT09IG51bGwKICAgICAgICAgID8ge30KICAgICAgICAgIDogewogICAgICAgICAgICAgIHBlcnNvbm5lbERvc3NpZXJJZDogY2FuZGlkYXRlLnBlcnNvbm5lbERvc3NpZXJJZCwKICAgICAgICAgICAgICBjcmVkZW50aWFsSWQ6IGNhbmRpZGF0ZS5pZCwKICAgICAgICAgICAgICBjcmVkZW50aWFsVmVyc2lvbjogY2FuZGlkYXRlLmNyZWRlbnRpYWxWZXJzaW9uLAogICAgICAgICAgICB9LAogICAgICApOwogICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7IHN0YXR1czogJ1BPSU5UQUdFX0NSRURFTlRJQUxfSU5WQUxJRCcgfSk7CiAgICB9CgogICAgYXdhaXQgaW5wdXQucmVwb3NpdG9yeS5yZXNldENhbmRpZGF0ZVJhdGVMaW1pdCgKICAgICAgZW50cnlTY29wZSwKICAgICAgY2FuZGlkYXRlRGlnZXN0LAogICAgICBhdHRlbXB0VGltZSwKICAgICk7CiAgICBjb25zdCBjcmVkZW50aWFsID0gT2JqZWN0LmZyZWV6ZSh7CiAgICAgIHByb29mVHlwZTogJ1ZFUklGSUVEX1BPSU5UQUdFX0NSRURFTlRJQUwnIGFzIGNvbnN0LAogICAgICBvcmdhbml6YXRpb25JZDogZW50cnlTY29wZS5vcmdhbml6YXRpb25JZCwKICAgICAgZXN0YWJsaXNobWVudElkOiBlbnRyeVNjb3BlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgcGVyc29ubmVsRG9zc2llcklkOiBjYW5kaWRhdGUucGVyc29ubmVsRG9zc2llcklkLAogICAgICBjcmVkZW50aWFsSWQ6IGNhbmRpZGF0ZS5pZCwKICAgICAgY3JlZGVudGlhbFZlcnNpb246IGNhbmRpZGF0ZS5jcmVkZW50aWFsVmVyc2lvbiwKICAgIH0pOwogICAgYXdhaXQgaW5wdXQucmVwb3NpdG9yeS5hcHBlbmRBdWRpdCh7CiAgICAgIC4uLmVudHJ5U2NvcGUsCiAgICAgIGV2ZW50VHlwZTogJ3BvaW50YWdlLmNyZWRlbnRpYWwuYXV0aGVudGljYXRpb25fc3VjY2VlZGVkJywKICAgICAgb3V0Y29tZTogJ3N1Y2NlZWRlZCcsCiAgICAgIHBlcnNvbm5lbERvc3NpZXJJZDogY2FuZGlkYXRlLnBlcnNvbm5lbERvc3NpZXJJZCwKICAgICAgY3JlZGVudGlhbElkOiBjYW5kaWRhdGUuaWQsCiAgICAgIGNyZWRlbnRpYWxWZXJzaW9uOiBjYW5kaWRhdGUuY3JlZGVudGlhbFZlcnNpb24sCiAgICAgIG9jY3VycmVkQXQ6IGF0dGVtcHRUaW1lLAogICAgfSk7CiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7IHN0YXR1czogJ1ZFUklGSUVEJywgY3JlZGVudGlhbCwgZW50cnlTY29wZSB9KTsKICB9CgogIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlQ3JlZGVudGlhbCgKICAgIHJlcXVlc3Q6IFJlYWRvbmx5PHsKICAgICAgZXN0YWJsaXNobWVudFNsdWc6IHN0cmluZzsKICAgICAgY3JlZGVudGlhbDogc3RyaW5nOwogICAgfT4sCiAgKTogUHJvbWlzZTxQb2ludGFnZVZhbGlkYXRpb25SZXN1bHQ+IHsKICAgIHRyeSB7CiAgICAgIHJldHVybiBhd2FpdCB2YWxpZGF0ZUNyZWRlbnRpYWxJbnRlcm5hbChyZXF1ZXN0KTsKICAgIH0gY2F0Y2ggewogICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7IHN0YXR1czogJ1BPSU5UQUdFX1VOQVZBSUxBQkxFJyB9KTsKICAgIH0KICB9CgogIGFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZUVtcGxveWVlT3BlcmF0aW9uSW50ZXJuYWwoCiAgICBpbnB1dE9wZXJhdGlvbjogUmVhZG9ubHk8ewogICAgICBjcmVkZW50aWFsOiBWZXJpZmllZFBvaW50YWdlQ3JlZGVudGlhbDsKICAgICAgZW50cnlTY29wZTogUG9pbnRhZ2VFbnRyeVNjb3BlOwogICAgICBvcGVyYXRpb246IFBvaW50YWdlRW1wbG95ZWVPcGVyYXRpb247CiAgICB9PiwKICApOiBQcm9taXNlPFBvaW50YWdlRW1wbG95ZWVDb250ZXh0IHwgbnVsbD4gewogICAgaWYgKAogICAgICBpbnB1dE9wZXJhdGlvbi5jcmVkZW50aWFsLm9yZ2FuaXphdGlvbklkICE9PQogICAgICAgIGlucHV0T3BlcmF0aW9uLmVudHJ5U2NvcGUub3JnYW5pemF0aW9uSWQgfHwKICAgICAgaW5wdXRPcGVyYXRpb24uY3JlZGVudGlhbC5lc3RhYmxpc2htZW50SWQgIT09CiAgICAgICAgaW5wdXRPcGVyYXRpb24uZW50cnlTY29wZS5lc3RhYmxpc2htZW50SWQKICAgICkgewogICAgICByZXR1cm4gbnVsbDsKICAgIH0KICAgIGNvbnN0IGVtcGxveW1lbnQgPSBhd2FpdCBpbnB1dC5yZXBvc2l0b3J5LmZpbmRQZXJzb25uZWxFbXBsb3ltZW50UGVyaW9kKAogICAgICBpbnB1dE9wZXJhdGlvbi5lbnRyeVNjb3BlLAogICAgICBpbnB1dE9wZXJhdGlvbi5jcmVkZW50aWFsLnBlcnNvbm5lbERvc3NpZXJJZCwKICAgICk7CiAgICBpZiAoZW1wbG95bWVudCA9PT0gbnVsbCkgewogICAgICBhd2FpdCBhcHBlbmREZW5pZWRBdWRpdCgKICAgICAgICBpbnB1dE9wZXJhdGlvbi5lbnRyeVNjb3BlLAogICAgICAgICdkb3NzaWVyX25vdF9pbl9zY29wZScsCiAgICAgICAgJ3BvaW50YWdlLmF1dGhvcml6YXRpb24uZGVuaWVkJywKICAgICAgICB7IHJlcXVlc3RlZE9wZXJhdGlvbjogaW5wdXRPcGVyYXRpb24ub3BlcmF0aW9uIH0sCiAgICAgICk7CiAgICAgIHJldHVybiBudWxsOwogICAgfQogICAgY29uc3QgY3VycmVudEJ1c2luZXNzRGF0ZSA9IGJ1c2luZXNzRGF0ZSgKICAgICAgbm93KCksCiAgICAgIGlucHV0T3BlcmF0aW9uLmVudHJ5U2NvcGUudGltZXpvbmUsCiAgICApOwogICAgY29uc3QgcmVhc29uID0KICAgICAgY3VycmVudEJ1c2luZXNzRGF0ZSA8IGVtcGxveW1lbnQuZW50cnlEYXRlCiAgICAgICAgPyAnYmVmb3JlX2VudHJ5JwogICAgICAgIDogZW1wbG95bWVudC5kZXBhcnR1cmVEYXRlICE9PSBudWxsICYmCiAgICAgICAgICAgIGN1cnJlbnRCdXNpbmVzc0RhdGUgPiBlbXBsb3ltZW50LmRlcGFydHVyZURhdGUKICAgICAgICAgID8gJ2FmdGVyX2RlcGFydHVyZScKICAgICAgICAgIDogbnVsbDsKICAgIGlmIChyZWFzb24gIT09IG51bGwpIHsKICAgICAgYXdhaXQgYXBwZW5kRGVuaWVkQXVkaXQoCiAgICAgICAgaW5wdXRPcGVyYXRpb24uZW50cnlTY29wZSwKICAgICAgICByZWFzb24sCiAgICAgICAgJ3BvaW50YWdlLmV2aWRlbmNlX2VsaWdpYmlsaXR5LmRlbmllZCcsCiAgICAgICAgewogICAgICAgICAgcGVyc29ubmVsRG9zc2llcklkOiBlbXBsb3ltZW50LnBlcnNvbm5lbERvc3NpZXJJZCwKICAgICAgICAgIGNyZWRlbnRpYWxJZDogaW5wdXRPcGVyYXRpb24uY3JlZGVudGlhbC5jcmVkZW50aWFsSWQsCiAgICAgICAgICBjcmVkZW50aWFsVmVyc2lvbjogaW5wdXRPcGVyYXRpb24uY3JlZGVudGlhbC5jcmVkZW50aWFsVmVyc2lvbiwKICAgICAgICAgIHJlcXVlc3RlZE9wZXJhdGlvbjogaW5wdXRPcGVyYXRpb24ub3BlcmF0aW9uLAogICAgICAgIH0sCiAgICAgICk7CiAgICAgIHJldHVybiBudWxsOwogICAgfQogICAgcmV0dXJuIGNyZWF0ZVBvaW50YWdlRW1wbG95ZWVDb250ZXh0KHsKICAgICAgY3JlZGVudGlhbDogaW5wdXRPcGVyYXRpb24uY3JlZGVudGlhbCwKICAgICAgb3BlcmF0aW9uOiBpbnB1dE9wZXJhdGlvbi5vcGVyYXRpb24sCiAgICB9KTsKICB9CgogIGFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZUVtcGxveWVlT3BlcmF0aW9uKAogICAgaW5wdXRPcGVyYXRpb246IFJlYWRvbmx5PHsKICAgICAgY3JlZGVudGlhbDogVmVyaWZpZWRQb2ludGFnZUNyZWRlbnRpYWw7CiAgICAgIGVudHJ5U2NvcGU6IFBvaW50YWdlRW50cnlTY29wZTsKICAgICAgb3BlcmF0aW9uOiBQb2ludGFnZUVtcGxveWVlT3BlcmF0aW9uOwogICAgfT4sCiAgKTogUHJvbWlzZTxQb2ludGFnZUVtcGxveWVlQ29udGV4dCB8IG51bGw+IHsKICAgIHRyeSB7CiAgICAgIHJldHVybiBhd2FpdCBhdXRob3JpemVFbXBsb3llZU9wZXJhdGlvbkludGVybmFsKGlucHV0T3BlcmF0aW9uKTsKICAgIH0gY2F0Y2ggewogICAgICByZXR1cm4gbnVsbDsKICAgIH0KICB9CgogIGFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZU1hbmFnZXJPcGVyYXRpb24oCiAgICBpbnB1dE9wZXJhdGlvbjogUmVhZG9ubHk8ewogICAgICBzZXNzaW9uOiBBdXRoZW50aWNhdGVkU2Vzc2lvbjsKICAgICAgdGVuYW50OiBUZW5hbnRDb250ZXh0OwogICAgICBvcGVyYXRpb246IHN0cmluZzsKICAgIH0+LAogICk6IFByb21pc2U8UG9pbnRhZ2VNYW5hZ2VyQ29udGV4dCB8IG51bGw+IHsKICAgIHRyeSB7CiAgICAgIHJldHVybiBjcmVhdGVQb2ludGFnZU1hbmFnZXJDb250ZXh0KGlucHV0T3BlcmF0aW9uKTsKICAgIH0gY2F0Y2ggewogICAgICBpZiAoCiAgICAgICAgaW5wdXRPcGVyYXRpb24udGVuYW50LmVzdGFibGlzaG1lbnRJZCAhPT0gbnVsbCAmJgogICAgICAgIGlucHV0T3BlcmF0aW9uLnRlbmFudC5hY3Rvci50eXBlID09PSAndXNlcicKICAgICAgKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgIGF3YWl0IGFwcGVuZERlbmllZEF1ZGl0KAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgb3JnYW5pemF0aW9uSWQ6IGlucHV0T3BlcmF0aW9uLnRlbmFudC5vcmdhbml6YXRpb25JZCwKICAgICAgICAgICAgICBlc3RhYmxpc2htZW50SWQ6IGlucHV0T3BlcmF0aW9uLnRlbmFudC5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgICdvcGVyYXRpb25fbm90X2dyYW50ZWQnLAogICAgICAgICAgICAncG9pbnRhZ2UuYXV0aG9yaXphdGlvbi5kZW5pZWQnLAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgbWFuYWdlclVzZXJJZDogaW5wdXRPcGVyYXRpb24udGVuYW50LmFjdG9yLnVzZXJJZCwKICAgICAgICAgICAgICByZXF1ZXN0ZWRPcGVyYXRpb246ICgKICAgICAgICAgICAgICAgIFBPSU5UQUdFX09QRVJBVElPTlMgYXMgcmVhZG9ubHkgc3RyaW5nW10KICAgICAgICAgICAgICApLmluY2x1ZGVzKGlucHV0T3BlcmF0aW9uLm9wZXJhdGlvbikKICAgICAgICAgICAgICAgID8gaW5wdXRPcGVyYXRpb24ub3BlcmF0aW9uCiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCwKICAgICAgICAgICAgfSwKICAgICAgICAgICk7CiAgICAgICAgfSBjYXRjaCB7CiAgICAgICAgICAvLyBBdXRob3JpdHkgcmVtYWlucyBkZW5pZWQgd2hlbiBhdHRyaWJ1dGlvbiBwZXJzaXN0ZW5jZSBpcyB1bmF2YWlsYWJsZS4KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG51bGw7CiAgICB9CiAgfQoKICBhc3luYyBmdW5jdGlvbiBhcHBlbmRMaWZlY3ljbGVEZW5pYWwoCiAgICBtYW5hZ2VyOiBQb2ludGFnZU1hbmFnZXJDb250ZXh0LAogICAgcGVyc29ubmVsRG9zc2llcklkOiBzdHJpbmcsCiAgICBvcGVyYXRpb246IFBvaW50YWdlTWFuYWdlck9wZXJhdGlvbiwKICAgIGVycm9yOiB1bmtub3duLAogICk6IFByb21pc2U8dm9pZD4gewogICAgY29uc3QgcmVhc29uQ29kZSA9CiAgICAgIGVycm9yIGluc3RhbmNlb2YgUG9pbnRhZ2VBdXRob3JpemF0aW9uRXJyb3IKICAgICAgICA/ICdvcGVyYXRpb25fbm90X2dyYW50ZWQnCiAgICAgICAgOiBlcnJvciBpbnN0YW5jZW9mIFBvaW50YWdlRG9zc2llck5vdEluU2NvcGVFcnJvcgogICAgICAgICAgPyAnZG9zc2llcl9ub3RfaW5fc2NvcGUnCiAgICAgICAgICA6IHVuZGVmaW5lZDsKICAgIHRyeSB7CiAgICAgIGF3YWl0IGlucHV0LnJlcG9zaXRvcnkuYXBwZW5kQXVkaXQoewogICAgICAgIG9yZ2FuaXphdGlvbklkOiBtYW5hZ2VyLm9yZ2FuaXphdGlvbklkLAogICAgICAgIGVzdGFibGlzaG1lbnRJZDogbWFuYWdlci5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgZXZlbnRUeXBlOiAncG9pbnRhZ2UuYXV0aG9yaXphdGlvbi5kZW5pZWQnLAogICAgICAgIG91dGNvbWU6ICdkZW5pZWQnLAogICAgICAgIHJlYXNvbkNvZGUsCiAgICAgICAgbWFuYWdlclVzZXJJZDogbWFuYWdlci51c2VySWQsCiAgICAgICAgcGVyc29ubmVsRG9zc2llcklkOgogICAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBQb2ludGFnZURvc3NpZXJOb3RJblNjb3BlRXJyb3IKICAgICAgICAgICAgPyB1bmRlZmluZWQKICAgICAgICAgICAgOiBwZXJzb25uZWxEb3NzaWVySWQsCiAgICAgICAgcmVxdWVzdGVkT3BlcmF0aW9uOiBvcGVyYXRpb24sCiAgICAgICAgb2NjdXJyZWRBdDogbm93KCksCiAgICAgIH0pOwogICAgfSBjYXRjaCB7CiAgICAgIC8vIFRoZSBvcmlnaW5hbCBjb21tYW5kIHN0YXlzIGZhaWxlZCBhbmQgbm8gcGxhaW50ZXh0IGlzIHJldHVybmVkLgogICAgfQogIH0KCiAgYXN5bmMgZnVuY3Rpb24gaXNzdWVDcmVkZW50aWFsKAogICAgaW5wdXRDb21tYW5kOiBSZWFkb25seTx7CiAgICAgIG1hbmFnZXI6IFBvaW50YWdlTWFuYWdlckNvbnRleHQ7CiAgICAgIHBlcnNvbm5lbERvc3NpZXJJZDogc3RyaW5nOwogICAgfT4sCiAgKTogUHJvbWlzZTxPbmVUaW1lUG9pbnRhZ2VDcmVkZW50aWFsUHJlc2VudGF0aW9uPiB7CiAgICBsZXQgcGxhaW50ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDsKICAgIHRyeSB7CiAgICAgIHJlcXVpcmVQb2ludGFnZU1hbmFnZXJPcGVyYXRpb24oCiAgICAgICAgaW5wdXRDb21tYW5kLm1hbmFnZXIsCiAgICAgICAgJ3BvaW50YWdlLmNyZWRlbnRpYWwuaXNzdWUnLAogICAgICApOwogICAgICBjb25zdCBwZXJzaXN0ZWQgPSBhd2FpdCBpbnB1dC5yZXBvc2l0b3J5Lmlzc3VlQ3JlZGVudGlhbCh7CiAgICAgICAgc2NvcGU6IGlucHV0Q29tbWFuZC5tYW5hZ2VyLAogICAgICAgIHBlcnNvbm5lbERvc3NpZXJJZDogaW5wdXRDb21tYW5kLnBlcnNvbm5lbERvc3NpZXJJZCwKICAgICAgICBtYW5hZ2VyVXNlcklkOiBpbnB1dENvbW1hbmQubWFuYWdlci51c2VySWQsCiAgICAgICAgbm93OiBub3coKSwKICAgICAgICBjcmVhdGVNYXRlcmlhbDogYXN5bmMgKCkgPT4gewogICAgICAgICAgcGxhaW50ZXh0ID0gZ2VuZXJhdGVDcmVkZW50aWFsKCk7CiAgICAgICAgICBjb25zdCB2ZXJpZmllciA9IGF3YWl0IGNyZWF0ZVBvaW50YWdlQ3JlZGVudGlhbFZlcmlmaWVyKAogICAgICAgICAgICBrZXlzLAogICAgICAgICAgICBwbGFpbnRleHQsCiAgICAgICAgICApOwogICAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxNYXRlcmlhbCgKICAgICAgICAgICAga2V5cywKICAgICAgICAgICAgaW5wdXRDb21tYW5kLm1hbmFnZXIsCiAgICAgICAgICAgIHBsYWludGV4dCwKICAgICAgICAgICAgdmVyaWZpZXIsCiAgICAgICAgICApOwogICAgICAgIH0sCiAgICAgIH0pOwogICAgICBpZiAocGxhaW50ZXh0ID09PSBudWxsKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2ludGFnZSBjcmVkZW50aWFsIHByZXNlbnRhdGlvbiB3YXMgbm90IGNyZWF0ZWQuJyk7CiAgICAgIH0KICAgICAgcmV0dXJuIE9iamVjdC5mcmVlemUoewogICAgICAgIHByZXNlbnRhdGlvblR5cGU6ICdPTkVfVElNRV9QT0lOVEFHRV9DUkVERU5USUFMJywKICAgICAgICBjcmVkZW50aWFsOiBwbGFpbnRleHQsCiAgICAgICAgLi4ucGVyc2lzdGVkLAogICAgICB9KTsKICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7CiAgICAgIHBsYWludGV4dCA9IG51bGw7CiAgICAgIGlmICgKICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFBvaW50YWdlQXV0aG9yaXphdGlvbkVycm9yIHx8CiAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBQb2ludGFnZURvc3NpZXJOb3RJblNjb3BlRXJyb3IgfHwKICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFBvaW50YWdlQ3JlZGVudGlhbEFscmVhZHlFeGlzdHNFcnJvciB8fAogICAgICAgIGVycm9yIGluc3RhbmNlb2YgUG9pbnRhZ2VDcmVkZW50aWFsQ29sbGlzaW9uRXhoYXVzdGVkRXJyb3IKICAgICAgKSB7CiAgICAgICAgYXdhaXQgYXBwZW5kTGlmZWN5Y2xlRGVuaWFsKAogICAgICAgICAgaW5wdXRDb21tYW5kLm1hbmFnZXIsCiAgICAgICAgICBpbnB1dENvbW1hbmQucGVyc29ubmVsRG9zc2llcklkLAogICAgICAgICAgJ3BvaW50YWdlLmNyZWRlbnRpYWwuaXNzdWUnLAogICAgICAgICAgZXJyb3IsCiAgICAgICAgKTsKICAgICAgfQogICAgICB0aHJvdyBlcnJvcjsKICAgIH0KICB9CgogIGFzeW5jIGZ1bmN0aW9uIHJlc2V0Q3JlZGVudGlhbCgKICAgIGlucHV0Q29tbWFuZDogUmVhZG9ubHk8ewogICAgICBtYW5hZ2VyOiBQb2ludGFnZU1hbmFnZXJDb250ZXh0OwogICAgICBwZXJzb25uZWxEb3NzaWVySWQ6IHN0cmluZzsKICAgIH0+LAogICk6IFByb21pc2U8T25lVGltZVBvaW50YWdlQ3JlZGVudGlhbFByZXNlbnRhdGlvbj4gewogICAgbGV0IHBsYWludGV4dDogc3RyaW5nIHwgbnVsbCA9IG51bGw7CiAgICB0cnkgewogICAgICByZXF1aXJlUG9pbnRhZ2VNYW5hZ2VyT3BlcmF0aW9uKAogICAgICAgIGlucHV0Q29tbWFuZC5tYW5hZ2VyLAogICAgICAgICdwb2ludGFnZS5jcmVkZW50aWFsLnJlc2V0JywKICAgICAgKTsKICAgICAgY29uc3QgcGVyc2lzdGVkID0gYXdhaXQgaW5wdXQucmVwb3NpdG9yeS5yZXNldENyZWRlbnRpYWwoewogICAgICAgIHNjb3BlOiBpbnB1dENvbW1hbmQubWFuYWdlciwKICAgICAgICBwZXJzb25uZWxEb3NzaWVySWQ6IGlucHV0Q29tbWFuZC5wZXJzb25uZWxEb3NzaWVySWQsCiAgICAgICAgbWFuYWdlclVzZXJJZDogaW5wdXRDb21tYW5kLm1hbmFnZXIudXNlcklkLAogICAgICAgIG5vdzogbm93KCksCiAgICAgICAgY3JlYXRlTWF0ZXJpYWw6IGFzeW5jICgpID0+IHsKICAgICAgICAgIHBsYWludGV4dCA9IGdlbmVyYXRlQ3JlZGVudGlhbCgpOwogICAgICAgICAgY29uc3QgdmVyaWZpZXIgPSBhd2FpdCBjcmVhdGVQb2ludGFnZUNyZWRlbnRpYWxWZXJpZmllcigKICAgICAgICAgICAga2V5cywKICAgICAgICAgICAgcGxhaW50ZXh0LAogICAgICAgICAgKTsKICAgICAgICAgIHJldHVybiBjcmVkZW50aWFsTWF0ZXJpYWwoCiAgICAgICAgICAgIGtleXMsCiAgICAgICAgICAgIGlucHV0Q29tbWFuZC5tYW5hZ2VyLAogICAgICAgICAgICBwbGFpbnRleHQsCiAgICAgICAgICAgIHZlcmlmaWVyLAogICAgICAgICAgKTsKICAgICAgICB9LAogICAgICB9KTsKICAgICAgaWYgKHBsYWludGV4dCA9PT0gbnVsbCkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignUG9pbnRhZ2UgY3JlZGVudGlhbCBwcmVzZW50YXRpb24gd2FzIG5vdCBjcmVhdGVkLicpOwogICAgICB9CiAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHsKICAgICAgICBwcmVzZW50YXRpb25UeXBlOiAnT05FX1RJTUVfUE9JTlRBR0VfQ1JFREVOVElBTCcsCiAgICAgICAgY3JlZGVudGlhbDogcGxhaW50ZXh0LAogICAgICAgIGNyZWRlbnRpYWxJZDogcGVyc2lzdGVkLmNyZWRlbnRpYWxJZCwKICAgICAgICBjcmVkZW50aWFsVmVyc2lvbjogcGVyc2lzdGVkLmNyZWRlbnRpYWxWZXJzaW9uLAogICAgICB9KTsKICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7CiAgICAgIHBsYWludGV4dCA9IG51bGw7CiAgICAgIGlmICgKICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFBvaW50YWdlQXV0aG9yaXphdGlvbkVycm9yIHx8CiAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBQb2ludGFnZURvc3NpZXJOb3RJblNjb3BlRXJyb3IgfHwKICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFBvaW50YWdlQ3JlZGVudGlhbE1pc3NpbmdFcnJvciB8fAogICAgICAgIGVycm9yIGluc3RhbmNlb2YgUG9pbnRhZ2VDcmVkZW50aWFsQ29sbGlzaW9uRXhoYXVzdGVkRXJyb3IKICAgICAgKSB7CiAgICAgICAgYXdhaXQgYXBwZW5kTGlmZWN5Y2xlRGVuaWFsKAogICAgICAgICAgaW5wdXRDb21tYW5kLm1hbmFnZXIsCiAgICAgICAgICBpbnB1dENvbW1hbmQucGVyc29ubmVsRG9zc2llcklkLAogICAgICAgICAgJ3BvaW50YWdlLmNyZWRlbnRpYWwucmVzZXQnLAogICAgICAgICAgZXJyb3IsCiAgICAgICAgKTsKICAgICAgfQogICAgICB0aHJvdyBlcnJvcjsKICAgIH0KICB9CgogIHJldHVybiBPYmplY3QuZnJlZXplKHsKICAgIHZhbGlkYXRlQ3JlZGVudGlhbCwKICAgIGF1dGhvcml6ZUVtcGxveWVlT3BlcmF0aW9uLAogICAgYXV0aG9yaXplTWFuYWdlck9wZXJhdGlvbiwKICAgIGlzc3VlQ3JlZGVudGlhbCwKICAgIHJlc2V0Q3JlZGVudGlhbCwKICB9KTsKfQoKZXhwb3J0IHR5cGUgUG9pbnRhZ2VTZXJ2ZXJGb3VuZGF0aW9uID0gUmV0dXJuVHlwZTwKICB0eXBlb2YgY3JlYXRlUG9pbnRhZ2VTZXJ2ZXJGb3VuZGF0aW9uCj47Cg=="}
{"path":"apps/backoffice/test/pointage-foundation-inventory.test.ts","byteLength":2001,"sha256":"1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa","base64":"aW1wb3J0IHsgcmVhZEZpbGVTeW5jLCByZWFkZGlyU3luYyB9IGZyb20gJ25vZGU6ZnMnOwppbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJzsKaW1wb3J0IHsgZGVzY3JpYmUsIGV4cGVjdCwgaXQgfSBmcm9tICd2aXRlc3QnOwoKY29uc3QgcmVwb3NpdG9yeVJvb3QgPSByZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsICcuLi8uLi8uLicpOwpjb25zdCBpbXBsZW1lbnRhdGlvbkZpbGVzID0gWwogICdwYWNrYWdlcy9hdXRoL3NyYy9wb2ludGFnZS1jcmVkZW50aWFsLnRzJywKICAncGFja2FnZXMvZGItY2xvdWQvc3JjL3NjaGVtYS9wb2ludGFnZS50cycsCiAgJ3BhY2thZ2VzL2RiLWNsb3VkL3NyYy9wb2ludGFnZS1yZXBvc2l0b3J5LnRzJywKICAnYXBwcy9iYWNrb2ZmaWNlL3NyYy9zZXJ2ZXIvcG9pbnRhZ2UvYXV0aG9yaXphdGlvbi50cycsCiAgJ2FwcHMvYmFja29mZmljZS9zcmMvc2VydmVyL3BvaW50YWdlL3NlcnZpY2UudHMnLApdOwoKZGVzY3JpYmUoJ1BvaW50YWdlIGZvdW5kYXRpb24gbmVnYXRpdmUgaW52ZW50b3J5JywgKCkgPT4gewogIGl0KCdoYXMgbm8gbG9jYWwsIFBPUywgYnJvd3Nlci1zdG9yYWdlLCB0cmFuc3BvcnQsIG9yIGZvcndhcmRlZC1oZWFkZXIgZGVwZW5kZW5jeScsICgpID0+IHsKICAgIGNvbnN0IHNvdXJjZSA9IGltcGxlbWVudGF0aW9uRmlsZXMKICAgICAgLm1hcCgoZmlsZSkgPT4gcmVhZEZpbGVTeW5jKHJlc29sdmUocmVwb3NpdG9yeVJvb3QsIGZpbGUpLCAndXRmOCcpKQogICAgICAuam9pbignXG4nKTsKICAgIGZvciAoY29uc3QgZm9yYmlkZGVuIG9mIFsKICAgICAgJ0B5dXRhL2RiLXBvcycsCiAgICAgICdzaXRlLWFnZW50JywKICAgICAgJ2xvY2FsU3RvcmFnZScsCiAgICAgICdpbmRleGVkREInLAogICAgICAnWC1Gb3J3YXJkZWQtRm9yJywKICAgICAgJ1gtUmVhbC1JUCcsCiAgICAgICdoZWFkZXJzKCknLAogICAgICAnTmV4dFJlcXVlc3QnLAogICAgICAnTmV4dFJlc3BvbnNlJywKICAgICAgJ2NvbnNvbGUuJywKICAgICAgJ2xvZ2dlci4nLAogICAgICAncmF3X2Nsb2NrJywKICAgICAgJ2Nsb2NrX2V2ZW50JywKICAgIF0pIHsKICAgICAgZXhwZWN0KHNvdXJjZSkubm90LnRvQ29udGFpbihmb3JiaWRkZW4pOwogICAgfQogIH0pOwoKICBpdCgnZ2VuZXJhdGVkIG1pZ3JhdGlvbiBjcmVhdGVzIG9ubHkgdGhlIHRocmVlIHJldmlld2VkIFBvaW50YWdlIHRhYmxlcycsICgpID0+IHsKICAgIGNvbnN0IG1pZ3JhdGlvbkRpcmVjdG9yeSA9IHJlc29sdmUoCiAgICAgIHJlcG9zaXRvcnlSb290LAogICAgICAncGFja2FnZXMvZGItY2xvdWQvZHJpenpsZScsCiAgICApOwogICAgY29uc3QgbWlncmF0aW9uTmFtZSA9IHJlYWRkaXJTeW5jKG1pZ3JhdGlvbkRpcmVjdG9yeSkuZmluZCgobmFtZSkgPT4KICAgICAgbmFtZS5zdGFydHNXaXRoKCcwMDE5X3BvaW50YWdlX2F1dGhvcml0eV9mb3VuZGF0aW9uJyksCiAgICApOwogICAgZXhwZWN0KG1pZ3JhdGlvbk5hbWUpLnRvQmVEZWZpbmVkKCk7CiAgICBjb25zdCBzcWwgPSByZWFkRmlsZVN5bmMoCiAgICAgIHJlc29sdmUobWlncmF0aW9uRGlyZWN0b3J5LCBtaWdyYXRpb25OYW1lISksCiAgICAgICd1dGY4JywKICAgICk7CiAgICBleHBlY3QoCiAgICAgIFsuLi5zcWwubWF0Y2hBbGwoL0NSRUFURSBUQUJMRSAiKFteIl0rKSIvZ3UpXS5tYXAoKG1hdGNoKSA9PiBtYXRjaFsxXSksCiAgICApLnRvRXF1YWwoWwogICAgICAncG9pbnRhZ2VfY3JlZGVudGlhbF9yYXRlX2xpbWl0cycsCiAgICAgICdwb2ludGFnZV9lbXBsb3llZV9jcmVkZW50aWFscycsCiAgICAgICdwb2ludGFnZV9zZWN1cml0eV9hdWRpdF9ldmVudHMnLAogICAgXSk7CiAgICBleHBlY3Qoc3FsKS5ub3QudG9NYXRjaCgvXig/OkRST1B8SU5TRVJUfFVQREFURXxERUxFVEV8VFJVTkNBVEUpXGIvaW11KTsKICAgIGV4cGVjdChzcWwpLm5vdC50b01hdGNoKC9yYXcuKig/OmV2ZW50fGV2aWRlbmNlKXxjbG9jay4qZXZlbnQvaXUpOwogIH0pOwp9KTsK"}
{"path":"docs/architecture/AUTHENTICATION.md","byteLength":12200,"sha256":"c92736abbc1192b18a06923e5ead5ed7416c4610f8c0dbd8ae639bc65cfdf4c8","base64":"IyBCYWNrLW9mZmljZSBBdXRoZW50aWNhdGlvbgoKU3RhdHVzOiBDdXJyZW50CgpWaXNpYmlsaXR5OiBFbmdpbmVlcmluZwoKT3duZXI6IFlVVEEgZW5naW5lZXJpbmcKCkxhc3QgdXBkYXRlZDogMjAyNi0wOS0wNwoKVGhlIFlVVEEgcmVzdGF1cmFudCBiYWNrLW9mZmljZSB1c2VzIHNlcnZlci1zaWRlLCBkYXRhYmFzZS1iYWNrZWQgc2Vzc2lvbnMuIEF1dGhlbnRpY2F0aW9uIGlzCmltcGxlbWVudGVkIGJ5IGBAeXV0YS9hdXRoYCwgdGhlIGNsb3VkIGRhdGFiYXNlIGJvdW5kYXJ5LCBhbmQgdGhlIHNlcnZlcgpib3VuZGFyeSBpbiBgYXBwcy9iYWNrb2ZmaWNlL3NyYy9zZXJ2ZXIvYXV0aGAuCgpBdXRoZW50aWNhdGlvbiBwZXJzaXN0ZW5jZSBhbmQgdGVuYW50IGxvb2t1cCBhZGFwdGVycyBhcmUgaW1wbGVtZW50ZWQgaW4KYEB5dXRhL2RiLWNsb3VkYC4gQmFjay1vZmZpY2Ugc2VydmVyIGNvZGUgY3JlYXRlcyB0aGUgY2xvdWQgY2xpZW50IGZyb20KYENMT1VEX0RBVEFCQVNFX1VSTGA7IHRoZSByZW1vdmVkIGxlZ2FjeSBgQHl1dGEvZGJgIHBhY2thZ2UgaXMgbm90IHVzZWQuCgpDbG91ZCBhdXRoZW50aWNhdGlvbiBpcyBub3QgdXNlZCBieSBgYXBwcy95dXRhLXBvc2AsIGBhcHBzL3NpdGUtYWdlbnRgLCBvcgpgYXBwcy95dXRhLWRpc3BsYXlgLiBQT1Mgc3RhZmYgYXV0aGVudGljYXRpb24gaXMgbG9jYWwgYW5kIHVzZXMgbG9jYWwgdXNlcnMsCnJvbGVzLCBQSU4gc2Vzc2lvbnMsIGFuZCBhdWRpdCByZWNvcmRzIHRocm91Z2ggYHNpdGUtYWdlbnRgL2BkYi1wb3NgLgoKIyMgU2lnbi1pbiBmbG93CgoxLiBgL2Nvbm5leGlvbmAgdmFsaWRhdGVzIHRoZSBzdWJtaXR0ZWQgZW1haWwgYW5kIHBhc3N3b3JkIG9uIHRoZSBzZXJ2ZXIuCjIuIFBhc3N3b3JkcyBhcmUgdmVyaWZpZWQgd2l0aCBOb2RlLmpzIHNjcnlwdC4gUGxhaW50ZXh0IHBhc3N3b3JkcyBhcmUgbmV2ZXIKICAgc3RvcmVkLgozLiBBY3RpdmUgZXN0YWJsaXNobWVudCBtZW1iZXJzaGlwcyBhcmUgcmVzb2x2ZWQgdXNpbmcgemVyby9vbmUvbWFueSBydWxlcy4KNC4gV2l0aCBvbmUgbWVtYmVyc2hpcCwgYSBjcnlwdG9ncmFwaGljYWxseSByYW5kb20gc2NvcGVkIHNlc3Npb24gdG9rZW4gaXMKICAgcmV0dXJuZWQgaW4gYW4gSHR0cE9ubHkgY29va2llLgo1LiBXaXRoIHNldmVyYWwgbWVtYmVyc2hpcHMsIGEgc2luZ2xlLXVzZSAxMC1taW51dGUgc2VsZWN0aW9uIHRpY2tldCBpcyBzdG9yZWQKICAgYXMgYSBzZXBhcmF0ZSBIdHRwT25seSBjb29raWUgdW50aWwgdGhlIHVzZXIgY2hvb3NlcyBhIG1lbWJlcnNoaXAuCjYuIFBvc3RncmVTUUwgc3RvcmVzIG9ubHkgU0hBLTI1NiBoYXNoZXMgb2Ygc2Vzc2lvbiBhbmQgc2VsZWN0aW9uIHRva2Vucy4KNy4gVGhlIGF1dGhlbnRpY2F0ZWQgbGF5b3V0IHZhbGlkYXRlcyB0aGUgc2Vzc2lvbiBhbmQgYWN0aXZlIHVzZXIuCjguIFRoZSBzZXNzaW9uIG9yZ2FuaXphdGlvbiBhbmQgZXN0YWJsaXNobWVudCBhcmUgY2hlY2tlZCBhZ2FpbnN0IGFuIGFjdGl2ZQogICBgdGVuYW50X21lbWJlcnNoaXBzYCByZWNvcmQuCjkuIGByZXNvbHZlQXV0aGVudGljYXRlZFRlbmFudGAgcHJvZHVjZXMgdGhlIHRydXN0ZWQgdGVuYW50IGNvbnRleHQgdXNlZCBieQogICByZXBvc2l0b3JpZXMgYW5kIHBlcm1pc3Npb24gY2hlY2tzLgoKVXNlcnMgd2l0aG91dCBhbiBhY3RpdmUgcmVzdGF1cmFudCBtZW1iZXJzaGlwIGFyZSByZWRpcmVjdGVkIHRvCmAvYWNjZXMvYXVjdW4tZXRhYmxpc3NlbWVudGAuIFVzZXJzIHdpdGggc2V2ZXJhbCBtZW1iZXJzaGlwcyBzZWxlY3Qgb25lIGF0CmAvc2VsZWN0aW9uLWV0YWJsaXNzZW1lbnRgIGJlZm9yZSBhIHNjb3BlZCBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSBzZWxlY3Rpb24KdGlja2V0IGhhcyBubyB0ZW5hbnQgc2NvcGUgYW5kIGNhbm5vdCBhdXRob3JpemUgcHJvdGVjdGVkIGJhY2stb2ZmaWNlIHJvdXRlcy4KCkJyb3dzZXIgaW5wdXQsIHF1ZXJ5IHBhcmFtZXRlcnMsIGFuZCBjb29raWVzIGFyZSBuZXZlciB0cnVzdGVkIGFzIHNvdXJjZXMgZm9yIGEKdXNlciByb2xlLCBvcmdhbml6YXRpb24sIGVzdGFibGlzaG1lbnQsIGVudGl0bGVtZW50LCBvciBwZXJtaXNzaW9uLgoKIyMgT3JnYW5pemF0aW9uIGFuZCBlc3RhYmxpc2htZW50IHN3aXRjaGluZwoKVGhlIGF1dGhlbnRpY2F0ZWQgYmFjay1vZmZpY2Ugc2hlbGwgbGlzdHMgZXZlcnkgYWN0aXZlIGVzdGFibGlzaG1lbnQgbWVtYmVyc2hpcAphdmFpbGFibGUgdG8gdGhlIGN1cnJlbnQgdXNlci4gT3B0aW9ucyBhcmUgZ3JvdXBlZCBieSBvcmdhbml6YXRpb24uIEEgdXNlciBjYW4Kc3dpdGNoIGFjcm9zcyBlc3RhYmxpc2htZW50cyBpbiBvbmUgb3JnYW5pemF0aW9uIG9yIGFjcm9zcyBvcmdhbml6YXRpb25zIG9ubHkKd2hlbiBhbiBhY3RpdmUgZXN0YWJsaXNobWVudC1sZXZlbCBtZW1iZXJzaGlwIGV4aXN0cyBmb3IgZWFjaCB0YXJnZXQuCgpTd2l0Y2hpbmcgaXMgYSBzZXJ2ZXItc2lkZSBvcGVyYXRpb246CgoxLiBUaGUgY3VycmVudCBzZXNzaW9uIHRva2VuIGlzIHZhbGlkYXRlZCBhZ2Fpbi4KMi4gVGhlIHRhcmdldCBtZW1iZXJzaGlwIFVVSUQgaXMgY2hlY2tlZCBhZ2FpbnN0IHRoZSBjdXJyZW50IHVzZXIsIGFuCiAgIGFjdGl2ZSBvcmdhbml6YXRpb24sIGFuZCBhbiBhY3RpdmUgZXN0YWJsaXNobWVudC4KMy4gVGhlIGN1cnJlbnQgZGF0YWJhc2Ugc2Vzc2lvbiBpcyByZXZva2VkLgo0LiBBIG5ldyBkYXRhYmFzZSBzZXNzaW9uIGFuZCBvcGFxdWUgY29va2llIHRva2VuIGFyZSBpc3N1ZWQgZm9yIHRoZSBzZWxlY3RlZAogICBvcmdhbml6YXRpb24gYW5kIGVzdGFibGlzaG1lbnQuCjUuIFRoZSBjdXJyZW50IHBhZ2UgaXMgcmVsb2FkZWQgdXNpbmcgdGhlIG5ldyB0cnVzdGVkIHRlbmFudCBjb250ZXh0LgoKVGhlIGNsaWVudCBjYW5ub3QgcHJvdmlkZSBvciBvdmVycmlkZSBvcmdhbml6YXRpb24gb3IgZXN0YWJsaXNobWVudCBpZGVudGlmaWVycy4KSXQgc3VibWl0cyBvbmx5IHRoZSB0YXJnZXQgbWVtYmVyc2hpcCBVVUlELCBhbmQgYm90aCBzY29wZSBpZGVudGlmaWVycyBhcmUKZGVyaXZlZCBmcm9tIHRoZSB2YWxpZGF0ZWQgbWVtYmVyc2hpcC4gSWYgbWVtYmVyc2hpcCBhY2Nlc3Mgd2FzIHJlbW92ZWQgYWZ0ZXIgdGhlIHNlbGVjdG9yIHdhcwpyZW5kZXJlZCwgdGhlIHN3aXRjaCBpcyByZWplY3RlZCBhbmQgdGhlIGV4aXN0aW5nIHNlc3Npb24gcmVtYWlucyB1bmNoYW5nZWQuCgojIyBDb29raWUgcG9saWN5CgpUaGUgYmFjay1vZmZpY2Ugc2Vzc2lvbiBjb29raWUgaXMgbmFtZWQgYHl1dGFfYmFja29mZmljZV9zZXNzaW9uYCBhbmQgdXNlczoKCi0gYEh0dHBPbmx5YAotIGBTYW1lU2l0ZT1MYXhgCi0gYFNlY3VyZWAgaW4gcHJvZHVjdGlvbgotIHJvb3QgcGF0aAotIGEgZml4ZWQgMTQtZGF5IGV4cGlyYXRpb24KLSBubyBleHBsaWNpdCBgRG9tYWluYCwgc28gaXQgcmVtYWlucyBob3N0LW9ubHkgb24gYGFwcC55dXRhcHJvLmZyYAoKTG9nb3V0IHJldm9rZXMgdGhlIGRhdGFiYXNlIHNlc3Npb24gYmVmb3JlIGRlbGV0aW5nIHRoZSBicm93c2VyIGNvb2tpZS4gVGVuYW50CnN3aXRjaGluZyByb3RhdGVzIHRoZSBzZXNzaW9uIHRva2VuIGFuZCByZXZva2VzIHRoZSBwcmV2aW91cyB0b2tlbi4gUGFzc3dvcmQKcmVzZXQgaW5jcmVtZW50cyB0aGUgdXNlcidzIGF1dGhlbnRpY2F0aW9uIHZlcnNpb24gYW5kIHJldm9rZXMgYWxsIGFjdGl2ZQpzZXNzaW9ucy4KCiMjIFJhdGUgbGltaXRpbmcKCkZhaWxlZCBsb2dpbiBhdHRlbXB0cyBhcmUgc3RvcmVkIGFnYWluc3QgYW4gSE1BQy1kZXJpdmVkIGtleSBjb250YWluaW5nIHRoZQpub3JtYWxpemVkIGVtYWlsIGFuZCBjbGllbnQgYWRkcmVzcy4gRml2ZSBmYWlsZWQgYXR0ZW1wdHMgaW4gMTUgbWludXRlcyBibG9jawphZGRpdGlvbmFsIGF0dGVtcHRzIGZvciB0aGF0IGtleS4gUmF3IGNsaWVudCBhZGRyZXNzZXMgYXJlIG5vdCBzdG9yZWQuCgpgQVVUSF9TRUNSRVRgIG11c3QgY29udGFpbiBhdCBsZWFzdCAzMiBjaGFyYWN0ZXJzIGluIHByb2R1Y3Rpb24uIEl0IGlzIHVzZWQgdG8KZGVyaXZlIHByaXZhY3ktcHJlc2VydmluZyBoYXNoZXMgZm9yIHJhdGUgbGltaXRpbmcgYW5kIGNsaWVudC1hZGRyZXNzIG1ldGFkYXRhLgoKRXhwaXJlZCBzZXNzaW9ucywgcmVzZXQgdG9rZW5zLCBhbmQgbG9naW4gYXR0ZW1wdHMgY2FuIGJlIHJlbW92ZWQgdGhyb3VnaCB0aGUKYXV0aCByZXBvc2l0b3J5IGNsZWFudXAgb3BlcmF0aW9uLiBQcm9kdWN0aW9uIHNjaGVkdWxpbmcgc2hvdWxkIGludm9rZSB0aGlzCm9wZXJhdGlvbiBwZXJpb2RpY2FsbHkuCgojIyBBdXRob3JpemF0aW9uCgpUaGUgZ2xvYmFsIGB1c2Vyc2AgcmVjb3JkIGlzIHRoZSBsb2dpbiBpZGVudGl0eS4gRXh0ZXJuYWwgaWRlbnRpdGllcyBtYXAgdGhyb3VnaApgdXNlcnMuYXV0aF9wcm92aWRlcl9pZGA7IHByb3ZpZGVyIHBheWxvYWRzIGRvIG5vdCBlbnRlciBkb21haW4gY29kZS4KYHRlbmFudF9tZW1iZXJzaGlwcy5yb2xlYCBpcyB0aGUgcmVzdGF1cmFudCBhdXRob3JpemF0aW9uIHNvdXJjZSBvZiB0cnV0aC4KYHVzZXJzLnN5c3RlbV9yb2xlYCBpcyByZXNlcnZlZCBmb3IgZXhwbGljaXQgWVVUQSBwbGF0Zm9ybSBhY2Nlc3MgYW5kIG5ldmVyCmJ5cGFzc2VzIHJlc3RhdXJhbnQgbWVtYmVyc2hpcCBjaGVja3MuIFBPUyBhdXRoZW50aWNhdGlvbiByZW1haW5zIGxvY2FsLgoKUmVwdXRhdGlvbiBwZXJtaXNzaW9ucyBhcmUgZW5mb3JjZWQgc2VydmVyLXNpZGU6CgotIE9XTkVSOiBhbGwgcmVwdXRhdGlvbiBwZXJtaXNzaW9ucy4KLSBNQU5BR0VSOiByZWFkLCBkcmFmdC9wdWJsaXNoIHJlcGxpZXMsIGluY2lkZW50cywgYW5hbHl0aWNzLCBhbmQgc3RhZmYgYWNjZXNzIG1hbmFnZW1lbnQuCi0gU1RBRkY6IHJlYWQsIGNyZWF0ZSBkcmFmdHMsIGFuZCBjcmVhdGUgaW5jaWRlbnRzLgotIE90aGVyIHJvbGVzOiBubyByZXB1dGF0aW9uIGFjY2VzcyBieSBkZWZhdWx0LgoKQ2xpZW50LXNpZGUgYnV0dG9uIHZpc2liaWxpdHkgaXMgb25seSBhIHVzYWJpbGl0eSBhaWQgYW5kIG11c3Qgbm90IHJlcGxhY2UgdGhlCnNlcnZlciBwZXJtaXNzaW9uIGNoZWNrLgoKIyMgUG9pbnRhZ2UgYXV0aG9yaXR5IGZvdW5kYXRpb24KClRoZSBCYWNrb2ZmaWNlIGNsb3VkIHJ1bnRpbWUgY29udGFpbnMgYSBzZXJ2ZXItb25seSBQb2ludGFnZSBhdXRoZW50aWNhdGlvbiBhbmQKYXV0aG9yaXphdGlvbiBmb3VuZGF0aW9uLiBJdCBkb2VzIG5vdCBleHBvc2UgYSByb3V0ZSwgYnJvd3NlciB0cmFuc3BvcnQsCmVtcGxveWVlIHNlc3Npb24sIGNsb2NrIGV2ZW50LCBVSSwgb3IgcHJvZHVjdGlvbi1lbmFibGVkIGNhcGFiaWxpdHkuCgpQb2ludGFnZSBlbXBsb3llZSBjcmVkZW50aWFscyBhcmUgaW5kZXBlbmRlbnQgZnJvbSBCYWNrb2ZmaWNlIHVzZXIgc2Vzc2lvbnMsClBlcnNvbm5lbCBwZXJtaXNzaW9ucywgUE9TIHVzZXJzLCBhbmQgbG9jYWwgUElOcy4gQSBjcmVkZW50aWFsIGNvbnRhaW5zIGV4YWN0bHkKZWlnaHQgQVNDSUkgZGlnaXRzLCBpcyBnZW5lcmF0ZWQgd2l0aCBOb2RlIGNyeXB0b2dyYXBoaWMgcmFuZG9tbmVzcywgYW5kIGlzCnBlcnNpc3RlZCBvbmx5IHRocm91Z2ggYSBzY29wZWQgSE1BQyBsb29rdXAgZGlnZXN0IHBsdXMgYSBzYWx0ZWQsIHBlcHBlcmVkCmBzY3J5cHRgIHZlcmlmaWVyLiBWZXJzaW9uZWQgSEtERiBsYWJlbHMgc2VwYXJhdGUgbG9va3VwLCB2ZXJpZmllciwgbGltaXRlciwgYW5kCmR1bW15LXZlcmlmaWNhdGlvbiBrZXlzLiBQbGFpbnRleHQgaXMgYXZhaWxhYmxlIG9ubHkgaW4gdGhlIHN1Y2Nlc3NmdWwgaXNzdWUgb3IKcmVzZXQgY29tbWFuZCByZXN1bHQgYWZ0ZXIgaXRzIGRhdGFiYXNlIHRyYW5zYWN0aW9uIGNvbW1pdHM7IGl0IGNhbm5vdCBiZSByZWFkCmJhY2sgZnJvbSB0aGUgcmVwb3NpdG9yeS4KCkV2ZXJ5IGVtcGxveWVlIGNyZWRlbnRpYWwgcmVxdWVzdCBtdXN0IHJlc29sdmUgYW4gYWN0aXZlIG9yZ2FuaXphdGlvbiBhbmQKZXN0YWJsaXNobWVudCBmcm9tIHRoZSBwdWJsaWMgZXN0YWJsaXNobWVudCBzbHVnIG9uIHRoZSBzZXJ2ZXIuIENyZWRlbnRpYWwKdmFsaWRhdGlvbiBhbHNvIHJlcXVpcmVzIGFuIGluamVjdGVkIGBUcnVzdGVkUG9pbnRhZ2VDbGllbnRBZGRyZXNzUHJvdmlkZXJgLgpUaGVyZSBpcyBkZWxpYmVyYXRlbHkgbm8gcHJvZHVjdGlvbiBwcm92aWRlciwgZm9yd2FyZGVkLWhlYWRlciByZWFkZXIsCnVua25vd24tY2xpZW50IGJ1Y2tldCwgb3IgY2FuZGlkYXRlLW9ubHkgZmFsbGJhY2sgaW4gdGhpcyBmb3VuZGF0aW9uLiBBIG1pc3NpbmcKc2VjcmV0IG9yIG1pc3NpbmcvdW50cnVzdGVkIGFkZHJlc3MgcHJvdmVuYW5jZSBmYWlscyBjbG9zZWQgYmVmb3JlIHVzYWJsZQpjcmVkZW50aWFsIHByb2Nlc3NpbmcuIFByb2R1Y3Rpb24gZW5hYmxlbWVudCByZW1haW5zIGJsb2NrZWQgdW50aWwgZXhhY3QKZGVwbG95bWVudCBwcm92ZW5hbmNlIGlzIHJldmlld2VkIHNlcGFyYXRlbHkuCgpDcnlwdG9ncmFwaGljIHZhbGlkYXRpb24gY3JlYXRlcyBvbmx5IGEgYFZlcmlmaWVkUG9pbnRhZ2VDcmVkZW50aWFsYC4gSXQgZG9lcwpub3QgY3JlYXRlIGVtcGxveWVlIGF1dGhvcml0eS4gVGhlIHRocmVlIGVtcGxveWVlIG9wZXJhdGlvbnPigJRpZGVudGlmeSwgb3duLXN0YXRlCnJlYWQsIGFuZCBvd24tb3BlcmF0aW9uIGNyZWF0aW9u4oCUZWFjaCByZXF1aXJlIGEgc2VwYXJhdGVseSBjaGVja2VkLCBzY29wZWQKUGVyc29ubmVsIGVtcGxveW1lbnQgcGVyaW9kIHVzaW5nIHRoZSBlc3RhYmxpc2htZW50IHRpbWV6b25lOyBlbnRyeSBhbmQgdmFsaWQKZGVwYXJ0dXJlIGRheXMgYXJlIGluY2x1c2l2ZS4gTWFuYWdlciBQb2ludGFnZSBncmFudHMgYXJlIHNlcGFyYXRlIGFuZCBsaW1pdGVkCnRvIGFjdGl2ZSBzY29wZWQgT1dORVIgb3IgTUFOQUdFUiBjb250ZXh0cyBmb3IgZXN0YWJsaXNobWVudCByZWFkLCBjcmVkZW50aWFsCmlzc3VlLCBhbmQgY3JlZGVudGlhbCByZXNldC4gU1RBRkYgaGFzIG5vIFBvaW50YWdlIGdyYW50LCBhbmQgdGhlcmUgaXMgbm8Kc3RhbmRhbG9uZSByZXZva2UsIHN1c3BlbmQsIG9yIGludmFsaWRhdGUgb3BlcmF0aW9uLgoKQ2xvdWQgcGVyc2lzdGVuY2UgaXMgYWRkaXRpdmUgYW5kIGxpbWl0ZWQgdG8gY3JlZGVudGlhbCB2ZXJzaW9ucywgZGlzdHJpYnV0ZWQKY2FuZGlkYXRlL2NsaWVudCBsaW1pdGVyIHN0YXRlLCBhbmQgbWluaW1pemVkIHdyaXRlLW9ubHkgc2VjdXJpdHkgYXR0cmlidXRpb24uCkl0IGNvbnRhaW5zIG5vIHJhdyBQb2ludGFnZSBldmlkZW5jZSBvciBvZmZsaW5lL3N5bmMgc3RhdGUuIEV4YWN0IHJldGVudGlvbiwKZGVsZXRpb24vYW5vbnltaXphdGlvbiwgbGVnYWwgaG9sZCwgYmFja3VwLXJldGVudGlvbiBpbnRlcmFjdGlvbiwgZW1wbG95ZWUgbm90aWNlLApkZXRhaWxlZCBhdWRpdCB2aXNpYmlsaXR5LCBhbmQgdHJ1c3RlZCBwcm9kdWN0aW9uIGNsaWVudC1hZGRyZXNzIHByb3ZlbmFuY2UgYXJlCnN0aWxsIHVucmVzb2x2ZWQgcHJvZHVjdGlvbiBnYXRlcy4KCiMjIFVzZXIgYW5kIG1lbWJlcnNoaXAgYWRtaW5pc3RyYXRpb24KCmAvcGFyYW1ldHJlcy91dGlsaXNhdGV1cnMtYWNjZXNgIGlzIHRoZSB0ZW5hbnQtYXdhcmUgYWNjZXNzIG1hbmFnZW1lbnQgc3VyZmFjZToKCi0gVGhlICJVdGlsaXNhdGV1cnMgJiBhY2PDqHMiIG5hdmlnYXRpb24gaXRlbSBhcHBlYXJzIHVuZGVyIHRoZSBzZXR0aW5ncyBzZWN0aW9uCiAgb25seSBmb3Igb3duZXJzIGFuZCBtYW5hZ2Vycy4KLSBPd25lcnMgY2FuIG1hbmFnZSBhY3RpdmUgZXN0YWJsaXNobWVudHMgYWNyb3NzIHRoZWlyIGN1cnJlbnQgb3JnYW5pemF0aW9uLgotIE1hbmFnZXJzIGNhbiBtYW5hZ2Ugc3RhZmYgb25seSBpbiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVzdGFibGlzaG1lbnQuCi0gTWFuYWdlcnMgY2Fubm90IGFzc2lnbiBvciBtb2RpZnkgb3duZXIgb3IgbWFuYWdlciByb2xlcy4KLSBUaGUgbWVtYmVyc2hpcCB1c2VkIGJ5IHRoZSBjdXJyZW50IHNlc3Npb24gY2Fubm90IG1vZGlmeSBvciBzdXNwZW5kIGl0c2VsZi4KLSBUaGUgbGFzdCBhY3RpdmUgb3duZXIgbWVtYmVyc2hpcCBpbiBlYWNoIG9yZ2FuaXphdGlvbi9lc3RhYmxpc2htZW50IHNjb3BlCiAgY2Fubm90IGJlIGRvd25ncmFkZWQgb3Igc3VzcGVuZGVkIHRocm91Z2ggZWRpdCBvciBleGlzdGluZy11c2VyIGF0dGFjaG1lbnQuCi0gU3VzcGVuZGluZyBhIG1lbWJlcnNoaXAgaW1tZWRpYXRlbHkgcmV2b2tlcyBhY3RpdmUgc2Vzc2lvbnMgZm9yIHRoYXQgdXNlciwKICBvcmdhbml6YXRpb24sIGFuZCBlc3RhYmxpc2htZW50LgoKQ3JlYXRpbmcgYSB1c2VyIHdpdGggYSBuZXcgZW1haWwgY3JlYXRlcyBhIGdsb2JhbCBsb2dpbiBpZGVudGl0eSBhbmQgb25lIG9yIG1vcmUKZXN0YWJsaXNobWVudCBtZW1iZXJzaGlwcy4gQ3JlYXRpbmcgYWNjZXNzIGZvciBhbiBlbWFpbCB0aGF0IGFscmVhZHkgZXhpc3RzCmF0dGFjaGVzIHRoZSBleGlzdGluZyBpZGVudGl0eSBhbmQgcHJlc2VydmVzIGl0cyBjdXJyZW50IHBhc3N3b3JkLiBBdXRvbWF0ZWQKaW52aXRhdGlvbiBlbWFpbCBpcyBub3QgYWN0aXZlIHlldCwgc28gdGhlIGluaXRpYWwgcGFzc3dvcmQgbXVzdCBiZSBkZWxpdmVyZWQKdGhyb3VnaCBhbiBhcHByb3ZlZCBvcGVyYXRpb25hbCBjaGFubmVsIGZvciBuZXdseSBjcmVhdGVkIGlkZW50aXRpZXMuCgpNZW1iZXJzaGlwIGVkaXRzIGFuZCBjcmVhdGlvbi9hdHRhY2htZW50IHRyYW5zYWN0aW9ucyBhY3F1aXJlIGBGT1IgTk8gS0VZClVQREFURWAgbG9ja3Mgb24gdGhlaXIgZXhpc3RpbmcgYWN0aXZlIGVzdGFibGlzaG1lbnQgcm93cyBpbiBjYW5vbmljYWwgVVVJRApvcmRlciBiZWZvcmUgbXV0YXRpb24gd3JpdGVzLiBCb3RoIHBhdGhzIHVzZSBleHBsaWNpdCBgUkVBRCBDT01NSVRURURgIGFuZApmcmVzaCBwb3N0LWxvY2sgbWVtYmVyc2hpcCBhbmQgYWN0aXZlLW93bmVyIHJlYWRzLiBNZW1iZXJzaGlwIHdyaXRlcywgc2NvcGVkCnNlc3Npb24gcmV2b2NhdGlvbiwgYW5kIHN1Y2Nlc3MgYXVkaXQgc2hhcmUgdGhhdCB0cmFuc2FjdGlvbjsgYSByZWplY3RlZCB0YXJnZXQKb3IgbGF0ZXIgZmFpbHVyZSByb2xscyBiYWNrIHRoZSBlbnRpcmUgYmF0Y2ggYW5kIGl0cyBlZmZlY3RzLiBUaGUgb3duZXIgY291bnQKdXNlcyBhY3RpdmUgbWVtYmVyc2hpcHMgaW4gdGhlIGV4YWN0IG9yZ2FuaXphdGlvbi9lc3RhYmxpc2htZW50IHNjb3BlLCBub3QKZ2xvYmFsIGFjY291bnQgdXNhYmlsaXR5LgoKTWVtYmVyc2hpcCBjcmVhdGlvbiwgYXR0YWNobWVudCwgcm9sZSBjaGFuZ2VzLCBhbmQgc3VzcGVuc2lvbiBhcmUgcmVjb3JkZWQgaW4KYGF1dGhfYXVkaXRfZXZlbnRzYC4gQXVkaXQgbWV0YWRhdGEgY29udGFpbnMgaWRlbnRpZmllcnMsIHJvbGVzLCBhbmQgc3RhdHVzZXM7Cml0IG5ldmVyIHN0b3JlcyBwbGFpbnRleHQgcGFzc3dvcmRzIG9yIHNlc3Npb24gdG9rZW5zLgoKVGhlIHNhbWUgcm91dGUgZXhwb3NlcyBhbiBvd25lci1vbmx5IGFjY2VzcyBoaXN0b3J5IHJlYWQgZnJvbSB0aG9zZSBwZXJzaXN0ZWQKZXZlbnRzLiBUaGUgc2VydmVyIGRlcml2ZXMgdGhlIG9yZ2FuaXphdGlvbiwgYWN0b3Igcm9sZSwgYW5kIGN1cnJlbnRseQptYW5hZ2VhYmxlIGFjdGl2ZSBlc3RhYmxpc2htZW50cyBmcm9tIHRoZSBhdXRoZW50aWNhdGVkIHNlc3Npb24uIFRoZSBhdWRpdApxdWVyeSBpcyBjb25zdHJhaW5lZCBieSBib3RoIG9yZ2FuaXphdGlvbiBhbmQgdGhhdCBlc3RhYmxpc2htZW50IGFsbG93bGlzdDsKdXNlciwgZXN0YWJsaXNobWVudCwgYW5kIGFjdGlvbiB2YWx1ZXMgcmVjZWl2ZWQgZnJvbSB0aGUgYnJvd3NlciBhcmUgZGlzcGxheQpmaWx0ZXJzIG9ubHkuIE1hbmFnZXJzIGFuZCBzdGFmZiBjYW5ub3QgcmVhZCB0aGUgaGlzdG9yeS4KClRoZSBoaXN0b3J5IHN1cHBvcnRzIHRoZSBleGlzdGluZyBgdGVuYW50LnVzZXIuY3JlYXRlZGAsCmB0ZW5hbnQudXNlci5hdHRhY2hlZGAsIGFuZCBgdGVuYW50Lm1lbWJlcnNoaXAudXBkYXRlZGAgZXZlbnRzIHdpdGggc3RhYmxlCmBjcmVhdGVkX2F0YCBwbHVzIGV2ZW50LUlEIGN1cnNvciBwYWdpbmF0aW9uLiBJdHMgcmVzcG9uc2UgcHJvamVjdHMgb25seSB0aGUKZXZlbnQgdGltZXN0YW1wLCBhY3RvciBhbmQgc3ViamVjdCBkaXNwbGF5IGlkZW50aXR5LCBhY3Rpb24sIGFsbG93ZWQKZXN0YWJsaXNobWVudCBuYW1lcywgYW5kIHByZXZpb3VzL25leHQgcm9sZSBhbmQgbWVtYmVyc2hpcCBzdGF0dXMuIFJhdyBhdWRpdAptZXRhZGF0YSwgcGFzc3dvcmQgaGFzaGVzLCB0b2tlbnMsIElQIGhhc2hlcywgdXNlci1hZ2VudCB2YWx1ZXMsIGFuZCB1bnJlbGF0ZWQKbWV0YWRhdGEgYXJlIG5ldmVyIHJldHVybmVkIHRvIHRoZSBwYWdlLiBObyBoaXN0b3JpY2FsIHNlZWQgYmFja2ZpbGwgaXMKY3JlYXRlZCwgc28gYW4gb3JnYW5pemF0aW9uIHdpdGhvdXQgcGVyc2lzdGVkIGV2ZW50cyByZWNlaXZlcyB0aGUgdHJ1dGhmdWwKZW1wdHkgc3RhdGUuIExvZ2luLCBsb2dvdXQsIGFuZCBzZXNzaW9uIGF1ZGl0aW5nIHJlbWFpbiBvdXRzaWRlIHRoaXMgYWNjZXNzCm1hbmFnZW1lbnQgaGlzdG9yeS4KCiMjIExvY2FsIGRldmVsb3BtZW50CgpSdW4gdGhlIGRhdGFiYXNlIG1pZ3JhdGlvbiBhbmQgc2VlZCBiZWZvcmUgc2lnbmluZyBpbjoKCmBgYGJhc2gKcG5wbSBkYjpjbG91ZDptaWdyYXRlCnBucG0gLS1maWx0ZXIgQHl1dGEvZGItY2xvdWQgZGI6c2VlZApgYGAKCkRldmVsb3BtZW50IHNlZWQgaWRlbnRpdGllczoKCmBgYHRleHQKT3duZXI6IG93bmVyQGx1bmEtcmVzdGF1cmFudC5mcgpNYW5hZ2VyOiBtYW5hZ2VyQGx1bmEtcmVzdGF1cmFudC5mcgpgYGAKClJ1biBgcG5wbSBkZXY6ZW52OnN5bmNgIHRvIGNyZWF0ZSBhIHJhbmRvbSBgWVVUQV9DTE9VRF9TRUVEX1BBU1NXT1JEYCBpbiB0aGUKaWdub3JlZCBgcGFja2FnZXMvZGItY2xvdWQvLmVudi5sb2NhbGAsIG9yIHByb3ZpZGUgdGhlIHZhcmlhYmxlIGV4cGxpY2l0bHkuClNlZWQgZXhlY3V0aW9uIGZhaWxzIGNsb3NlZCB3aGVuIGl0IGlzIG1pc3NpbmcuIFRoZSBvd25lciBhbmQgbWFuYWdlciBpZGVudGl0aWVzCnJlY2VpdmUgYWN0aXZlIExVTkEgbWVtYmVyc2hpcHMuIGBhZG1pbkB5dXRhcHJvLmZyYCByZWNlaXZlcyB0aGUgYFlVVEFfQURNSU5gCnN5c3RlbSByb2xlIGFuZCBubyByZXN0YXVyYW50IG1lbWJlcnNoaXAsIHNvIGl0IGNhbm5vdCB1c2UgdGhlIHJlc3RhdXJhbnQKYmFjay1vZmZpY2UuIE5ldmVyIGRlcGxveSBkZXZlbG9wbWVudCBzZWVkIGlkZW50aXRpZXMgb3IgY3JlZGVudGlhbHMuCgojIyBQYXNzd29yZCByZWNvdmVyeQoKUmVzZXQgdG9rZW5zIGFyZSBhdG9taWNhbGx5IHNpbmdsZS11c2UuIEFmdGVyIGhhc2hpbmcgdGhlIG5ldyBwYXNzd29yZCwgdGhlCnJlcG9zaXRvcnkgY29uZGl0aW9uYWxseSBjbGFpbXMgYW4gdW5jb25zdW1lZCwgdW5leHBpcmVkIHRva2VuIHdpdGggYW4gdXBkYXRlCnRoYXQgcmV0dXJucyBpdHMgdXNlciBJRC4gVGhlIGNsYWltLCBwYXNzd29yZCB1cGRhdGUsIGF1dGhlbnRpY2F0aW9uLXZlcnNpb24KaW5jcmVtZW50LCBzZXNzaW9uIHJldm9jYXRpb24sIGFuZCBzZWxlY3Rpb24tdGlja2V0IGRlbGV0aW9uIHNoYXJlIG9uZQp0cmFuc2FjdGlvbi4gQSBsYXRlciBmYWlsdXJlIHJvbGxzIGJhY2sgdGhlIGNsYWltIGFzIHdlbGwgYXMgdGhlIG90aGVyIHdyaXRlcy4KVW5rbm93biwgZXhwaXJlZCwgY29uc3VtZWQsIGFuZCBjb25jdXJyZW50bHkgY2xhaW1lZCB0b2tlbnMgYWxsIHByb2R1Y2UgdGhlCnNhbWUgaW52YWxpZC10b2tlbiByZXN1bHQuIENvbmN1cnJlbnQgdXNlIG9mIG9uZSB0b2tlbiBjYW4gY29tcGxldGUgYXQgbW9zdCBvbmUKcGFzc3dvcmQgcmVzZXQuCgpUaGUgcmVzZXQtdG9rZW4gc3RvcmFnZSBhbmQgcGFzc3dvcmQgcmVzZXQgcGFnZSBhcmUgaW1wbGVtZW50ZWQuIEF1dG9tYXRlZApkZWxpdmVyeSBpcyBpbnRlbnRpb25hbGx5IG5vdCBhY3RpdmUgYmVjYXVzZSB0aGUgcmVwb3NpdG9yeSBkb2VzIG5vdCB5ZXQgaGF2ZSBhCnRydXN0ZWQgdHJhbnNhY3Rpb25hbCBlbWFpbCBzZXJ2aWNlLiBVbnRpbCBvbmUgaXMgY29uZmlndXJlZCwgYW4gb3duZXIgb3IgbWFuYWdlcgptdXN0IGNyZWF0ZSBhbmQgZGVsaXZlciB0aGUgc2hvcnQtbGl2ZWQgdG9rZW4gdGhyb3VnaCBhbiBhcHByb3ZlZCBvcGVyYXRpb25hbApjaGFubmVsLgo="}
{"path":"docs/architecture/DATABASE_BOUNDARIES.md","byteLength":2225,"sha256":"833fc791ec80e487c8f079af951dd35006dc27102e2a9f8be7c4ef347a3ead5e","base64":"IyBZVVRBIERhdGFiYXNlIGFuZCBSdW50aW1lIEJvdW5kYXJpZXMKClN0YXR1czogQ3VycmVudAoKVmlzaWJpbGl0eTogRW5naW5lZXJpbmcKCk93bmVyOiBZVVRBIGVuZ2luZWVyaW5nCgpMYXN0IHVwZGF0ZWQ6IDIwMjYtMDgtMDUKCiMjIENsb3VkCgpgcGFja2FnZXMvZGItY2xvdWRgIG93bnMgU2FhUyBkYXRhIHVzZWQgYnkgc2VydmVyLXNpZGUgY29kZSBpbiBgYXBwcy93ZWJgLApgYXBwcy9iYWNrb2ZmaWNlYCwgYGFwcHMvYm9va2luZy13ZWJgLCBhbmQgYGFwcHMvZmVlZGJhY2std2ViYC4gSXQgdXNlcwpgQ0xPVURfREFUQUJBU0VfVVJMYCBhbmQgb3ducyBpZGVudGl0eSwgb3JnYW5pemF0aW9ucywgZXN0YWJsaXNobWVudHMsCm1lbWJlcnNoaXBzLCBkb21haW5zLCBlbnRpdGxlbWVudHMsIHJlcHV0YXRpb24gaW50ZWdyYXRpb25zLCBwdWJsaWMgYm9va2luZywKYW5kIG90aGVyIGFwcHJvdmVkIGNsb3VkIGRvbWFpbnMuCgpUZW5hbnQtb3duZWQgY2xvdWQgcXVlcmllcyBpbmNsdWRlIGBvcmdhbml6YXRpb25JZGA7IGVzdGFibGlzaG1lbnQtb3duZWQgZGF0YQphbHNvIGluY2x1ZGVzIGBlc3RhYmxpc2htZW50SWRgLiBSZXBvc2l0b3J5IEFQSXMgZW5mb3JjZSB0aG9zZSBwcmVkaWNhdGVzLgoKIyMgUE9TIGxvY2FsCgpgYXBwcy9zaXRlLWFnZW50YCBpcyB0aGUgb25seSBydW50aW1lIG93bmVyIG9mIGBwYWNrYWdlcy9kYi1wb3NgIGFuZCB1c2VzCmBQT1NfREFUQUJBU0VfVVJMYC4gYGFwcHMveXV0YS1wb3NgIGNhbGxzIHNpdGUtYWdlbnQgYW5kIGRvZXMgbm90IG9wZW4gYSBkYXRhYmFzZQpjb25uZWN0aW9uIGZyb20gaXRzIGJyb3dzZXIvc2VydmVyIGJ1bmRsZS4gT3JkZXJzLCBjaGVja3MsIHBheW1lbnRzLCBraXRjaGVuCnN0YXRlLCBwcmludCBqb2JzLCBsb2NhbCBzdGFmZiwgbWVudSBzbmFwc2hvdHMsIGFuZCBsb2NhbCBvcGVyYXRpb25hbCByZXBvcnRzCnJlbWFpbiBhdCB0aGUgcmVzdGF1cmFudCBhbmQgYXJlIG5ldmVyIHN5bmNocm9uaXplZCB0byBjbG91ZCBwZXJzaXN0ZW5jZS4KCiMjIERpc3BsYXkgbG9jYWwKCmBhcHBzL3l1dGEtZGlzcGxheWAgaXMgYSBzdGFuZGFsb25lIHByb2R1Y3QuIEl0cyBzZXJ2ZXIgY29kZSBvd25zIHRoZSBzY2hlbWEgYW5kCnJlcG9zaXRvcmllcyB1bmRlciBgYXBwcy95dXRhLWRpc3BsYXkvc3JjL2RiYCBhbmQgdXNlcyBgRElTUExBWV9EQVRBQkFTRV9VUkxgLgpEbyBub3QgY3JlYXRlIGBwYWNrYWdlcy9kYi1kaXNwbGF5YCB1bmxlc3MgYSBzZWNvbmQgbGVnaXRpbWF0ZSBzZXJ2ZXItc2lkZQpjb25zdW1lciBuZWVkcyB0aGF0IGRhdGFiYXNlIGJvdW5kYXJ5LgoKIyMgR2xvYmFsIHJ1bGVzCgotIFRoZSBsZWdhY3kgYHBhY2thZ2VzL2RiYCBwYXRoIGlzIHJlbW92ZWQgZnJvbSB0cmFja2VkIHNvdXJjZS4gTmV2ZXIgdXNlIG9yCiAgcmVzdG9yZSBpdCBhcyB0aGUgYEB5dXRhL2RiYCBjb21wYXRpYmlsaXR5IHBhY2thZ2U7IGlnbm9yZWQgZmlsZXMsIGdlbmVyYXRlZAogIGNvbnRlbnQsIG9yIGVtcHR5IGxvY2FsIGRpcmVjdG9yaWVzIHVuZGVyIHRoYXQgcGF0aCBkbyBub3QgbWFrZSBpdCBhY3RpdmUuCi0gTmV2ZXIgdXNlIGFtYmlndW91cyBgREFUQUJBU0VfVVJMYCBmb3IgdGhlc2UgcnVudGltZSBmYW1pbGllcy4KLSBOZXZlciBleHBvc2UgZGF0YWJhc2UgVVJMcyB0aHJvdWdoIGBORVhUX1BVQkxJQ18qYCB2YXJpYWJsZXMuCi0gQ2xvdWQsIFBPUywgYW5kIGRpc3BsYXkgdXNlIHNlcGFyYXRlIG5hbWVzLCBjcmVkZW50aWFscywgbWlncmF0aW9ucywgYmFja3VwcywKICBhbmQgZmFpbHVyZSBkb21haW5zIGV2ZW4gd2hlbiBkZXZlbG9wbWVudCB1c2VzIG9uZSBQb3N0Z3JlU1FMIHNlcnZlci4KLSBVc2UgYXBwbGljYXRpb24tZ2VuZXJhdGVkIFVVSUR2NyBmb3Igbm9ybWFsIG5ldyBidXNpbmVzcyByZWNvcmRzIHVubGVzcyBhbgogIG9wYXF1ZSBzZWN1cml0eSB0b2tlbiBuZWVkcyBjcnlwdG9ncmFwaGljYWxseSByYW5kb20gYnl0ZXMuCi0gRG8gbm90IGVkaXQgYW4gYWxyZWFkeSBkZXBsb3llZCBtaWdyYXRpb247IGNyZWF0ZSBhbmQgcmV2aWV3IGEgbmV3IG1pZ3JhdGlvbi4KLSBJbnRlZ3JhdGlvbiB0ZXN0cyB1c2UgZGlzcG9zYWJsZSBkYXRhYmFzZXMgYW5kIHRoZSByZXBvc2l0b3J5J3MgZXhwbGljaXQKICBzYWZldHkgZ3VhcmRzLgoKT3BlcmF0aW9uYWwgY29tbWFuZHMgYW5kIHRvcG9sb2d5IGxpdmUgaW4gYGRvY3Mvb3BlcmF0aW9ucy9gLgo="}
{"path":"packages/auth/src/index.ts","byteLength":239,"sha256":"b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634","base64":"ZXhwb3J0ICogZnJvbSAnLi9jb250cmFjdHMnOwpleHBvcnQgKiBmcm9tICcuL2Zvcm1hbGl0ZXMtdGVtcGxhdGUtc3lzdGVtLWF1dGhvcml6YXRpb24nOwpleHBvcnQgKiBmcm9tICcuL3BvaW50YWdlLWNyZWRlbnRpYWwnOwpleHBvcnQgKiBmcm9tICcuL3Bhc3N3b3JkJzsKZXhwb3J0ICogZnJvbSAnLi9wb3N0LWxvZ2luJzsKZXhwb3J0ICogZnJvbSAnLi9zZXNzaW9uJzsKZXhwb3J0ICogZnJvbSAnLi90b2tlbnMnOwo="}
{"path":"packages/contracts/src/index.ts","byteLength":338,"sha256":"ce44e688cea68cee2291db00a89207b5ae95086c3ef9de2df649858aa7378a44","base64":"ZXhwb3J0ICogZnJvbSAnLi9jbG91ZC1hZG1pbic7CmV4cG9ydCAqIGZyb20gJy4vY29tbW9uJzsKZXhwb3J0ICogZnJvbSAnLi9kaXNwbGF5JzsKZXhwb3J0ICogZnJvbSAnLi9lc3RhYmxpc2htZW50LXByb2ZpbGUnOwpleHBvcnQgKiBmcm9tICcuL2Zvcm1hbGl0ZXMnOwpleHBvcnQgKiBmcm9tICcuL2xvY2FsLXBvcyc7CmV4cG9ydCAqIGZyb20gJy4vb3JkZXJzJzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwnOwpleHBvcnQgKiBmcm9tICcuL3JlcHV0YXRpb24nOwpleHBvcnQgKiBmcm9tICcuL3Jlc2VydmF0aW9ucyc7CmV4cG9ydCAqIGZyb20gJy4vdGVuYW50LWZvdW5kYXRpb24nOwo="}
{"path":"packages/db-cloud/drizzle/meta/_journal.json","byteLength":3251,"sha256":"64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997","base64":"ewogICJ2ZXJzaW9uIjogIjciLAogICJkaWFsZWN0IjogInBvc3RncmVzcWwiLAogICJlbnRyaWVzIjogWwogICAgewogICAgICAiaWR4IjogMCwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NTE4NjI4MDk3MSwKICAgICAgInRhZyI6ICIwMDAwX2luaXRpYWwiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NTYyNzEzNjEwNCwKICAgICAgInRhZyI6ICIwMDAxX2FtdXNlZF93cmVja2VyIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDIsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODU2NjQwMTY2NDUsCiAgICAgICJ0YWciOiAiMDAwMl9idW1weV9lbGVrdHJhIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDMsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODU2NjQ2NTY1ODIsCiAgICAgICJ0YWciOiAiMDAwM19zbWFsbF9yYWlkZXIiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNCwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjAzOTgwNzc4OCwKICAgICAgInRhZyI6ICIwMDA0X3ByZXZpb3VzX2dyYXZpdHkiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjYxOTA4NjYwOCwKICAgICAgInRhZyI6ICIwMDA1X2xlYW5fenp6YXgiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjYyNzE2OTYwOCwKICAgICAgInRhZyI6ICIwMDA2X2Fyb21hdGljX2Jvb21fYm9vbSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiA3LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg2Nzg0MjAzODYzLAogICAgICAidGFnIjogIjAwMDdfaGFwcHlfbWFzdGVyX2NoaWVmIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDgsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODY3OTYwMTgxMzgsCiAgICAgICJ0YWciOiAiMDAwOF9vbW5pc2NpZW50X2NvbG9uZWxfYW1lcmljYSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiA5LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg2ODgwNTMwODQwLAogICAgICAidGFnIjogIjAwMDlfaGVhdnlfc2F1cm9uIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDEwLAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg3MDA2MDMxNzM1LAogICAgICAidGFnIjogIjAwMTBfZ2lmdGVkX3JvbGFuZF9kZXNjaGFpbiIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxMSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODEyNTgwOTkwNiwKICAgICAgInRhZyI6ICIwMDExX3Jlc3RhdXJhbnRfa25vd2xlZGdlX2NvbmNlcHRfaGlzdG9yeSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxMiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODE3MzI0MzU0NCwKICAgICAgInRhZyI6ICIwMDEyX3Jlc3RhdXJhbnRfa25vd2xlZGdlX2N1aXNpbmVfa25vd19ob3ciLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMTMsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODgyNjc3NzkyMTQsCiAgICAgICJ0YWciOiAiMDAxM19yZXN0YXVyYW50X2tub3dsZWRnZV9jdXN0b21lcl9leHBlcmllbmNlIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE0LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4MzM4OTQyNzMxLAogICAgICAidGFnIjogIjAwMTRfcmVzdGF1cmFudF9rbm93bGVkZ2VfdGVhbV9jdWx0dXJlIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE1LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4MzcwMjk5Njg1LAogICAgICAidGFnIjogIjAwMTVfcmVzdGF1cmFudF9rbm93bGVkZ2VfY29tbXVuaWNhdGlvbl9pZGVudGl0eSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxNiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODM4NjQ4MTQxNiwKICAgICAgInRhZyI6ICIwMDE2X3Jlc3RhdXJhbnRfa25vd2xlZGdlX3ZhbGlkYXRlZF9pdGVtcyIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxNywKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODQzODUwOTA1MSwKICAgICAgInRhZyI6ICIwMDE3X3dob2xlX3dhcmJvdW5kIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE4LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4NTU5ODgwMjk5LAogICAgICAidGFnIjogIjAwMThfZWxpdGVfaGFyZGJhbGwiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMTksCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODg3MzE5NTgwMzgsCiAgICAgICJ0YWciOiAiMDAxOV9wb2ludGFnZV9hdXRob3JpdHlfZm91bmRhdGlvbiIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAyMCwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODg1MzEwNDgxNSwKICAgICAgInRhZyI6ICIwMDIwX2Zvcm1hbGl0ZXNfbGVnYWxfdGVtcGxhdGVfZm91bmRhdGlvbiIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0KICBdCn0="}
{"path":"packages/db-cloud/src/index.ts","byteLength":1571,"sha256":"7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0","base64":"ZXhwb3J0ICogZnJvbSAnLi9hY2Nlc3MtYXVkaXQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vYXV0aC1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9ib29raW5nLXJlcG9zaXRvcnknOwpleHBvcnQgKiBmcm9tICcuL2NsaWVudCc7CmV4cG9ydCAqIGZyb20gJy4vZW52JzsKZXhwb3J0ICogZnJvbSAnLi9lc3RhYmxpc2htZW50LXByb2ZpbGUtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vZm9ybWFsaXRlcy1wZXJzb25uZWwtZHJhZnQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLXJlcG9zaXRvcnknOwpleHBvcnQgewogIFBFUlNPTk5FTF9ISVNUT1JZX0NVVE9WRVJfVkVSU0lPTiwKICBQZXJzb25uZWxIaXN0b3J5Q3V0b3ZlckludGVncml0eUVycm9yLAogIFBlcnNvbm5lbEhpc3RvcnlDdXRvdmVyTm90Q29tcGxldGVkRXJyb3IsCiAgYXNzZXJ0UGVyc29ubmVsSGlzdG9yeUN1dG92ZXJDb21wbGV0ZWQsCiAgZ2V0UGVyc29ubmVsSGlzdG9yeVJldGVudGlvbkVsaWdpYmlsaXR5LAogIHJ1blBlcnNvbm5lbEhpc3RvcnlDdXRvdmVyLAogIHR5cGUgUGVyc29ubmVsSGlzdG9yeUN1dG92ZXJSZXN1bHQsCiAgdHlwZSBQZXJzb25uZWxIaXN0b3J5UmV0ZW50aW9uRWxpZ2liaWxpdHksCn0gZnJvbSAnLi9wZXJzb25uZWwtaGlzdG9yeS1jdXRvdmVyJzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwtcmVnaXN0ZXItcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcG9pbnRhZ2UtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLWFjdGlvbi1vdmVydmlldy1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwtZG9jdW1lbnQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLWNvbnRyYWN0LWFtZW5kbWVudC1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9yZXB1dGF0aW9uLXJldmlldy1zb2NpYWwtbGlua3MnOwpleHBvcnQgKiBmcm9tICcuL3JlcHV0YXRpb24tcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcmVzdGF1cmFudC1rbm93bGVkZ2UtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vc2NoZW1hJzsKZXhwb3J0ICogZnJvbSAnLi90ZW5hbnQtYWRhcHRlcnMnOwpleHBvcnQgKiBmcm9tICcuL3RlbmFudC1mb3VuZGF0aW9uLXJlcG9zaXRvcnknOwpleHBvcnQgKiBmcm9tICcuL3RlbmFudC11c2VyLXJlcG9zaXRvcnknOwpleHBvcnQgewogIGNyZWF0ZUZvcm1hbGl0ZXNMZWdhbFRlbXBsYXRlUmVwb3NpdG9yeSwKICB0eXBlIEZvcm1hbGl0ZXNMZWdhbFRlbXBsYXRlUmVwb3NpdG9yeSwKfSBmcm9tICcuL2Zvcm1hbGl0ZXMtbGVnYWwtdGVtcGxhdGUtcmVwb3NpdG9yeSc7CmV4cG9ydCB7CiAgRk9STUFMSVRFU19MRUdBTF9TT1VSQ0VfUFJPRklMRSwKICBGb3JtYWxpdGVzTGVnYWxUZW1wbGF0ZUVycm9yLAogIHR5cGUgRm9ybWFsaXRlc0xlZ2FsVGVtcGxhdGVFcnJvckNvZGUsCiAgdHlwZSBGb3JtYWxpdGVzVGVtcGxhdGVBcHBsaWNhYmlsaXR5LAp9IGZyb20gJy4vZm9ybWFsaXRlcy1sZWdhbC10ZW1wbGF0ZS1kb21haW4nOwo="}
{"path":"packages/db-cloud/src/schema/index.ts","byteLength":335,"sha256":"1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15","base64":"ZXhwb3J0ICogZnJvbSAnLi9hdXRoJzsKZXhwb3J0ICogZnJvbSAnLi9ib29raW5nJzsKZXhwb3J0ICogZnJvbSAnLi9mb3JtYWxpdGVzJzsKZXhwb3J0ICogZnJvbSAnLi9mb3JtYWxpdGVzLWxlZ2FsLXRlbXBsYXRlcyc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsJzsKZXhwb3J0ICogZnJvbSAnLi9wb2ludGFnZSc7CmV4cG9ydCAqIGZyb20gJy4vcmVwdXRhdGlvbic7CmV4cG9ydCAqIGZyb20gJy4vcmVzdGF1cmFudC1rbm93bGVkZ2UnOwpleHBvcnQgKiBmcm9tICcuL3JlbGF0aW9ucyc7CmV4cG9ydCAqIGZyb20gJy4vdGVuYW5jeSc7CmV4cG9ydCAqIGZyb20gJy4vdXNlcnMnOwo="}
{"path":"packages/db-cloud/src/schema/pointage.ts","byteLength":8900,"sha256":"19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6","base64":"aW1wb3J0IHsgc3FsIH0gZnJvbSAnZHJpenpsZS1vcm0nOwppbXBvcnQgewogIGNoZWNrLAogIGZvcmVpZ25LZXksCiAgaW5kZXgsCiAgaW50ZWdlciwKICBwZ1RhYmxlLAogIHByaW1hcnlLZXksCiAgdGltZXN0YW1wLAogIHVuaXF1ZSwKICB1bmlxdWVJbmRleCwKICB1dWlkLAogIHZhcmNoYXIsCn0gZnJvbSAnZHJpenpsZS1vcm0vcGctY29yZSc7CmltcG9ydCB7IHBlcnNvbm5lbEVtcGxveWVlRG9zc2llcnMgfSBmcm9tICcuL3BlcnNvbm5lbCc7CmltcG9ydCB7IGVzdGFibGlzaG1lbnRzLCBvcmdhbml6YXRpb25zIH0gZnJvbSAnLi90ZW5hbmN5JzsKaW1wb3J0IHsgdXNlcnMgfSBmcm9tICcuL3VzZXJzJzsKCmV4cG9ydCBjb25zdCBwb2ludGFnZUVtcGxveWVlQ3JlZGVudGlhbHMgPSBwZ1RhYmxlKAogICdwb2ludGFnZV9lbXBsb3llZV9jcmVkZW50aWFscycsCiAgewogICAgaWQ6IHV1aWQoJ2lkJykucHJpbWFyeUtleSgpLAogICAgb3JnYW5pemF0aW9uSWQ6IHV1aWQoJ29yZ2FuaXphdGlvbl9pZCcpCiAgICAgIC5ub3ROdWxsKCkKICAgICAgLnJlZmVyZW5jZXMoKCkgPT4gb3JnYW5pemF0aW9ucy5pZCwgeyBvbkRlbGV0ZTogJ3Jlc3RyaWN0JyB9KSwKICAgIGVzdGFibGlzaG1lbnRJZDogdXVpZCgnZXN0YWJsaXNobWVudF9pZCcpLm5vdE51bGwoKSwKICAgIHBlcnNvbm5lbERvc3NpZXJJZDogdXVpZCgncGVyc29ubmVsX2Rvc3NpZXJfaWQnKS5ub3ROdWxsKCksCiAgICBjcmVkZW50aWFsVmVyc2lvbjogaW50ZWdlcignY3JlZGVudGlhbF92ZXJzaW9uJykubm90TnVsbCgpLAogICAgY3JlZGVudGlhbEZvcm1hdFZlcnNpb246IGludGVnZXIoJ2NyZWRlbnRpYWxfZm9ybWF0X3ZlcnNpb24nKS5ub3ROdWxsKCksCiAgICBhbGdvcml0aG1WZXJzaW9uOiB2YXJjaGFyKCdhbGdvcml0aG1fdmVyc2lvbicsIHsgbGVuZ3RoOiAzMiB9KS5ub3ROdWxsKCksCiAgICBrZXlWZXJzaW9uOiBpbnRlZ2VyKCdrZXlfdmVyc2lvbicpLm5vdE51bGwoKSwKICAgIGxvb2t1cERpZ2VzdDogdmFyY2hhcignbG9va3VwX2RpZ2VzdCcsIHsgbGVuZ3RoOiA2NCB9KS5ub3ROdWxsKCksCiAgICBzYWx0OiB2YXJjaGFyKCdzYWx0JywgeyBsZW5ndGg6IDI0IH0pLm5vdE51bGwoKSwKICAgIHZlcmlmaWVyOiB2YXJjaGFyKCd2ZXJpZmllcicsIHsgbGVuZ3RoOiA0NCB9KS5ub3ROdWxsKCksCiAgICBpc3N1ZWRBdDogdGltZXN0YW1wKCdpc3N1ZWRfYXQnLCB7IHdpdGhUaW1lem9uZTogdHJ1ZSB9KS5ub3ROdWxsKCksCiAgICBpc3N1ZWRCeVVzZXJJZDogdXVpZCgnaXNzdWVkX2J5X3VzZXJfaWQnKS5yZWZlcmVuY2VzKCgpID0+IHVzZXJzLmlkLCB7CiAgICAgIG9uRGVsZXRlOiAnc2V0IG51bGwnLAogICAgfSksCiAgICBzdXBlcnNlZGVkQXQ6IHRpbWVzdGFtcCgnc3VwZXJzZWRlZF9hdCcsIHsgd2l0aFRpbWV6b25lOiB0cnVlIH0pLAogICAgc3VwZXJzZWRlZEJ5Q3JlZGVudGlhbElkOiB1dWlkKCdzdXBlcnNlZGVkX2J5X2NyZWRlbnRpYWxfaWQnKSwKICAgIHN1cGVyc2VkZWRCeVVzZXJJZDogdXVpZCgnc3VwZXJzZWRlZF9ieV91c2VyX2lkJykucmVmZXJlbmNlcygKICAgICAgKCkgPT4gdXNlcnMuaWQsCiAgICAgIHsKICAgICAgICBvbkRlbGV0ZTogJ3NldCBudWxsJywKICAgICAgfSwKICAgICksCiAgfSwKICAodGFibGUpID0+IFsKICAgIHVuaXF1ZSgncG9pbnRhZ2VfY3JlZGVudGlhbHNfc2NvcGVfaWRfdW5pcXVlJykub24oCiAgICAgIHRhYmxlLm9yZ2FuaXphdGlvbklkLAogICAgICB0YWJsZS5lc3RhYmxpc2htZW50SWQsCiAgICAgIHRhYmxlLmlkLAogICAgKSwKICAgIHVuaXF1ZUluZGV4KCdwb2ludGFnZV9jcmVkZW50aWFsc19oaXN0b3JpY2FsX2RpZ2VzdF91bmlxdWVfaWR4Jykub24oCiAgICAgIHRhYmxlLm9yZ2FuaXphdGlvbklkLAogICAgICB0YWJsZS5lc3RhYmxpc2htZW50SWQsCiAgICAgIHRhYmxlLmxvb2t1cERpZ2VzdCwKICAgICksCiAgICB1bmlxdWVJbmRleCgncG9pbnRhZ2VfY3JlZGVudGlhbHNfZG9zc2llcl92ZXJzaW9uX3VuaXF1ZV9pZHgnKS5vbigKICAgICAgdGFibGUub3JnYW5pemF0aW9uSWQsCiAgICAgIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgdGFibGUucGVyc29ubmVsRG9zc2llcklkLAogICAgICB0YWJsZS5jcmVkZW50aWFsVmVyc2lvbiwKICAgICksCiAgICB1bmlxdWVJbmRleCgncG9pbnRhZ2VfY3JlZGVudGlhbHNfb25lX2FjdGl2ZV9kb3NzaWVyX3VuaXF1ZV9pZHgnKQogICAgICAub24odGFibGUub3JnYW5pemF0aW9uSWQsIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwgdGFibGUucGVyc29ubmVsRG9zc2llcklkKQogICAgICAud2hlcmUoc3FsYCR7dGFibGUuc3VwZXJzZWRlZEF0fSBpcyBudWxsYCksCiAgICBpbmRleCgncG9pbnRhZ2VfY3JlZGVudGlhbHNfc2NvcGVfZG9zc2llcl9pZHgnKS5vbigKICAgICAgdGFibGUub3JnYW5pemF0aW9uSWQsCiAgICAgIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgdGFibGUucGVyc29ubmVsRG9zc2llcklkLAogICAgKSwKICAgIGZvcmVpZ25LZXkoewogICAgICBjb2x1bW5zOiBbdGFibGUub3JnYW5pemF0aW9uSWQsIHRhYmxlLmVzdGFibGlzaG1lbnRJZF0sCiAgICAgIGZvcmVpZ25Db2x1bW5zOiBbZXN0YWJsaXNobWVudHMub3JnYW5pemF0aW9uSWQsIGVzdGFibGlzaG1lbnRzLmlkXSwKICAgICAgbmFtZTogJ3BvaW50YWdlX2NyZWRlbnRpYWxzX2VzdGFibGlzaG1lbnRfc2NvcGVfZmsnLAogICAgfSkub25EZWxldGUoJ3Jlc3RyaWN0JyksCiAgICBmb3JlaWduS2V5KHsKICAgICAgY29sdW1uczogWwogICAgICAgIHRhYmxlLm9yZ2FuaXphdGlvbklkLAogICAgICAgIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgICB0YWJsZS5wZXJzb25uZWxEb3NzaWVySWQsCiAgICAgIF0sCiAgICAgIGZvcmVpZ25Db2x1bW5zOiBbCiAgICAgICAgcGVyc29ubmVsRW1wbG95ZWVEb3NzaWVycy5vcmdhbml6YXRpb25JZCwKICAgICAgICBwZXJzb25uZWxFbXBsb3llZURvc3NpZXJzLmVzdGFibGlzaG1lbnRJZCwKICAgICAgICBwZXJzb25uZWxFbXBsb3llZURvc3NpZXJzLmlkLAogICAgICBdLAogICAgICBuYW1lOiAncG9pbnRhZ2VfY3JlZGVudGlhbHNfZG9zc2llcl9zY29wZV9maycsCiAgICB9KS5vbkRlbGV0ZSgncmVzdHJpY3QnKSwKICAgIGZvcmVpZ25LZXkoewogICAgICBjb2x1bW5zOiBbCiAgICAgICAgdGFibGUub3JnYW5pemF0aW9uSWQsCiAgICAgICAgdGFibGUuZXN0YWJsaXNobWVudElkLAogICAgICAgIHRhYmxlLnN1cGVyc2VkZWRCeUNyZWRlbnRpYWxJZCwKICAgICAgXSwKICAgICAgZm9yZWlnbkNvbHVtbnM6IFt0YWJsZS5vcmdhbml6YXRpb25JZCwgdGFibGUuZXN0YWJsaXNobWVudElkLCB0YWJsZS5pZF0sCiAgICAgIG5hbWU6ICdwb2ludGFnZV9jcmVkZW50aWFsc19zdXBlcnNlZGVkX3Njb3BlX2ZrJywKICAgIH0pLm9uRGVsZXRlKCdyZXN0cmljdCcpLAogICAgY2hlY2soCiAgICAgICdwb2ludGFnZV9jcmVkZW50aWFsc192ZXJzaW9uc19jaGVjaycsCiAgICAgIHNxbGAke3RhYmxlLmNyZWRlbnRpYWxWZXJzaW9ufSA+IDAgYW5kICR7dGFibGUuY3JlZGVudGlhbEZvcm1hdFZlcnNpb259ID4gMCBhbmQgJHt0YWJsZS5rZXlWZXJzaW9ufSA+IDBgLAogICAgKSwKICAgIGNoZWNrKAogICAgICAncG9pbnRhZ2VfY3JlZGVudGlhbHNfbG9va3VwX2RpZ2VzdF9jaGVjaycsCiAgICAgIHNxbGAke3RhYmxlLmxvb2t1cERpZ2VzdH0gfiAnXlswLTlhLWZdezY0fSQnYCwKICAgICksCiAgICBjaGVjaygKICAgICAgJ3BvaW50YWdlX2NyZWRlbnRpYWxzX3N1cGVyc2VkZV9jb25zaXN0ZW5jeV9jaGVjaycsCiAgICAgIHNxbGAoJHt0YWJsZS5zdXBlcnNlZGVkQXR9IGlzIG51bGwgYW5kICR7dGFibGUuc3VwZXJzZWRlZEJ5Q3JlZGVudGlhbElkfSBpcyBudWxsIGFuZCAke3RhYmxlLnN1cGVyc2VkZWRCeVVzZXJJZH0gaXMgbnVsbCkgb3IgKCR7dGFibGUuc3VwZXJzZWRlZEF0fSBpcyBub3QgbnVsbCBhbmQgJHt0YWJsZS5zdXBlcnNlZGVkQnlDcmVkZW50aWFsSWR9IGlzIG5vdCBudWxsIGFuZCAke3RhYmxlLnN1cGVyc2VkZWRCeVVzZXJJZH0gaXMgbm90IG51bGwpYCwKICAgICksCiAgXSwKKTsKCmV4cG9ydCBjb25zdCBwb2ludGFnZUNyZWRlbnRpYWxSYXRlTGltaXRzID0gcGdUYWJsZSgKICAncG9pbnRhZ2VfY3JlZGVudGlhbF9yYXRlX2xpbWl0cycsCiAgewogICAgb3JnYW5pemF0aW9uSWQ6IHV1aWQoJ29yZ2FuaXphdGlvbl9pZCcpLm5vdE51bGwoKSwKICAgIGVzdGFibGlzaG1lbnRJZDogdXVpZCgnZXN0YWJsaXNobWVudF9pZCcpLm5vdE51bGwoKSwKICAgIGtleUtpbmQ6IHZhcmNoYXIoJ2tleV9raW5kJywgeyBsZW5ndGg6IDE2IH0pLm5vdE51bGwoKSwKICAgIGtleURpZ2VzdDogdmFyY2hhcigna2V5X2RpZ2VzdCcsIHsgbGVuZ3RoOiA2NCB9KS5ub3ROdWxsKCksCiAgICB3aW5kb3dTdGFydGVkQXQ6IHRpbWVzdGFtcCgnd2luZG93X3N0YXJ0ZWRfYXQnLCB7CiAgICAgIHdpdGhUaW1lem9uZTogdHJ1ZSwKICAgIH0pLm5vdE51bGwoKSwKICAgIGZhaWx1cmVDb3VudDogaW50ZWdlcignZmFpbHVyZV9jb3VudCcpLm5vdE51bGwoKSwKICAgIGJsb2NrZWRVbnRpbDogdGltZXN0YW1wKCdibG9ja2VkX3VudGlsJywgeyB3aXRoVGltZXpvbmU6IHRydWUgfSksCiAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCgndXBkYXRlZF9hdCcsIHsgd2l0aFRpbWV6b25lOiB0cnVlIH0pLm5vdE51bGwoKSwKICB9LAogICh0YWJsZSkgPT4gWwogICAgcHJpbWFyeUtleSh7CiAgICAgIGNvbHVtbnM6IFsKICAgICAgICB0YWJsZS5vcmdhbml6YXRpb25JZCwKICAgICAgICB0YWJsZS5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgdGFibGUua2V5S2luZCwKICAgICAgICB0YWJsZS5rZXlEaWdlc3QsCiAgICAgIF0sCiAgICAgIG5hbWU6ICdwb2ludGFnZV9yYXRlX2xpbWl0c19zY29wZV9rZXlfcGsnLAogICAgfSksCiAgICBmb3JlaWduS2V5KHsKICAgICAgY29sdW1uczogW3RhYmxlLm9yZ2FuaXphdGlvbklkLCB0YWJsZS5lc3RhYmxpc2htZW50SWRdLAogICAgICBmb3JlaWduQ29sdW1uczogW2VzdGFibGlzaG1lbnRzLm9yZ2FuaXphdGlvbklkLCBlc3RhYmxpc2htZW50cy5pZF0sCiAgICAgIG5hbWU6ICdwb2ludGFnZV9yYXRlX2xpbWl0c19lc3RhYmxpc2htZW50X3Njb3BlX2ZrJywKICAgIH0pLm9uRGVsZXRlKCdyZXN0cmljdCcpLAogICAgY2hlY2soCiAgICAgICdwb2ludGFnZV9yYXRlX2xpbWl0c19rZXlfa2luZF9jaGVjaycsCiAgICAgIHNxbGAke3RhYmxlLmtleUtpbmR9IGluICgnY2FuZGlkYXRlJywgJ2NsaWVudCcpYCwKICAgICksCiAgICBjaGVjaygKICAgICAgJ3BvaW50YWdlX3JhdGVfbGltaXRzX2RpZ2VzdF9jaGVjaycsCiAgICAgIHNxbGAke3RhYmxlLmtleURpZ2VzdH0gfiAnXlswLTlhLWZdezY0fSQnYCwKICAgICksCiAgICBjaGVjaygKICAgICAgJ3BvaW50YWdlX3JhdGVfbGltaXRzX2ZhaWx1cmVfY291bnRfY2hlY2snLAogICAgICBzcWxgJHt0YWJsZS5mYWlsdXJlQ291bnR9ID49IDBgLAogICAgKSwKICBdLAopOwoKZXhwb3J0IGNvbnN0IHBvaW50YWdlU2VjdXJpdHlBdWRpdEV2ZW50cyA9IHBnVGFibGUoCiAgJ3BvaW50YWdlX3NlY3VyaXR5X2F1ZGl0X2V2ZW50cycsCiAgewogICAgaWQ6IHV1aWQoJ2lkJykucHJpbWFyeUtleSgpLAogICAgb3JnYW5pemF0aW9uSWQ6IHV1aWQoJ29yZ2FuaXphdGlvbl9pZCcpLm5vdE51bGwoKSwKICAgIGVzdGFibGlzaG1lbnRJZDogdXVpZCgnZXN0YWJsaXNobWVudF9pZCcpLm5vdE51bGwoKSwKICAgIGV2ZW50VHlwZTogdmFyY2hhcignZXZlbnRfdHlwZScsIHsgbGVuZ3RoOiA4MCB9KS5ub3ROdWxsKCksCiAgICBvdXRjb21lOiB2YXJjaGFyKCdvdXRjb21lJywgeyBsZW5ndGg6IDE2IH0pLm5vdE51bGwoKSwKICAgIHJlYXNvbkNvZGU6IHZhcmNoYXIoJ3JlYXNvbl9jb2RlJywgeyBsZW5ndGg6IDQwIH0pLAogICAgbWFuYWdlclVzZXJJZDogdXVpZCgnbWFuYWdlcl91c2VyX2lkJykucmVmZXJlbmNlcygoKSA9PiB1c2Vycy5pZCwgewogICAgICBvbkRlbGV0ZTogJ3NldCBudWxsJywKICAgIH0pLAogICAgcGVyc29ubmVsRG9zc2llcklkOiB1dWlkKCdwZXJzb25uZWxfZG9zc2llcl9pZCcpLAogICAgY3JlZGVudGlhbElkOiB1dWlkKCdjcmVkZW50aWFsX2lkJyksCiAgICBjcmVkZW50aWFsVmVyc2lvbjogaW50ZWdlcignY3JlZGVudGlhbF92ZXJzaW9uJyksCiAgICByZXF1ZXN0ZWRPcGVyYXRpb246IHZhcmNoYXIoJ3JlcXVlc3RlZF9vcGVyYXRpb24nLCB7IGxlbmd0aDogNjQgfSksCiAgICBvY2N1cnJlZEF0OiB0aW1lc3RhbXAoJ29jY3VycmVkX2F0JywgeyB3aXRoVGltZXpvbmU6IHRydWUgfSkubm90TnVsbCgpLAogIH0sCiAgKHRhYmxlKSA9PiBbCiAgICBpbmRleCgncG9pbnRhZ2VfYXVkaXRfc2NvcGVfdGltZV9pZHgnKS5vbigKICAgICAgdGFibGUub3JnYW5pemF0aW9uSWQsCiAgICAgIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgdGFibGUub2NjdXJyZWRBdCwKICAgICksCiAgICBmb3JlaWduS2V5KHsKICAgICAgY29sdW1uczogW3RhYmxlLm9yZ2FuaXphdGlvbklkLCB0YWJsZS5lc3RhYmxpc2htZW50SWRdLAogICAgICBmb3JlaWduQ29sdW1uczogW2VzdGFibGlzaG1lbnRzLm9yZ2FuaXphdGlvbklkLCBlc3RhYmxpc2htZW50cy5pZF0sCiAgICAgIG5hbWU6ICdwb2ludGFnZV9hdWRpdF9lc3RhYmxpc2htZW50X3Njb3BlX2ZrJywKICAgIH0pLm9uRGVsZXRlKCdyZXN0cmljdCcpLAogICAgZm9yZWlnbktleSh7CiAgICAgIGNvbHVtbnM6IFsKICAgICAgICB0YWJsZS5vcmdhbml6YXRpb25JZCwKICAgICAgICB0YWJsZS5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgdGFibGUucGVyc29ubmVsRG9zc2llcklkLAogICAgICBdLAogICAgICBmb3JlaWduQ29sdW1uczogWwogICAgICAgIHBlcnNvbm5lbEVtcGxveWVlRG9zc2llcnMub3JnYW5pemF0aW9uSWQsCiAgICAgICAgcGVyc29ubmVsRW1wbG95ZWVEb3NzaWVycy5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgcGVyc29ubmVsRW1wbG95ZWVEb3NzaWVycy5pZCwKICAgICAgXSwKICAgICAgbmFtZTogJ3BvaW50YWdlX2F1ZGl0X2Rvc3NpZXJfc2NvcGVfZmsnLAogICAgfSkub25EZWxldGUoJ3Jlc3RyaWN0JyksCiAgICBmb3JlaWduS2V5KHsKICAgICAgY29sdW1uczogWwogICAgICAgIHRhYmxlLm9yZ2FuaXphdGlvbklkLAogICAgICAgIHRhYmxlLmVzdGFibGlzaG1lbnRJZCwKICAgICAgICB0YWJsZS5jcmVkZW50aWFsSWQsCiAgICAgIF0sCiAgICAgIGZvcmVpZ25Db2x1bW5zOiBbCiAgICAgICAgcG9pbnRhZ2VFbXBsb3llZUNyZWRlbnRpYWxzLm9yZ2FuaXphdGlvbklkLAogICAgICAgIHBvaW50YWdlRW1wbG95ZWVDcmVkZW50aWFscy5lc3RhYmxpc2htZW50SWQsCiAgICAgICAgcG9pbnRhZ2VFbXBsb3llZUNyZWRlbnRpYWxzLmlkLAogICAgICBdLAogICAgICBuYW1lOiAncG9pbnRhZ2VfYXVkaXRfY3JlZGVudGlhbF9zY29wZV9maycsCiAgICB9KS5vbkRlbGV0ZSgncmVzdHJpY3QnKSwKICAgIGNoZWNrKAogICAgICAncG9pbnRhZ2VfYXVkaXRfZXZlbnRfdHlwZV9jaGVjaycsCiAgICAgIHNxbGAke3RhYmxlLmV2ZW50VHlwZX0gaW4gKCdwb2ludGFnZS5jcmVkZW50aWFsLmlzc3VlZCcsICdwb2ludGFnZS5jcmVkZW50aWFsLnJlc2V0JywgJ3BvaW50YWdlLmNyZWRlbnRpYWwuc3VwZXJzZWRlZCcsICdwb2ludGFnZS5jcmVkZW50aWFsLmF1dGhlbnRpY2F0aW9uX3N1Y2NlZWRlZCcsICdwb2ludGFnZS5jcmVkZW50aWFsLmF1dGhlbnRpY2F0aW9uX2RlbmllZCcsICdwb2ludGFnZS5jcmVkZW50aWFsLnJhdGVfbGltaXRlZCcsICdwb2ludGFnZS5hdXRob3JpemF0aW9uLmRlbmllZCcsICdwb2ludGFnZS5ldmlkZW5jZV9lbGlnaWJpbGl0eS5kZW5pZWQnKWAsCiAgICApLAogICAgY2hlY2soCiAgICAgICdwb2ludGFnZV9hdWRpdF9vdXRjb21lX2NoZWNrJywKICAgICAgc3FsYCR7dGFibGUub3V0Y29tZX0gaW4gKCdzdWNjZWVkZWQnLCAnZGVuaWVkJylgLAogICAgKSwKICAgIGNoZWNrKAogICAgICAncG9pbnRhZ2VfYXVkaXRfcmVhc29uX2NvZGVfY2hlY2snLAogICAgICBzcWxgJHt0YWJsZS5yZWFzb25Db2RlfSBpcyBudWxsIG9yICR7dGFibGUucmVhc29uQ29kZX0gaW4gKCdpbnZhbGlkX2NyZWRlbnRpYWwnLCAnc3VwZXJzZWRlZF9jcmVkZW50aWFsJywgJ3Vuc3VwcG9ydGVkX3ZlcnNpb24nLCAncmF0ZV9saW1pdGVkJywgJ3Njb3BlX25vdF9yZXNvbHZlZCcsICdjbGllbnRfYWRkcmVzc191bnRydXN0ZWQnLCAnb3BlcmF0aW9uX25vdF9ncmFudGVkJywgJ2Rvc3NpZXJfbm90X2luX3Njb3BlJywgJ2JlZm9yZV9lbnRyeScsICdhZnRlcl9kZXBhcnR1cmUnKWAsCiAgICApLAogICAgY2hlY2soCiAgICAgICdwb2ludGFnZV9hdWRpdF9jcmVkZW50aWFsX3ZlcnNpb25fY2hlY2snLAogICAgICBzcWxgJHt0YWJsZS5jcmVkZW50aWFsVmVyc2lvbn0gaXMgbnVsbCBvciAke3RhYmxlLmNyZWRlbnRpYWxWZXJzaW9ufSA+IDBgLAogICAgKSwKICBdLAopOwoKZXhwb3J0IHR5cGUgUG9pbnRhZ2VFbXBsb3llZUNyZWRlbnRpYWwgPQogIHR5cGVvZiBwb2ludGFnZUVtcGxveWVlQ3JlZGVudGlhbHMuJGluZmVyU2VsZWN0OwpleHBvcnQgdHlwZSBOZXdQb2ludGFnZUVtcGxveWVlQ3JlZGVudGlhbCA9CiAgdHlwZW9mIHBvaW50YWdlRW1wbG95ZWVDcmVkZW50aWFscy4kaW5mZXJJbnNlcnQ7CmV4cG9ydCB0eXBlIFBvaW50YWdlU2VjdXJpdHlBdWRpdEV2ZW50ID0KICB0eXBlb2YgcG9pbnRhZ2VTZWN1cml0eUF1ZGl0RXZlbnRzLiRpbmZlclNlbGVjdDsKZXhwb3J0IHR5cGUgTmV3UG9pbnRhZ2VTZWN1cml0eUF1ZGl0RXZlbnQgPQogIHR5cGVvZiBwb2ludGFnZVNlY3VyaXR5QXVkaXRFdmVudHMuJGluZmVySW5zZXJ0Owo="}
```

### Full baseline path and SHA-256 inventory

Exact `git ls-files --cached --others --exclude-standard` union, deduplicated,
existing files only, sorted ordinal by repository-relative path. Raw bytes read
with .NET ReadAllBytes and SHA256.HashData; no text normalization.
Each line is path, TAB, lowercase SHA-256.

```text
.agents/skills/.openspec-target	243b0dc9b847e66c440dca985e10fe0ce9e29c379b018ddd5747ba8948f84cc8
.agents/skills/openspec-apply-change/SKILL.md	7c79315715da88639e60f05268206ba72939ef9bf298c6f3195152d09d20b3fe
.agents/skills/openspec-archive-change/SKILL.md	e0ffaacdb982e7440e97979422a91178cc93220a5805bd07cbdaef82c33284ac
.agents/skills/openspec-continue-change/SKILL.md	0176d962032c6c36011db0ef30c1cd6130ef6c34ebf359d64cdb21c958949972
.agents/skills/openspec-explore/SKILL.md	95ed31936b538cbf44b5e3f7f81da50defd256d96048ee370d82b36e8ff5c486
.agents/skills/openspec-new-change/SKILL.md	84374cb8ab0c6e076933126f688bc7f59abdfa7aced7bb710743dd3bf72e3383
.agents/skills/openspec-propose/SKILL.md	0c95777dd8cc28f52dc4d6e2a51beeb1917a6638bed51baa710735721784d731
.agents/skills/openspec-sync-specs/SKILL.md	da0ae40869be60ceff6cd231c75976487875675a7eca390b61a932b081aa91d4
.agents/skills/openspec-update-change/SKILL.md	23bd9d7d95cc34caee693f7f3671ec8d49f8eca436483d3e29bea43e511b87d5
.agents/skills/openspec-verify-change/SKILL.md	a049b171b9728a684d901f5e0d6f523bdcd768bc083277a1f6bb9b556cd24b9c
.agents/skills/yuta-finish-change/SKILL.md	90522895c23e6d4e7943344e915be94cdfe15a40bc7b3951387e349e3225ce8f
.agents/skills/yuta-run-change/SKILL.md	ea82819f0ae07ea24e58169c3b33fe7ad2b1140b5ca91b9cbad81389e9ef0f70
.dockerignore	7c9724a0e6be248447796522cfb402b3c9e30134965e20042b7c0e5d808d11c4
.github/copilot-instructions.md	6b8698ac44ee47b814a0eaa204c4337783bd2d04a098ba4d6be5a9789b4fe721
.github/dependabot.yml	5af11d03242a49487e18ea7ef354366a65902640bec2509803ba93ce5bb6cdb6
.github/pull_request_template.md	261b60e2b621fc8dfc4ef3ea5e338542b6f01f7ad66ea586c028876409269f16
.github/workflows/ci.yml	0f738c855e627da68f9304754117488744a4d2fa2e39e9dc0db6c5b71da5702e
.gitignore	31262a06e1e330502c323eda7ac811cdcd8bd6e9e2b10c0c73bd6ca60543351b
.nvmrc	98182b41c9ce3357797985cf12dc3b0124490ef88bc918a905373e7688e6aec9
.prettierignore	cbe3ace3ff048bcd511979935f4e76c38e6bc19837748ac8bb202941d3799fd8
.prettierrc.json	6042ecc6dbbe2e938bdc2a1d149406ad2f8812e7c6519d6ce8e6cc030049c77f
AGENTS.md	9e93a58dcdf6127660388ae073817fbac1df0b73be1e8fff9da9187e5cd9065b
README.md	5404c00ca3032a34137096edd34a6b4997e2c460d02ded3a63b8f224b9a74ef8
apps/backoffice/.env.example	54939888ecb8ba5483b9fdbc9b1abb0dff44b8fc02d1c5c9ffc7d38de77d1ad7
apps/backoffice/AGENTS.md	88924be9011e509f4924f895a522304d3a9132124798f5406105c5475eec70c8
apps/backoffice/next.config.ts	b13be70099048cda4b8ec4f0993ca7b331fa47cde1a960b2c5ab1be5c8cfab6c
apps/backoffice/package.json	cc0b0843f6eda71064ce81775de568837bd414bac83f33843b4c77c4d77cbf4f
apps/backoffice/postcss.config.mjs	9ca55411b62b2c9cc5631a3e6c631d80c8b8171c7b9ea1e19f83400f4100e910
apps/backoffice/public/creative-studio/bao-poster.png	d8c2c405a4eafec3ee5fc37fc2cbc73bc30acb441e9990c22b4410e5ff1fb3b5
apps/backoffice/public/creative-studio/menu-poster.png	44d5177ab3ec2a8534f76081687fa95f9da2e71c1a5faf2ec872152b0931c2fd
apps/backoffice/public/creative-studio/pho-poster.png	91bb4c9e2fa6faf1acab56c33591edaca5f740aee34d8517b16cd6123fbb2311
apps/backoffice/public/creative-studio/rolls-poster.png	4f80449333855baf12687516750172f9549824e5e646cc1b9c784935ef4787c8
apps/backoffice/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/backoffice/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/backoffice/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/backoffice/public/images/logo-slogan.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/backoffice/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/backoffice/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/backoffice/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/backoffice/public/site.webmanifest	1d9097cb396e48230395004c8a676357a210346f076e747467a1a923670177e4
apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py	6ddbd29046cbff645bd546e472f04cac010d7e6d53c84ed9a67f0ca04201bff2
apps/backoffice/scripts/requirements-contract-evaluation.txt	9c1813047fa521f9691c11d1a38c83a6140ad7a96ee12800a20c9c658e9cda59
apps/backoffice/src/app/(authenticated)/actions.ts	0ec6d714705bcaf259b3dee82c5dfcd79367e539ade63e681f0e72b91b1dcb59
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-dashboard.tsx	2069802318757f0d5b7831acb365f1902587e00c9df78a2865ba6dc4f91cc386
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-reservations-panel.tsx	2c58272bc61a87b29c30ad460e0d190bfbf40a4c49bb57bcb446e81cb79d2223
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-reviews-panel.tsx	26dfcda4411757bda39a50a04e971063dc2ba1517f6d9b1f7fe5787e113e6ba2
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-section-unavailable.tsx	2cb7681ac9294f5136bb297ce02cbafdba4df5d9a04d795af1ee1c342b57a070
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-services-panel.tsx	8662da6387fe2ce80c2e268bcffd396ccc9be5dbf3e219b238897f3ff6ddee49
apps/backoffice/src/app/(authenticated)/aujourdhui/_components/today-summary-cards.tsx	6be74cb347610d79924dfc0d9e888573303f9deeb5613fe1480fe1873e1ffc50
apps/backoffice/src/app/(authenticated)/aujourdhui/error.tsx	170784e44ddef18f685abdd66fa671148b6ede18b0edb91c9753006cc75b054a
apps/backoffice/src/app/(authenticated)/aujourdhui/loading.tsx	d0e2d8350b7c15928849f149f0224c40e49d676f5dfe7a2c4a4f9e75ad91dec9
apps/backoffice/src/app/(authenticated)/aujourdhui/page.tsx	e5979359777537888c7fecaf679fa225180545d452836d907b24580350c3234b
apps/backoffice/src/app/(authenticated)/aujourdhui/today-data.ts	11c7d7eb2a0c4fc1a7e085d335049f0e96c013c077542c1110d20cb2b7965ee9
apps/backoffice/src/app/(authenticated)/aujourdhui/today-view-model.ts	5d0ae679c4f703a2aca9857eb1af7932222f7f87851be8623d3d2a136b26d7ba
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-content.tsx	c3e49f1c8d670f997e539b62a9d8f2359e0436d73fa67c8af3b9aa5ecaec44ad
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-details.tsx	deb841ed05d2d17bf3840ae2950f97ae7bf7f19a5fd25d831a93241d6695d176
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-header.tsx	5ce577b13c061b6d10ab49ebe121697a918264a2af2ee8e1528e48042425e532
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-overview.tsx	3bf1a54dbd830903f34a893b06776565c5f9ad9cf0e14bb53f13ecc4ce8a2bb3
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-page.tsx	b1817fd66893c1975e30bf3d415abb498c9f6b82e84dd2f5aca511adc2381a56
apps/backoffice/src/app/(authenticated)/conformite/veille/_components/compliance-summary.tsx	f8b01cb5a258a9e6a5fdd1533220e3696ac6a7809ec8b81d303dd7d4b66e802b
apps/backoffice/src/app/(authenticated)/conformite/veille/compliance-fixtures.ts	bb5c1f478733c7ebbf04d80f856e73191d7da0ca632372792f394aacdf1db6bf
apps/backoffice/src/app/(authenticated)/conformite/veille/compliance-model.ts	4e0ca965e09bbb66bb1da1bc0d51103ef8232ffd8bdf2c6f2fa784295b42f3f1
apps/backoffice/src/app/(authenticated)/conformite/veille/page.tsx	d3edcc3855187f4ef7c7d6bc25efb8eff5c5452504fb58f29b96e3ff465b063e
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions.ts	41d0ed0dbf7bb71e8c0d111e154a1daefc8c86ceb96b744b8bd0282694644b76
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx	f79f9cc3c86cca0dafaaa2bd79f0fb2fad9c28a7d3c7f3e8012940fa50fb8c72
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype.tsx	4a7a9272d145e8f887c1a72a4dda0a43773b2713ee7721a7c268f16b21d5e406
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-readiness-prototype.tsx	89cdfceaa840a0ce2f939aef5f4f77ff1ef8d27b8cb79e5269d3f64e96ea52c1
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx	213ed3ea2206a687f6be5264e4e726396d12f5041899930230070ec8d5e4ca28
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model.ts	bb2679be6919f0af8bd9a9b3a925387cd5031edfa63005a8eddaf5cdee5ddf31
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-prototype.ts	c186e16f54a16d0447a727583166123df1498f83193efda9b97e258603c574cb
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state.ts	49d62b72661ff2282cd880a0c055db093084e1756ce773102b9089163a504ded
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.test.ts	47cef2ab0dff23c210e89f1ce9898d4ebe21555b0d149c54de283d3a6bd5c438
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.ts	8e68816d2e69b7ef373806a10bc313dd12650b7f651b2a1ff8e7be3b3f99eb50
apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/page.tsx	dca3e2bd45570847b95117ffe9c3acc7a332d08dd0a3383f2974d65f34326fe4
apps/backoffice/src/app/(authenticated)/equipe/layout.tsx	37708f81b888d17299b9bb5f0f25547c7d0b290632dd0f82d90bd31ab24690e9
apps/backoffice/src/app/(authenticated)/equipe/planning/page.tsx	368a201ee13a48de2ae2ceff70d932bf7a89f3d899a967ab060caa43c1620023
apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx	f2fe5f9ccf167aaf4be6233046ce3765b385c3d452e2b8cd6e1314108fb85307
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/_components/personnel-register-page.tsx	e2f60ce33d186e820473353503088bfac86dd7703465862935c96d696733f116
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/_lib/personnel-register-runtime.ts	a4d1fdc1131dc6108656c6dab7370822fad01f46edaf9155b75e980b0571f52b
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/actions.ts	beaa33e1847c6a3fb8ff70c85cda8b5bcc5a5fa88edc325a7e684992e56fb974
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/error.tsx	b5209c4f259bd523ba72de1e7b5dcf9b49427f21cdb475fd63709f2467c0792e
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/loading.tsx	b7dbe8d313da7ac7a859c693bf4134fd6022b37d10a68b20da40972b82d57b7e
apps/backoffice/src/app/(authenticated)/equipe/registre-personnel/page.tsx	4141a634876d03bf7d3085f146a6e1467fa0e9fe21fe90c5dfcdd952bb755359
apps/backoffice/src/app/(authenticated)/equipe/salaries/[employeeId]/page.tsx	a4d3aafc557f428d1d40b8d9e3ba6d100f3212154043ac81b4d50fe688630471
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/contract-extraction-prototype.tsx	df3e9df8c409aa1e759e5a6a32e1160f2fea1676b7e8edb9369b94ee60005eff
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-action-overview.test.ts	e1d0fb4e4739bab99f82ed1c4a38acf652729fbce8195594666069a3eb141724
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-action-overview.tsx	bc0efc776abd4fc6b626f317ce075d344aa61b2fecd912715d2a56276a189977
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-amendments.tsx	b2e66908d8db6afc1736d7e89261f835b3626342f5c753a4f2a34da4733adf16
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-create-dialog.tsx	1c436e0ce02c6c37207c202778a84a31fb9a955a27940225c6d858d58dbeeec2
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-departure-dialog.tsx	d7b0eeb3600c66f2f01eb4a44d73bfeb2901cc930fcebdab68e24a822e83b1bb
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-documents.tsx	d72805f6c6ddfcc0089f63be1cfce4de493cb4973b9d2e078a6604d604bf476d
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-edit-dialog.tsx	2d9f00c5cfd3c5ff82aea290e297cdda50b41d871ce46159eddf84f976b9a8e5
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-employment-details.test.tsx	b2f057e14e44c70417496819a14f73f33d513bf674637f21b53ce098f6b7409f
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-employment-details.tsx	78458acf125b63039ca6acdce83e8f1c5548c853492ff110e28aaa3632257fae
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history-metadata-fields.tsx	5c0fc96862a6be7e0d9b64d73bc819df502e83412e84d506c1a941e83a0a0cd5
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/employee-history.tsx	c3cc34819b7ad786f7b17201384df9682faddb2feab4a84807664a17373ebdf0
apps/backoffice/src/app/(authenticated)/equipe/salaries/_components/salaries-page.tsx	75dd06e0e53681c452e0e877dcaa3f657b6a622b0a8c2437529e101aff6f6d6c
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/contract-extraction-prototype-runtime.test.ts	3b0c49d858a11dd80d93edca33544d0e7e3f9f80970ce9448e409dbd5aad006a
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/contract-extraction-prototype-runtime.ts	9ebd410c3fdf8ab50def1a7f8f5f60bffbb229993cefe568c17fc13f25b34133
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-amendments.test.ts	90ca89054b953816ad4d06ed0d9d6d9f0b61590ff0052cdd7ca471554af0146b
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-amendments.ts	08fa334106353eef9f87d65304d2e9721f1deabaea47e99f4abb8ce5158e29f5
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-create-flow.test.ts	f9715b3960fee1ce1404bf3d7f76f100e6693c30e429d84651cc090a33281c41
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-create-flow.ts	fa06c35d36e2c3f84ba54c6a8f8166af706d2500ffa767264e972c73e8f1af86
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.test.ts	d7516ae5ed1bd52f41ff16ba7f6c3260faa098bb9d216fcaf5349c929287ad7b
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow.ts	84e9b4c827bfbb23cc880e3681918d577a159a1021e11f850cb55aabd75bee5b
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-employment.test.ts	0e8860a77cb9a0f9dad075a235a10f77a65a42f59fbee8ac046c4bf0114cf5c7
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-employment.ts	46f866a55ec4357c78a6fbf1578818f29600ce1cfdcf1cbc221f7c372c9509d4
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-action-errors.ts	49902e23f172425b835c995a40e18ef856269972ec73e49a2ec0e26fd4974c9c
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-presentation.ts	54c7fbb2c10d9f80968736fee39da2d2c38aec75c5168cf24b1d4a58f0ee34a9
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.test.ts	6d91d38d1b2352291f8fdd9ef700a92370d29328fc753196aa9b3265fbb02efc
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/employee-history-refresh.ts	eaf639c4b14c6871b27955585d0e21bd2638444989e8f45c7c4b00e2e040e616
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/personnel-action-overview-runtime.test.ts	affe85ba3db96dcee5a1836fc52f0541f549d4241e46706d10130dfd558b2987
apps/backoffice/src/app/(authenticated)/equipe/salaries/_lib/personnel-action-overview-runtime.ts	951b6cc04e652d93e514a58b54ae0c81ae050769de79bdc384110919da4b436d
apps/backoffice/src/app/(authenticated)/equipe/salaries/actions.ts	21a48e154ad23ec84c4cf0e0b828f6cb3741b3e8b0a92bc33e7c65388e99c240
apps/backoffice/src/app/(authenticated)/equipe/salaries/contract-extraction-prototype-model.test.ts	9b8d9e8b3431316a9ed778bf2cdf31841e4933dbbdf1bc772bf0d365a3e7c1dc
apps/backoffice/src/app/(authenticated)/equipe/salaries/contract-extraction-prototype-model.ts	fe88b92e7aca3b954bc2a496e71170f223899bcfbd65e8b9b42e1b12a4af0f0a
apps/backoffice/src/app/(authenticated)/equipe/salaries/employee-action-overview-model.ts	d70923e44a98db6ee29910386c13bd751c7bd7989e9f0c135f76686134d413a7
apps/backoffice/src/app/(authenticated)/equipe/salaries/employee-documents-model.ts	e31ad8622fee9d265c48d45e2e4ab2f10efc4a8563d4c8f807d0a770e90e60eb
apps/backoffice/src/app/(authenticated)/equipe/salaries/employee-documents.test.ts	b617f28d5499a466824c587fd5a86ae6ae5bfa66124ff9970a3121a57fec1c2f
apps/backoffice/src/app/(authenticated)/equipe/salaries/error.tsx	31708bef2564c7dc3b4fa224c13d007dde4fe11f633879b8dbc2a6fee2591a5d
apps/backoffice/src/app/(authenticated)/equipe/salaries/loading.tsx	8a2766c2cb4a8ca772748ae230532c33ff058f2b148ed63ee8929a857e3a3bc8
apps/backoffice/src/app/(authenticated)/equipe/salaries/page.tsx	c452ac950819b2b4703c94efd653ddbc88482dd4b49c978d1bf8fb9800ce60fb
apps/backoffice/src/app/(authenticated)/equipe/salaries/salaries-model.test.ts	5ead2d757e4b759c947b74ff978df84f4e4a94788ee89fc58475229794066942
apps/backoffice/src/app/(authenticated)/equipe/salaries/salaries-model.ts	f6709bf6bcd2774b7d7af9f8c3ec4e11c91c3bc4c9937f02cf80f2ac2c9261b2
apps/backoffice/src/app/(authenticated)/equipe/taches-quotidiennes/page.tsx	40f3ba55379b6315072496def723cd1ba16e5bde6c9816acca65c4f8179497e5
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-administration-action-feedback.tsx	aa93379e543247cd020408679653064123e360eddca3ac6ed33d916f4d689ce8
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-administration-delete-button.tsx	d41d23f64ed05dd3462f75d53b973f6fe0bc18cf659eb6aa4f6f857de98bc342
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-exception-fields.tsx	4c11533f9075c5a3cb6145c7de7c62f924a458070d9dd179a51d09a3e3d510cb
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-exception-form.tsx	a4e061bd0704c2437e206a5dc7fcc0ac98f4370850b40d84335c2782b4268358
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-exception-list.tsx	26771c192a0fe2e965f37d9f7e3998cc4a973db84e7f60ddee5604929df76dff
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-exceptions-panel.tsx	4316c2691abba195615306c4ddfb9303ab5dc141877ec8e140c265b7a1c153a2
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-public-information-fields.tsx	f6430a2045a8dc45f9a20372694deea71d287cbf0df0eef5ab158a7d08cd6605
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-rule-fields.tsx	576f0bfe909e5aa592f5334f402858aa5e252862ef8226247765bd6a686527ba
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-rules-form.tsx	c0f75380e4de4502f1f269de578e9a278bd400a9e43c3fe8d9ccab65b409753d
apps/backoffice/src/app/(authenticated)/etablissement/_components/booking-service-period-forms.tsx	be6394990d5c39dda89f08ba32fba91658b68d3538a2011eec1a0e11db7a882a
apps/backoffice/src/app/(authenticated)/etablissement/booking-administration-action-state.ts	5d35d93968b36dd36fba4c62ac37b86fd8108780d4738399c463a0e3680c9f04
apps/backoffice/src/app/(authenticated)/etablissement/booking-administration-model.ts	c0b3facd04abb0dcc76f31a1cd4c600d595928bb7898d5521294851c0aefd3f3
apps/backoffice/src/app/(authenticated)/etablissement/booking-exception-actions.ts	6341710c066501d90f199651e06dbb64aa86f3c3666a23f2faf7664694139374
apps/backoffice/src/app/(authenticated)/etablissement/booking-schedule-view-model.ts	2b88c003405b67553777af83453a6c84017f396d08622b01d9bcc5e5ae029391
apps/backoffice/src/app/(authenticated)/etablissement/booking-service-period-actions.ts	1f9814e80d59413727d4255dca3412dfb4594bb88d25823bfee1b9cf6a148daf
apps/backoffice/src/app/(authenticated)/etablissement/booking-settings-actions.ts	5f400f13de94e2c65a82148d46db0d0b1a2062ce2e8ed54df881facc9120b315
apps/backoffice/src/app/(authenticated)/etablissement/carte-menus/page.tsx	1d4c3b2700f7a37d83e46327c02e8c851259ddd1a11f58e51a2918e73fef665b
apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/_components/weekly-schedule-section.tsx	4e834a4db942b8f28b16248ab8799b264215a8679285bd155fdc0f5f9347b2ea
apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/error.tsx	9f12ed391d677033bd9e0d88f2f5f897255564bcffa6d2858ca707b2bd7c7c46
apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/loading.tsx	4ce36038c405d2c059d94f0e2c0de089d9e6852249e341ee9637dd8f181f5517
apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/page.tsx	bd6f9d714e03efa4cf0de9d3dcc88f097a60af4765c9777fa260f93a612ef48c
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields.tsx	b59d7365f380e90cbc4fe52c0c117e85a87e4532635b8602450dd1db148dc595
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx	f0b71356c8fb9b1394409edcfd8c4ebd091e233af2fe0e92b2b3e977345500aa
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-fields.tsx	2141ac8c80f18abd684148d6d538771182994bf8eae849c27b0f6ec5ba75f2fa
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx	212ef12981998ede17a06382385934713d65bcedf22f6ee64275fea85d7cd0ab
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/coordinates-section.tsx	170bf19969b9a4f44a43a237876c4da600a4154b48ec04047fe51186ba0c28bd
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-fields.tsx	ed8f349c60adcb71e5217cf7b3779c01a1e779d439efba5bc78998054923c383
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx	6fa66ae6c24e0ba7cda4c961a51fb0d90f213df7bc08ccb6b4a68ece079735c8
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-fields.tsx	29be3e627fb8601f7433e8205664e2df45542083ace79f24eeeb36039ddc2b08
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx	8ac9ec5547379d7da8faa58839ffab73e19ea7dcd4a4e4f9018466b75ab16999
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-fields.tsx	15c06f0c480e9e6ff6135f98fc500758cdfc0188ee405eaaa76b8336688d3f5f
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx	92e799f7799c40ec9885b49980571ecff164be1bc3273b5a236cd66eaa810795
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-preview.tsx	90f4dc312557ffddb3ffbe5e1ad2729248b8b3d0732a2f35fab0f341c1de6141
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/identity-section.tsx	3a3f480a24db95886c784995aaf1375d450c7091cf3ca8c1489aabef8188f2f2
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/languages-service-modes-section.tsx	35323aff9798c86d0aee556894a4545991c644252eb9889d183a9be36e0d9fbc
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx	0737400a56c35020ecc089db6dd5bbd4182c8ea4929ee995e3f6f0a0cc5f757e
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-fields.tsx	e38dd94dd1bce060b91c3a9c884178c5a6d67739f388867a4f7c5b6d5eed1970
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx	05b4e974bd677478e3259aed5873026ab859983f7785a2fafdb08861f895e3fd
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx	ff765cc4c2c9953fc4889bb883bd58c47a41ed96dcedf7121daa29c684185250
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts	db918f65ab196a18daf1ff1549f9f4597cd111b55a1949364a246f649f952037
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/communication-identity-model.ts	0e081898947966e8a40c9592f2ac01b9393c9f3606dab40d809535f2ad99e2c5
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/concept-history-model.ts	96c54561fb193c9b9b199c7eb5450221bf98acc828f8b0f9657e6c06ca8d56d0
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/cuisine-know-how-model.ts	10492214fbe33d260de58fc89aaa742b9840c8dc4c1b26146e47ae417a2084d8
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/customer-experience-model.ts	dd9ef900ce8329f8ce0880f3662a02833b23e4b00ef671899101b90ba2f529ad
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/error.tsx	c8c18899eb9112aaf17f988f9a426271aa867d91468768e9bc0386e4bda1d35d
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts	86334b89388f5c8f735e8895542696f24955d18d68d487e0430b97c5bf0b5495
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/loading.tsx	b5068ab20ba0933a8a749a7a95c7195f85d7d9c3b460ad7c59adeeb4baa1b746
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx	749252744e1b08bb630c245f44e05d495fee5637ad823dbb57a818229b25675f
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts	dd6743bccd39296779a4f37809da962c9a77b76bf11d5be975e518cf133da4ef
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/team-culture-model.ts	5e64d13f70af82c2d9fd6eeb2fd8b33636a662eff4ff8762481cecbfe37e9817
apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model.ts	649f16ab6698777db929f03f891bf07767dbc06c023974df2c21ee580383ffbd
apps/backoffice/src/app/(authenticated)/etablissement/ressources-internes/page.tsx	4a8169e29f9cec07b51e2e37a6e717640a3a0008fe72a8a3d941f6e121477abb
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/_components/table-details.tsx	e5583e9d5b55b956c5c034140b235906b83c91a97382a84446ce99501c4c4043
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/_components/table-map.tsx	b5c7ad5ece08c013b5fe1a1749db329dc3323e2e08307036f2f1fe4d8ff58d2c
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/_components/table-room-selector.tsx	63e8f7a94c1168654ee4352b86f49241a7f4e932772db82f8130d2ec0e0c4896
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/_components/tables-page.tsx	ce7cd1637dc543415f964c5fcf411f4eaa94a641d948d05e20e0b4cd1258d1de
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/page.tsx	8c5ce51a9d62d0517359bcbdeb9438d17908760b8e6a32406956ff82759e68d5
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/tables-fixtures.ts	55e6d6ec008e2cb2c72cdda11ac127e4c5f5414ee2e7373bb045bda7c41c1987
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/tables-model.ts	aa80a08c06a9d78db1322a8e581d4285c09e00b2a3bcd6389357822835fbf98a
apps/backoffice/src/app/(authenticated)/etablissement/salles-tables/tables-presentation.ts	0c4c79d1a95d54d5ca7a4429a52a3b78d32c8c59e91dc63e5fd74981da5c4832
apps/backoffice/src/app/(authenticated)/layout.tsx	b5e88b1864a21132b880ee1c945efc98c4e41e14bcdbba635190d6e9e23a47f6
apps/backoffice/src/app/(authenticated)/marketing/contenus/page.tsx	521806eb9ca341841f87ea85f2c8b01a938f66174e6548e965d551491cbe1e53
apps/backoffice/src/app/(authenticated)/marketing/layout.tsx	37708f81b888d17299b9bb5f0f25547c7d0b290632dd0f82d90bd31ab24690e9
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-generator-panel.tsx	8c09a559f577623e0d39b9246fc41adbdc369deb2b9faaa05dcd2f9678ff37aa
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-inspiration-card.tsx	a002249677399a042412d0723262ea1f2f62a3c69465e248dde0dc42efc787da
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-studio-content.tsx	ceab7de002d4c95c812cd6d1e3a62d7903dfacd3b2b0d42bd7e278e100952df2
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-studio-header.tsx	04e3a0e77d2134dcc8aa7a149f69d7ebe9837723943d43ea0e284e1a75e44778
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-studio-home.tsx	aff0184cb73bad5b7543a21b0fb8dea9863daf4630aba70f6210a73ab0b5f54c
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-studio-page.tsx	2e64d1d062ea06bbdc9d0bee9ea7adabba4497d75a4b3b82998db77bc6934a80
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/creative-template-card.tsx	d6589d7ff46b3bc2bc27641048315ef5807dadd64ea1ac8ae88da21e14b26879
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/_components/recent-creation-card.tsx	d1600bcd6359c1e6a90416a24e736881a2b8feef9a33269950dee96d94474708
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/creative-studio-fixtures.ts	59977016e7285169a049fc3d7cd72445f872f19ef3bcf07e3374613e53d5a3b2
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/creative-studio-model.ts	2138877e1e0ed5189ee4dacaf23a28b8f45dba8f13112f86a460a720498e063e
apps/backoffice/src/app/(authenticated)/marketing/studio-creatif/page.tsx	96f42b558130ba6fd478a9e6dc3ebe350705b021e113345f43e499c8d1a2bf73
apps/backoffice/src/app/(authenticated)/parametres/abonnement/page.tsx	69b18fcfa54b6263916f78f6a21b74065007d51fc97a0fb3f7792311b1df83c2
apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-connector-panel.tsx	734c4d2793922991f3375ff0f2835800eae9d720fd160f66205e4608b3a374d6
apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx	c1c8e408ef89478cccc1c92337d096fed0544246647cbbd6bb65bebd7a2b7e7c
apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx	fffeb15a48359b85459cc5160ee24b6bb1c7483952a8efa4a7ff0bdca38defe1
apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/integration-status-alerts.tsx	5c98933beea13267a19622b00cee50b672b7490400284a95db9ea91bb4369de7
apps/backoffice/src/app/(authenticated)/parametres/integrations/actions.ts	c45d23577186e2e2dfda6e2c52bc430f21a9dd35a5ab70aa2624a43df06ddca4
apps/backoffice/src/app/(authenticated)/parametres/integrations/google-integration-loader.ts	ff703704883264785a8e1b9f87f2ce26a266f4686345d85c69e4e5eb3da22d94
apps/backoffice/src/app/(authenticated)/parametres/integrations/integrations-model.ts	8f7cd2d10badb3b0bf901132bc929368285cb37a43ca62eb50f0d1a9532dbee9
apps/backoffice/src/app/(authenticated)/parametres/integrations/page.tsx	67812d4bc1660906a4656a1ac857d50807efb10065c0bf1c5767b6e67624347c
apps/backoffice/src/app/(authenticated)/parametres/layout.tsx	37708f81b888d17299b9bb5f0f25547c7d0b290632dd0f82d90bd31ab24690e9
apps/backoffice/src/app/(authenticated)/parametres/restaurant/page.tsx	3e33f8dc0fc3bce199fc7adb1e0dbbda11e3c14f60d05732bc2db56cb19c3d01
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/access-audit-history.tsx	da26dc6a7cd70379d8b0248ac69bf01c9f3d14f26036752c356f4fb137cfac15
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/access-audit-loading.tsx	28dcf3da060da8d5f504bb992990df6fe7cc9361411eec86b631c2f38492ae7e
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/access-audit-retry-button.tsx	bc32067b2d555b36de0a8500223c0417348ec05eca2a59fd25ac8110ce8ca4a8
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/create-user-dialog.tsx	b42a4ee26b43370f84427f0da4e1bf69b1cee1a2620460bc567fb3bd3f9cc3a9
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/membership-editor-form.tsx	cc4a15374daf2d2df1d0f2b459a7c5da271d6b58ef735a78b2ac73397ca4a971
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/user-access-card.tsx	839bf9a06d8b1ab905b4659eb10a0588736c57f22bc5ee9a302dea11ae560b09
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/user-access-summary.tsx	c2cfd90945631b8d724ddf6fa89862fe398b04ba7e6a85807afb165473818f60
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/users-access-list.tsx	3a6f962533e2ee6ab7a5f483d50a9c7193fc1c4ad4b556e5b4f9163424dc9989
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/_components/users-page.tsx	92a0f4c5875260a06f9d4415257d5ab87675f2ac136aa97fcb1c3a0c9e083c0d
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/access-audit-loader.ts	28db775b56628980cddb659d2f666751f047b52d2ffa0411dc5a8b0a11cd73ed
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/access-audit-model.ts	5a2305bda045769657f4f25cc80c883def503e2514a36e3d8159978755cf0edb
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/actions.ts	18974d11ce7a3d199ab66f1f12a62462370877957c9ebc34da2f7933bb532767
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/error.tsx	65a6c7fae75ac03239760b141e7da1b08453d5c490ba54471694f1b7890eb25c
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/page.tsx	69625ed65bc30eba68b8aad519eb78fe43f5350c3dfbcf8140e5c2b1f699f487
apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/user-access-model.ts	3b7048843607394ac379e3ec3ea496c560288c0315da2aa9f269af1ff815ab4b
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/_components/reservation-edit-form.tsx	0fe04fd877899913c57248d5dbf55f592addb8627980c99426012d2b2e98e993
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/_components/reservation-history.tsx	b679f71b9adb7e56d91d66e2c040ea5a354404b08f59c61dfcdbae908458c97c
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/_components/reservation-notes.tsx	4ebfa7ca6bb05df2fc4700e80db0714763e704063444d27880aad865b49a7644
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/_components/reservation-overview.tsx	7c74bc6010240e06d388af058fa45c6ccb3dbd0dc00063280e6097022886381f
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/_components/reservation-status-actions.tsx	38122f73e4984bf374428881102c8908d54bb70e75d67f7c66ae84fb85eb9509
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/not-found.tsx	da477fdc1898481cf929da8fee0dfd283ffaf418caa88e28bc05eb7df8a1b30e
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/page.tsx	1ba6ef97b741c310581c72e270dfc04a9f3110a69c745042044463463dbdbea8
apps/backoffice/src/app/(authenticated)/reservations/[reservationId]/reservation-detail-model.ts	116df9fc243a5cdcc34f804bd385bece1bffab83ad844db863a103f726be7dac
apps/backoffice/src/app/(authenticated)/reservations/_components/manual-reservation-form.tsx	a95e5d93eceb663d019183eb7113815e4af0c7ea88a8daeda547c6473e320d8f
apps/backoffice/src/app/(authenticated)/reservations/_components/reservation-action-feedback.tsx	dc5b1567cc6c956fd3730d2fa80207d348bb64e2d3001152f318d37c6e287f0e
apps/backoffice/src/app/(authenticated)/reservations/_components/reservation-field-accessibility.tsx	5ee779fbf798f4c429d4dee43f0f3cd3c009c6209ec643f7d3e8f7b3cdf5d3ac
apps/backoffice/src/app/(authenticated)/reservations/_components/reservation-status-action-form.tsx	46f1318cf001b06b62a062894117b7ae2831b86611d56bf83e29fe5d0b624e8d
apps/backoffice/src/app/(authenticated)/reservations/_components/reservations-feedback.tsx	391e567693b8548517773140e0ab89f757eb7563ac34eb3449dcf3e21a5e0125
apps/backoffice/src/app/(authenticated)/reservations/_components/reservations-table.tsx	4c4fb5c7519254088864afd3fb2cdcb935cbc7c791f005a62655ceacad07705e
apps/backoffice/src/app/(authenticated)/reservations/_components/reservations-toolbar.tsx	b7239a5d7063105c1ba85a433b9dfb75a24231e8da6770e4ee29bdcb73d0e606
apps/backoffice/src/app/(authenticated)/reservations/calendrier/page.tsx	87afbfc59f54f1489ad3f56ee1a4d420178c47bc92bbcc63df4d57ba86778c02
apps/backoffice/src/app/(authenticated)/reservations/error.tsx	5d0a9285e929aac1ad1f8ab8f6dac8e60ba2da317e3d87b0eee53479290f5706
apps/backoffice/src/app/(authenticated)/reservations/loading.tsx	6c6075591bcfb4210bfb322bfd5c3963d27947d080c993351a7e530bb736a6b7
apps/backoffice/src/app/(authenticated)/reservations/page.tsx	f4294487298cf5975d4c45f4651a6b72b191073d493deb0b820a5011c8b3ad17
apps/backoffice/src/app/(authenticated)/reservations/parametres/loading.tsx	3f28361159ceac8e4a4a2503a806d0f62711eafb6da8288696b5076dcd257f7d
apps/backoffice/src/app/(authenticated)/reservations/parametres/page.tsx	74e642c7bc0ec3412b32441ca7be24132dfbae809dfc2ac6e090b8a5dd85784c
apps/backoffice/src/app/(authenticated)/reservations/reservation-action-error.ts	6a62ac1fd901f0dd53d0ce4e5ef4ff4954a8dc324bd216a34bc15fbd8ed5764c
apps/backoffice/src/app/(authenticated)/reservations/reservation-action-state.ts	02871a058562fda5b5a43595d593476d8c13ef432f92ff39bbc18d83008fff49
apps/backoffice/src/app/(authenticated)/reservations/reservation-actions.ts	6af4a7227680468b6eb165cbfe4d69cdbd6a52cbbe653692ef94cdef88420772
apps/backoffice/src/app/(authenticated)/reservations/reservation-status-model.ts	4aacb4a1cf0e109e814efbc2c311335ac568a13368dd0c2695fbc0a54677b89f
apps/backoffice/src/app/(authenticated)/reservations/reservations-list-model.ts	1052712419fd4f2a0d4c1164d8de9bf9c77b6f813e0b7d5a849816fb79c6a1b5
apps/backoffice/src/app/(authenticated)/stock/_components/stock-prototype-table-footer.tsx	0c7989e665db1443d47bdb4dea5a94a78909b0bc8f9f6310b0309e4ac8f5ebbd
apps/backoffice/src/app/(authenticated)/stock/fiches-techniques/page.tsx	d0e6e4a34bc21f57b2b3004c1134ff7ebea6243fd3f47fa12646b8b6f6a0c0af
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/supplier-details.tsx	44454d9fc582117f17e6c7cd4f6321a2744231840665fea2cf6081ac9aff8ca8
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/supplier-logo.tsx	c9b7cfca9a838bf4c0c1e9c18965f78bc524c258ca976eab84ae7960a7decc3f
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/suppliers-header.tsx	ef2351ee21485af67ad781af8382dbd9508449e8de459c9ffe8ba68c1d991a06
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/suppliers-page.tsx	c081d6060f9132e661a7804b091cebe62f1e42acd78ce84c3fa66f5850e56fd0
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/suppliers-summary.tsx	9cf562592cd4eccf98f10c11b9a5dbbede7f972e35374cfe99f47bd970a93c33
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/suppliers-table.tsx	5db7d57af5495e8bebfc71811c441fafd0fc4bc0f58a97f843514a76134eff32
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/_components/suppliers-toolbar.tsx	62db69fb4061849374fe6784888b2cf687d132e923ed9e3118c3a3a0eac685fb
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/page.tsx	c4aa18e8b42eb69a93d11813735e8dd1e83d350efc9b8a1419cf666d93e38cfe
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/suppliers-fixtures.ts	3616664e2c69e40b2a0236eacfdd7ae25ae8c7d998bcddf2485f9b49550cdead
apps/backoffice/src/app/(authenticated)/stock/fournisseurs/suppliers-model.ts	73984a1c3e6a4f48d754fd837a6601923d4f56a2c3149c94bad82a2939285275
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-details.tsx	ba2c0f38285b2a4ae07411b33ae75d8344e5a4d46e2ac7620c3b5f55c4bdac16
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-header.tsx	afcebd15858d465f9385ba07335bf0904da674db35c41db5c66073c650d46c94
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-page.tsx	827422e59273a6f41a969294fbdb083ca7ef773924e2c8106e1643f59488ef75
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-summary.tsx	6145645f913d87386fd6071046005b59d6fc5a02dd7d24bd7a1b529dc07d3200
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-table.tsx	106bfdc4cab6ac87c5ecea17de257b61e11a749c68e4c17f2b3fd21d025b0ebe
apps/backoffice/src/app/(authenticated)/stock/inventaire/_components/inventory-toolbar.tsx	bf7eac7214aac6f3857293b8621685fa2d19e8b79e05ae79bc83c3cf2757eb49
apps/backoffice/src/app/(authenticated)/stock/inventaire/inventory-fixtures.ts	c6971fad20d5c97434871fb84a7795af94dbd5148d1a983b012651eed838af5a
apps/backoffice/src/app/(authenticated)/stock/inventaire/inventory-model.ts	531cfebc30cfd1bcca2f811a16e1fc303d5a654de0fe4e9e24695c575d8eb4aa
apps/backoffice/src/app/(authenticated)/stock/inventaire/inventory-presentation.ts	365ae2b97d21cd0df1956b27456781546a99d326455e29bd38d76947fb92bcd0
apps/backoffice/src/app/(authenticated)/stock/inventaire/page.tsx	b7bc1fa419046480ef2d38372f376a1a0a633723ccda43f2aff7d63c9eb88e1d
apps/backoffice/src/app/(authenticated)/stock/layout.tsx	37708f81b888d17299b9bb5f0f25547c7d0b290632dd0f82d90bd31ab24690e9
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movement-details.tsx	0b173002a68f80b13577a17d4176fae5e37da376b66e5edf112c2e0902de4e0d
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movements-filters.tsx	e8ce69f950238c8b093d94585c9b95a7c7f11181fe21d06deed993aa26d27b52
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movements-header.tsx	d31598e3cd826c07a9c4b257762d6945f2acc60a3ebea7af6133a7b503c0115d
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movements-page.tsx	9d61e4e071db232533ce127aa66e128880e55ef2be31fad80aa4154d8b50f042
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movements-summary.tsx	705f4e5b8feed0d4d3ca84f0f3b283f807cac2b18d9bd6131fce6c7dbe16665f
apps/backoffice/src/app/(authenticated)/stock/mouvements/_components/stock-movements-table.tsx	0fbf8ac1b1f6d4c1c5fa91862cad4172beba4ac2a11661267128ba381d26bd19
apps/backoffice/src/app/(authenticated)/stock/mouvements/page.tsx	8472278a4d6fbc46ddd70d334ca121c975860678d68f37d3ef2970554d4bfda9
apps/backoffice/src/app/(authenticated)/stock/mouvements/stock-movement-presentation.ts	a7bf1af7c3c505a8aef59dd68bf9f1826493e436bacd566229b553f7fef3a60d
apps/backoffice/src/app/(authenticated)/stock/mouvements/stock-movements-fixtures.ts	047785eade700c441b9b1aca48f019f432aeaf90353514716524790f8039cb30
apps/backoffice/src/app/(authenticated)/stock/mouvements/stock-movements-model.ts	4df450d25f343936f8feab935341e4c92dad35417e4a833cdcfeae9d0378a240
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/[reviewId]/page.tsx	c391929a7a773e3bcda48412e416196ab9bb8030468b318f15ef1c802828b886
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-action-feedback.tsx	77e72629af4f4ac8759bbdd5b247a34d34370b15bd3290f77974f0def084a1d5
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-analysis-section.tsx	5b15f0e5d319621f2af66db934feca12b7bbe6890e83d5ac6bfe968dd9bd2f0a
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-detail.tsx	bccbf6e67195ee33fa32046ea8ee4dbc581f4c972cbc01fcbd42b0cdf2559237
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-management-form.tsx	a3335296992a06efb914561c9f7a9c5995b3324db2b48525e914801af1569f4e
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-notes-section.tsx	65a5fb13dc1ff78723103bfa56aa103d7ea7ae996810815b5f60c40e3fd87883
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-presentation.tsx	977da06e877dff893b56d1cadba7c26e56926f879002e781e5d82908967b086e
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx	5e40e7cb8f7d18c0a4e8b883dddd0781b2f618bbbd5050fbe975a16d4e95c1f2
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-list-panel.tsx	30af97d260d776f12aba3f5b73f55f268d47ee969ddce5fb9690d00c207c6ddf
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader.tsx	c50945ada4049b5176b073882a8bdc28375d476935a3521bf250a505e5ce4510
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-page.tsx	f95ab1f277e414cf1f3293de10c39baa1e4d88b00faf8c7d5b3e31d3465abbfd
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/actions.ts	b5e2797e9e064b4cd4913aeaf14fb0b19f71ca63a072fa7302103c2bf494345c
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/page.tsx	ed773b3907bb68cc947c9651b1d610a2d542f1f4c09c606f8eb365f1cc559d2c
apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/reviews-model.ts	020a077b826d17f0257e5416a9fc8964f07f7ed00d921992d6b24e07b6f2ed27
apps/backoffice/src/app/(authenticated)/visibilite-reputation/layout.tsx	37708f81b888d17299b9bb5f0f25547c7d0b290632dd0f82d90bd31ab24690e9
apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx	16710b1bedbd94ccca7932a2a2b83b475a7325c962eca7adcb4ee90d68487dbe
apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts	78a05f1eead39c13919ab0b45dd66f00a1009f3bcf0d7ffa3d25d23bb3cc3d74
apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/actions.ts	b23d7d00da9e700b91d35fdead8ab235abe70a524e32c2bf57157171805fabe1
apps/backoffice/src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx	b8caf1028cb0f579d9facb9274bdd80a404a890ce2f8ef8b7aa242c8440c44d2
apps/backoffice/src/app/(public)/acces/aucun-etablissement/page.tsx	6f648dc08e58b706026b6b152c1b57fe8a86e427d4c45835aef53b0650e38cd9
apps/backoffice/src/app/(public)/connexion/_components/login-form.tsx	2308704af00974871bef41ab7a3db414a6ef64a6c78c97964b6e79777d807cfa
apps/backoffice/src/app/(public)/connexion/actions.ts	5ea157af6db9c7810b96274db46d6eb07991551178f2d25d91d721821b3177d6
apps/backoffice/src/app/(public)/connexion/page.tsx	7b505503f3c69d59dac4c909f10c1ff553f9b5200872c26aadc4772af333d240
apps/backoffice/src/app/(public)/layout.tsx	216a4c76aea455b9c4d0b93fecade74fd94046bb416fa1cd22fdb98c53680eaf
apps/backoffice/src/app/(public)/mot-de-passe-oublie/page.tsx	1f1a11ed2587e7305b72c1aaea2afa43bc24669a5c80dcae4dbdb064616d9aa7
apps/backoffice/src/app/(public)/reinitialiser-mot-de-passe/_components/reset-password-form.tsx	3ea6d85e6522a6294df9dbd631bdf3fe8c5189c440c7a2a9ba04782ab8dad4e7
apps/backoffice/src/app/(public)/reinitialiser-mot-de-passe/actions.ts	c016b2bcceb1ca137b97b3e1cadb0577ad2268e300e453d37f255849723c0e4f
apps/backoffice/src/app/(public)/reinitialiser-mot-de-passe/page.tsx	a9ef380a4ff2be646eaf2c1f0e6e32be7488b59796aae1b86e8970b7edbc12f5
apps/backoffice/src/app/(public)/resolution-etablissement/route.ts	aa829966bf04f368563152361367ab8c33a14bdbd784ec8b3f47773ae36937b6
apps/backoffice/src/app/(public)/selection-etablissement/_components/establishment-selection-form.tsx	571204cd3438942d3fd03a31c620f6ac193be93e60ec58b018a589acae5af491
apps/backoffice/src/app/(public)/selection-etablissement/actions.ts	dcbae3c892e258637bb8345195921a76c50aa782e0473f5ea6acb217b0d8d69b
apps/backoffice/src/app/(public)/selection-etablissement/page.tsx	6bc86b0a48812cda65f1f19aa115ba1830dfaa800f6988454b91c3dc5315f170
apps/backoffice/src/app/api/personnel/amendments/[employeeId]/[amendmentId]/route.ts	3a03761d7770bc77adc03e0b285fd0b455b2395a48edc80c5bc074163fee5fe2
apps/backoffice/src/app/api/personnel/documents/[employeeId]/[documentId]/route.ts	eff4f62af83ba4eab61b3ea42505151607c4e457041398a3ad376b9abb2882c8
apps/backoffice/src/app/api/personnel/register/export/route.ts	f1ee05c924742e87aafcf2ab21bd2190e384fe5b44a2ae7b62394aa9d069bb04
apps/backoffice/src/app/api/reputation/google/oauth/callback/route.ts	d4ac7e6f60c5690535556878d1b6703dcf3246e65526e64bb308d5f153d98306
apps/backoffice/src/app/api/reputation/google/oauth/start/route.ts	f9e8caaf9ffbe3384e5d6a04157a9875e4fd196b0be7f31e5c16e6e1ad8ec39b
apps/backoffice/src/app/error.tsx	b43c30db429eb59187725b8691060064649561b25a01c2765d73d4b98f02491a
apps/backoffice/src/app/global-error.tsx	4c9a1687d999eb8248ddc880b8d1c73dbcd3e1695de49dfefb3eb74e418eeca1
apps/backoffice/src/app/globals.css	3a2ac100fea524650a8edaadf49fbdbd9c0ebc7be156acdd88a69aad1badad88
apps/backoffice/src/app/layout.tsx	e77005907bbae9ceb02c40317dd3b9f8f362df5da2e1cd244afa10af12310f9e
apps/backoffice/src/app/not-found.tsx	3e8e707080731f7dcca8e2cccbfa04d756648f33d61d968db012ad116423d6cb
apps/backoffice/src/app/page.tsx	3298ceb438eaa3be42f66ca3771f39f248f6eb4eb4063347531315df01ee8eac
apps/backoffice/src/components/backoffice/backoffice-frame.tsx	7c272b7586559389c1c0aa2d9d254480cde14269dc63cef51193eb89968ea54e
apps/backoffice/src/components/backoffice/backoffice-navigation.ts	6deaa75874a35b114248d349433ab1c71b8e4e788411908786c5e89d6c4d0a97
apps/backoffice/src/components/backoffice/backoffice-page.tsx	fea75d3697307486f095b45e75013bc69346d043f1481667a437658f394b4720
apps/backoffice/src/components/backoffice/backoffice-theme-provider.tsx	4616492ea28b5e48449cbc41e4f413906b055de556c2a03d3ac5f5f7f56e8be5
apps/backoffice/src/components/backoffice/emotion-registry.tsx	782380caef20b04720b15b4ab9a3d0dd05f34b001acaad54918c4e63ae3cc6d6
apps/backoffice/src/components/backoffice/logout-submit-button.tsx	6159b197ee50ee5333b7b169417248213703bc83a0584c44934f31e22ddb02ab
apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx	04e3da9092d3cfd2b36e300be748b07cca5e5ac6b31433e563babecae231a99c
apps/backoffice/src/components/backoffice/prototype-backoffice-notice.tsx	4ff4277a2c3913ceccea81056a235c74bbe105f30234392c9525933f6721ef65
apps/backoffice/src/components/backoffice/tenant-switcher-submission.ts	26f6e64d4ae9c0080d7fae686eb68a685fe9d358bbfb51721d1a55eab0912128
apps/backoffice/src/components/backoffice/tenant-switcher.tsx	04f44665616a2f8abd1982a9cdcc42c40070cfcc738bcb1565ba160d19ae77b1
apps/backoffice/src/server/auth/access-audit-permissions.ts	e9a6f260ea80edea302d2c9cc5b521db9df3d1b9e75f28a7dd316db28f04e1ed
apps/backoffice/src/server/auth/formalites.ts	60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626
apps/backoffice/src/server/auth/permissions.ts	e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353
apps/backoffice/src/server/auth/session.ts	7231fb2507efa111e1674f2bf1b393955f90ff24249c91f2bbc24ec6ce932f98
apps/backoffice/src/server/cloud-database.ts	a3365d2ee887a805e6d8b21ed7e9194cb287c2404523010c55681cdc34fba76f
apps/backoffice/src/server/personnel-contract-extraction/evaluation.ts	c260676cfcdc5fb5e946f96dcf35a553963e4436a815b0ca21a1652aecce9722
apps/backoffice/src/server/personnel-contract-extraction/openai-adapter.ts	d3bcdb5448e5f632d80e9177af73207d5a42e86274e78749dfd996bacf2439f6
apps/backoffice/src/server/personnel-contract-extraction/review-store.ts	793d13c39a9977880b84530764672b870b1228f1332c980dbc91b16b31ca5c56
apps/backoffice/src/server/personnel-contract-extraction/runtime.ts	e393b0389b85da9feab6bfc804fa6387059104b8f0e1c69b0725c486392097ef
apps/backoffice/src/server/personnel-contract-extraction/service.ts	63315529ac50479728b0dbdfa54972f5851a70e6252d19bb87abb53d16477d9c
apps/backoffice/src/server/personnel-contract-extraction/stored-synthetic-document.ts	0a95537a0eb12462dc77a6e925037ed5b6f55654f2d78b13a53a642e9ac8570d
apps/backoffice/src/server/personnel-contract-extraction/synthetic-upload.ts	6590743924c69d3f3cb5e601a228a39fa38a540873a3292d406ef93c36a0ffb6
apps/backoffice/src/server/personnel-documents/runtime.ts	7c05674376a6c776a47cb6ea58969771f8a916d4f3da1c9cb15312eae0d41f05
apps/backoffice/src/server/personnel-register/pdf.ts	0e5ea41ee76f13025d5ff0e9db201b98406ff0ac48e8cab5c2adad2238e0a042
apps/backoffice/src/server/pointage/authorization.ts	c33a530483f76f29065729834e07b5d4512ee54255765645bece9cef8c87cc34
apps/backoffice/src/server/pointage/index.ts	5a17ce9a793561f26e7eca9c62f7835925d54d9eba61074951d58871dd910133
apps/backoffice/src/server/pointage/service.ts	1e34ca92770148dbbaa9582a793de425163e89cd067d6d90e317b1fb2e2747ae
apps/backoffice/src/server/reputation/credential-crypto.ts	f0c648fb660242b2f9eed5e73350103d95df31c7d9b1c647beba5a8f2d9c3a44
apps/backoffice/src/server/reputation/google-business-profile-client.ts	a4e921a71080de8a8b26fdb6e00a08fabc20cc3e838c64136409b5dcac1e76d9
apps/backoffice/src/server/reputation/google-connector-access.ts	f22f6af88fb79c94b80bf9f909ccc514f7a3c4ae5dba479d8b97721842addbbf
apps/backoffice/src/server/reputation/google-connector-config.ts	e32d4ffe4bb7874188de1fd1eb8fe25c72d4e68908c918d877c735d08b5eed8a
apps/backoffice/src/server/reputation/google-oauth-state.ts	ad8c6a769a2340c985858bd1d3a0ca1913a02ef3bf5399ab74dbd1eaadd8f910
apps/backoffice/test/access-audit-model.test.ts	733b5af99668f533333afb0cac9fc170f4eb7508c2a7e42f2e769486acc702b1
apps/backoffice/test/access-audit-permissions.test.ts	d42d5bc2a0e2d099afb03a3fbe82628c5f3814c927473192dc4e07fc6c31c915
apps/backoffice/test/backoffice-navigation.test.ts	e76c5457a123384e53b9a245f3fd66895bdacc0f9bdf94d524dd477545a45946
apps/backoffice/test/booking-administration-action-state.test.ts	a83d2d5df27f45e4790d05f924cb15f121e084479594d7c3acf362dcd8b0f045
apps/backoffice/test/booking-administration-model.test.ts	5e0f5b3ce601e9bedf7318b44d56fd5dc26e962a0f27c06b7c5e7a76b1b880b5
apps/backoffice/test/communication-identity-action.test.ts	d67496ae230cd1327e4355bde979996322c2db51f3b4bd62574873ad888d62bd
apps/backoffice/test/communication-identity-fields.test.tsx	66a1d2fd9a65e7d92108d8f2f4e9e00a8c5329f2cbb60487e8e4252b79fbcfd0
apps/backoffice/test/communication-identity-form.test.tsx	0691d1a27236aa479fe97deab4737c18f23d50f8c977d10e6d5a0bbc17abac14
apps/backoffice/test/communication-identity-model.test.ts	040b938e2913931e70751deecd0c303efad5b8dc809d38055b0bcd69cf365452
apps/backoffice/test/compliance-model.test.ts	71e014eb3fa60bd5ce2b193efcb700101b589edd5740a4e29b69c441615a6447
apps/backoffice/test/concept-history-action.test.ts	3686cd909d85a6997e652a8b59e301db66473bbe4b28b1f1a58dcf356bb2fab3
apps/backoffice/test/concept-history-fields.test.tsx	e49fe63b7d39c802e5e29f998228b2747070ea6dac241c9c6d377ab1f5e2016f
apps/backoffice/test/concept-history-form.test.tsx	502d8c807815cd1df85b78a4bd8107d68d0009cedcbffc6ddafbfb7a90192637
apps/backoffice/test/concept-history-model.test.ts	65a2e7aa09a92371aca3374adc0f3293f280b534f9f1328e0d72391f9233f777
apps/backoffice/test/contract-extraction-prototype.test.tsx	cc4e88231833251bec04a3c51873436959c3cbf5e560531106d8fbef1f859e39
apps/backoffice/test/creative-studio-model.test.ts	fea8279fe58e7912094b2255b0b37acd9853e17cb39e8e0493e83ea541331917
apps/backoffice/test/cuisine-know-how-action.test.ts	52c8a14c4a438cdc2cf14c025d89ca09d1201635cab069d3078d4401b671c770
apps/backoffice/test/cuisine-know-how-fields.test.tsx	e2cbad535a7a281bf99eaf372d5c4cbb763ecf2a21853c9f8995922a9bdae5c1
apps/backoffice/test/cuisine-know-how-form.test.tsx	17084e7669934ff5c35a5f90fb7ce1b09f90c288f8233df6c344e3832df33259
apps/backoffice/test/cuisine-know-how-model.test.ts	f105de782ffae4c24344d678cf09a4dd955aab6c5c5eae4b82c4381a6fc54916
apps/backoffice/test/customer-experience-action.test.ts	fea352df9a155e6c95c383151ed75800b9a9eb5a1a613b24d3724b62fe9e01e6
apps/backoffice/test/customer-experience-fields.test.tsx	8c0c0a71ad192b7e47e063dfc7b55948affaf6e7c33905a1de50ac815aa8cb1f
apps/backoffice/test/customer-experience-form.test.tsx	978754381379ae30ec97049f505f80b9ecc22b3ae27fe9d49903aee2d1aa2346
apps/backoffice/test/customer-experience-model.test.ts	6a4da9267d558d582d7e903778cc55eacb3f7070d42b05478f05c75c6332a916
apps/backoffice/test/establishment-profile-permissions.test.ts	cdc43e575eb81f21a8aba99a2890b4906519bf2fd180e4b343884074352e51cf
apps/backoffice/test/fixtures/personnel-contract-evaluation/README.md	532bd9278f1fc08959c4e536170d67536666d18c26de10dd928fd227bbe1fb6c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json	8e43f64cb32fae3776636e8d74661fecb88d2f137847fe7e67c368a6624274b2
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-04.pdf	71d9e701d15a4d3363240cc5d8a7e5b7788d6fc822d8cf7924d3dcd6325d3589
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-05.pdf	e51cd699387c5162e9453485612d59eec4367e34b9c18ced8e7b6028c8cbb05b
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-06.pdf	14f038a1b8961b11bab04e831b86a47cc9f4c6233aba7dcb2ac6400d213e0f79
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-07.pdf	4aba032683dc87f00f3720581c90c323ccfb7d4a2fab75edc5fbf1e067780b13
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-08.pdf	251571520a484294fe9d6dab648aeb4fd341a48488d60de950b4815253b73d27
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-09.pdf	f82022e3bfc7195dc33ec5d161a7686c00062bb289616a071d7d33ee2ce836bc
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-10.pdf	57fc059bb1ab26a5182aa3fc88c0d7230bca23736da128d767a71c208ab31375
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-instruction.pdf	79c781476477dc2fc143437104bca8a64506b60fea7440945a4517ac40bb30ee
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-missing.pdf	d85ab36bdfca12ad9abc5a88c001b7e9794f8d5a718812cbb444db591dd73ae5
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-adversarial-term-conflict.pdf	12b7a7fb0ef53143bf542ac568d245666f6acca347751d7f34a6889141afc884
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-04.pdf	c1f2b5d0bfdfb2577e37775655d302136aac82579e736a4a727666d9a8fd95cb
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-05.pdf	60ba3565333b863cda6579d580df4f12ddc6f845a040551f0704586c4315144d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-06.pdf	1bdeb0c6561c3bc4b8f0ba2644bd24d6e1646230247c1a3fd63f4c65aaa41a74
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-07.pdf	5e63c4a8ded8006790a8962a2a273b2aed86c81a58684cf1f3c1479f72e528ed
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-08.pdf	98fae02d2cb582e3be206275e12ced5c466877f27f4e6a4a8c2891a7efa09349
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-09.pdf	e955c1cc1cea5c6cc52ef38257174b6a6987ef727be49948c6cd2ce5a9d38a0e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-10.pdf	793fbd053f4406be2617f6919cf13445f5c11ab8489b26b3fc9910a2517f276d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-11.pdf	6b5778bee4093d74cbb249bbd8bb3d47ee8a5285ec7de069b26084e386bf9556
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-12.pdf	4d8a56e2d6eaeacd5720e96402b35df104630f02b143ab162dd2a94a0b13a819
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-13.pdf	db06b86df0c4e9f08cf47b7fd4731781014a229b46392b1fa029027e7d00b5f9
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-14.pdf	6a73d75202fd86959200e3c8546fc1ae174c6df10f90f39891f4ae5cbfbb4d70
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-15.pdf	86c48b30a3326830c3bef815cc00b6931c28ed41182e19a27613059e0a15d40a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-16.pdf	5d1c4fccddac22abdce8e677d88d2bcd7b5bb729188141e55baac28fb0d373d1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-17.pdf	a595cbd8c4105f7348e100a8578637043f0155e018e9267577c527c1752ac233
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-18.pdf	4f86619b12c16dc88097a8381cfcf62973940a1f6d8ffc228e2887facfa8545a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-19.pdf	3c5c39dd72144ac470678cc8123009587bf049ee065e3ad876dd63e0c30bb4e4
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-20.pdf	bd6897011743a06b5b43c1f3dd6dd9493573b8aeac99df8461c8a78408718b9c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-cdd-35h.pdf	5b4fd463bc96874262109d279a1189a3b765ea17cb7214913bdfbbc39bec3a27
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-cdi-24h.pdf	8d2817226d909ff5100fdda76ea0cb71f1710b89b48a30ac81122acd0b034291
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-digital-cdi-39h.pdf	d233cc55333029ab0306bc4e613b7a2d5b989c8089730252c3b74ff6216a3fb7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-03.pdf	e8f3869b78b0dcfd8d4d7a2de47613f156eb8c8683887f1290296a83de5161f7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-04.pdf	b7e83850e87bc86144b5f663602113e0dd18abebd971d33d7633e0fe4bdc461c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-05.pdf	5627d8f58556d420905f322c7534799d73fa70deb4de0220474759325fe57ca7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-06.pdf	be2ad574a890fb148174b8fda3b9ce3fb8ac74f9de87aa9a30e2afea648f74f6
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-07.pdf	a5f8f037e18c2595df4b403e42cdf46e6ec8b7d4bfcf5a381337d5b0e5e27085
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-08.pdf	21a1780196f1b78fdaab389be65fa8146c4563de97d8080e7fed417d550b3adc
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-09.pdf	67ad3aca4f4becfdb437c965431054995b60c24be672494a72af5cb5c741327c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-10.pdf	4673c6983bb2581a275584259f2a6bcd63fae29227f93d41e5f02ffc0a815543
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-11.pdf	f565fb7452181eeea8956d670f9da59947cb5a9e7016157da1fcef62a3ffc67a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-12.pdf	81047daa9293f2f111dfecbd02f12b5eab93c8222af98fef836ccf7bf5acd951
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-13.pdf	863de722f20f9044c9f9fcacf8a316fb4bec874739d39ed4eaab2c4f24b78f22
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-14.pdf	6510042ae504784805b00b079da821a5406e0359d4f734b01b950bfee39b81e1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-15.pdf	b35c527da9c495503ebe7ae6744d0c18a833858acaa91cfea8379c995c5bd93f
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-cdd.pdf	0ba96525c6bc010500e312aa258afa6725f0e0d7336cd39b0bdaf1bee875578e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-clear-cdi.pdf	d34d31125e770d03b468d11bcfe8fb70434bc85bb82808a5e34da082104be985
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-03.pdf	e5cca88cd37b0b73812d089c055857be88056d1d2ca0d13ff4f8bdce22c79c84
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-04.pdf	e3e7c5fe8d727a18a8c46d60ab37ba5559a2a19a659f19808866811a4fc9131d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-05.pdf	22d8cd2e0885c45a7acabd24cbd8f0d12ab65361f89f6bca90081df9df97bd20
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-06.pdf	8a7725fddb7d51ba072e82384e6b9280cbe24c6afe9f68c1de6f2f291434d344
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-07.pdf	9047f4b3340366698d2f7773e653e49ae0be1aee956fdaf91d9f272c9b9ce6fa
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-08.pdf	e96c494def4ec381e93fcc226449caa203446a5bbcd915bf90e317feddcbed15
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-09.pdf	50095910c4cfc2920f7d76f12713842e9873aeeababba92d8d7ad7e37ff1f3a1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-10.pdf	6c72b2f27b5c44d63e8335572113f18485207fca210a62b9d279c90570daf3f4
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-11.pdf	f9d3705eff21fd1b9bb02dd2016d93948d89998df3f3b022f1d7d2235e05777c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-12.pdf	412722ff7996a8f8ca9fd10f091dfce2640e8f1c41bbc1fe2d4300338e796f9e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-13.pdf	4a981e47ad05e5f163fab6465a05efd1ecddef7978efd593214d0f23bbee099f
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-14.pdf	8a751e3eed669002f28aea2116f81b2963edbac18af1ad591c1b2ae69bef30ab
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-15.pdf	d8a75e7a507c46deaddbcd04b1f6b15649bf9440f9a4a48e3db951e5fe756d5b
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-contradictory.pdf	c235f4367cbc1586dabfeff83a3461b676ed0a93ff8b07801546804245dbcb5a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/wg2-scan-degraded-partial.pdf	1680e08a171fc0bc62d7de41efebac30e87800ca4dc05d2e658d416559ecd2a4
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json	e76e0cfe39cafedcf25564e6dae079fadfc709fd8179da5000f7b7a4ff2879f0
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-04.pdf	71d9e701d15a4d3363240cc5d8a7e5b7788d6fc822d8cf7924d3dcd6325d3589
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-05.pdf	0eea5ec94bdaa835c1818180c85409c927bbd89c3aea0eb84a4ea8a9ce0fb1aa
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-06.pdf	14f038a1b8961b11bab04e831b86a47cc9f4c6233aba7dcb2ac6400d213e0f79
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-07.pdf	4aba032683dc87f00f3720581c90c323ccfb7d4a2fab75edc5fbf1e067780b13
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-08.pdf	251571520a484294fe9d6dab648aeb4fd341a48488d60de950b4815253b73d27
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-09.pdf	6055eb15968f521981c7b531a55abb9b5d35ee5f8c58910ec21fd4ac709a614a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-10.pdf	57fc059bb1ab26a5182aa3fc88c0d7230bca23736da128d767a71c208ab31375
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-instruction.pdf	79c781476477dc2fc143437104bca8a64506b60fea7440945a4517ac40bb30ee
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-missing.pdf	d85ab36bdfca12ad9abc5a88c001b7e9794f8d5a718812cbb444db591dd73ae5
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-adversarial-term-conflict.pdf	12b7a7fb0ef53143bf542ac568d245666f6acca347751d7f34a6889141afc884
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-04.pdf	c1f2b5d0bfdfb2577e37775655d302136aac82579e736a4a727666d9a8fd95cb
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-05.pdf	60ba3565333b863cda6579d580df4f12ddc6f845a040551f0704586c4315144d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-06.pdf	1bdeb0c6561c3bc4b8f0ba2644bd24d6e1646230247c1a3fd63f4c65aaa41a74
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-07.pdf	5e63c4a8ded8006790a8962a2a273b2aed86c81a58684cf1f3c1479f72e528ed
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-08.pdf	98fae02d2cb582e3be206275e12ced5c466877f27f4e6a4a8c2891a7efa09349
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-09.pdf	e955c1cc1cea5c6cc52ef38257174b6a6987ef727be49948c6cd2ce5a9d38a0e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-10.pdf	793fbd053f4406be2617f6919cf13445f5c11ab8489b26b3fc9910a2517f276d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-11.pdf	6b5778bee4093d74cbb249bbd8bb3d47ee8a5285ec7de069b26084e386bf9556
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-12.pdf	4d8a56e2d6eaeacd5720e96402b35df104630f02b143ab162dd2a94a0b13a819
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-13.pdf	db06b86df0c4e9f08cf47b7fd4731781014a229b46392b1fa029027e7d00b5f9
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-14.pdf	6a73d75202fd86959200e3c8546fc1ae174c6df10f90f39891f4ae5cbfbb4d70
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-15.pdf	86c48b30a3326830c3bef815cc00b6931c28ed41182e19a27613059e0a15d40a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-16.pdf	5d1c4fccddac22abdce8e677d88d2bcd7b5bb729188141e55baac28fb0d373d1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-17.pdf	a595cbd8c4105f7348e100a8578637043f0155e018e9267577c527c1752ac233
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-18.pdf	4f86619b12c16dc88097a8381cfcf62973940a1f6d8ffc228e2887facfa8545a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-19.pdf	3c5c39dd72144ac470678cc8123009587bf049ee065e3ad876dd63e0c30bb4e4
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-20.pdf	bd6897011743a06b5b43c1f3dd6dd9493573b8aeac99df8461c8a78408718b9c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdd-35h.pdf	5b4fd463bc96874262109d279a1189a3b765ea17cb7214913bdfbbc39bec3a27
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdi-24h.pdf	8d2817226d909ff5100fdda76ea0cb71f1710b89b48a30ac81122acd0b034291
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdi-39h.pdf	d233cc55333029ab0306bc4e613b7a2d5b989c8089730252c3b74ff6216a3fb7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-03.pdf	e8f3869b78b0dcfd8d4d7a2de47613f156eb8c8683887f1290296a83de5161f7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-04.pdf	b7e83850e87bc86144b5f663602113e0dd18abebd971d33d7633e0fe4bdc461c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-05.pdf	5627d8f58556d420905f322c7534799d73fa70deb4de0220474759325fe57ca7
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-06.pdf	be2ad574a890fb148174b8fda3b9ce3fb8ac74f9de87aa9a30e2afea648f74f6
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-07.pdf	a5f8f037e18c2595df4b403e42cdf46e6ec8b7d4bfcf5a381337d5b0e5e27085
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-08.pdf	21a1780196f1b78fdaab389be65fa8146c4563de97d8080e7fed417d550b3adc
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-09.pdf	67ad3aca4f4becfdb437c965431054995b60c24be672494a72af5cb5c741327c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-10.pdf	4673c6983bb2581a275584259f2a6bcd63fae29227f93d41e5f02ffc0a815543
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-11.pdf	f565fb7452181eeea8956d670f9da59947cb5a9e7016157da1fcef62a3ffc67a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-12.pdf	81047daa9293f2f111dfecbd02f12b5eab93c8222af98fef836ccf7bf5acd951
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-13.pdf	863de722f20f9044c9f9fcacf8a316fb4bec874739d39ed4eaab2c4f24b78f22
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-14.pdf	6510042ae504784805b00b079da821a5406e0359d4f734b01b950bfee39b81e1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-15.pdf	b35c527da9c495503ebe7ae6744d0c18a833858acaa91cfea8379c995c5bd93f
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-cdd.pdf	0ba96525c6bc010500e312aa258afa6725f0e0d7336cd39b0bdaf1bee875578e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-clear-cdi.pdf	d34d31125e770d03b468d11bcfe8fb70434bc85bb82808a5e34da082104be985
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-03.pdf	e5cca88cd37b0b73812d089c055857be88056d1d2ca0d13ff4f8bdce22c79c84
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-04.pdf	e3e7c5fe8d727a18a8c46d60ab37ba5559a2a19a659f19808866811a4fc9131d
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-05.pdf	22d8cd2e0885c45a7acabd24cbd8f0d12ab65361f89f6bca90081df9df97bd20
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-06.pdf	8a7725fddb7d51ba072e82384e6b9280cbe24c6afe9f68c1de6f2f291434d344
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-07.pdf	9047f4b3340366698d2f7773e653e49ae0be1aee956fdaf91d9f272c9b9ce6fa
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-08.pdf	e96c494def4ec381e93fcc226449caa203446a5bbcd915bf90e317feddcbed15
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-09.pdf	50095910c4cfc2920f7d76f12713842e9873aeeababba92d8d7ad7e37ff1f3a1
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-10.pdf	6c72b2f27b5c44d63e8335572113f18485207fca210a62b9d279c90570daf3f4
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-11.pdf	f9d3705eff21fd1b9bb02dd2016d93948d89998df3f3b022f1d7d2235e05777c
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-12.pdf	412722ff7996a8f8ca9fd10f091dfce2640e8f1c41bbc1fe2d4300338e796f9e
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-13.pdf	4a981e47ad05e5f163fab6465a05efd1ecddef7978efd593214d0f23bbee099f
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-14.pdf	8a751e3eed669002f28aea2116f81b2963edbac18af1ad591c1b2ae69bef30ab
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-15.pdf	d8a75e7a507c46deaddbcd04b1f6b15649bf9440f9a4a48e3db951e5fe756d5b
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-contradictory.pdf	c235f4367cbc1586dabfeff83a3461b676ed0a93ff8b07801546804245dbcb5a
apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/wg2-scan-degraded-partial.pdf	1680e08a171fc0bc62d7de41efebac30e87800ca4dc05d2e658d416559ecd2a4
apps/backoffice/test/formalites-authorization-context.test.ts	af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537
apps/backoffice/test/formalites-cdi-connected-read.test.tsx	25c1faf6f85a0fb511d2888b1439cfd4365f25001959e4a434c28b5c89b9b425
apps/backoffice/test/formalites-cdi-prototype.test.tsx	71ced71746bee04c95458a1bfb3c2ca054930da775478f8e87f44bccbda2729b
apps/backoffice/test/formalites-permissions.test.ts	9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6
apps/backoffice/test/formalites-persistent-draft-actions.test.ts	8702fa3de1821fc6929454a5a5f6bd33dde1f726def74c984b68dac33166c9d9
apps/backoffice/test/formalites-persistent-draft-component.test.tsx	92f776df45c52c19d7bdaa190ba9f42e63e87fba2380aab22c925162437f2cc2
apps/backoffice/test/formalites-persistent-draft-state.test.ts	3a149cc792cf6295e44b84f26ca00a20a969e583e84cf4d5df0812f2be1ca4ec
apps/backoffice/test/general-information-form.test.tsx	777e4a38ae27b5d4a6a8779d4e8f3388ebe82a5857ef7eee819e8fb9efdcbdfe
apps/backoffice/test/general-information-model.test.ts	adf919ebc4dc9f0a0c61ffa3a6fc8851cb7593e9bfa7c41b2530c4f1d43f529e
apps/backoffice/test/google-connector-security.test.ts	d965d748794e19412f77bd8edf7eccd76140be5ff3edb816e7ce620dc72fb13a
apps/backoffice/test/google-location-submit-button.test.tsx	8dccb32335b6709ab576ead4474e26e584c97230e7b5cc4bbf02c8db0ef08d6f
apps/backoffice/test/hours-services-view-model.test.ts	f1eebae9c3e9bda57ef00c5a5c26245af7f553fed2ca4dd46b88a3cd093d2d17
apps/backoffice/test/integrations-model.test.ts	c1cf0bbcd092e45929917d22db55c8507b94ecbc97c5ed223c53135131f339ce
apps/backoffice/test/inventory-model.test.ts	b20cf5a61f1e5248e4e1ccd3510e3cf6020c91c71101b12c3fd7a55ed963200a
apps/backoffice/test/logout-submit-button.test.tsx	c02ff1274f8eacc106f593a1131d35d2943c00d3b8114e643a1bf420b9ee756b
apps/backoffice/test/personnel-contract-evaluation-corpus-v2.test.ts	e985fadafe56ebf6fe76d7e2f56fbb772373dd8c27cbbb68cc09ff9a34f367e2
apps/backoffice/test/personnel-contract-evaluation-corpus.test.ts	62682fdf720b457f6b18d31ad7de5bb13345c77e16bb3d2c1782e28660e100a0
apps/backoffice/test/personnel-contract-extraction-runtime.test.ts	fa3e29435eac5cb44ea97c2a53d7fb248cd10fdbc462e46a9172d401a2689dcc
apps/backoffice/test/personnel-contract-extraction-service.test.ts	40cab2b2de57a54793362bdabfe80e316686a16eda95e08b51594a601a96a811
apps/backoffice/test/personnel-contract-openai-adapter.test.ts	eb5babbeefcc6951137102ce6fb656217889a5f1611969b330e2a3d059df2b00
apps/backoffice/test/personnel-contract-openai-prompt-v2.test.ts	3403f001a6ed986eaee7d09147da87b81171f89d78183bee49ddd9b6307973a6
apps/backoffice/test/personnel-contract-openai-prompt-v3.test.ts	fa218332dbb6a8544b7ab8324d9630447d2c2a0ee7d2ef8995842bbcfa2b8064
apps/backoffice/test/personnel-contract-openai-prompt-v4.test.ts	975fc5bf0db4cb1a92b9cce11a8ef2b6f2c71838e75fb1d37a8053e92f624537
apps/backoffice/test/personnel-contract-openai-smoke.test.ts	b331517657088602a797c0d8abddf4d305213ada7a70f25df76a4f1701866a16
apps/backoffice/test/personnel-contract-review-store.test.ts	9e56d4da34ab48c26587f71dd936d63f101b1e18d247cfb31d0d1cd3ca4c61ed
apps/backoffice/test/personnel-contract-stored-synthetic-document.test.ts	3f66d22ec2d66cab9971a7f1596a24e492a01cc73bca7d85722a3833652fcebc
apps/backoffice/test/personnel-contract-synthetic-upload.test.ts	b013fca7c7d4ae54818343a3c4bbfdd656cd7994d5a8957906e75cf5ba177009
apps/backoffice/test/personnel-history-action.test.ts	6a4155ad622fb9178754ac9274b36ae918d66b21f6f86102ec60535270c84e83
apps/backoffice/test/personnel-permissions.test.ts	0127728f1c19da3b36344fa3f3e329dbab9dd7bce23e16c124245334741761b9
apps/backoffice/test/personnel-reconstructable-history-ui.test.tsx	579f8873c063e38cbbd217cfa7190e1a3f7f6936ca7b6285362843a32f02a87e
apps/backoffice/test/personnel-register-pdf.test.ts	7bf42deedddc624d9a7b48a85133ad97cdcb7a211f4a08df2cbe22222952a584
apps/backoffice/test/personnel-register-runtime.test.ts	809b5502996461b343f62d96eebfbbe5e4957b8c6aaff9cf2ed1b38a492a97f8
apps/backoffice/test/pointage-foundation-inventory.test.ts	1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa
apps/backoffice/test/pointage-foundation.test.ts	e3f091057b9c0f21bfd2ed872b9e435fc4330ae9239ffa8e5bbd51534ed3729b
apps/backoffice/test/prototype-backoffice-notice.test.tsx	d69e4e424d85d3abc163c825ad825623e37d29c633c23915b6d236229bcf0752
apps/backoffice/test/public-information-section.test.tsx	bc06dedecdeb0d597e458f8ac197231cce67fb44d6d596085b3160adb1c57e17
apps/backoffice/test/reputation-review-social-links-actions.test.ts	3eb692b5e351e8e6f053b95fdd6a99bd289f91dc68744188b5483028b35cc9ee
apps/backoffice/test/reputation-review-social-links-component.test.tsx	5d26a9b3f5892cb0b05e823d659b855e3b3ee6e6ff3c158c514c91ff15ef553a
apps/backoffice/test/reservation-action-error.test.ts	e791e014e7303e92baadb2f26c4212aa98257ce6631a455620de45cb29d2bd56
apps/backoffice/test/reservation-detail-model.test.ts	d87cca01d09434c44123452c37edb057ecc2074e937c42803143fd2cb9fbdb54
apps/backoffice/test/reservations-list-model.test.ts	e5db05c61e79cfde3176bd49eb426493fa1beaea4b0a2e2e8814cc9b7f5e92d9
apps/backoffice/test/restaurant-knowledge-loader.test.ts	1918630900b3cd00c63cbe5854459914c0ed374a8fa49721218b063ede4de6b1
apps/backoffice/test/restaurant-knowledge-permissions.test.ts	448dff89e48468d52c07b6aa14cf6adb040446b87ee3289c08922b97979c184e
apps/backoffice/test/reviews-model.test.ts	1b233090e8e5b0b33056fda169751ef5b388d869bdcd02557c46cb666e7b2c92
apps/backoffice/test/salaries-model.test.ts	6d27b06eed4a17bcd37926a1e57a2c8c1d27dc7f2e13c44e9eb86c1720901791
apps/backoffice/test/stock-movements-model.test.ts	4cb093cb33d91761504fe3ce636e7ff53ce49164edb488d8212ef11fb5661d40
apps/backoffice/test/stock-prototype-table-footer.test.tsx	73becf0526159a6e6791a9e1c1b07a016ec4f9ac936f6499575b7ab3fa0d7533
apps/backoffice/test/suppliers-model.test.ts	762d5e1f1f2140304360540921225bb240bf4e234bac95ed8f0d01e719788df0
apps/backoffice/test/tables-model.test.ts	5ebd5b526eaaac3cde554cb9059a007911462d22fe1e97dab4b96af3b496c17b
apps/backoffice/test/team-culture-action.test.ts	7fad055f1e6b3926f6768b4c87e320d5bf4b86ba12b015220f9d42422fcce857
apps/backoffice/test/team-culture-fields.test.tsx	b2516cc6e67cb515b0b8752c22b14c4da08c7e6c1bdcff28c63786a7e486401b
apps/backoffice/test/team-culture-form.test.tsx	cd56ace734eb33ca3c4020867639f9f4fd589b9a209343c4c8b2685525623ab4
apps/backoffice/test/team-culture-model.test.ts	36c2a25ae1a0b10f62b6eb684ac88d25f66804491ed837d4cd96a6cb84fb278a
apps/backoffice/test/tenant-switcher-submission.test.ts	1eef6392fda733c8983de6c9d12875207e9613c2baefc40295532f63ba51fe2b
apps/backoffice/test/tenant-switcher.test.tsx	862f104bbc11f6fb883b9444f383c0624d7371c3133f2425e0c5a4f78b8036ec
apps/backoffice/test/today-view-model.test.ts	164fb26c7fd7f2f0610ecabbf4a921b053eaa1cc31e033fba36f8aa713e4781b
apps/backoffice/test/user-access-model.test.ts	bc9e8540608d76f81b607e19eb4b4ad74a6db9b586cf28a1ee0a16ccd8b7f03b
apps/backoffice/test/validated-knowledge-action.test.ts	6b596ea3ea3f6ce118506b21784e47273440577ff008a54ef6218509ae5c208e
apps/backoffice/test/validated-knowledge-model.test.ts	0ede511b4271717f41012ae03620098994a8e83a1c16da4ed44cf5686ad2b481
apps/backoffice/test/validated-knowledge-section.test.tsx	bb5fdd46b3b4d2143f210cf6af68423cc99aa521be668a65b3eca11e88ced1bb
apps/backoffice/tsconfig.json	4205278f3399f28e874c49b461ab0c8d6d5bedd1da71431ba86665401e6eb3be
apps/backoffice/vercel.json	b2ca3677c797f6006864cf604eee0ad15713d2d2b5f8b8b8b6f74a683095f428
apps/booking-web/.env.example	e98cbbcac01c9e96583a46d570e98797f4ec4f74fc0d3c9f3079cbedb425e4e8
apps/booking-web/AGENTS.md	e57787b7f045ff999f17bc5c6d6b847df53ee0d0776ab6b556f97e642f7e81b3
apps/booking-web/e2e/public-booking.spec.ts	52b3264e7450e6c92a24a6023f9d362df8220435ad6cc7ed66bfb22a55e979b6
apps/booking-web/next.config.ts	939166f51ebb2f2983b985fb68525c8e6aa31ff50dfda357f1d1733b223c514e
apps/booking-web/package.json	4dbcad9e9bfff232398d60b76821186482aac4fc857134099df6e0a2b19c76d5
apps/booking-web/playwright.config.ts	c786134406e9df9c90a71a338b18233dfbe6c63762f167185a1a2938db61eae0
apps/booking-web/postcss.config.mjs	258faa39968594a46c2cf72ba120fb353e788ef2acc3265ddbfbc6400dd80761
apps/booking-web/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/booking-web/public/images/ChatGPT Image 02_42_21 28 thg 6, 2026.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/booking-web/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/booking-web/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/booking-web/public/images/logo-slogan.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/booking-web/public/images/restaurant-dashboard.png	c97abfa5677f08ef914f15ebbea1e515c3c829c7fe89511c003cdf7edddf2081
apps/booking-web/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/booking-web/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/booking-web/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/booking-web/src/app/[establishmentSlug]/_components/booking-flow.tsx	3332caf92e42dd2b9130cd65637a85168531811b6358e4acae965ac7c1b11801
apps/booking-web/src/app/[establishmentSlug]/error.tsx	edd2405463d2e7ff72649454822fb6252256113c13448541774210d420620654
apps/booking-web/src/app/[establishmentSlug]/loading.tsx	cb34acc85c5bbc950ab1ac06600ce22a50f7a99ddb08c9305d95758e0c070421
apps/booking-web/src/app/[establishmentSlug]/page.tsx	0bd141be2b1eecac931a3c892d3c823c9719e38bf508671c528be3e62ba08817
apps/booking-web/src/app/[establishmentSlug]/reservation/[publicToken]/_components/cancel-reservation-button.tsx	5560ce28591d6fdc33e8b94470214c571ea784962c8a1560b6054e292a5fb263
apps/booking-web/src/app/[establishmentSlug]/reservation/[publicToken]/not-found.tsx	5ee3acbf43535b3dff0c3ad1f51d854f1033e153b0f29ac61989412dc74536f8
apps/booking-web/src/app/[establishmentSlug]/reservation/[publicToken]/page.tsx	117338ca0514f061acd9f43eb42dfadc116c96f362eeb4c1482283466d721d7e
apps/booking-web/src/app/api/health/route.ts	ac5f1ac904205a17c45ed688a7648e8e9164012d465ece59fb3c27552522da40
apps/booking-web/src/app/api/public/booking/establishments/[establishmentSlug]/availability/route.ts	9bc6eaf738e76d3ecacef9b73f481ca60a603b72f98bf3a722857ee91d218b11
apps/booking-web/src/app/api/public/booking/establishments/[establishmentSlug]/reservations/[publicToken]/cancel/route.ts	f156243fca3f8d09f16d05b308f94d7f7ac40547481eaa817455e7a334fd622b
apps/booking-web/src/app/api/public/booking/establishments/[establishmentSlug]/reservations/[publicToken]/route.ts	0ad9524e9505b1a72e07236e17bedce7fdaa238b420856a7e8c1fe487bfeb477
apps/booking-web/src/app/api/public/booking/establishments/[establishmentSlug]/reservations/route.ts	c967b5477c4d63d4896ae7cba55d1127ec8336d4dcf220eae58db13aa7acb87b
apps/booking-web/src/app/api/ready/route.ts	c3d0356415dae44664580f59462143e71a8313d0ac694a2236118f46b1be1860
apps/booking-web/src/app/globals.css	0376fe54b03eaf0b7667e13667f2413eb7f013558e648043c4579de4dff01b97
apps/booking-web/src/app/layout.tsx	87fe7b03c2ecbc490fe224aad9e5bfbadc5867f036468da5a92088b1ef597bae
apps/booking-web/src/app/not-found.tsx	8ea2dee8ba0f171efef591d72fca5d000fbb73aafc39cb65796bb3b6290db08d
apps/booking-web/src/app/page.tsx	9e7f62ae083d9a6aab0757484feeafa70cb120c2e393a701acf26f68f766a430
apps/booking-web/src/server/cloud-database.ts	aa52a66fdf239af3c38fd995bfe36a88da77cd163a5c6ab719d7d58ef76c5c01
apps/booking-web/src/server/environment.ts	c3bd327e44e8c34f891a645c0d327e25feffeb3fdbae8dc40f7e44a6ee096592
apps/booking-web/src/server/public-request.ts	8518bd01a807be13d0496b84f1bfe1b8da73f68af7b9bd600abfc8eb4651b017
apps/booking-web/src/server/readiness.ts	f1323ac2aa5bcd4eb39264c4c01cac51265ef6f0597bff8d272f1ac90d71eec4
apps/booking-web/test/public-booking-api.integration.test.ts	f0f26fc205c90b1a570c7c0ca92cd1f76c880c3402de03bd2eb5535735deeae8
apps/booking-web/test/readiness-route.test.ts	1d5bf5ffcb53a148e172735f0b9de54cc5fa94fee967349e5807fa1fd6f3d778
apps/booking-web/tsconfig.json	033b5e2d7e8b2db0b3d9e286cf54b32a1e06c2e3cfbce5512ccd512b57e427c2
apps/booking-web/vercel.json	6dc1e0e720f6eb621ea04885da24e09965020ff47c1615bbf749d6e5cc41ee35
apps/feedback-web/AGENTS.md	6d36a1ce03e3744736b170ba11d9e338f39aa74809a2bfbda973f7bff1ad9ffe
apps/feedback-web/next.config.ts	939166f51ebb2f2983b985fb68525c8e6aa31ff50dfda357f1d1733b223c514e
apps/feedback-web/package.json	f9eb8b33e832752ef20f7d460c073fe7fdfa4b700316ba7855393d81dfa80fee
apps/feedback-web/postcss.config.mjs	90a413fcb7bc068b0643ea4f7c9e95ef28fec01e2d71caf9dfb2afa7067c4772
apps/feedback-web/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/feedback-web/public/images/ChatGPT Image 02_42_21 28 thg 6, 2026.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/feedback-web/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/feedback-web/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/feedback-web/public/images/logo-slogan.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/feedback-web/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/feedback-web/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/feedback-web/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/feedback-web/src/app/[tenantSlug]/_components/feedback-form.tsx	4a017f3b31a7a86f47813cedbc24423c4a5b79bca7f00bf732d4df5b007ad32a
apps/feedback-web/src/app/[tenantSlug]/page.tsx	4516929921806a2196510aba69ca088e2967dc06104c0515a5d2bd9c0669af4c
apps/feedback-web/src/app/api/health/route.ts	fe1aa4bcf423b46b3cfe3a920334784017d16c967a445d94a0a36ac874dae44a
apps/feedback-web/src/app/api/public/feedback/[tenantSlug]/route.ts	e5236be215e13beb59c1336521b93154118124d165ab1dbabc98ed6d164c81ef
apps/feedback-web/src/app/globals.css	9fb2818d8702fb7377a77c5f83550b30bd449f9ca91700d1c457f3ec1feef32d
apps/feedback-web/src/app/layout.tsx	e383115eef30c5429441db3a6ca41a1d7385c9ca094672b7ebc874730d955327
apps/feedback-web/src/app/not-found.tsx	a96fbecc1a73bfb0d6ffe09337ade882f81e9369e3bccf2e06e9f6843c21d918
apps/feedback-web/src/app/page.tsx	ee55f27a2c4492a8e2bed737d0abf7d367d041c8811988743f448f5a3f581561
apps/feedback-web/src/server/cloud-database.ts	5dac8698de727e49ffd0fead48854d0778a386ba2cad0c6b8761e55f16cd2d66
apps/feedback-web/src/server/resolve-public-feedback.ts	65cacade89d9ce73e2a89977e66e4907dca44657f6e0a04c4df322777a603009
apps/feedback-web/tsconfig.json	033b5e2d7e8b2db0b3d9e286cf54b32a1e06c2e3cfbce5512ccd512b57e427c2
apps/feedback-web/vercel.json	b2ca3677c797f6006864cf604eee0ad15713d2d2b5f8b8b8b6f74a683095f428
apps/site-agent/.env.example	7b7f605137617dc17febf819be1c399859fb4951e75216be5c553a1b0a3c4024
apps/site-agent/AGENTS.md	5e0ab1bd3aba9a2d799068fb0288b29188f87f56758bf65cb0051e1d7060ad57
apps/site-agent/package.json	6a82cd23f9bd7bc05ac4ac9a583b763ee874a0b8291fca96860a9c0b49bb196d
apps/site-agent/src/env.ts	16b66f2e7c3a4cf3a146f75e0b0fc2154f208fa100c3110779cffe926670c7f1
apps/site-agent/src/http.ts	0cb16b9da64bd586bd2a0f262f90fbba294e44a2cab5832b1810c23c24bccffb
apps/site-agent/src/routes/auth.ts	64e7149ed28d57d346dbeefcd65aa5c43177edfa65fa11e5068f94d2255cbb3f
apps/site-agent/src/routes/catalog.ts	0247d9e27355947a168f93048ffa42e338ed3df1a27edeac84bf3117bf7cef00
apps/site-agent/src/routes/customer-receipts.ts	c62b4900eb52db214c6ede37a03a7ac70b3187818b1124584232883814aa6d41
apps/site-agent/src/routes/establishment-profile.ts	28d480f3c48f28d7d1436518ac9ce7ef7c0269da97c4fe4de87d89ff6f392956
apps/site-agent/src/routes/health.ts	550a2e2cb8b78acc6434098a551370f6fad0b30721ac489a68c941872c5cf353
apps/site-agent/src/routes/index.ts	313cfdd6bb781dddb9061852e1359bb483fb645286bb304322fa29fc1b21189a
apps/site-agent/src/routes/kitchen-events.ts	40039fbf465104f151e309f0de7fe4ecb016bbaaf7525c333f7a0143adc4b5d7
apps/site-agent/src/routes/kitchen.ts	f5ecad76bc7f9c8448373fd3a39186a3cccfcc710691051dd94a1446d1f8957a
apps/site-agent/src/routes/local-users.ts	b37c156e75b8f7514fe6ed0ee7288fffa3b9213876b0bde701edc7bbd27a42ed
apps/site-agent/src/routes/management-reports.ts	90cec2562c039a98483cdf51c2e753cd90d41ec16128a91debbe8d2e625fb1e6
apps/site-agent/src/routes/order-items.ts	06e3e548990cce193e6c30390a5e157c68f12dda80ce4cc47a3681a10ffdc7c2
apps/site-agent/src/routes/orders.ts	3c9fcd72bcfcc0bdf67c933650126923819ab35bca8331f0c7314aa263394ecb
apps/site-agent/src/routes/payments.ts	8c8550267327f4ef3668aaad104d2482c132ab5d0f7166021afcdae526177947
apps/site-agent/src/routes/print-jobs.ts	043113de93c56f4b7f58cc6dd8522b245fbea6f684ef2c13e95a4d9705873558
apps/site-agent/src/routes/print-settings.ts	019d579368d114f89165a5669be6da5ae8388212681167f8e8e1d6efe0aa4638
apps/site-agent/src/routes/printer-status.ts	aba395e9bd75060ff07adce9c6e0208f299fb5e4eb1f2ca66e0e6b49eb3863a5
apps/site-agent/src/routes/types.ts	65ae5340fcc5fc1741f56e64bb3e6fac96174d2351d8fd887b08e71947264310
apps/site-agent/src/scripts/internal-ticket-preview.ts	e6769d33357923cc0e641d0ce6e26bf0262949bcd136b4a77f4f433469253182
apps/site-agent/src/scripts/receipt-preview.ts	e3abc653f9f5af2718a2fff8c33120a8cfb513344b024b523689eb01725eaecf
apps/site-agent/src/scripts/test-receipt-preview.ts	5bb208829f79da6b409d7fc9ff6b5b6bfc1c77934316540d5a1234ebf93f58a5
apps/site-agent/src/server.ts	b65cfb3a1146ccc6ca13c98459fef9eb317b24489e642340051d6f2584f0ea53
apps/site-agent/src/services/catalog-management-service.ts	fa324a8bfba478d62807e8e8945ef938014d6f71966276337789bbf5355f4809
apps/site-agent/src/services/combo-management-service.ts	a4c9c362a32c6968217be58055dd0b0889775172e67248a7a74ee0c357100009
apps/site-agent/src/services/combo-persistence-service.ts	2ba65511b26b34e85b61378b51bad408da21db82f3b6e33255d63bf2e9d525a0
apps/site-agent/src/services/customer-receipt-service.ts	9d2ae8a1a81650384ee51e0cf6c180147f1d7697b19291e0f855299c392a28f5
apps/site-agent/src/services/establishment-profile-service.ts	5aafb1b06902f522d9238ba1fe48fb89c58cdd82efef59fe447f1b53255cc1fa
apps/site-agent/src/services/financial-service.ts	2e0851d0372bb7578c0f060f5f6597de6137da3d0dc0258b17c9666b1e1a478a
apps/site-agent/src/services/instruction-settings-service.ts	26a092035f21a877a2f0b87494e97cd549cc4e446198b23c37660ed29c80a0de
apps/site-agent/src/services/instruction-snapshots.ts	251cd231ee06a1444619ccd6b2152e650d348a761369948ac0910f052030fa10
apps/site-agent/src/services/internal-ticket-preview-service.ts	c1cbc5bc32f4d69af878965ae05da8a13ded4214db1f3c1cfebc587e968ca842
apps/site-agent/src/services/kitchen-event-hub.ts	5f8c26bb3e6bb29eecb4c0fdf625f0822886895eb9c6b140a30c592ae9a2a4fa
apps/site-agent/src/services/local-auth-service.ts	2243ff4b13464471e2bd13cd75af67902f800c50b5ea43ebf721cd5add0098f6
apps/site-agent/src/services/local-printer-worker.ts	31d57ae520a00d207c84f08d07520bd7cfe9f765fd8227e4c9360197fda63ed6
apps/site-agent/src/services/local-user-management-service.ts	2e25164fa78251502b372e4d957952779ff4ea31c687d7757b7cb340da714699
apps/site-agent/src/services/management-reports-service.ts	4b9db417a5af17b58b8f1e16b5f70f1d1c7d7986817716c29ba876fb9adee805
apps/site-agent/src/services/order-command-service.ts	52683c5510a693da873338f95042966436694c0319b2ade4e66ff115c950e11f
apps/site-agent/src/services/print-job-service.ts	ac74155ed52c4f8549ad25df3eb89bd192b0900ea62ac2fa19ca5b88b7053d2f
apps/site-agent/src/services/print-settings-service.ts	27ea4693a0843ebefd6ba121b2ab9b5d667252b4a87ab199e231a4a7c1969a5d
apps/site-agent/src/services/printer-status-service.ts	d23f5be5fcc4a4ae8f3f39b48a70634208099a227c62f0e254f2120339925899
apps/site-agent/src/services/receipt-preview-service.ts	6ad3600716c4f9aa2cdfa77051d1c630f8fa21d59f36f2dff719b83356456c07
apps/site-agent/src/services/site-agent-service.ts	1abcc5bd28f4ca921936c5f504f739acc0864907f49308b5db73f98f91d04641
apps/site-agent/test/combo-management.integration.test.ts	b0e329dcf55418b23c27293c4950793e25f3bc4d16491ed1f234a28c692ffb80
apps/site-agent/test/combo-persistence.integration.test.ts	5f728fa794268727400755c51ab22086a58d590c125140422b12b65201511265
apps/site-agent/test/env.test.ts	beacacfd8e0f40692b87f9c6131f26f154199cd75ef2ef5e60701e020b05e40d
apps/site-agent/test/establishment-profile.integration.test.ts	e36a74b69d2b96549cc430422cab97429f787cd956b48f145dc6b2e1cc8d296a
apps/site-agent/test/financial-rules.test.ts	b2a42fb4c7950ee6166439528bc36e870267de9db5a7a321ba58c1025a2ca5ab
apps/site-agent/test/financial.integration.test.ts	c38800f41be9a42da7131bb3f2acccac7faa7ab8ac82fbb52a16d0adb33e6d2e
apps/site-agent/test/instruction-settings-service.test.ts	6fd08b3adcbc551062fdd1b31be1e019049a9ebc7b96639df7c0eb2c9b7ba607
apps/site-agent/test/instruction-snapshots.test.ts	70db7a8fae3de0783707128b2e946c2a66cf41e8c6c73b0bc4253f000bb27465
apps/site-agent/test/internal-ticket-preview-service.test.ts	9cd9e45863eadc4dd398b52f08f9a7dee4f41718ec259884b1576b25e45cdfad
apps/site-agent/test/kitchen-event-hub.test.ts	5fb6373c67dee1800839c72dadff339253c27dc811d37812569835b065bc2e03
apps/site-agent/test/kitchen-read.test.ts	d893d35b2c68687e9a94ea967e0532f98f8e9d449bea01d07f6a4a7338627042
apps/site-agent/test/local-printer-worker.test.ts	0afdaf405de93a391c27f834c631ab8fd5f7d4b31c6af199c0da64ce4c54e232
apps/site-agent/test/local-user-management.integration.test.ts	593f1943278a911ddc628dac55aade693b3775969f7019d1f84103b0be35d68b
apps/site-agent/test/management-reports.integration.test.ts	210407cccaf79ffca4120efdcfadff86d7e0b8ddde78f86cb41fbf3bef5d6f7f
apps/site-agent/test/management-reports.test.ts	c8a0a9bcdd1479502a6ac57ca634461677d0c69cac2cadf7e25d1a285b48e772
apps/site-agent/test/order-command-service.test.ts	504c48e33476aa359ab70acd1673c62e8ef9e781ca4b893230ea9f8272647805
apps/site-agent/test/orders-home.integration.test.ts	90574f6cbca743860428c282690c68b05e77a2b4f36665004a69ba37768ba83c
apps/site-agent/test/orders-home.test.ts	27622213b705dd31cc6d47d60b59897079420448d9a6a67f8981335167521dd5
apps/site-agent/test/print-job-pagination.test.ts	418412c6bb1776def3664b99f2d5eba3945969fdbe8f067a48a07b8fa9d4333d
apps/site-agent/test/printer-status-service.test.ts	8cbb0ac17aab2fdacafa730b56146324204529d9c3038faa8deca099394453eb
apps/site-agent/test/receipt-preview-service.test.ts	bc5dde96c6f8b5b7598ae17598384c1392ab29d8276d276b0715207c6ca8e353
apps/site-agent/test/server.test.ts	a5e4d186ff98bcc388a885d8bd1d766fbda58969e9ecef85fab347d70cff365d
apps/site-agent/tsconfig.json	b80843710110ef964fea2320a908a19daa0d5a6c286fca82425ae02748e4ee9f
apps/web/.env.example	b64af9a65df935503555dd5339a66e788677d3ca7c3c9b8876efa9f387d1ab38
apps/web/AGENTS.md	5f38a25285873adf9b200d18ed26b1aa609998eb3a209b4981326044f28900e6
apps/web/next.config.ts	359d3b93b8e3a926d0c6ad3e260c73e4e12d60d2d1c6a9974fe97ea17f7d4dad
apps/web/package.json	1880814418066eb2935557a9208ea1648f62aa5e30695f0a5eceb9aa63534830
apps/web/postcss.config.mjs	4cae941be9bc3bee9a6905e47ea7a51aee216d587d34a8cc4ae48f78fd6d8159
apps/web/public/brands/google-g.png	d1ce9c2af0b10a7333abc99bc706f9a6a199e5b65bf3e3009624f076b8638e6a
apps/web/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/web/public/flags/fr.svg	a526851c372e3372b1596be71af355ea72b1650bbc4c06e6e2c226900d3de6cc
apps/web/public/images/ChatGPT Image 02_42_21 28 thg 6, 2026.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/web/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/web/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/web/public/images/logo.svg	c4137f0c11dccba6efd26e6622ada66c78fb88692c3e2e35465168e12059312e
apps/web/public/images/restaurant-integration.webp	080a9d253df96738e1a082fe6986304e3b44c85066f5a741cacb8562269d2d4a
apps/web/public/images/restaurant-team-service.webp	f9252a81b88957d30427c096cd58a0061509777842f59ab6243f8eab742dd7f7
apps/web/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/web/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/web/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/web/public/site.webmanifest	d1fb0c213742eb9f597e9df6c59c34a81b696fc32bb17270c34bb4e95728807f
apps/web/src/app/a-propos/page.tsx	13a4be29fee310a122e7b4018d43ffcf540e7492b2fc0053274a80bded2c147c
apps/web/src/app/api/public/tenant/route.ts	b36934b79738afeab8065b301f0c1a282e69940a0b8f8385085bcc417e3003d1
apps/web/src/app/conditions-utilisation/page.tsx	ad93d79c58e67cb0e9c8c4805f8f9d4b20c15d38615274a1be83079b1409cb8d
apps/web/src/app/confidentialite/page.tsx	ef75482f5f162a934cab81cac7a4dfd53f1d279b35291f51959fbd9eccd1a1f0
apps/web/src/app/contact/page.tsx	1fb5c3dc5213d4cc48f47a7a626603571ddcc7902dea165a049919c8fdc26689
apps/web/src/app/gestion-des-donnees/page.tsx	00359193a5289db004abe63fe84bee88fd86b927247bc3493bd3d38668d0f95c
apps/web/src/app/globals.css	9fb2818d8702fb7377a77c5f83550b30bd449f9ca91700d1c457f3ec1feef32d
apps/web/src/app/integrations/google-business-profile/page.tsx	eb7dbaa5771642d3b5581803081b90871705c3efcfbc52eb928a5ece1a9ef2ab
apps/web/src/app/layout.tsx	6edf3626b587a7e1cccfd6ad146c6f65e6740e0fda887a8b9b174d1661b9c459
apps/web/src/app/mentions-legales/page.tsx	2f8bce42a3bd4ec7dab888d1a2c8351f7e6550363d0b4ab5877f00e943abfead
apps/web/src/app/opengraph-image.tsx	e79534d4e8e10ff361c868e4ee8c646ddc9c8dbc653d42509d5ceb8d2025f5ad
apps/web/src/app/outils/[slug]/page.tsx	fa15c632b7570c53b4c91c60d000d8b9efbeb30aac2cc27f7a19bd41696ff217
apps/web/src/app/page.tsx	7627be8840b7518b6c60a8e3af85a072bfa9ed1045f7a10da3f4a5e708452a44
apps/web/src/app/pour-les-restaurateurs/page.tsx	101f86582e19b8211bc320073b2403940e4c9748a3a8d344eb12210d3592b13e
apps/web/src/app/robots.ts	8ced26932a2f4cbbf531ff477208f8593357a1c43dfbba633189caaae27d67a7
apps/web/src/app/sitemap.ts	9838e5f3f67435767a387f7cab44f634dc92fbc76754cc2ff5288f3e15a78ff7
apps/web/src/app/solutions/avis-commentaires/page.tsx	6a0a0bcb019649a25da229952b53b80028f4df93569454fb952c7d8300ac8264
apps/web/src/app/solutions/page.tsx	f0e6ce25ae9706af0cabaebe5845c8c2ec4a7cd567fd7975ae4413691d7205fd
apps/web/src/app/twitter-image.tsx	fb6c476aab6a2b9f4ee9bee90e214be5b47455f72edd1b8692367e5073279d0e
apps/web/src/components/marketing/MarketingShell.tsx	78fe8904a5d14621085e37fc3725ce9379291eb8189f25158626dc76358b1a62
apps/web/src/components/marketing/PublicContainer.tsx	859a2376cc1e7e602c4a4601a0fa9e348604415810fa6f65f72b67435011e9e4
apps/web/src/server/cloud-database.ts	77e117b9f62f6e76a9a29c03e6bbc6dd8664a969ffcbb726c38d1e3d90902ebb
apps/web/tsconfig.json	109c9e59502ccce6b8984ff49b14bfa0ead8268180c09c4f9bba4bbb2b1d650f
apps/web/vercel.json	b2ca3677c797f6006864cf604eee0ad15713d2d2b5f8b8b8b6f74a683095f428
apps/yuta-display/.dockerignore	770198fa9677d825e16556eb578ffabf134c6be342e9558dc41fa7c0714022c2
apps/yuta-display/.env.example	d24e579126403806c3e63cea8d1dffec4c23aec1bb3a8f04f4d2f9cf89fdeea6
apps/yuta-display/.gitignore	8c569f022872e67ee103265601d577b356f0cd3409f4b3f5d9da052a45f882b0
apps/yuta-display/AGENTS.md	24a7aaff66c7099215dd5342f08b2aa4146a3cfd8651ed1b6cd448473de48f2b
apps/yuta-display/DEPLOY.md	c0b7abc148afeb977bf8f1582b6fb03221cda71b6432aaa292b96078492f9e8c
apps/yuta-display/Dockerfile	4ec1a7eb6b33b423410f70fb91aac8a1e3de084dcf6153f7a7b20c71e3a3a2f1
apps/yuta-display/docker-compose.dev.yml	17e2fb34c01ccac976d8db401043deee562fea06b428233e609fbfc8e9ee7128
apps/yuta-display/docker-compose.yml	250a16a22ea960603462594f47e46b2cc86552aac1b511a8e5dcc46db43de32f
apps/yuta-display/docs/MVP.md	73a88122762a141d52039cb5e6761af16e70df23beeff140d551d29990397f0c
apps/yuta-display/drizzle.config.ts	66d5e7b2bed69ad1d80f23e02456c359405de35f3759f39758dad297547c2bfb
apps/yuta-display/drizzle/0000_initial.sql	d50f05cb44e95969a2e802ac5a5a9ce8eb8e08caf597c3018922b3e056fefdac
apps/yuta-display/drizzle/meta/0000_snapshot.json	615206f464a7a0ab96144af48d2fa7d494658bff9fb3695df63a9d118a65a2f7
apps/yuta-display/drizzle/meta/_journal.json	2c0e6208cf91a524f96bdd40de959ca9756e47de0f28367db28464d96d84fc9a
apps/yuta-display/next.config.ts	85e1dde7e25024a2e21ff4c7ca5cf3080fec7d337777dcee3772f674eeaec3a1
apps/yuta-display/package.json	5365b90ec6fb3d45c682b1038bca253ed01191aaaee90ed8eb6cadb14ae32dc3
apps/yuta-display/postcss.config.mjs	4cae941be9bc3bee9a6905e47ea7a51aee216d587d34a8cc4ae48f78fd6d8159
apps/yuta-display/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/yuta-display/public/images/ChatGPT Image 02_42_21 28 thg 6, 2026.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/yuta-display/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/yuta-display/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/yuta-display/public/images/logo.svg	c4137f0c11dccba6efd26e6622ada66c78fb88692c3e2e35465168e12059312e
apps/yuta-display/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/yuta-display/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/yuta-display/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/yuta-display/public/manifest.json	a4527189b51cce55aac1c8c17a732980f6e40fd65296bab707b900bec6a7387a
apps/yuta-display/public/site.webmanifest	d1fb0c213742eb9f597e9df6c59c34a81b696fc32bb17270c34bb4e95728807f
apps/yuta-display/public/uploads/display/.gitkeep	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
apps/yuta-display/src/app/admin/_components/AdminShell.tsx	cbf81cb93814446bcef3d355685f5155df185a33dd84ab61e115d3f412451a25
apps/yuta-display/src/app/admin/_components/MediaActions.tsx	260c9305e855fdb1da870822fc6fb38ffda11c9f7c99322ba2a36808b9393418
apps/yuta-display/src/app/admin/_components/MediaForm.tsx	3aec713f66d1d46fe29125fcd07e10421e80ba1a29ca34008f4495f6c9834f13
apps/yuta-display/src/app/admin/_components/MediaList.tsx	94751b6524805fd9fda7ae07edf6c185fc147e42918df720ac6916540909c23f
apps/yuta-display/src/app/admin/_components/MediaPreview.tsx	4510c69ebe353abaa310d76a7c37c0b18e10b913e6d24b8072d73435ecf8b71d
apps/yuta-display/src/app/admin/page.tsx	8189c683493542b7d9cbd0ab6d5035b49de6e9d48c0b172e828455788a4118d4
apps/yuta-display/src/app/api/display-media/[id]/route.ts	b5390509f40869920f7bd39dd8cf528d46df6a7881092fe3c7018589ff3ab92a
apps/yuta-display/src/app/api/display-media/route.ts	67e5b497b6e2ca96626f20576c5c4f7202632acde728f5fca166ab313d981c8b
apps/yuta-display/src/app/api/upload/display/route.ts	1a671e0e5ec31f223cb45b578c7bc26310ee0b15b19a33c88d6fe770c43f6bc1
apps/yuta-display/src/app/display/_components/DisplayPlayer.tsx	a9be4383230bad0efdb311388ef4574bebafaf284403225fcd78c22d0737efb5
apps/yuta-display/src/app/display/layout.tsx	a06e2d09fdea91e5e05ebaf2834386dcbe5596dd70b8a20297acc5eeb96b3b3e
apps/yuta-display/src/app/display/page.tsx	b49b01622e774e8721d2d31da91539f23a7ccf40429ce116429a1776df3443e0
apps/yuta-display/src/app/globals.css	9b2da60acef4a6fc04ddb83798bef4a798f120ebbdad08a54077c8f22dd5b8e6
apps/yuta-display/src/app/layout.tsx	e101aebaaae41e4740d6650e60c57651a457bffabc2d433f6b603bb99eb79ec6
apps/yuta-display/src/app/page.tsx	2942c8ebd740fb5402219e437d9508c0e93e91c670ca389dc4c5d2b2c202befe
apps/yuta-display/src/app/uploads/display/[filename]/route.ts	ed2c71cc96bb4f1d55851ee758ae0c239f0c8b2d6f74dabf859717b38a453a86
apps/yuta-display/src/constants/ui-text.ts	b4aaa8304996b2025b31cc980e7e81a9e3d2031e04ea4662e8274a494471d83c
apps/yuta-display/src/db/index.ts	0e76845240a92c0cba798c794af9dcb7991097439e2d4f714fc8751ed755e027
apps/yuta-display/src/db/schema/display-media.ts	0c65b8820085d55e82e9e0958580cfca366f75b0888148e1bbafe13806670060
apps/yuta-display/src/db/schema/index.ts	f1e4ab582784482b61f495701ad5e42eefc14fa01295f5247c07eab7912a7fe9
apps/yuta-display/src/services/DisplayMediaService.ts	05447322a78ef810cc18cb9d9e6c2b67dbf9dfbc8ed2e09b210eb51c91cb73af
apps/yuta-display/src/types/display-media.ts	899ebaa60c887905f7e01035f2cb98b1420843058f0feed02860cf7360010427
apps/yuta-display/src/utils/file.ts	2f6d84610f6ff54d3e4e3be3cc4687e9e57cf95006f8c9521d5cd4d81856cbcf
apps/yuta-display/src/utils/media.ts	19498f87f1cd7fc96a49030a262d5997aeacb73ae0a4ab5fcdab904c70cadbd2
apps/yuta-display/tsconfig.json	109c9e59502ccce6b8984ff49b14bfa0ead8268180c09c4f9bba4bbb2b1d650f
apps/yuta-pos/.env.production.example	dafb135894058fa764b82c5d78ed47ebcad6c084f88aa3382203710f2b25d5ba
apps/yuta-pos/.tmp/prints/.gitkeep	01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
apps/yuta-pos/AGENTS.md	eb4d56d033498c82a6a3afcb0565ffe60e3d361ada24ebf5c00e6631d7499d11
apps/yuta-pos/Dockerfile	4d64c198a3fa7369e9407f3d9649b953657c42a20dd5886f35ed288fc41f0d5f
apps/yuta-pos/docker-compose.yml	462a98ac815a52c7a17414e114a9736d796aaeb42b3691819e30888441976fe0
apps/yuta-pos/next.config.ts	362c910ac3bc36ae522d1abb2f1262f0c9c063b6e33908f192891a50826e0166
apps/yuta-pos/package.json	33c529454ec5311d30a420fd089d355dd29aa4e6af5426b21490c773ce5a75c5
apps/yuta-pos/postcss.config.mjs	401bd0455c4fad221dd84a0dacec26c99cf609e58dfd79091f8c49fcadef8a63
apps/yuta-pos/public/favicon.ico	0812959d774d42484a36a4bb5d3f6c3b865e7587a40a831165962aa14ec912e3
apps/yuta-pos/public/images/ChatGPT Image 02_42_21 28 thg 6, 2026.png	e294b7300115726f85883dcc2caf712101c06ed431fa2da8d8621cdf08e138e8
apps/yuta-pos/public/images/apple-touch-icon.png	41ba8b4ff20add28473366f05e1b424c03bf6995e8598b174f2d2e513946fb5b
apps/yuta-pos/public/images/favicon-96x96.png	8d75c7d2197162da671f22f7103d8a583551938806cdd33c89785723c65f976c
apps/yuta-pos/public/images/logo.svg	c4137f0c11dccba6efd26e6622ada66c78fb88692c3e2e35465168e12059312e
apps/yuta-pos/public/images/web-app-manifest-192x192.png	1d667717a4c83d99bdd28fa52322229f2cbe10a0925ffe37cfc7701abe72685d
apps/yuta-pos/public/images/web-app-manifest-512x512.png	095f4dba0795694f119e3b66684a032479518ad72546ffad7f7cc98b785f8696
apps/yuta-pos/public/images/yuta-logo-padding-giam-square-transparent.png	9cdf0bd289b9eb9495fe35fe0e5a2cdbe7ffe8142c09c84c3c2e73837d526e33
apps/yuta-pos/public/site.webmanifest	6cf9abdf3e19af05f29a1ebd299ec87b0426cef7d29a61eb2fb48631a182cc2b
apps/yuta-pos/public/sw.js	f15be18c9207417c6d76fd363ffdef4f9898efb8cdbca99951707bdb661861be
apps/yuta-pos/scripts/backup-db.sh	798203a354865d4efad5160febab090936a5b0c8f2e8f04dd1d58b40a1eca777
apps/yuta-pos/scripts/restore-db.sh	3e297be9ef70d06ac9d7d6b4610cfee3f1f6deeda7c3c17583fca90ce010650c
apps/yuta-pos/src/app/_pos-helpers.ts	0c3155297298e1cf7f353b807dde247d0a5125808968f28729727818bb15de5a
apps/yuta-pos/src/app/actions.ts	9a674e4eb7995624bac97e3168fef5dc2b2d46fca7c5741079398919d0162911
apps/yuta-pos/src/app/actions/kitchen-actions.ts	3883497c6a0f344f9ba486878064ed6e3aafbff217a1abb8013a24b8f2d17354
apps/yuta-pos/src/app/actions/order-actions.ts	49c89fef574f4a5d0cd00aa138fa1bbf770599c9873e372cc4253c2a7da1409e
apps/yuta-pos/src/app/actions/payment-actions.ts	9b18b32eabf36d1f2778f26ccf39eec658f4402e7a7917d9d4942611f87e4131
apps/yuta-pos/src/app/actions/staff-actions.ts	20f398fde7d4ac65185826a56c449403e12e2765ee0e5f88315f3daee9164ff4
apps/yuta-pos/src/app/api/health/route.ts	813d4b798a5a45163c583f091c7274e5ed5b938067fb0e7e93bffb7732cc281b
apps/yuta-pos/src/app/api/kitchen-events/route.ts	e6f10dfba88f82cc07b34a7004a2f92012d6becced5542506b403fa70b0eaaf0
apps/yuta-pos/src/app/globals.css	0c99708551008600f286b2a20fe5eb29eb05dfaa64175830d770dc85ba380483
apps/yuta-pos/src/app/kitchen/_components/KitchenAutoRefresh.tsx	1b273c5102c421f0304a1b9416109576ecb48fd08beaeacebe6548eebc177f5a
apps/yuta-pos/src/app/kitchen/_components/KitchenFilters.tsx	d4d16854b652fb8045f6001e619072376f53d77c6cf363135efa83f47b3498e2
apps/yuta-pos/src/app/kitchen/_components/KitchenItem.tsx	c8429fd1c9f52bcf4145e065870a6c962a4ded8efd15243d0ea8536ed5a3931e
apps/yuta-pos/src/app/kitchen/_components/KitchenTickets.tsx	2e703bf8a37e4bd925764dab68c7fbd31f4efe9b29f71a20b2bc45a0ef195eef
apps/yuta-pos/src/app/kitchen/_lib/kitchen-live-updates.ts	6c367d3c3e54baf7bc1df70ee0df25e85c0928e5822bcc83ff5cdc81a06f2625
apps/yuta-pos/src/app/kitchen/_lib/kitchen-view.ts	a7c7a5ed76f07f2eec11d1a04092f635570997f01d3359db5daeb99550cca96d
apps/yuta-pos/src/app/kitchen/kitchen.module.css	837cc12ffb44314977b3ad11286d95cfb046f7b793229799cdaf75a5a5b17ea0
apps/yuta-pos/src/app/kitchen/page.tsx	d9ef85e9509be898b61add1784b4c8564b2da7ed0bf3f354831d05e004605f1b
apps/yuta-pos/src/app/layout.tsx	5824f730a2c9ea34252fca912bad9cc08dd071a2babf9b8137904496e1d7b474
apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx	9d93412739b41efe3057bc8fa5a0e427c02aacb05d4297cd2e1ab477dfb19514
apps/yuta-pos/src/app/management/_components/ManagementModules.tsx	57cf7903c9c1d0046b45f4e36ee5b1671e309345376da76877890b62ed84c4f4
apps/yuta-pos/src/app/management/actions.ts	b9d36d2437a3c9e7a45c815c918bd49389d1cd88ac46b5ed3205ee232027262a
apps/yuta-pos/src/app/management/catalog/_components/CatalogCategoryDialogs.tsx	5fec7c1cf9191eb0514eb5b5c592b26860e2e0d68aeb90e7980f994787e6f691
apps/yuta-pos/src/app/management/catalog/_components/CatalogDialogSupport.tsx	b212d6c2710972e9fbc511e0331e46d16daf93603d3c5c11c23ddf755f0f9ee0
apps/yuta-pos/src/app/management/catalog/_components/CatalogItemDialog.tsx	88408853476bfdf29c7def50cbc15ba67e8ac9eeece6cc9437d9aff39855bbb7
apps/yuta-pos/src/app/management/catalog/_components/CatalogManagement.module.css	3b2d11c1ac82eb5f7e9ff4c99d3056a4484e8309abb13f856aa190adbaecfd44
apps/yuta-pos/src/app/management/catalog/_components/CatalogManagement.tsx	b3bf2fff147fdf019a129aba732ff89022d6c2c630b1fd7947a87bafcf20fb90
apps/yuta-pos/src/app/management/catalog/_components/CatalogOverview.tsx	48135c59eb957ba08c53439f910a5c78d4b8cb153fb8619191edccb80e87d92c
apps/yuta-pos/src/app/management/catalog/actions.ts	a3b3011668c5492cbf0346119749968104d8332790b98035c759c19be89f2a32
apps/yuta-pos/src/app/management/catalog/catalog-action-state.ts	f002d09f3f4cd6554f0e1c8c2285cb3c28d8933bcd90d39e22c3868dae00fe12
apps/yuta-pos/src/app/management/catalog/catalog-model.ts	3a10c0b122de44672e2273f282aaa63c0d95c48c764eaa40a7aa78493f76c276
apps/yuta-pos/src/app/management/catalog/page.tsx	08d5ffddad7978cf7d5cdfa6790d91db5b74c01390e5387fabf597fd056c9aa7
apps/yuta-pos/src/app/management/combos/_components/ComboDialogSupport.tsx	e9664ab41c793123992f268bcdd575633bb0f5ac183e4e8124ab7c3c6e9cd453
apps/yuta-pos/src/app/management/combos/_components/ComboGroupDialogs.tsx	2c7bf745319501d6ac42e98454da32e3d580d062603460fd63845021106d2908
apps/yuta-pos/src/app/management/combos/_components/ComboManagement.tsx	9ba0a31d6d92a1745682a3fcccc2b202a8de075130a320f044a13226d6654657
apps/yuta-pos/src/app/management/combos/_components/ComboOverview.tsx	02a0d60af9bc6d41d2e0c565da1e61d9fa01d6cfd6373877aaf26a5710a507d2
apps/yuta-pos/src/app/management/combos/_components/ComboRuleDialogs.tsx	97c13575a359812b96a59b93da4eec1ea78cadd309fdb049ab2fe5fcb13d74af
apps/yuta-pos/src/app/management/combos/_components/ComboSuggestionControl.tsx	d94987ffc536f21c279e55872bd430570b13df0774c02e1ce33e594c51f84ed9
apps/yuta-pos/src/app/management/combos/actions.ts	fb5dae3137b55bd0ea1a1d12fdaed7382e0525c08d6363490067f0fd8fa55d14
apps/yuta-pos/src/app/management/combos/combo-action-state.ts	333679cd791377efbe6b8eddc64d43bb5057d217c7de89d78685950575007b56
apps/yuta-pos/src/app/management/combos/combo-model.ts	a6df16236a57afd635203f623cd4f471617bff60b272294125fc31ed75426a26
apps/yuta-pos/src/app/management/combos/page.tsx	d5b4c767337a72d807610b38088fc409d74fe4abd2eb779518780cb8e5194046
apps/yuta-pos/src/app/management/establishment/_components/EstablishmentProfileForm.tsx	7ef9cf36ff692e0dd31b759b611772630f9a0421037c501fe7924623648f0666
apps/yuta-pos/src/app/management/establishment/_lib/establishment-profile-action-state.ts	69368b900c21bb5fc0f6ea250d0c21f2133830e13c2f90cccc32df159a3830b5
apps/yuta-pos/src/app/management/establishment/_lib/establishment-profile-form.ts	31ebb77983b76e1be91b4a0f83db919bdd88fba5f68fd0c46ab4dc86a4a59ec6
apps/yuta-pos/src/app/management/establishment/actions.ts	8e7d3c755bcd0064c73b16154317d409fb58f66352765d40b6cd77242c6035de
apps/yuta-pos/src/app/management/establishment/page.tsx	760a0dbf1d12b717071b3a93735443b20b35d9c29893078353794f3e258c9238
apps/yuta-pos/src/app/management/login/_components/ManagementLoginForm.tsx	37bc82ca4a693d465b4a15a2be3cd238d9071b6c9b45123b68969dbcee919177
apps/yuta-pos/src/app/management/login/page.tsx	086c858f4f55a6f67f3b7541fa94a76ad94f64ffd997d6bc2ea839fd7f71c78b
apps/yuta-pos/src/app/management/page.tsx	74467a08a350531b71d77a0567d956a157e6470978541ae1497547da4800d317
apps/yuta-pos/src/app/management/printing/_components/PrintJobsCard.tsx	2cfc83b55115edbd38639d6b24a8b4b8f8759f71465311942827acf120d9985e
apps/yuta-pos/src/app/management/printing/_components/PrintSettingsCard.tsx	e5e9f6e7238517c18a7b2513ffab627e39b4656b5b4a2d543b1f1a0f5ca9696d
apps/yuta-pos/src/app/management/printing/_components/PrinterStatusCard.tsx	a200e5ef98e81d722f7245ffb2f63f963a2cf47c071a5794f6f3125ad3cd669e
apps/yuta-pos/src/app/management/printing/_components/PrintingAutoRefresh.tsx	3406700a52dc255cf9cdec4f203d8c44f7d856072271391b8ab091b48e12a546
apps/yuta-pos/src/app/management/printing/_components/PrintingManagement.tsx	c9f4177b2fbac633d15f9095dceefe2712a5633311df0d310de1170115443604
apps/yuta-pos/src/app/management/printing/actions.ts	0c184593a229a7aa8bca3e9f2a8d278af6161dfa14eeb06ba52b26b500402f4e
apps/yuta-pos/src/app/management/printing/page.tsx	050bd2adee8585954abf5cdff4cec00e59e4e61a42af34a27c1c0c9e9ee11420
apps/yuta-pos/src/app/management/reports/_components/ReportsPagination.tsx	84eec05e4377173bdf2e084a09cd0a76be2a49d0e58dac2c90552b25b2dc590c
apps/yuta-pos/src/app/management/reports/_components/ReportsRefreshButton.tsx	b49baff2db3454cfb345027701416a55100e415f791fbed3fd3ca5da62b2a226
apps/yuta-pos/src/app/management/reports/_components/ReportsView.tsx	8cef42b79eda8415f6b3e7e5ebc86e4a17e239e9d27452931409f45e19d718eb
apps/yuta-pos/src/app/management/reports/_lib/reports-presentation.ts	bb08a4754886aac0218d80b8e5b53d9d6dbeaf090d760dbe5cde8cd99a64e956
apps/yuta-pos/src/app/management/reports/loading.tsx	4dfd17ebd643230f05040f29643e306d2e03d1abf39dc50acdb2f90b22c3ef8d
apps/yuta-pos/src/app/management/reports/page.tsx	44cd266f662de58ae06981c6488d36e1d28c1feab91c6f39fdf8d3646bfe8aa7
apps/yuta-pos/src/app/management/users/_components/UserDialogs.tsx	5d55f537cb74bf494139508b3a8f902cc34717b5a723de147e50d5e946ebb6b7
apps/yuta-pos/src/app/management/users/_components/UsersManagement.tsx	08df01b86b30128181a67483f3e8684902a10103be11b3896258393d0844f123
apps/yuta-pos/src/app/management/users/_components/UsersOverview.tsx	1a2958e7a410eb2405978a5c5753bc91a4970819b85e58a5fe96d2158ddf99d7
apps/yuta-pos/src/app/management/users/actions.ts	c9cc55aa81fc6c795ca5531539634286f070f369c078dc3049972d2f21ffe883
apps/yuta-pos/src/app/management/users/page.tsx	af665386325c279bff565469e90b9db738ae1b9eb7079df6a629c40775ff2b8e
apps/yuta-pos/src/app/management/users/users-action-state.ts	bca09c4e94dcfedd6ccb72ac7978833c6d0c26d309428bcbcdd6a5714795ab0f
apps/yuta-pos/src/app/management/users/users-model.ts	2782cf29f6a7bc176e4f7ec110db78d97cce319313f35a0939942ef415e02b4f
apps/yuta-pos/src/app/orders-service-day.ts	bf320d1129a2218a02aab9584977f124cba8268b06505f18ab3bbda84acb8605
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderArticlesPanel.tsx	cb30929e34e3a3ec7119611cffabb6a7991bad99bc5be91b9a00f806709df283
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderDetailActions.module.css	b81fa2dc6e0abf849a9f0c44556a09ab5d5d6db364bdead3cc3f6771fc98fd77
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderDetailActions.tsx	ff10092bc6132131700045627a8edb5d888a77ae364c722744d7fd84e0eeb704
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderInfoPanel.tsx	d174f3b55ecf46d096083e421074ffe150f01351c56e9a41cf9b52f96bf64983
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderProgressPanel.module.css	6d27b81f42af420fa34be07b158743e6f4d7adeb4feb61631817f38e9654641d
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderProgressPanel.tsx	64918e5a6e08d682558d17e3af49c9a063c7f253909e37c25ca36b19a1293eb4
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderReceiptMenuAction.tsx	1ac07f4efc77148f97bab7aa47e3dcf8f0205646bf0b7a48cc0ba31a6a392549
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderSummaryHeader.module.css	883e6ce9908fd442d2ea92df1a2d6cc0c63f60d38d6be40c3324ff413a68e09c
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderSummaryHeader.tsx	4628d645262567bceaa23e1243e04660d5a47cf3c2989d454ee11230816a8a12
apps/yuta-pos/src/app/orders/[orderId]/_components/OrderTotalsPanel.tsx	c992a44982e6aef1ee26c2bf176ff9b7f3dc02fb8b2cb413edefccdc4a829c59
apps/yuta-pos/src/app/orders/[orderId]/_lib/order-detail-presentation.ts	6b98ac77332095afe9886a802f8952e0b0286eeec3e6bcfef90d8e72038a1379
apps/yuta-pos/src/app/orders/[orderId]/_lib/order-receipt-actions.ts	074700ff027486715ab3129020da8448ff28c32a27c869128f24b4b2fd78f09f
apps/yuta-pos/src/app/orders/[orderId]/_lib/order-receipt-presentation.ts	ebdda4e6ee50310b384d4345445ed416f6b7aa9700f8b6538b34dabf3295914f
apps/yuta-pos/src/app/orders/[orderId]/items/_components/CategoryScroller.tsx	e4e8a7483e9e7b62e5d96fc780ed28bda2b350b4e2cda8618fd723934738ccdf
apps/yuta-pos/src/app/orders/[orderId]/items/_components/MenuItemBrowser.tsx	32e4a3d677cfc5307690841cde03668b36bb78b65c7f8e7b4f1a4e75d5a4beb1
apps/yuta-pos/src/app/orders/[orderId]/items/_components/MobileOrderDialog.tsx	0acbcc05ae571aa80bcf7d026da316d1dd74301da200c055ee88173cfdab6d80
apps/yuta-pos/src/app/orders/[orderId]/items/_components/OrderItemNoteDialog.tsx	50ef3cf30aaf0356124d003c65f9e5a5272cbdb8e5aa0eb03e7959b5b033725b
apps/yuta-pos/src/app/orders/[orderId]/items/_components/OrderItemPresentation.tsx	1cf56a0b2808def5247b20855a732b8ea19b01bc172ac6b28f2839355eda5740
apps/yuta-pos/src/app/orders/[orderId]/items/_components/OrderItemsSendSuccess.tsx	d5c6acfa45a76f82b179ded7f2583355fe3d61544ef7ff409de79fd52c51acb9
apps/yuta-pos/src/app/orders/[orderId]/items/_components/VariantSelectionDialog.tsx	b3a1bba641d374f4e42063bc67d6c1911d3c8518e7cd573e3db3705dcff1d1c3
apps/yuta-pos/src/app/orders/[orderId]/items/_lib/combo-completion-suggestions.ts	466fe86fbbd6bcada1b0041e5c10e910468700a241645dc2af633e1604ff3888
apps/yuta-pos/src/app/orders/[orderId]/items/_lib/combo-suggestion-visibility.ts	505771a1ba2659f86b928a1d4df42ff17f2a2942f940df07b4c2fb3acd59f47a
apps/yuta-pos/src/app/orders/[orderId]/items/_lib/kitchen-send-validation.ts	81bff2905aee3230f013172cf1ed7a16aa3b4bd3158f3df4a7948590664e1a8e
apps/yuta-pos/src/app/orders/[orderId]/items/page.tsx	e0f302e8dfead13a891de77b65f78cbe77195e760d957732c6ce2df68267d25f
apps/yuta-pos/src/app/orders/[orderId]/order-detail.module.css	2337b71254f25c6d3e6c1c4b179e1f7ca80c89a6aed785cb0538ba39cf49da90
apps/yuta-pos/src/app/orders/[orderId]/page.tsx	ef5e04250c6c41fdd695668b7807c92be995cb47e0c01748686e8b3cd43c39b9
apps/yuta-pos/src/app/orders/[orderId]/payment/_components/EqualSplitDialogContent.tsx	aae5433959620e0da1efadce5a8f1abbb9f751380c396c530b6a7400ea5cc58c
apps/yuta-pos/src/app/orders/[orderId]/payment/_components/ItemSplitDialogContent.tsx	3d89c9f35e79374bac95ed87957e3eced9edbe63a20e563cf5e8f57ab992e03c
apps/yuta-pos/src/app/orders/[orderId]/payment/_components/PaymentCaptureForm.tsx	cafc2624fcd0bfb90396fce64ca9aa4a7c6f23769c567b93103881cff409ca02
apps/yuta-pos/src/app/orders/[orderId]/payment/_components/PaymentChoiceDialogs.tsx	e5977a4fee547ff7e5aadbdd56b3a1a63c839d2509dc8b73a3173b65bb7ec9ca
apps/yuta-pos/src/app/orders/[orderId]/payment/item-split-combos.ts	251d013f018863dca64f9b18675fddd5e1d31fdcf9b08aa9979ae6d164abf182
apps/yuta-pos/src/app/orders/[orderId]/payment/items/page.tsx	13b2379a7359e8327c4ff66f71ac748e5eb9f4d14ad1a532f00c1cebc1d86745
apps/yuta-pos/src/app/orders/[orderId]/payment/page.tsx	f8b7eea4e9295f21bff993d7edc7d3b20b90152b36f96703e4e482b4f4ab233d
apps/yuta-pos/src/app/orders/_components/KitchenSendSuccessBoundary.tsx	aeef1b6cc8ca7dff3a0ec861d4ba2e91fda67c43dbd51a37efd857dbabb40618
apps/yuta-pos/src/app/orders/_components/SendToKitchenButton.tsx	be70ddc887cd2419a040a32a2e6d2b4182afa0e98c291e05a91e163cb170dc9b
apps/yuta-pos/src/app/orders/page.tsx	218f5644d343cac41878dba27e8f034a42482d231694624a3ec679e7c52c3f23
apps/yuta-pos/src/app/page.tsx	b8366ac2e51a24ef503efa7eeaee9e4060df7ddb55a8ea2f3c6967321c804489
apps/yuta-pos/src/app/pos/_components/OrderEntryForm.tsx	c88f98caa9f63d8126ff7fa5dc65507bf5f8cdda12dad50b12ebe3e93aafee6b
apps/yuta-pos/src/app/pos/page.tsx	32b020a3e47aef7c32b4d837fec3ac5a2f647637fad27549cd6d0abfae625890
apps/yuta-pos/src/components/orders/AllergyAlert.tsx	c8922a99f81cdb5d00bcf07fe0209aae7b599b33e2caa33ca7e366a564ced601
apps/yuta-pos/src/components/pos/PosConnectivityStatus.tsx	3024010f75cc12ac3d67ec897f22e18cd5d5839b3eb0f99f1fba3cd5aac5a1a3
apps/yuta-pos/src/components/pos/PosHeader.tsx	367610b0e2cca9ddc786a35c4d7ef49273f1f62070fff10f8971497926455fa5
apps/yuta-pos/src/components/pos/PosHeaderMenu.tsx	9d8db8754f87aeaf33dd02dc0af6a565eabd8da77866ddf69c1b92f38d2dee49
apps/yuta-pos/src/components/pos/PosPageShell.tsx	298e917f60e4c1ebb4726c10e9b951a6cf761b6a18aa502b8885ccf526f7c680
apps/yuta-pos/src/components/pos/PosStandbyProvider.tsx	93c46c8bcb6867afc3d5700e36f324a72f020bec143002b92a2822744d0e8319
apps/yuta-pos/src/components/pos/PwaInstallPrompt.tsx	5c3612cb5e9c10278d2bf43fddf1daec8744f8603453d0f042dc588d5e17f4d9
apps/yuta-pos/src/components/pos/pos-standby-schedule.ts	27be170eb3936583b9800c6102239aaefdab8949dc04d91bdf13bf41abbc27c6
apps/yuta-pos/src/lib/pos-api.ts	1f552fd16b9ceef6af895c44290f49f002d1fc14f3cd47910c5324d7b5055b63
apps/yuta-pos/src/lib/site-agent-client.ts	6b7f684b0d32596b81cb160d6c51120506c988c5ac1833813a05a93a47c5b8de
apps/yuta-pos/src/server/local-management-session.ts	c6f719c64f6851b81968887506ed50dbfc8c1e09f7d8b500cba86a673a434eae
apps/yuta-pos/test/catalog-action-state.test.ts	fbb270dc34e3fa7bb07430c996c505cba38729b7f99098a26039b757781e0deb
apps/yuta-pos/test/category-scroller.test.ts	92474ed624fd8e8e74218285ececc7774f08951dea4c00a44634c0f186375abd
apps/yuta-pos/test/combo-action-state.test.ts	21640d86487c94878bd1eb419fe59a2ecc9916bb653d4c3d276fefc9815fe99a
apps/yuta-pos/test/combo-completion-suggestions.test.ts	ccbbdebe0867f3b2dad28cbcea551f1a7610d6a5cc0628ea2fc1eebcaf63ae96
apps/yuta-pos/test/combo-suggestion-action.test.ts	fa32282ce50cb17b719e7493363b5707fe063506e8c24dbddebb155db22e8fde
apps/yuta-pos/test/combo-suggestion-setting.test.ts	2c6b05b71120a1699cb9b7f4cd3fa2ba300acc66e467c459396705e28f237350
apps/yuta-pos/test/combo-suggestion-visibility.test.ts	c11434f7c151b8d654f173499520988d03804c8c2b0a3eacd361ea1e9e02abce
apps/yuta-pos/test/configured-order-item-action.test.ts	04501ed97c7fa9d75716070e1d46548a8db5b5c6cfb668b3d650849166d8306a
apps/yuta-pos/test/establishment-profile-form.test.ts	77142afc9cbc86c7ef63de4bc9a98d1175a6c4f24027b50d53b8b3894a29c578
apps/yuta-pos/test/item-split-combos.test.ts	d18170cea95ce67b06524cce7f4b7e200b543d39b1ff323bad0088310d2e1cf7
apps/yuta-pos/test/kitchen-live-updates.test.ts	93aacdf9e93cda9bb5a93741eec3d59fabd0b147306560fd72c848c66f9f7ecd
apps/yuta-pos/test/kitchen-send-action.test.ts	2fb5b9700cc9933298d1db6326b9710ab13b584c5959b92670f7081f2a1f3f35
apps/yuta-pos/test/kitchen-send-validation.test.ts	5a383838e800cb26211da76ea4cd41d3e38b503ac22f48aec2f1c94aba4d9441
apps/yuta-pos/test/kitchen-view.test.ts	3030f065d1eb9cf57e625a01975ea48843b3471a65ff494a6700031fa7a6f5f0
apps/yuta-pos/test/order-entry-action.test.ts	8e1b7361c3e94a4360b990824279bc22f4ce43483762334d6449a266a2db24bc
apps/yuta-pos/test/order-items-send-success.test.tsx	525185f33378bd3f3fba49d38f34cb9692e6e733869188799ef70788296e883c
apps/yuta-pos/test/order-receipt-presentation.test.ts	8d58de5ade287cfab1f2c25d555a613a59d3875a639b55ceabacf2fa26dc3049
apps/yuta-pos/test/order-totals-panel.test.tsx	e55d1a0897e018c4698290f847e1a0ac82c5caca28e5a193a5605539660341e1
apps/yuta-pos/test/orders-service-day.test.ts	7c63c6e21e5157bbdf931aaa7059aff056bf6f2c9783d83e74955fdd0edc6c0a
apps/yuta-pos/test/pos-header-menu.test.tsx	d53a347addd34452d632a266f59397e732eed991a99e0ca3cebfd96d4f0c86c0
apps/yuta-pos/test/pos-header.test.tsx	15493b4d82be2262229e100a38a56e0993ea735668e8407f65701a7f8ce63463
apps/yuta-pos/test/pos-standby-schedule.test.ts	be5a719ffe73e9d9dd8f987b7bbecfc6d84a902cada289bee1a41fc22ae5e895
apps/yuta-pos/test/reports-view.test.tsx	163691f351f0bf89b5fb4921a40458eff4c15f193c7af4591941a8db8af55c81
apps/yuta-pos/test/server-action-modules.test.ts	4ff87f791d6841b0fc2ca5d0020fcde4b3f16edd38326d0192c5f93dbd3d2261
apps/yuta-pos/test/site-agent-client.test.ts	42e61cb387771e21df01c87efe17a08df1ed6ee194d38c7293a9716300862059
apps/yuta-pos/test/users-action-state.test.ts	1bd4178614afc936a22f7a1a5e42d5db3ee9c9570d6fa4dab61772d9c7c98f15
apps/yuta-pos/test/users-model.test.ts	5acfd515b0fa21144cc95940bf3463564d1bc8900b663c2d77f75da0235def37
apps/yuta-pos/tsconfig.json	109c9e59502ccce6b8984ff49b14bfa0ead8268180c09c4f9bba4bbb2b1d650f
docker-compose.cloud.dev.yml	70c1cbd47c7b85c8969db302dd71f879665b7338dd52720bab77c81dc025bca9
docker-compose.local.dev.yml	1c50d575332ac0eb3c76c5b51c2744b1918c6cb5734499ce992115379ca981b7
docs/AUTHORITY_MODEL.md	ff82cba785e2f81d9605f20aa9d311a3d7d8abc4008384fabc159d54b949e01f
docs/CURRENT_STATE.md	ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b
docs/CURRENT_STATE_SLIM_PLAN.md	9b3669981b910e6f53a6ef592f87868ea5c9cd5ca947b213de0d25e6ca184fe5
docs/DEVELOPMENT_WORKFLOW.md	892db065b41c932152ea56bd55f043eb6ae94d5181894ace69cb26746b8f2b6f
docs/DOCUMENTATION_CLEANUP_AUDIT.md	1838913e56c2830ec4587090316af753091fb7ae69fd038fbc52ef67e08a3d9f
docs/DOCUMENTATION_CLEANUP_FINAL_REPORT.md	7fc17b6ac1652de1c38f3d49757787dac7f110ed58a6682d822b76cf028c4b44
docs/DOCUMENTATION_POLICY.md	d998a5b5f836d59ac062e7a87a0e50372cffb70f8883cdcaea1cf04175119e4a
docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md	5081390fcca571cde2f5f51957671ffa522835cf7ed578fda25cd6c7549af60d
docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md	0415eab196922e9a3a2312a6dc521b689f1918726d8a32e81197edc3125129e5
docs/LIFECYCLE_STATUS_MODEL.md	8f9f45a918f37a538d211e1981f7109fbbed6543d0e28b6eff91d89d9a8e0b1f
docs/MODULE_REGISTRY.md	5727e1caaf374dd9611a79e5447f68b781a826f61ccfa27b53ac9693607f5481
docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md	27e7cd6a621c6a3f490949041d0d87e1093ffa0d6f045f4356ab39255a0b4a8f
docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md	312674dce339b11cc59002278bdcdb09a12535b86d26f8a2f358d890cb8e0c55
docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md	edf97a0988b6edfa26c4acc04c89ff91eec6ec8f6df3ac16d3b50d1c895d1bd5
docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_ANALYSIS_REPORT.md	e68c0f238631b3768e85cf86ce25102a561d6bdae666728a3d2a4628c4ef7fc4
docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_REPORT.md	ad494067293399d428573677d3aa8a0b60133e724a0f6967e71431b27e4435a5
docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_REPORT.md	8eb9b5544da7632e24cd69b2a6a7cb99faadaa212930a1e5fa44adb656bc8cac
docs/PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_REPORT.md	f8c288dcce63f0b42104af0e00381f353de7b4949e456434efe336aa6b51ed5f
docs/PRODUCT_KNOWLEDGE.md	4249d0ef9caf3da7f6cc703eb182305f186e82bf14b820765918b00ce1ff19c9
docs/README.md	5bcf60ad959e26cf4f32c7a740fa55615ce482ce674d5352bf5dc0ad216b23d9
docs/REPOSITORY_MAP.md	0b87f015e255d7f78154bbd79aaa98edbf12a86eaa87ea773a1ea6f0eaff09f6
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md	b76d13f5cb929ba30ae13ed7e74679f28b7991201fb4336c13867b95feb80b05
docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md	779de9bcf2c6ee0fdf380303c96876e8dbe38fd31a7f610394dac93f80054821
docs/YUTA_QA_PROTOCOL.md	f05089427b6550b64f96d6e098f362e18f5156586525f310c647c131e647aa24
docs/YUTA_WORKFLOW_V3.md	2e10a64ec93fd10927439dc803d515919accd5ebb77b0a2c4119d2d92fc4c4ca
docs/YUTA_WORKFLOW_V3_APPLY_VERIFY_QA_CLARIFICATION_REVIEW.md	cfbd4bc0cb1d94bdd8b1a464bc21a42b61bfd4450782ce10e62ae79c73309308
docs/YUTA_WORKFLOW_V3_DOCUMENTATION_AUDIT.md	f256618366791805323cde90dc7a7ed74ce48e79dfd81d612bd7a613235073fa
docs/YUTA_WORKFLOW_V3_HISTORY_CLEANUP_REVIEW.md	52d610560e02b8ce0524ec025bb47904949bda3698bf4fdb147860d7527dd955
docs/YUTA_WORKFLOW_V3_LEGACY_CLEANUP_REVIEW.md	90cebf46a1e9dc945af87119e01004ee203460ff816985cb4df8c3312ff0f98f
docs/YUTA_WORKFLOW_V3_PDF_B_REVIEW.md	b6a569880d08e512fe853be9443c54260356ca4fd415482395fb4fc2133a637a
docs/architecture/AUTHENTICATION.md	c92736abbc1192b18a06923e5ead5ed7416c4610f8c0dbd8ae639bc65cfdf4c8
docs/architecture/DATABASE_BOUNDARIES.md	833fc791ec80e487c8f079af951dd35006dc27102e2a9f8be7c4ef347a3ead5e
docs/architecture/DATA_MODEL.md	1022e45f8f56748e8ef9326deb6824c35b4ee0945016c69ae05ea754d04f999b
docs/architecture/IDENTITY_AND_MEMBERSHIP.md	515e3ab673914db49e01aeda1bda7c05f7053628435107566df8fdeb19ca1578
docs/architecture/OVERVIEW.md	ec83802f61facff522007346ca0ec2111698dea6ac81211cf19289bd944824c5
docs/architecture/TENANCY.md	33f07d70b7e08fe61fe7c74b3865bf818dabbf6986061e1ea11c793bbb79b68d
docs/archive/README.md	239cebcb031daaeccbfe40c053909b6198155ebc78e40e1729b9c2553695f010
docs/archive/knowledge-normalization/KNOWLEDGE_AUDIT.md	e4bb4e32711f048efe4d8b790f99104766eaa42fa27c31f549af3ab44ae6d153
docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md	b64b2552f443f934fcbce610742ba096121a21e1bcd6e72f60815d86f99737d1
docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md	d2868540f14588fc63a1023a4d4c656ade4c87a11d13b1c912a4bc7d35e47716
docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md	91bd52894d8a47298e413c82c14930ed947ff7ae509381a19af21f5dbe4eabd1
docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md	b67b76d8e6b68a94164849e06abcac607136ef5d6fd0847bca69dd87eabb4aaf
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md	c3233400c564b178bfea043a3377ce9dbdf6eef129c974c30ce6cd54a0cd061f
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md	eaaba0ec35c84752b6611e83956a7ee940c7e95c58dabb602add33d8843fa5e1
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md	076ce2c81cd01f730712bbd99b17ccfce2c295659bdcc4d48e20db33838a2297
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md	a32137c77beb979e58e6ef302dd6a40260c582da7975917d6234b85d74bfe89f
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md	ce8aae0936e8da8cf2612d0c7800467f1767c1df880365f4b6fa0d91e471fda2
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md	0e897d0298b1edb364fb8d30af347a7b571a50c5de6bf555a1f1aa7cd6b88799
docs/archive/yuta-workflow/OPENSPEC_BASELINE_AUDIT.md	4fa6fddb6e7d970df8d56d4e72e4be140eb07129d4c72879618c1ee6ce0fadbd
docs/archive/yuta-workflow/OPENSPEC_YUTA_ACTIVATION_REPORT.md	37e97f27077b67908e8637c3e081b0cc7269acfc085e7aa6d10afad5a160a6be
docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_IMPLEMENTATION_REPORT.md	7480b195342afa010c5bc247f11fc36e7301479dcd210112e07156a3929369f6
docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_HARDENING_REVIEW.md	a021db6f28bea4126ca629001134a3c21fdbdcbdb41bf06f0b345e5a972633d8
docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_REVIEW.md	21a7ea245d498a4bdb5329f3b683f85cc00d05bc3c94663e339dd575fe4bb5d7
docs/archive/yuta-workflow/OPENSPEC_YUTA_SCHEMA_SMOKE_TEST_REPORT.md	4342950287b321c4ac518232a5909e96b9f1996a97fbda502726e7b3d6a04953
docs/archive/yuta-workflow/README.md	d7d74cb17614ec85a7f2fcf6cb923f14c32dc5c72f3786d97314e6b4ecc71af8
docs/archive/yuta-workflow/YUTA_AUTOMATED_CHANGE_WORKFLOW_SETUP_REPORT.md	f93e50253b881aaef8963f1aa865f9383ef71c9db3bdea73e3f5f1a3f12409e6
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_ARTIFACT_DECISION_REVIEW.md	27dac4f0ec867d049bbca2adee2a83b12727076e2d3afa3d5ee7ad606aff68d0
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DESIGN_CONDITIONAL_IMPLEMENTATION_REVIEW.md	9402250b957f49cedd17b299677ceb2be27238e9e756ee74866929d09df044f0
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_DOCUMENTATION_REVIEW.md	bca9a97f9bd12ba37233ddf78b19e65a8bcd2ae399494f3a6c5abcc9960d127e
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_APPROVAL_REVIEW.md	ddb61cad995c2146664d115820437c7c4766145ee4458d7ed319636b217e98bd
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_PROTOCOL_FINAL_APPROVAL_REVIEW.md	a267ddb9508a8f65ebfa69e4414a7fd08036d553d0ffb2f4bd1cf7c55b97318a
docs/archive/yuta-workflow/YUTA_WORKFLOW_V3_UPDATE_REPORT.md	284558efaa35b814ed97b002b4b114c3f52c56c51e75401b49ea9ab9b0170365
docs/archive/yuta-workflow/reference/YuTa_Workflow_v3.pdf	16998bfc5912dae1e657298de08bdc49aee9fc7361432cd2dbcfb1d8cb1d0d0c
docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md	26cfc8e0e0805a2a716909a18cfb86407f85eb508eefe5657e5c50a64e158ff6
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md	3bff5078465adc49a91db004dc527cd9fdedf0b3ef435e34affb0824b2a83550
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md	44f10bc1956b130d26fbe2a5ca37bcbba8e12e571608d6448ced5be26af52e6b
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md	1c09d910450fd7d1e32b35c6c86f0beabd683b2bae6247fef73b30e71fa7ec36
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md	eab95cce27be4f9e76b2eb3e854d01bde059066f9ac60a39fc9645dbb2a01269
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md	98b375dee27a9a112377ed2feaabe1f7d505ef5c37ab6ec60f6e40c335559880
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md	d226560949cd6ca073b907fdddae71d3bc17e7e161846fcc9c1703873e985e62
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md	d48f8dca326d38b874867dcd20f641eaa9c6385333010ab6224cd04a57c3f289
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md	7843820f9cf323127c7024e2e44530ad330c741832983b7a3685708793503012
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md	34f4264630ea7d07428fa58e6409e7a4eb7815250848d27b193225630e49fd0c
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md	e2a5517077d2234001c8cb7c0e9b8027b099b409b04d6b26aaa55d2574465f39
docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md	14538a6aeb70c26552811935cabe5f3729608a6b2d462ab78c05017aaa19dfba
docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md	35cc642ac6b26b40b6611bc1be16b19a52a35b68489d67e9fa24c133f37f92c6
docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md	fb8a8c99dd340ee7a1d8e5594e07a679a7666d8ddfdb5b5fdff0bbf10dbdac9b
docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md	82e0af41b0509074a4b5559ebb0dca82bbed4c8d07134c588288b9e2485e16a0
docs/decisions/ADR-000-template.md	44d565e5667a22b4eb3048138fba24411ea72c278b357cdbded77d156fce1ea6
docs/decisions/ADR-001-runtime-families-and-product-visibility.md	ff6c37a3985e6aefa00722417b272ec229fbe6cb500ebdc2a2d341ffe0bfbb34
docs/decisions/ADR-002-independent-public-booking-application.md	c6437e028cdf956a0140070b434b9f1d1b2d770add139b83398654171f6341d3
docs/decisions/ADR-003-database-ownership-boundaries.md	7129db7efc61f4e1d2b77d287f779f43cb2c8956dcb5da1e5bfa1916cb7eb53d
docs/decisions/ADR-004-independent-public-feedback-application.md	d546e292278a224ef2d42d2c2127db0b2b23211e1c0d86eed87633aa5d350e4d
docs/decisions/ADR-005-today-operational-steering.md	a6d4ff668eef43a1ba4c5d8c4d4bb851040ac888856fec3b80576e4797c5bd23
docs/decisions/ADR-006-cloud-establishment-profile-context.md	a3be48011544495a8dbc9bc1d5721df1251f3927e6f887a784ecb082eb49b286
docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md	791d58e75a1b123a934cc59e7e0fb53c21de23242212f5a88a24fb54a0d76276
docs/features/establishment/README.md	3faa9733f0422b39c1959758beb2e06ee2371810680eb89099e83da3b11da815
docs/features/establishment/general-information/README.md	2cd26adfe88321fb22d69d18d79f472faa0da49b9f1f7bcea2e212faf43cad62
docs/features/identity-access/README.md	6df71086f496151b4fa4f8e286a6e3db83233db140a9d154ff4c85adaa653e36
docs/features/personnel/README.md	ac6e0a1baf36dd0839de1e9c8d36613f773852ec1644d21b9e3f867b29e6922a
docs/features/public-booking/PRODUCT_SPEC.md	a3e411172b9e0882f82b085e96e6330af897289897769ee0f9f998ba41ee90de
docs/features/public-booking/PRODUCT_SPEC_REVIEW.md	cf27c840a3019948861bbb0ae9d5cc17124c518578ed0b7e657a2a6874869a83
docs/features/public-booking/README.md	b51c5e6983df460175e4ebb7228d4c90d704688ded981989ec605837875a6f9f
docs/features/public-booking/STATUS.md	9b1656ae975b4931fb613e5502266aa019086ac26abc44dfb8a9e55f80c38071
docs/features/public-website/README.md	2bed5ea90e12f5b1e81f0ce3517e1cb7d5c9927174f3db842a1cf6fbe10f5b37
docs/features/reputation/README.md	4246fae12135d328470780af294713f15e3b0d418b02a41aee60964d30e7ae18
docs/features/reputation/STATUS.md	1df9c82d22a18b2bdab2f0ae5d8c20a31f464c4f007c74d3ad2929b439ef8cc1
docs/features/today/README.md	d12a339f9fb3d6158fbab7422f0fcf4d2be95d4240b9fccb813bce72c5c20157
docs/operations/DEPLOYMENT.md	9c4a2233738f674fa0967f4a7aca2689865472498c557139afc08b131ab4b3fd
docs/operations/EXTERNAL_DELIVERABLES.md	918451975649aee472982387b9ffab866906c51af15b2b0fa6dee60a715d9432
docs/operations/LOCAL_DEVELOPMENT.md	2caa95953125c42e86903128d51a5720bfe86603d1f80b1739571b783467a715
docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md	ad9331b77b419db193a50d7f2b6ffbdad9111ef06101b0072674afcd8087bc73
docs/operations/PRODUCTION_READINESS.md	8e24615545a5246c353fe8eac7786e1d20a4d9d901012d119efe850ab5c73223
docs/products/display/README.md	dd372907428852f3a5805a16cc648cf5d21e519b252f40cbdcccf4fdc7cf7e3e
docs/products/pos/OFFLINE_STRATEGY.md	75b1ddf1590a0fa4755045fe78f685936f518737459af7c33e43a9a026904f15
docs/products/pos/PRODUCT_SPEC.md	04b7723ffd89ab739682f50914f7416a8529b8044218b5e4ed3a4e473de71fa8
docs/products/pos/PRODUCT_SPEC_REVIEW.md	3a1aa3d910feb87cc86c800472dd3e7b2998c7b2a51eed9470f297c8689f0ba3
docs/products/pos/QA_CHECKLIST.md	4610c92ef8f8480f59e25e8678beeca78f23aa842bb8bb52e92f7ec9ba5d1f84
docs/products/pos/README.md	229e831871450ebaf0a4e91832a15376985f3ff473855d6d78b0985232620217
docs/products/pos/USER_GUIDE.md	29fb0bbf1cdf0f06bf8c9c051bc3aef3d24c63bd2298865fb39b037e6f844cdb
docs/products/pos/site-agent/README.md	11c05ac1fd10020e1f32370d1c6fb8558338939d5ac7373b6b7e2b4b68d82b2d
docs/reference/YUTA_Workflow_v3_Official_Guide_B.pdf	a9a00466f4df49bdf6458275b412d06aa6c08176fed2e09113edbd7e9a535036
docs/reviews/README.md	ed88147a3bf5e3d8d8237f777177dca6864fccfb68fb0b628ed2e45e6c25cb55
docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md	03cbb892029eb01c8bac8b48e7c301458e21acde4940c4c5f71f2a08eea6c15c
docs/reviews/async-interaction-feedback-foundation/02-specs-review.md	221fa3040d8c5756c5f00dd9a0d42ec18c314bb00c8f0b286c4f1c3eab628b92
docs/reviews/async-interaction-feedback-foundation/02b-design-review.md	52a893cf59c6169fb0cf2897a10910903ea054c1539a635007b2f42ac99dc5c9
docs/reviews/async-interaction-feedback-foundation/02c-tasks-review.md	0c4d155747fb4d19e830debdebd65fb5d65f14fc3eb72ee29db1247d43aecb6d
docs/reviews/async-interaction-feedback-foundation/02d-apply-review.md	ed9a067cc8cb807ebad8d2677faf671e683c63b998e79b76790c525455e94d55
docs/reviews/async-interaction-feedback-foundation/03-technical-compliance-matrix.md	90d79e21c54319079bb7426b6a2b9890b7292a7544e4570e5db18f8338330ee5
docs/reviews/async-interaction-feedback-foundation/03-verify-evidence.md	d810fb044b8bfa511648726e48fb39e937ca291af63ffd072bd939ab6394c144
docs/reviews/async-interaction-feedback-foundation/qa/1024x768-formalites-save-pending.png	4cc07c8bfbb6f19ed15b694413c88a01e3f7f6e7e273f1cf260e1fcb842f2d15
docs/reviews/async-interaction-feedback-foundation/qa/1024x768-general-information-pending.png	f3cdad9de7461fe14b85b932c5249d068e91ec47c543ed7a12b6409b1c4f7c0e
docs/reviews/async-interaction-feedback-foundation/qa/1024x768-google-location-environment.png	dd3c30ad294b22c27d8cb5e101bb2bf184ada98aeb50fbbac23d639b6407b2ef
docs/reviews/async-interaction-feedback-foundation/qa/1024x768-logout-idle.png	a16a3e6c54033dfe52b3092406ad7ddb5f45750f3fe3b5aaeb920f6997f16e68
docs/reviews/async-interaction-feedback-foundation/qa/1024x768-logout-pending.png	33cce6a81744a5c49b09260a9fc46a5ee492efb41e4125d71e31f8e3ffc9ca91
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-formalites-create-pending.png	23050e5f41bc342aea834a6742680daabf8c4192a18a38ed143f197fc4a0183a
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-formalites-draft.png	ff6145d7783830d18e201095cc34441d9bac783cc94a78de57c187513ab0cde6
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-formalites-idle.png	66c360518080e912ec4b3dab59d433ba417d32b6bc42e64f5992e17e48cf4412
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-general-information-idle.png	eabad2815d2207af70d59ccbb5f7963f07a90057002bca126a1d4340e8a23bcb
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-general-information-pending.png	5e32bd92eec77627c2f470c601aec9b3b4fe08d6bf571570dcd2a6f3421080a6
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-general-information-success.png	b491453739c09ed36e4a28cfdf338a9c0f3cdbfbd59e5eb099928b2a0bda7050
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-general-information-validation.png	9f0b19e30dbb4288757ba81b7b0f93566a010bea96556e93836ce3df05a43568
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-google-location-environment.png	7a4668c3cbf1713fed89ddbcd1035e5826d9c856d8159ae8533a9aad706ea004
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-logout-idle.png	2ec12f5fc22b0dc5f9828a40ffeea70a49cda87f8571b5c6a9582005fafee700
docs/reviews/async-interaction-feedback-foundation/qa/1440x900-logout-pending.png	30253e25a53166fdeb6f85a948c22d13f19d556c97b03b21c554ca517cc4b8e7
docs/reviews/async-interaction-feedback-foundation/qa/390x844-formalites-save-pending.png	a8eb19758be6ea506a78a9b073cf3f74fe434d8757d368e9056de0439d846e48
docs/reviews/async-interaction-feedback-foundation/qa/390x844-formalites-saved.png	b539291357160d4f97f20a37968dc4e422a3bd80d7a582b0cf78bc4dd7ab99f0
docs/reviews/async-interaction-feedback-foundation/qa/390x844-general-information-pending.png	cb6d9b62a314ad670f120bbec9dcba4ccb34161f87ab002b01b37b9bed0e2ccc
docs/reviews/async-interaction-feedback-foundation/qa/390x844-google-location-environment.png	bc8321999baf1c7280a6315cce902b9275fa569beee039c9eadc46f95d318f2c
docs/reviews/async-interaction-feedback-foundation/qa/390x844-logout-idle.png	069d15e5c7c7c93e5ddf98439edb89b75c10fca9f78ba94e83694f8c9c434225
docs/reviews/async-interaction-feedback-foundation/qa/390x844-logout-keyboard-pending.png	14714a1a68be7fec9358901602535c2556e49c35f7519c78da7b4545278984c2
docs/reviews/async-interaction-feedback-foundation/qa/768x1024-formalites-save-pending.png	57910c0e16cde786ebeaebbc6a9f3a53ed30b556455ae864b7a8cc6448055e9c
docs/reviews/async-interaction-feedback-foundation/qa/768x1024-general-information-pending.png	96eea1e097a4fd3261be9f6f66761842def78f5c296fab8f1dd2bdbf447e6eeb
docs/reviews/async-interaction-feedback-foundation/qa/768x1024-google-location-environment.png	b33adc59d0ec4be55a9bb3a2b2bcd482b7c960163d42d787b108430825c891cf
docs/reviews/async-interaction-feedback-foundation/qa/768x1024-logout-idle.png	383186e009826c923825628bbaf5f7af56245bf4e503e72891e07dfd6c227046
docs/reviews/async-interaction-feedback-foundation/qa/768x1024-logout-pending.png	48eb52a4070cdc32d518d54e06d6286368bd14aba673742443adc62856f030a3
docs/reviews/async-interaction-feedback-foundation/qa/QA_REPORT.md	d81995606bc9530b3568603d71e0a05f0adc0c0405ef4b8aded01ed1d1352a09
docs/reviews/async-interaction-feedback-foundation/qa/screenshot-manifest.md	fbc40431d35807eec69bb8ad57fff0cb5d0b8869d4ce902310c8ce10f3089ae3
docs/reviews/authenticated-establishment-switching/qa/QA_REPORT.md	efb4aa96eb1e95a0523bd4a961a3fabcc5001ed692c38bff4f54e3bcf6d64d89
docs/reviews/authenticated-establishment-switching/qa/desktop-luna-before.png	05ab4a550b1b682f5b712bf481979c9b0b73f1b19fc33dc79f4a350781b8c85c
docs/reviews/authenticated-establishment-switching/qa/desktop-luna-switch-back.png	05ab4a550b1b682f5b712bf481979c9b0b73f1b19fc33dc79f4a350781b8c85c
docs/reviews/authenticated-establishment-switching/qa/desktop-poitiers-after.png	629c4a3c2be2ac3899a7620cfaa051490866933de3b6ea10b909f85e60ff1366
docs/reviews/authenticated-establishment-switching/qa/desktop-poitiers-refresh.png	629c4a3c2be2ac3899a7620cfaa051490866933de3b6ea10b909f85e60ff1366
docs/reviews/authenticated-establishment-switching/qa/mobile-luna-before.png	76f637ab1c603a5bb991f2c5cfc132c49179a30c7b54f48a6933a1f89357bb51
docs/reviews/authenticated-establishment-switching/qa/mobile-poitiers-after.png	49abba679e0f76e767dda43275272f30637f4647e338c5333e2f9a9ee09ee04f
docs/reviews/authenticated-establishment-switching/qa/screenshot-manifest.md	da219ac6bb58ada86a40919005589d09671a5160fcb1cb5c39642e20e0100de5
docs/reviews/establishment-copy-primary-contact-to-public/01-analysis-review.md	336d9b3e18dc2669064d1c9597d10f13e489196801d867a77da4c8f2d1535275
docs/reviews/establishment-copy-primary-contact-to-public/02-specs-review.md	118441e628dfbd9f538b134b868227ac38ba2effab549b679e067a4cf4d197a0
docs/reviews/establishment-copy-primary-contact-to-public/03-final-review.md	3b31ccbd2550a94f81430c3bcfc5b31412fc7d3cee8b405fac6acf11b269b107
docs/reviews/feedback-public-trusted-boundary-hardening/01-analysis-review.md	545aa08084bc8607d723761ebc4eed3ff3b1534fe8d955fd8afd68cd558f438c
docs/reviews/feedback-public-trusted-boundary-hardening/02-specs-review.md	e8a2f9da00347007fb0c6c60e3f4553f80c169a92df94808c32898b5ffb158e9
docs/reviews/feedback-public-trusted-boundary-hardening/02b-design-review.md	60c0e4a5ee6374f5178398429d62a03bb517567ee46a3629ceb6b364d0efc0f0
docs/reviews/formalites-authorization/01-analysis-review.md	b6fc2871222a750ebaa2ffba99a717203fbf41f15bfdc7ff33634bc1a100bb57
docs/reviews/formalites-authorization/02-specs-review.md	7deebcd29f6b3d0e9a1f005c45f7966cd1f593dd77532ac75474a34baca78286
docs/reviews/formalites-authorization/02b-design-review.md	3a621ae86e916c072cd31373931a51b29d5dbdc9d6374bf2193e9cbef8321fa8
docs/reviews/formalites-authorization/03-command-results.md	4859c3c85f9a3b47caadad55cedcdc8683b21c646d929e439420d165959d9318
docs/reviews/formalites-authorization/03-final-review.md	feb935e3f06c924b633c1edc68469153b89ac5c14962c34976d604aa78c9d386
docs/reviews/formalites-authorization/03-implementation.diff	214702ed3c8a8b7a93fd17366b9491923295409d8ca2817c6233101c88e2e5bd
docs/reviews/formalites-authorization/03-integrity-revalidation.md	5a3ec738852a5619665045094c9072dd05039572689e0d2ee9ba8d0ac3e5f7c1
docs/reviews/formalites-authorization/03-integrity.json	1b0d3474722e9b25dddd4539f831b7778ef8a21f8c66517475fb415a9715a3c8
docs/reviews/formalites-authorization/03-verify-evidence.md	87bdc43572c7429b9a696619389cd254b7b548a770bd4b49bef0a3dfeeba5c93
docs/reviews/formalites-authorization/04-knowledge-consolidation-review.md	2a243728752292e7625e3f1598ebe269b1811ddfd68071ac63843073b647239f
docs/reviews/formalites-authorization/04-proposed-knowledge.patch	9ab888b661144b7956b66c0944ed193a9e9b83295da1a43fc116ff87df3d26b0
docs/reviews/formalites-authorization/phase-1-baseline.json	8bebe87ce43d365177e330eb2ac3a38f86a5b53dfa11bd777011d3e7c5017168
docs/reviews/formalites-authorization/phase-1-review.md	9892aa686e12b910072af0fffbe6116137979af185c5a7e927c9aef990dd95ab
docs/reviews/formalites-authorization/qa/QA_REPORT.md	90419ff3a4baea4f630abfa95f140cfc05d8cc742934b00cfdc9e6853690276a
docs/reviews/formalites-legal-template-foundation/01-analysis-review.md	bf141feb65b3a6a0253148088c15bee639d16b83c5367e0700b135fa21a869d1
docs/reviews/formalites-legal-template-foundation/02-specs-review.md	791f79b393b4bbd746a40952baf0f06d706339d61eb72f26ef11e200ddab2ff2
docs/reviews/formalites-legal-template-foundation/02b-design-review.md	917a344589e25531208cb56c60439a8f1cab73700c506cc8ef6693b605cea93e
docs/reviews/formalites-persistent-draft-foundation/01-analysis-review.md	17bf41fa36705e6ec96c93b08d9a0419aff1c88fb9e1ba84178f9c96f7462815
docs/reviews/formalites-persistent-draft-foundation/02-specs-review.md	12c341f511e0cbd79e4ee567002bfa0d814fa238c63386c97ea17a06ceaa61b5
docs/reviews/formalites-persistent-draft-foundation/02b-design-review.md	5f0e6e5f214de8fe322f4f8c952c92f223a205682bcb8bab1553db5fe422d996
docs/reviews/formalites-persistent-draft-foundation/02c-tasks-review.md	a0dc009f48e8d043098336a0aae49f92d9a4d82bf96d6a01cc1cdf1b3f101316
docs/reviews/formalites-persistent-draft-foundation/03-final-review.md	75a0bafea7d7cb55b24e02ee231fabe10888d3e59f39c3a1d7a92889e8354c66
docs/reviews/formalites-persistent-draft-foundation/03-implementation.diff	73688e1e1ca8d02669bf71b07c23401e1fb344b9d1ab3280242350818aaedf9f
docs/reviews/formalites-persistent-draft-foundation/03-integrity.json	a7ea89f14ea9c20fa17da18bc3391515ab97f6e948ffb3a90e071db19ad4a6f7
docs/reviews/formalites-persistent-draft-foundation/03-technical-compliance-matrix.md	9f3512ac11c1aedee365f50ff4863d752ff922bd607d847c4a31338af22d9520
docs/reviews/formalites-persistent-draft-foundation/04-knowledge-consolidation-review.md	75973f7696066f6ab89b8975a34f3746df22199123e7531c8f2c5e9095ad4435
docs/reviews/formalites-persistent-draft-foundation/04-proposed-knowledge.patch	2cafb3ef49d6255d0ba94936cdbe640c95884842c2d929f214b0979717759a40
docs/reviews/formalites-persistent-draft-foundation/phase-1-review.md	351032cd5ad5bb644ff1f0386b119a2e0ee6e42dff69d63aec4cc46d831151c3
docs/reviews/formalites-persistent-draft-foundation/phase-2-review.md	f2b9c014b2ffdcd1744275e2a14613707a16127efa6cbcdc7cd1bf1d1676b571
docs/reviews/formalites-persistent-draft-foundation/phase-3-review.md	fb9047e1f98ed8aedf757d657661585c2d894fe4b69aea6266e69cc80b5f9ccc
docs/reviews/formalites-persistent-draft-foundation/qa/01-owner-eligible-no-draft-1440.png	7608b1840c9cef6d7655a0745266df6c4f3c202957950413de85ec33b9c03db2
docs/reviews/formalites-persistent-draft-foundation/qa/02-created-editable-1024.png	c15130afed991f83c3ff434842f1c3aaec86ff05f0a36779f4c71799a9585acb
docs/reviews/formalites-persistent-draft-foundation/qa/03-reconciliation-required-768.png	d007274a39db0c05cb4bc635dd2a3ea93118067cf317aed18c97f4c14e56ea88
docs/reviews/formalites-persistent-draft-foundation/qa/04-reconciliation-validation-390.png	83b62f87216f93b03c1d7db19db83ca68c4b2039e660b0b6d2d2ba3b9b894058
docs/reviews/formalites-persistent-draft-foundation/qa/05-stale-personnel-source-768.png	e0528746fe96f4424bebb7a070d557b8ce69d03fa3aba8c67ee776ef5434f7bc
docs/reviews/formalites-persistent-draft-foundation/qa/06-stale-draft-1024.png	fe15904521d4f9c6b51476b2585df3510e6d52f91846479a68cc049f42bcc0e0
docs/reviews/formalites-persistent-draft-foundation/qa/07-recoverable-server-error-1024.png	5a10850d07ff40f5381a75e339602681dad1dec08a6f764f0382bb2999045280
docs/reviews/formalites-persistent-draft-foundation/qa/08-non-cdi-recovery-390.png	5130e1e2f0382ea738a4c52594656c91695a1f1e98ab0941a8c097421c898d82
docs/reviews/formalites-persistent-draft-foundation/qa/09-abandon-dialog-390.png	14a5a53fdc918792b2f5ea8651810e43fafb8ab433b0ccd7ae045219ce5af4a9
docs/reviews/formalites-persistent-draft-foundation/qa/10-abandoned-read-only-768.png	87bc37cc1324c16b0f43328ef6b7093839dc6f1d82b5015a59b8bd3ac59ef689
docs/reviews/formalites-persistent-draft-foundation/qa/11-replay-conflict-1024.png	d832ae41de08b72c36574089495cb9cb4db0c46a7a13782882cce3486e45c1a0
docs/reviews/formalites-persistent-draft-foundation/qa/12-manager-denied-1024.png	dd500bf6e96d2323038846c25ee1092cd2b01adec2388eeafbf7b321667fe71d
docs/reviews/formalites-persistent-draft-foundation/qa/13-login-recovery-390.png	1698f8551d90520ddadccebafa283a4c380d9af93203e17e405aac1ad5195467
docs/reviews/formalites-persistent-draft-foundation/qa/QA_REPORT.md	f23db03ea8090f595eb545936c9047e0acce57a3916821ef1f77cd1c9b20895e
docs/reviews/formalites-persistent-draft-foundation/qa/browser-qa-results.json	b6794aa5b1273aea32d56092ad3887536052e51978f3e3bf0e6aa6f8f148126d
docs/reviews/formalites-persistent-draft-foundation/qa/browser-qa.mjs	fc9b69acbfd3dffd5e29982203dc97398f78d9e301d74424df427d1f16791d39
docs/reviews/formalites-persistent-draft-foundation/qa/screenshot-manifest.md	faa661c8dc75d1f6267f53bf29115f78c02e2408246067e3059b50b2c84e9c21
docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md	8df6f016533a9a208273d36d5bd985f568fb63492fb1de670fceb0bf392dda05
docs/reviews/formalites-template-legal-review-governance/02-specs-review.md	14346c42610b10425bddbc60abe2680e981c58aba2a6b321177758f97c533ab5
docs/reviews/formalites-template-legal-review-governance/02b-design-review.md	5499d592d752b45a1a8804b6256aa57df7461155b56823c9cee60e4d8f4c20f1
docs/reviews/formalites-template-legal-review-governance/03-final-review.md	23b0c8064b8d9469db25c7369000ca88af4fb491f9d46ce53ef93cf5ec64ac0d
docs/reviews/formalites-template-legal-review-governance/04-knowledge-consolidation-review.md	5d326d80a8d1bd8e01673f10a6822c152d5589677c2c237bd98a2b420ae4e786
docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff	9274a366e84830106ac3b2cca61f91a2c0a376815c2925ae97d363b4e8977745
docs/reviews/next-generated-types-bootstrap/01-analysis-review.md	59e040c79b06b4d1f050ee3d964f1ca0dce969e59921a1531285c0cb57cad163
docs/reviews/next-generated-types-bootstrap/02b-design-review.md	ff9e3496b0162ca89d45b9cabadbaf2143635a6abb505d190933ef0810398a14
docs/reviews/next-generated-types-bootstrap/02b-investigation-baseline.json	5911d8813672a59922196ca5022730afec7cf6d8972730d111e1068035b18def
docs/reviews/next-generated-types-bootstrap/02b-investigation.json	ce4afd212c621dea6bcf38f24debc5c8486b498dda6048e1438ff0d4506bf4a3
docs/reviews/next-generated-types-bootstrap/02b-investigation.md	dff3517bb658b7bcaccf88fe4cccf0fcf2ffd175273e0b19ee9c125112905e60
docs/reviews/next-generated-types-bootstrap/03-final-review.md	f22a643952b90e34dd8d5cfe5e5fd14fd2d05387fdfb6e89e22e2ba6b921f63e
docs/reviews/next-generated-types-bootstrap/03-implementation-inventory.json	62b10efc0959be9bd2363c09fe0a75b50db10ae9a41ad09de20f45b78be9d26e
docs/reviews/next-generated-types-bootstrap/03-implementation.diff	6f1643414f375b72c5bff659285da448f4679b9d4e1cad2da3f90d09e03685ff
docs/reviews/next-generated-types-bootstrap/03-integrity.json	245140107c6c4e712eb9579be1d12741b390430d525225d8fab1a8f40401e471
docs/reviews/next-generated-types-bootstrap/03-phase3-baseline.json	eef4c0c58f9bb68803cbc5cf47f4e731d670544d96164d803b7b4cbba9b2f45b
docs/reviews/next-generated-types-bootstrap/03-phase3-closure-evidence.json	a2164205ac7fade5fcee73b15282750b7ff214833c489a435818d6619f51021f
docs/reviews/next-generated-types-bootstrap/03-phase3-completion-evidence.json	0393c57f4f6411666527d7652661d918441ce66124c51bb7bbde3123a8865f8c
docs/reviews/next-generated-types-bootstrap/03-phase3-completion-stopped-review.md	e9404f3a2db23c62783fa1996ef1179a85da0c0b70817381a97e6227ef69160b
docs/reviews/next-generated-types-bootstrap/03-phase3-evidence.json	9281693fe4229bf17850493d5754ab63d08f1b6c73915d6891fd6d89b0cd0009
docs/reviews/next-generated-types-bootstrap/03-phase3-remediation-evidence.json	14b5adc084665e1ff74a31995932c676c3ed545f0b36887ca1efdc3280f2ba6d
docs/reviews/next-generated-types-bootstrap/03-phase3-remediation-matrix.md	dad229aeedd71a4f134a4680c58e7a140680d2d66be0bb1877f8ee963640853d
docs/reviews/next-generated-types-bootstrap/03-phase3-remediation-review.md	a18404cdca2ccae0ca459b2b1cd6b091a262588b3a97b98dc5b361bdc6cc2ed9
docs/reviews/next-generated-types-bootstrap/03-phase3-review.md	425df8be0684e1a75efd3aa328ed2e71d0c7ee7c11f55b9bf153b1e3a68ee21f
docs/reviews/next-generated-types-bootstrap/03-verify-summary.txt	6a28824a351173b7504bfa7faba1b933c7189f17484820e3783bf1fa977a636b
docs/reviews/next-generated-types-bootstrap/03-verify.md	d2ea65e59e8533adcd8964197d1bd1511c7b58c0df377878a60212f3856017f7
docs/reviews/next-generated-types-bootstrap/phase-1-baseline.json	ef366ae0767a0e2d1096e8e1588efa9eb37c574cfdc93e21a97c706d851a6e31
docs/reviews/next-generated-types-bootstrap/phase-1-candidate.json	3954ec4670975e39409c80e170a1da892af22b99c0c9a3604b30bc8abb630078
docs/reviews/next-generated-types-bootstrap/phase-1-commands.json	8ad4a9427075488ca64a5bd5d0411830ab66c9dd8eb8795fbfbf029ca063aa7a
docs/reviews/next-generated-types-bootstrap/phase-1-remediation-baseline.json	a3866c19241306e107ac6a33dde45e7e7279411dd8e63aba2c38b2fc3ba17152
docs/reviews/next-generated-types-bootstrap/phase-1-remediation-evidence.json	79894a158b85f69ef1a5e9514d5dd5bf7f6246c9db32a8f9c8f8126835999cb1
docs/reviews/next-generated-types-bootstrap/phase-1-remediation-revalidation-review.md	1261d21955bf9e7c4a96495c35fd97556033e5827dabe84a0f256feac7f75846
docs/reviews/next-generated-types-bootstrap/phase-1-remediation-revalidation.json	9d113b442aa883167e456a097465067c9556e2d9a1d44850d15c47e4bed2d973
docs/reviews/next-generated-types-bootstrap/phase-1-remediation-review.md	d804f0ef06c7fb0b0fecdbdc8135437d618d542d011cc1bdaa6c9e9fd46aea54
docs/reviews/next-generated-types-bootstrap/phase-1-remediation.diff	11abd30274d8f0e394e66c9f5ead048eab3413b892887dcf8877181f90bad97f
docs/reviews/next-generated-types-bootstrap/phase-1-revalidation-review.md	3a8f848783aceac878eb699ced0045520842baa527da78e910a11f7a661c167a
docs/reviews/next-generated-types-bootstrap/phase-1-revalidation.json	d9e06d91a8175e7ae70d64486bd8cb829f4f241cdcb63b4ed7f298772e521aa3
docs/reviews/next-generated-types-bootstrap/phase-1-review.md	86b1a1b026d5ca1c3f7dfc424d081872182a013805f1914a23480ed8e3c298ec
docs/reviews/next-generated-types-bootstrap/phase-2-evidence.json	4b598a0285858bf59debb46e24212ff0ef562d87720ddff5da82a6ef8f1a5474
docs/reviews/next-generated-types-bootstrap/phase-2-implementation.diff	5b0a35bba33aba5be370f44316033c9d5d7a76a4f5be892f7815d97927f60867
docs/reviews/next-generated-types-bootstrap/phase-2-review.md	eb8df1621769ccb490d5d633d25c1d2681c12a8f7dfe169307e0145df2e23a3a
docs/reviews/next-generated-types-bootstrap/qa/QA_REPORT.md	532a4a47caf8bc50c35c21167842371ac6fb985bee1ac6433ad41ba3f33431ba
docs/reviews/next-generated-types-bootstrap/qa/phase3-remediation/QA_REPORT.md	58af5d7eb1e42efbaaa79fd6de5b3bc6996e425cc32886e3160af2f4eea940ee
docs/reviews/personnel-reconstructable-value-history/01-analysis-review.md	160e328f6c2683c5378e1cdcff01d8fb2a858065cb60b771e698dd8b964517a1
docs/reviews/personnel-reconstructable-value-history/02-specs-review.md	844ca91a33c0403d38be7b2974a6363285053593d0c13efa74660c14c7ad6f4b
docs/reviews/personnel-reconstructable-value-history/02b-design-review.md	7453950547cf9374a4c4e136b10ed92c219d2041c54ca0cca90bde05b53b7d4a
docs/reviews/personnel-reconstructable-value-history/03-final-review.md	e753f39d2ba2bd14b6bf600fec06f5eac0c6984ce373ee671e840ddc6cda8853
docs/reviews/personnel-reconstructable-value-history/03-implementation.diff	a3fea5c48c56945043551572c3db082f5683a9f2ab18647ca1c813cbf7f17a88
docs/reviews/personnel-reconstructable-value-history/03-verify-evidence.md	0fa41ad20593c1a639599cb0a0efd2c78020e6ee27feb8f1649870b73ada2874
docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-proposal.md	56eea191c72a2d071cd750eb9861ff8834eca7006f7b0cfd7632fba0817894e5
docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md	134888250a8ee9a874d142866d19209dbad23066a1dd633f6d88434a320d4769
docs/reviews/personnel-reconstructable-value-history/qa/QA_REPORT.md	e026c0fa10f6df9b5aaaac4cf8824d7925d703d6c7ab05e66fa9d9f99dc81ec1
docs/reviews/personnel-reconstructable-value-history/qa/f07-dirty-close-1440x1000.png	c6cdd9fe32bed87cf68e14fb57ab49a355a1e1ef6e393a215a1cc725dbc46a9b
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-error-retry-1440x1000.png	03c2b863a510a4ff422d302ac68eb246c953ac30ad4e4636d295adfbeb8ba89b
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-loading-1440x1000.png	2d07386feb9355308aa789db744ef8f0bc96eca8d8cd1fca296231a821389ea2
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-mixed-baseline-1440x1000.png	0e8e8afee497b660285380df957fe9f62df8085ed53d3735bc9b0b8ee7fb27c4
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-newest-50-1440x1000.png	4a4cff3fd9d67262f5b2dfac15d8aaaccc931b56977a818bbec375fff5dcb2e6
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-1024x768.png	dedcdd1155cef56646eaeb661759c14a0355168590439d2265a044405757e8c3
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-390x844.png	3c327014ef4a5e0036baf60e8100d6058ad5aaa9a7304a552ee77de3ff7bedfe
docs/reviews/personnel-reconstructable-value-history/qa/f07-history-responsive-768x1024.png	d3fa5675fee43b758ef2b455c14ed2ac7e7a9b997ca7259977af04c4cbfd1fbf
docs/reviews/personnel-reconstructable-value-history/qa/f07-per-group-validation-future-boundary-1440x1000.png	75bd45e88cfe618212a0dae6c4872b794cb27cef5480aa2137e1b4995cfc6050
docs/reviews/personnel-reconstructable-value-history/qa/f07-stale-revision-recovery-1440x1000.png	aff4c745524f97d4a70e660389e426d3924ed38d1b644d411aa9ecaf2d6df97d
docs/reviews/personnel-reconstructable-value-history/qa/screenshot-manifest.md	53ad4eade6c4e2c9789ca1e08e8ba23c0e37c38682de56eab1301a02bd98e4fa
docs/reviews/platform-admin-formalites-template-authority-foundation/01-analysis-review.md	1b613c4898cfbbb0e0ac139bc51c772ff85268b598e971863e95962a56bdb53c
docs/reviews/platform-admin-formalites-template-authority-foundation/02-specs-review.md	4054de5e90f3ec0b2aa37cf51adf3f76d3c90f467ae28cc98e93d9338f7a4c49
docs/reviews/platform-admin-formalites-template-authority-foundation/02b-design-review.md	b18dd0e7e9423d906950beed2a25e3b3839b57304e0084c9f753d065e1c36c25
docs/reviews/platform-admin-formalites-template-authority-foundation/03-final-review.md	3e3c767f708e21a2e0329cac4e557a6ccef857b9ffedfb09f156be57bec7948c
docs/reviews/platform-admin-formalites-template-authority-foundation/03-implementation.diff	fa89abc96319fb126596c0ff7afe70f6e5a7ec4cc533aa9f1b3f3f35541627cb
docs/reviews/platform-admin-formalites-template-authority-foundation/03-main-spec-sync.diff	88b83e723bce6b9032b6615a8f95681dbcd4b355d7a36a213e2765d8d23947a5
docs/reviews/platform-admin-formalites-template-authority-foundation/04-knowledge-consolidation-review.md	4e5171fe809a4639d919bda785c7eb93e0d84f9d1c83a8852a9446f26d2755fd
docs/reviews/platform-admin-formalites-template-authority-foundation/04-proposed-knowledge.diff	a37694a01a30365a16aac7a2b1d4e3237da2a487ccb27b62b9c66c21ff1c0a65
docs/reviews/platform-admin-formalites-template-authority-foundation/05-formatting-remediation-review.md	e5c2d50349def2fffa2c8babca66d877c32d413432a1d03a4a37078b46479486
docs/reviews/platform-admin-formalites-template-authority-foundation/05-formatting-remediation.diff	8eedc61c60c3ce03f0443486460795a526b5f3cf4d1ccfc802a2e9d56832a8c2
docs/reviews/platform-admin-formalites-template-authority-foundation/verify-evidence.md	644cc48f2b7fd4327e3e3d73642f42c0ae83a086cd939e5ac45fe78a04fe3d59
docs/reviews/pointage-authority-and-access-foundation/01-analysis-review.md	0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548
docs/reviews/pointage-authority-and-access-foundation/02-specs-review.md	6a983e23c34f945389b66550c39e892918ea0a2ea61a870e90dbd65236abe32c
docs/reviews/pointage-authority-and-access-foundation/02b-design-review.md	f92ec7ea482c33633770f7986898b426e59dbf114870267740296bc4a5c4fddd
docs/reviews/pointage-authority-and-access-foundation/03-final-review.md	6a28e24bef47d6f2a7a82df6711f56ac0185459397f56086ae2edf6db041ece4
docs/reviews/pointage-authority-and-access-foundation/03-implementation.diff	e161c46680bc4ab0f86e383a5263736b7a8200fb6485b6e9c0f70cecfc2af0fe
docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-byte-replacements.json	5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51
docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-proposal.md	6c4e9e47b7cdf7257924b62673e82de36b8045a7c57ce1b6bbd91405823a01d9
docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-review.md	94bee2ac1d1c636996d838b94971b83d1382188b1de786603b7d8e18793cd726
docs/reviews/pointage-authority-and-access-foundation/qa-assessment.md	7cc4da306e6ff45e7491e303b7a3248636b91b220322ac7908ae99096a88b6e2
docs/reviews/pointage-authority-and-access-foundation/verify-evidence.md	fd81bfc8c9f645d9f99a64da7203d329fecb3f6a40821d6e4bf75465728742a2
docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md	ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557
docs/reviews/pointage-usable-raw-clocking/02-specs-review.md	c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566
docs/reviews/pointage-usable-raw-clocking/02b-design-review.md	9627eb9fabe81bfb1408724100e470c7dbdc96a8fcf15bbedd2fc6597e21bad5
docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md	66f212b1b365e590398be68824f8e5fdccbb3e4dbeffee01294e34dc0664d9dc
docs/reviews/preserve-establishment-owner-invariant/01-analysis-review.md	12954ed85f670655e4efe9ac7caf3427923e104e4f3b04825c7d14a5cb4f4ec0
docs/reviews/preserve-establishment-owner-invariant/02-specs-review.md	0abf48a947ead58f718866c76fe9a648b79415575dcfd5404b64efed61bddcb2
docs/reviews/preserve-establishment-owner-invariant/02b-design-review.md	41ce715ce057aac2bbf7063c4f13a063d881e10450289d6cbd5b6bc06ec39062
docs/reviews/preserve-establishment-owner-invariant/qa/QA_REPORT.md	4557cb54b32d2975bece2c1345a980e448bd75f856c7a967a3152e0a52ab196e
docs/reviews/preserve-establishment-owner-invariant/qa/desktop-owner-edit-denied.png	9817f139c3707a33c79bbfdbc7cbff0abe5846f41149908df5c6a2860f3b47fe
docs/reviews/preserve-establishment-owner-invariant/qa/mobile-owner-layout-failure.png	e6647df8f65c458425166fa782624ec2eac4f71023ed8e74aca6b048218338d5
docs/reviews/preserve-establishment-owner-invariant/qa/screenshot-manifest.md	e5638ac21dcae7c89cf864ba3b8d9218634b02fff4c2e6658a5a3398cd3a35cb
docs/reviews/preserve-establishment-owner-invariant/verify-evidence.md	99dee530d2c54636d5b403f78c9b2b3cfe7c26d0959b9a7f16c65eb01481bf55
docs/reviews/reputation-review-social-links-configuration/01-analysis-review.md	2106185211b2db18a5164a2c721b14a08bba89be22a8f80f03abdbd9c74fe873
docs/reviews/reputation-review-social-links-configuration/02-specs-review.md	28d2b28af0f2da0f4db1b4a374d55734951707daa9497d8b5686ee9ae1fb802c
docs/reviews/reputation-review-social-links-configuration/02b-design-review.md	c267b2d9b58458c87e4844cd8fce8547d245f9ce2b5984353bdcd57953c3526f
docs/reviews/reputation-review-social-links-configuration/02c-tasks-review.md	0f344b91ede7d484565025a9a83d6e05cd1e9069108a9c7d43bc631d25d1581d
docs/reviews/reputation-review-social-links-configuration/03-final-review.md	6cdfd42a218fcdd18232225227e3b88e1a1666dc5bf69de7833a1305ae2aa4e2
docs/reviews/reputation-review-social-links-configuration/03-implementation.diff	0faa1b118f6b7104f1463c83c9279a99cbf138b31eea13c4aea51d1cb75f327f
docs/reviews/reputation-review-social-links-configuration/03-verify-evidence.md	730650169c14375a28b6bd7b9ab7f04ac129641e8e74e7c79fcea58d021f6ccb
docs/reviews/reputation-review-social-links-configuration/04-knowledge-consolidation-review.md	287b7c5d9f37fcdb907e686a5e6f32c65844ac646e5874e4a9be51e95daaf69b
docs/reviews/reputation-review-social-links-configuration/04-proposed-knowledge.patch	efaed1f98cf1f2f75731590a420948da64904e199b45cf2e68c1b0b345c0e26f
docs/reviews/reputation-review-social-links-configuration/evidence/frozen-repository-state.txt	f2575eafd483771be189fb4934f72f2e2eb2e40d1824c452f17749cb70a0644e
docs/reviews/reputation-review-social-links-configuration/evidence/phase-1-attributed-implementation.diff	007a0bebfccea676070be771bc514e9a5ef521eabfa1f658cd02f3a630f5a993
docs/reviews/reputation-review-social-links-configuration/evidence/phase-2-attributed-implementation.diff	ed1109130f4c300c416660fb64a8af030995fac1aa13502f99a234aabb1d4d0f
docs/reviews/reputation-review-social-links-configuration/evidence/phase-3b-invalid-state-correction.diff	50696722749e677697db9d640808ded635dd21135f3fcd38ca7aa20fd28c015c
docs/reviews/reputation-review-social-links-configuration/evidence/phase-3c-feedback-cta.test.tsx	8b934ad74f267ceeb3d88d2cb3531b326d306c87852fc1c8da2a6d6a0634bdd1
docs/reviews/reputation-review-social-links-configuration/phase-1-independent-implementation-review.md	e22cdcd5d486042373110b3a22fb3670e4f4846bba9f28f0782bfafa593fa838
docs/reviews/reputation-review-social-links-configuration/phase-2-out-of-sequence-reconciliation-review.md	facf87f046de165d133ab1233887db1b448a6b2c3689ed87361eea07f94c6584
docs/reviews/reputation-review-social-links-configuration/phase-3a-page-pack-review.md	c96a117ce94b7207db2945c01a082676417e9d17bdfd761a4259856dee618dc8
docs/reviews/reputation-review-social-links-configuration/phase-3b-backoffice-review.md	63ca4318365c4b083868ad0ba50565ca3f7b723fd7a08f8df55ae44360c99f7d
docs/reviews/reputation-review-social-links-configuration/phase-3c-public-rendering-review.md	ca0edbbf4fdbb24b7076b03829143be8a1677ebb5ab7aaa0652479425457ae7f
docs/reviews/reputation-review-social-links-configuration/qa/QA_REPORT.md	83898d670ef654a092c3c623cd4ea054490768d25b5ec8cadb2394ec7dd23774
docs/reviews/reputation-review-social-links-configuration/qa/manager-settings-absent-1024x768.png	49219a479986b800f78f8466eb52c0a5d753d0fe0eb8f402292e83b1aee10c8b
docs/reviews/reputation-review-social-links-configuration/qa/owner-configuration-unavailable-390x844.png	3031656d27d20988e6193e6f29c841d161b19948d579205370655ec84b0a750f
docs/reviews/reputation-review-social-links-configuration/qa/owner-conflict-390x844.png	0ffb49894b845c1b29df9a4ef51d80747c20396ea24f0e7d9c83fec55c282a14
docs/reviews/reputation-review-social-links-configuration/qa/owner-dirty-valid-390x844.png	6e9fc7abb33627ff56f4962760dab4b7e9b13b693d6336b4fc02fa4793a4c9ff
docs/reviews/reputation-review-social-links-configuration/qa/owner-empty-1440x900.png	b7c0ce50338a19b1c4b89f64a03f71957949b12dd406723fcb5cf689068ae755
docs/reviews/reputation-review-social-links-configuration/qa/owner-empty-settings-1440x900.png	29f4a7c5a9e6ffcf98fd9d40549f1f5666f5f2a6df4d3c92eff3ff2edc55d13b
docs/reviews/reputation-review-social-links-configuration/qa/owner-empty-settings-768x1024.png	9b7403aa234ae863698127fb0de9ea5abcfa5b2e9e49520ae120d7bdfe333e3f
docs/reviews/reputation-review-social-links-configuration/qa/owner-empty-settings-visible-1024x768.png	5a16ebefe45617a2ec13ac35f2d4dd2d93f7b1548b49f170a2808c8b11b5b1d9
docs/reviews/reputation-review-social-links-configuration/qa/owner-empty-settings-visible-390x844.png	900098843e3d55d0e9885fb2b90799ef5d531f9052f0e645d276aa4a363df5ca
docs/reviews/reputation-review-social-links-configuration/qa/owner-invalid-google-390x844.png	e7fbff2221e390b5ccfca81e5202af0bc6bc50f838927e266b98f8dd68536700
docs/reviews/reputation-review-social-links-configuration/qa/owner-saved-390x844.png	28e20bded9c0f8667ad58711cd4c8b6d93ca0f989eba29efebfce5547363d7a3
docs/reviews/reputation-review-social-links-configuration/qa/owner-server-error-retry-390x844.png	3d3b787b24c630bbaf6ccd9cf94e07229898e644c80e81ece1eafba34305b68c
docs/reviews/reputation-review-social-links-configuration/qa/public-success-all-providers-390x844.png	42218bd23d95dfdb363f4c5920ccb793287d97794db7e54178fad4be056c06e1
docs/reviews/reputation-review-social-links-configuration/qa/public-success-mixed-safe-projection-390x844.png	d48b8ea3120c7357bcd32442a783800a080e50ba9e9f2546f11c095abc112354
docs/reviews/reputation-review-social-links-configuration/qa/public-success-no-providers-390x844.png	351407721eb9113639fa57af4c339b8e0e654776f59f1ac60547b0bc2dbb0e6d
docs/reviews/reputation-review-social-links-configuration/qa/screenshot-manifest.md	9561b1763ad39abe6dc11ba52b6b410e5f1e1f068571e5be06aaa99b679681f2
docs/reviews/reputation-review-social-links-configuration/qa/staff-settings-absent-1024x768.png	7d71193a5cfac58d0c99faaf78deb6ed0f20f814fd5142dc2c1345a11690e41d
docs/reviews/restaurant-knowledge-authorization/01-analysis-review.md	d1ec45778cf2d60ea3069e448e807d3cdbc2499040fe85b6a1afb39ffb3f103f
docs/reviews/restaurant-knowledge-authorization/02-specs-review.md	8a6672dbda4c33e2f39fb8223555043c9a3ce11856938b9e98147914b2104d54
docs/reviews/restaurant-knowledge-authorization/02b-design-review.md	4955cca44ebe0f0e0f4a1ddb6d913515937060a2685e2f9881c8560d2bd40c88
docs/reviews/restaurant-knowledge-authorization/03-final-review.md	f6cff4e2cb873722ca6b81e837a43901c394f7d6dc0916c867e746c4aca76bbe
docs/reviews/restaurant-knowledge-authorization/03-implementation.diff	24a9afbc20256a8819a2f7ce24a25f4b533659dedfa9d67cde018f85a547efa3
docs/reviews/restaurant-knowledge-authorization/03-verify-evidence.txt	e6564b1e49877887effc5fbd10ac62d57c9b24efd74f6823a161bcce8a6dd895
docs/reviews/restaurant-knowledge-communication-identity/01-analysis-review.md	c5f134ea2904d639595a4eafea31ec2a1c087e93be4238bea62e7417b5d56b96
docs/reviews/restaurant-knowledge-communication-identity/02-specs-review.md	5e86c03b56e03dd63628d0ff4a1483a2f6e822c61563e2a2515ff4005fa013ea
docs/reviews/restaurant-knowledge-communication-identity/02b-design-review.md	511a3c3c65bc9525f6a4b7fff4326d4c29e773a93a55733fd227d08f286a685b
docs/reviews/restaurant-knowledge-communication-identity/03-final-review.md	c85abb756d848359e3e73d3d1405b9c003ffef5027cc907320a5e5cda33cbb03
docs/reviews/restaurant-knowledge-communication-identity/03-implementation.diff	d8fb9be29b2e072768db75d37fc92b545deca9d7702677fc3099ebb51708adb4
docs/reviews/restaurant-knowledge-communication-identity/03-migration.diff	3ae21ff7313ac21222d969e3e71345edb8e54874ca69a75e51b8d97ddfeddd15
docs/reviews/restaurant-knowledge-communication-identity/03-pre-apply-manifest.md	026514bf933ccb8e96fa750cf7e6f3ed6da1a4168db5a3112bfed4d66cdb5a39
docs/reviews/restaurant-knowledge-communication-identity/03-pre-sync-manifest.md	c33ac84c5b291f43c77101b723dbca0a85585fbb2375eec948c9577e0b2d32ae
docs/reviews/restaurant-knowledge-communication-identity/03-verify-evidence.md	ec692bcbd0b5442ff89f3180f8754cff96143d9f9e735866598fbd592d95ccf7
docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md	258c4405bff05a27a87d631b5fbd42f50148485c8ca72a60e7a1ce2b1cf49c0e
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/git-status-short.txt	0d3e7365ec5ef46019f2cdd95530e9b510c7f0fc9801cf79b154a99a046beda3
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/head.txt	0753bd3e3c20862805aed2c30efa94619a868c5658d27f0ac5a9778934030aae
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/intended-new-files.txt	68637a14a839ee562a5798354d143abab5356634888d80b973880120d6e6dd7d
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/planning-and-gates.sha256	b486812b15c74a039b6036d0bab9bed477d87baa628b9824665188521e8ba065
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/protected-existing-files.sha256	9fe59e7389f6ec130beb5d79a51cd445693607ac2628ef4f192cbae96d6e3e6b
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/shared-file-allowlist.txt	38ad83d895e835b59c99c4222faadce208faa6473424f7ef3bfa24c7d3b09140
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/shared-files.base64.json	73673ff5c79981fdf7de66e83ef5cca838a223414484db87bbcc36828e0f3302
docs/reviews/restaurant-knowledge-communication-identity/pre-apply-baseline/shared-files.sha256	43b20fb03b7bf1eddb816a31b7828a7ffae159ed778a011e8a06590cdc0f8807
docs/reviews/restaurant-knowledge-communication-identity/qa/QA_REPORT.md	9b24124a72d7ad326d977aeafd3e27744e33facc14ee9627712ec32f73cf9705
docs/reviews/restaurant-knowledge-communication-identity/qa/manager-editable-dirty-768x1024.png	016ca49f6a3473cb28941f15217f45ad2f40c8b1d0d7f19c4a4fba05177fa441
docs/reviews/restaurant-knowledge-communication-identity/qa/no-establishment-no-access-390x844.png	5680dfc02cb9bf030958dedd26465980a05856e5b9b400309b6f58ecb841c4f9
docs/reviews/restaurant-knowledge-communication-identity/qa/no-restaurant-knowledge-access-390x844.png	d7bb2db5d14048bf29b2227899d39b3ee45d9abda9269fe2f3d5b796fa8f9497
docs/reviews/restaurant-knowledge-communication-identity/qa/owner-all-empty-1024x768.png	eb155360cd223a0c8753718c9676ec41c39d3d3e900d398bd141c4b4422745da
docs/reviews/restaurant-knowledge-communication-identity/qa/owner-all-empty-section-1024x768.png	5dd2f0f950d104758babd5e0ce1f99c8bf35d23005d9fa832e5db326cac15f31
docs/reviews/restaurant-knowledge-communication-identity/qa/owner-dirty-focus-390x844.png	5f28f03dfe10f79531fedfa885103006a612a2dd9b452386818b326372afeefa
docs/reviews/restaurant-knowledge-communication-identity/qa/owner-populated-saved-1440x900.png	8b410696d7ba4e51a21833c70e1a76321e8a7cdb29fdaa672db38f2823b45139
docs/reviews/restaurant-knowledge-communication-identity/qa/owner-success-status-1440x900.png	d49f5be534561e10aff3939d3faaf6aca4e77328207d20b256e040aea2838ee4
docs/reviews/restaurant-knowledge-communication-identity/qa/screenshot-manifest.md	9fe36e1e7f28f87ee7ba10ae212bcbff0961eb0dae5aa31685d2d5f78b64989a
docs/reviews/restaurant-knowledge-concept-history/01-analysis-review.md	48a9a7584c69addae404c8385444cbfff58be19fd17ff8a823c3e5a58097551e
docs/reviews/restaurant-knowledge-concept-history/02-specs-review.md	f70b7d440b8803fdf57c12eeb1211fdd4e1352e7066c2493b0c72411b253773f
docs/reviews/restaurant-knowledge-concept-history/02b-design-review.md	3a4483a6febcaa94fe3fbf3066fee8eb81657b468b3b7adfa52737841485be21
docs/reviews/restaurant-knowledge-concept-history/03-final-review.md	13354d3f11025c2913cc56fd1c6ba329e3db39bda09ed3f62801571a9cf2de70
docs/reviews/restaurant-knowledge-concept-history/03-implementation.diff	c5dc55b185e963dea4a150473641613d12aee3df26888e3a30e223d3214861ce
docs/reviews/restaurant-knowledge-concept-history/03-migration.diff	b79a92ad201bbde24b0dca02ca216398a439915ab338d66b9b4dc688be408a66
docs/reviews/restaurant-knowledge-concept-history/03-verify-evidence.txt	9c6f566956b0232d454b5a96047684ed08f0a718cb54d7e48ceff748d7070071
docs/reviews/restaurant-knowledge-cuisine-know-how/01-analysis-review.md	5f374035d75a06069ccf7ddda63d1eaf9fbad212eb79019803476fa6b857a45f
docs/reviews/restaurant-knowledge-cuisine-know-how/02-specs-review.md	400c035da135e2be5e5962d96269b5b2eb40e7a784b2169112c78f618f641c8a
docs/reviews/restaurant-knowledge-cuisine-know-how/02b-design-review.md	e786427d8077669323d07f529623054dbf227c089acfcd2eba0cc7198a1f2efb
docs/reviews/restaurant-knowledge-cuisine-know-how/03-final-review.md	21a7e92ad7060c79140a2f47a98f7b2ded8bd211b5001d9bbb9086649fa3777c
docs/reviews/restaurant-knowledge-cuisine-know-how/03-implementation.diff	9992bcd7a8ac8c80aff6f22216a0a42b722b3917d3051ab4ea3962f7e7eec440
docs/reviews/restaurant-knowledge-cuisine-know-how/03-migration.diff	bb34bf99720fde83cf33032778deb20fd1cf729f54e5c5ce065626a0c5bc0fdb
docs/reviews/restaurant-knowledge-cuisine-know-how/03-verify-evidence.md	f659b145db67ade1d9cc00f0e8f438a8c3d7444e3c6e109eedad35b76a046ecc
docs/reviews/restaurant-knowledge-customer-experience/01-analysis-review.md	ee9cf27559e46c3ece59bced9d3d341859d36e9c3a9b0268182dde993365c9ee
docs/reviews/restaurant-knowledge-customer-experience/02-specs-review.md	2372f9c9ea94f1be8d035739a5a26acd4874e9cb6f14c66a2d3836e7aef0b9e8
docs/reviews/restaurant-knowledge-customer-experience/02b-design-review.md	0bd1809092694f60c5633f79cd0353035efb5717287cc7ec83d5f7968113b612
docs/reviews/restaurant-knowledge-customer-experience/03-final-review.md	7ad41b03048b4f911b8ce20cafe27aa9afcc8bc16ce26487d29a331d82d99cc9
docs/reviews/restaurant-knowledge-customer-experience/03-implementation.diff	075dcbba24359d5fd27c3e40bdb3b48188af99e38a99b22b296b4f2c0cec4ee3
docs/reviews/restaurant-knowledge-customer-experience/03-implementation.txt	075dcbba24359d5fd27c3e40bdb3b48188af99e38a99b22b296b4f2c0cec4ee3
docs/reviews/restaurant-knowledge-customer-experience/03-migration.diff	42462dd013e30e198568484179f4ccaaed760012a65bfd71d129fe9cefea3f10
docs/reviews/restaurant-knowledge-customer-experience/03-migration.txt	42462dd013e30e198568484179f4ccaaed760012a65bfd71d129fe9cefea3f10
docs/reviews/restaurant-knowledge-customer-experience/03-pre-apply-manifest.md	f0dffc5408415ba0e72864e294b879445f479093380cdf432bd69f2b07b38adf
docs/reviews/restaurant-knowledge-customer-experience/03-verify-evidence.md	5df49f94719a30cfbf646fcb099814a58e1930e7dd5176f31e7e7fca4e160eef
docs/reviews/restaurant-knowledge-customer-experience/04-pre-sync-manifest.md	6b72f720ae8f7603dceee78c636064ce5104c4fa2bf6e2662c6f1c4a17a5880d
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts	50b889797c3f096ca66d6674b0b5018a0c18893f1134d12386bc6317bdace665
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx	4141754619bfdca5e2fa8434141fbd07e63e5e9575b1d2ced72833628564b04b
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts	ddb6ce15638c263870ff12b1474ae95b486ce6dfc95a2ea5288e39dc870c71b6
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/test/concept-history-action.test.ts	ea059e50a957e60b5f3c32e38a0d5123290ee8aef9cdce5110bcd400a062d942
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/test/cuisine-know-how-action.test.ts	eb729d8298b0eea8a1ef79891dbeadb14de68891619c7a5410159beb06031377
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/apps/backoffice/test/restaurant-knowledge-loader.test.ts	d82cd51bc08c5f6a72ff533b426c2f402046baf839f7ea39a579fb67a3506161
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/MODULE_REGISTRY.md	045a808d9263e48a3021b490d4429cfcca330414ddb147bed7d29146c987d7d3
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/features/establishment/README.md	ed4519c6ed004c6b36510801181cd61482deab894d16519eeacd1b366fa8e1dd
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/features/establishment/general-information/README.md	3f1369fbdd0a7a0f0485e63cc2fbacdb69cd60e39680faf7cd35bea91b1f636a
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md	8c7b4f0acea703c2f9d4e0dfeeeb31f25c5cbfe46180368cb6295a05ef2ac05c
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md	0098fdc44742a01ff84ac11803cb4f41977b85d3be5cdb1bee8d278ef55743d6
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md	cb578f5a5e9bd75d65989a58e371bde78c04cc22ffcc95b99a80d97a7346de92
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/ui/pages/establishment-general-information/README.md	0d616efdcc1e57ac93d8965c992855a21b7b84f18fa8b2440d53f464c4ecaadb
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/docs/ui/pages/establishment-general-information/UI_SPEC.md	b664ac795566cab0878d54c6333e42d953fb163c81948424eccc20b80c4979cf
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/drizzle/meta/_journal.json	f4f314b6c4e551641ac505015832219ec3660966fda67f8e79429702b03da2fc
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/src/restaurant-knowledge-repository.ts	9bb87c63c84f6cede86dcc86aeb4cd1e24cb961cb04b5244de41efe6f3102e68
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/src/schema/restaurant-knowledge.ts	fa48a9d9aab36f51f8801c68f0f4e1a27d526538d66fd2297a666edc28beb431
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts	de843a7ba4c6750721d71585607179d846a6e3216c38d4ea4fbf3a3ccccdd92f
docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/test/schema.test.ts	1ea929492c0deb6104adc7982090dc793df37b7e221b160b8aba7fb7575e5ed7
docs/reviews/restaurant-knowledge-team-culture/01-analysis-review.md	9bbe1d2fd1bfb4dbb12fce77d2fec893e70a4831898b95bb6a535f3ec8869994
docs/reviews/restaurant-knowledge-team-culture/02-specs-review.md	b1e0c9aa253e9c2e3fa0c4ee66758ee7d2f04dae1b6edf8ce6a5e7ba3c0b0496
docs/reviews/restaurant-knowledge-team-culture/02b-design-review.md	9b39cb0ed1f4b0d7c6b7be32e17555c0d270b9383a8041077f8532141edbfbfd
docs/reviews/restaurant-knowledge-team-culture/03-final-review.md	18ceb66bc0ed2a85ea7ab352163b961d02c72ac4e61a625d4fbd059f46aaf1d3
docs/reviews/restaurant-knowledge-team-culture/03-implementation.diff	bbf72495533f176e0f2454ce2de2e581882b053f9427d4431a31ffa53319766b
docs/reviews/restaurant-knowledge-team-culture/03-migration.diff	55e752347d9b1eb0aa2bb0fd46f6e68a0240164a5f3b274e218f66491e36122f
docs/reviews/restaurant-knowledge-team-culture/03-pre-apply-manifest.md	b198084696e2f4b8de78df35ee6369f3de6fe639008898dc4d7712c66861047b
docs/reviews/restaurant-knowledge-team-culture/03-verify-evidence.md	faf5757f1367a62b94bdd14533a9bf43a5d87ab670e173f9d1cb62f73114390d
docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md	c2ec96123ca08b5e78c682e2fe5d0f87a13a1f543c3cff390c0399a7e4cea1f3
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts	2c741dd3f698f01d2d6282e3e39e841abbef767a01dd740e5dddef1e3fc64755
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx	02bdd0935d5dd71ca6fda6e4490bfd49fceca61cf8387579b0e9df3e45e0bba2
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts	d36c97988f70ccc13c857ba801eb01963fb9da78bbea4db1b8c00f75f0276a39
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/apps/backoffice/test/restaurant-knowledge-loader.test.ts	4c7ecb8760f811dfbe88757954b86786142baedc763cd7bcbb96530c351151b1
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md	9724cc7bee4b996158fec7669375862ab3df53bb846079cdf794348fdbcd80b7
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md	0e0cb7e003a3a14050d9fc056851390020d5aa3a1a5827b821f244cae7f2d350
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md	65e54deeb03aa1d6d6a409d69e29a6a1d9e4f02df53c0303e7c148686dba7eed
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/README.md	ea24dbfa64675369684e987208cc8f7b4274b97cbeedccdb0d193d7008dee07a
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/UI_SPEC.md	1e2b6ee3e025ab2168ae4dd489fbc331c7e567d0223481e37d837dcb86dd7cc9
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json	be4d18a6478c5c637c45df08d2b4188380340a5ae19e6264fb61523ec4d71052
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/src/restaurant-knowledge-repository.ts	3b610a9e456daf723342a1153cef94ecdcf36ebb795f164ce436bce79dab240e
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/src/schema/restaurant-knowledge.ts	84af04f0eff84632913d50275d8fec78da0a6a56c1b0704a2addcd1f7a6864a5
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts	97446a751e87598aff481270cfff04cd0080d85238dc3eb6b955fbc2414ac4c5
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/test/schema.test.ts	ece2b4f66bde17f8d492dbddfc39d756ccf4a52e27eb02a9496b359eb8164e1a
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/git-status-short.txt	fb4cb3a4c8d8b091aafc38f667a6ed81fd9419faf1918551c820088cb7083a37
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/head.txt	0753bd3e3c20862805aed2c30efa94619a868c5658d27f0ac5a9778934030aae
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/intended-new-files.txt	ca5ea354b6c5976e4a4656bb567f419fe68ee4fda18082268e78a9351ff0abbc
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/planning-and-gates.sha256	506acf1df58a2ae910456d8212b954cfcf137977cec7f9327f8fcd120c3a7c2d
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/protected-existing-files.sha256	0b9cda3c0217e38444c601b2e57164837350d06c8eee16b3ba22e35cca5d517c
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/shared-file-allowlist.txt	57ec445459e503fa4fb7e0391261f6bc20fb1bfe75ba2a5750e8760254c6643a
docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/shared-files.sha256	d011e5e012f1b2a0dcc8ceadfbd331547e3468175541e0cce33264863006be31
docs/reviews/restaurant-knowledge-team-culture/qa/QA_REPORT.md	e2ec61852dcea0edfdc4632d3ae85cbf12a328828be479590aceb31b9ddbbb9f
docs/reviews/restaurant-knowledge-team-culture/qa/manager-editable-768x1024.png	793a4982b6c2b6b1821ba169df8bfd3a3efac2ab72963fe4b5c91ba5edf44911
docs/reviews/restaurant-knowledge-team-culture/qa/owner-all-empty-1024x768.png	75041c300c23066f5acab9c21b97c0bfd80166d097e061630fe76abab21d57c2
docs/reviews/restaurant-knowledge-team-culture/qa/owner-dirty-390x844.png	e41770d4a6308eca02d746c02ac7075279024eda34b4bb78a2ea478933ab88d5
docs/reviews/restaurant-knowledge-team-culture/qa/owner-persisted-roundtrip-1440x900.png	3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b
docs/reviews/restaurant-knowledge-team-culture/qa/owner-populated-1440x900.png	3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b
docs/reviews/restaurant-knowledge-team-culture/qa/owner-reloaded-1440x900.png	3cd3d9441a60b6cbe4e4bd65530db79c6f3f780be529151a4c8180739055d69b
docs/reviews/restaurant-knowledge-team-culture/qa/owner-saved-1440x900.png	215ad3cfe687aa3fdc29fe181ae2839c99521786ac0631d04638f9db26bea303
docs/reviews/restaurant-knowledge-team-culture/qa/screenshot-manifest.md	80d9222516322e84d5a73e97a719a5d0af762c03f297e41163a8f8bc42d582ce
docs/reviews/restaurant-knowledge-team-culture/qa/staff-no-access-390x844.png	32c11ee11492b1e1ea8f1a212950597eaadeabb6f0ceb62c63e588e692893f07
docs/reviews/restaurant-knowledge-validated-knowledge/01-analysis-review.md	38ec43a4f9ae0a05922aa4a08209ab76dbbbac56d28ccfd1f852667bf4442b8d
docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md	894efffdcb38fedab5956f925968ac0b1cc177a9eed212b30164c2c5f4c286ef
docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md	56eb5f4807b82d500ac9b323c60506e2040c25586356beb90b632fbd6b0d9a4d
docs/reviews/restaurant-knowledge-validated-knowledge/03-final-review.md	37e77fc7d4bbab66e5440312ba4012c879018a7f461df2a716bfc466c25875b1
docs/reviews/restaurant-knowledge-validated-knowledge/03-implementation.diff	34f6a657202216d3e8e5bfcc20167b64dfe8581604f7c3d37b095bbe76b0840a
docs/reviews/restaurant-knowledge-validated-knowledge/03-migration.diff	f0e58c0d65c20a79f11b059bbe9038528002ab1a4ec01547654570a20f34ab4e
docs/reviews/restaurant-knowledge-validated-knowledge/03-pre-apply-manifest.md	cf0e70474a694a86460df42bca45ec45ae7b650778a72b81c8f423e3066956ee
docs/reviews/restaurant-knowledge-validated-knowledge/03-pre-sync-manifest.md	7163043d67a7951b57b83bdaf5bb2c892c9ebffdc806859d6a86b139a74e3d48
docs/reviews/restaurant-knowledge-validated-knowledge/03-verify-evidence.md	7dfc2bc77d1d61a264431303783b5e9f9452bfa1f072b1ba78552922fafe615f
docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md	82a4470c3b4f3d415db7964eb514919b9fc30e0ecab6897745145add28a4b306
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts	2e33e93dc34a9e6953b9a9b31ef61e0f1b6ccdbe50fcda9836fb41bff912a2e4
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx	641f22e3c9fae436e7c1dc34571f3cfe4690cac2ba3c484831d6982b618e0f52
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts	7fb32e24c3aeb7ff6d4c95ef58fe5daa69a0227685882f0caf0eb8891eb6f8cf
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/apps/backoffice/test/restaurant-knowledge-loader.test.ts	8023571c14d607223f4aabec6bb986b7be4a39c06540bf0461a6c56b1fdca2ba
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md	85bf94636990415b9198ee278945c5a73bb0504d4060d8233d4eaff05413f408
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md	7b96839439544f2542eabbfd2706e3870cab0b85010e93c5df844d233956b4fd
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md	639a8cd8cd856bc6b3a84efe87c00db083f29009ed88aa8a0a6b31d5c6441a47
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/README.md	db492fd8994956b870d7e3fd30cc226149df3e0fbc0c6659df193414c85d4d44
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/docs/ui/pages/establishment-general-information/UI_SPEC.md	0d782dfa04180b732d5edd645f6b5fa17dd34542b7f5df5b9361801fdcd96c37
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json	eda4a2bf75d48b6cb69a39ec13b84412a96ce239f6b0717ea39cc0cc1118a3f4
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/src/restaurant-knowledge-repository.ts	4a459bd0d165544a63f6e26d724b55fd7a930beadcdc8eb2cb08ad8e90db5967
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/src/schema/restaurant-knowledge.ts	44253bc66c0407ea6fb04bedddaa455f94f88bb961d0764ea22e0d5a9940d249
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts	138fc80b3b7dbe2d89cf484c9b9d9c07daa183f7fc59c25861d67fc14c2c9d64
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/test/schema.test.ts	8f5d1cab46eb440c0789276265453b370dd7dec8fa2fb8fab6348d7252da66f7
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/git-status-short.txt	cd00a8ee75097cb7af60e61f1c5001691912a06afeb797ce844bc6ca302ec190
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/head.txt	663c7627cc7688e12fa71597ba32134c71af7ffb602789613fa7912c4140d910
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/intended-evidence-paths.txt	f609361f3b6bed05bd955c4da094e3db886f6d17b8ad388aca68c6f4684ba294
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/intended-new-files.txt	f9848faff6e0de79600d48cae4bafc0dc1f12fd4302f6372c8a2af8ad80a53ac
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/journal.sha256	8f726211cadb96f7a307464ca124d9e207913a883445a244347ec656c4b6718a
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/migration-inventory.txt	2dbec1cefebe9c34710eb2f917a5c4cc10f0c8276ca3fb6c1499173fd52cc481
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/planning-and-gates.sha256	bf02e6a99deb89c275a903248fcb7acde587e388879db3ab4f035656dfeab4c3
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/protected-existing-files.sha256	a5061fc6738329f11d9a53ae2cd96c190d090fdeb23f6bedca5ff5ea5c638c5a
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/shared-file-allowlist.txt	14ec04cb2bd27b8e6254334662416e28495d614031ea9b844ad1b5fb8c29f540
docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/shared-files.sha256	bf7cf4d263e13e2110dddc605a91fd8f110126a7b779c3e0631d52ab2d3dd0b3
docs/reviews/restaurant-knowledge-validated-knowledge/qa/QA_REPORT.md	4a0d94d87a6075e2bd3da893622e856aa3eefe6c7d9345a2d9eb3b2064f65337
docs/reviews/restaurant-knowledge-validated-knowledge/qa/manager-editable-1440.jpg	47244c137ffcaae6d9b179e3addd19dce71c3939dd5f8b117304851e3a70f63c
docs/reviews/restaurant-knowledge-validated-knowledge/qa/manager-update-success-1440.jpg	850d6aa492ea26cb685d612236d2415dfab34d2700ad6fa0dbf5c033a51864c4
docs/reviews/restaurant-knowledge-validated-knowledge/qa/no-access-platform-admin-1440.jpg	f090fa1da405fecfe9e8032f98253ca492b5e23374e5df1e4bc9c5b3fd24d31b
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-blank-edit-validation-768.jpg	a15ebd6b631bb12edb6a0364491f6bb2bc886bc92e9c9d96522033184b713976
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-empty-1440.jpg	66441165eaadc2065d4cc9ce82a8065b0fdd8bdf0f22edf1b269f966df0c6282
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-keyboard-focus-768.jpg	fc1110c159a8c5df5a8a5c93d143a0b237830e4179f2d1d0bbe0c5224183718e
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-multiple-items-1024.jpg	238556a96e70270c27476d5dd57a7866c0e22823c8b7b0d333f88ee635b3b997
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-one-item-1440.jpg	c382cbdc962225006faa04844c431f10fb7bef650c17e672e91d4c178f8af9ee
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-pending-create-1024.jpg	c243d95fccc5b425e4dcd7267fa4dd4ea3d8e3ee3746a2ab0d61bac604697959
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-pending-remove-390.jpg	18e60044a393e7ed4f580ade51860db1abe28dc3cbe5440be31689ef0fbe8a8d
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-update-success-1024.jpg	662b8f5b2a02f362e93b8d528303da04acd6fc503b40d4a45ad9c6ce365dcdc2
docs/reviews/restaurant-knowledge-validated-knowledge/qa/owner-whitespace-validation-768.jpg	9512ac5ba8e83ebe29e096ed02815a46ad5570ba863aa1531ba84ef86384431c
docs/reviews/restaurant-knowledge-validated-knowledge/qa/screenshot-manifest.md	0de6c62e84480dad876679c7638d5ee313a1ea438df46acbdb2818e0a31bae49
docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md	8be6ec2bb544955ad27e131a877f3f361741a85cfb96167911a9e95593f47a2a
docs/tasks/TASK_TEMPLATE.md	6181ab82d4d22a30b02d836e6e09e427ef18a688a1b8b37610673aa6e4028786
docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md	af36c756a79e5a0c6c8a4566651df7e053e9468e4dffada3991eac9b652b4050
docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md	802cf663fbfd2abee4e45a15723450dded0ac1d8a0f75e6a6bcb2b4aa400f3fe
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md	3a8e3ad54c0b25240c2807dcc3e6007032b21e6fe38a2f60485b1304c663f95c
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md	3a9f28842b5eb8e6abfba01eb32ce15f3936358fdf543d2e81f8c655df9050ce
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md	13295a7c1760535e16bdf1ca500fc9e5646957d024e2b1dec9ff9a37362b74ce
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md	6ba82212a9b07239905d93f99e54ddcd63cf662d3e2e8c503fc38d909f05cb21
docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md	286e8257f44d98c92e4437264caffc477ac9694ddc111e3bd15086d6c4e8b1c4
docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md	bcc64d6d57ddd7ab838f93ea670a5950befb1a168f7356b8f4f7f1efa9462545
docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md	c756582e4d7b885de4f65ba087dc3f1642b32e51bb81a0c633a0dec379c187c2
docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md	54375b5ba943bad17f12cf24876327734ef435399d7b57cdf060bc591cf1aeb1
docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md	0cc1d849c2f83a87802ce2ee8239c3b409f20c37f01dd3c4052be7dac2dbdd29
docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md	56d11486010cc8d5c18cad82242c02759d80e3417ac732320ddd08f5754907b6
docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md	a244f28cabde04d78bc1189517d19514c74f336611ee74cd146228fd7e0c4531
docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md	2cdb6edaf3ba6c292c4ee7bf0a9b1e3ee758676a42f6ee46c44b16c333a8f50e
docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md	9b702151136d530c441077f08cf8d415d48832960c2aea9c13e445fe79c97f52
docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md	38d3cd2c5812ff5693853b9d9cac2ca25fd8b401a81e9bf463746413ec887a86
docs/ui/BACKOFFICE_FRONTEND_RULES.md	db3faacbb9d6c8c0b85b4c79c85c4ff952b9f4f917b029dc8b592ea8dd9ced51
docs/ui/DELIVERY_WORKFLOW_MODES.md	d0c035a5510b82492c95f1153b461b276718dd89da70c3d34f5b95c1ededc999
docs/ui/DESIGN_TO_CODE_WORKFLOW.md	b5bde661cc67da3bf48f0981f5fa4720347173513cf9509cfe80be05d5c7f279
docs/ui/PAGE_PACK_PROTOCOL.md	68ecaa85ba8be73e56fc9903f29dc6ac78ef9803d943ca54bd6cda36145d51af
docs/ui/POS_FRONTEND_RULES.md	60a252445430f0b04fb1b7049fe690abf4e95f91cbfaac6994afb8b52a652007
docs/ui/PROMPT_PROVENANCE_MIGRATION_REPORT.md	5210f3f2fabe264b953a3a463e264636b76bfab04ca72662423eb87c0d7eaf85
docs/ui/README.md	cf45d6be36bd69bf6fd3a010f20895178b5cce113507a935fe65f49a8cd63a69
docs/ui/UI_PACK_TOOLING_SPEC.md	d18ba106754a976a1d9fa0b01046535ef35c12b68a3a79f0aeda85f5507487bb
docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md	8cc40939750b3e9692a0cab8b78e5e9cf90cba02faf26dea4a0cb7c4076d59bd
docs/ui/UI_WORKFLOW_DELIVERY_CHECKLIST.md	3943590e5bd8d0569430a2073a810fcf266420d2efbfc96a3d7051d94b9d185f
docs/ui/YUTA_FRONTEND_RULES.md	4754f686492b1c8683d7aeed62f6faf4be709c45c9f90c73bee17c22b9e93949
docs/ui/pages/README.md	b68aa197f8448d72095735fd3be0c81256d571c39809f3dfc69619be3fd3a3b1
docs/ui/pages/backoffice-equipe-formalites-personnel/ACCEPTANCE_CHECKLIST.md	8dfe06c11a3c1db078eb58d0261016c6815d8188bceb688c4fd3dc778937b1d6
docs/ui/pages/backoffice-equipe-formalites-personnel/DATA_AND_INTERACTION_SPEC.md	3952dc1ad05e8303da133e5ef3f7e2a71452eed780bcdccfe02b62c6dc52e8d1
docs/ui/pages/backoffice-equipe-formalites-personnel/DESIGN_HANDOFF.md	d54b426da8506bf990ac02affb136ff8e3948b1847d5dcc0828fd32856e1d535
docs/ui/pages/backoffice-equipe-formalites-personnel/IMPLEMENTATION_PLAN.md	a36397f37bcef2d1e18b91ec47ecc3856f2f16067a3f932ade32af25421e4289
docs/ui/pages/backoffice-equipe-formalites-personnel/LEGAL_REVIEW_BRIEF.md	d43d712ea7f1a9ebdb686df0d926b8e6c2673991123bea2e16339558186809c0
docs/ui/pages/backoffice-equipe-formalites-personnel/PRODUCT_SCOPE.md	c338d12c183bb8f813818f8a98a7df50d98bcffaeeb20db4243827e5aced4023
docs/ui/pages/backoffice-equipe-formalites-personnel/README.md	cb1391626ee478bb2ddb6ff31c5d7e38e825c89c875f9a8c835d0b42c53e3a92
docs/ui/pages/backoffice-equipe-formalites-personnel/UI_SPEC.md	abb907107354f94caa6b9de8958257c243cde4dc0b08aad54a1697eb0fa610d3
docs/ui/pages/backoffice-equipe-formalites-personnel/prompt-provenance.json	c518a9ace38cd6f7e9988f91c5f8ed2c9aaaedb86c32a0d6a9f71a3bebf4ce1c
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/00_REPOSITORY_ANALYSIS.md	7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/01_VISUAL_BASELINE.md	d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/backoffice-equipe-formalites-personnel/prompts/05_VISUAL_QA.md	5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0
docs/ui/pages/backoffice-equipe-formalites-personnel/references/README.md	080b874253293b207be75f2fd429b9dad2b490864301688217148ba92f50d0ae
docs/ui/pages/backoffice-equipe-registre-personnel/ACCEPTANCE_CHECKLIST.md	9e2da4accd6104732b1d40ae8c9cf947c95106d0224db883c2cce77e5876d8bc
docs/ui/pages/backoffice-equipe-registre-personnel/DATA_AND_INTERACTION_SPEC.md	cf11668ca3e567ec57544d3cb17c090e1010cdb85629aa5437d04e56941da532
docs/ui/pages/backoffice-equipe-registre-personnel/DESIGN_HANDOFF.md	644a5f9c8638931a1511fb47b4ccc7aacaadfd21d963bfa69f67119545074e76
docs/ui/pages/backoffice-equipe-registre-personnel/IMPLEMENTATION_PLAN.md	6a4b7e254662dae477c1c9b4e4246fdeecb7a466245e348a0c4589a57b53306a
docs/ui/pages/backoffice-equipe-registre-personnel/PRODUCT_SCOPE.md	5a537c8b15c22668c28065ef51616c8126720e4f74d064b90913c33c25bad7e4
docs/ui/pages/backoffice-equipe-registre-personnel/README.md	f718c97f4102912e10e30af92d61bb899a7255582ed888bb0732c7648982b37a
docs/ui/pages/backoffice-equipe-registre-personnel/UI_SPEC.md	a8bdf10d28bf89d910a6f6d0ab239ef291484a433e0307882232f3e859405bae
docs/ui/pages/backoffice-equipe-registre-personnel/prompt-provenance.json	cbc327d12ed05c86286ebff5d6daa6ac4fec0241242804868cdf713270eb8c26
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/00_REPOSITORY_ANALYSIS.md	1b451a6c567fe08900889520bfa84daeba46d5af12b5990a8f45d816ed544ff5
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/01_VISUAL_BASELINE.md	d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/backoffice-equipe-registre-personnel/prompts/05_VISUAL_QA.md	5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0
docs/ui/pages/backoffice-equipe-registre-personnel/references/README.md	29a05c7f9204420fbb3e4ca2875e869743921783f08cb2f55150568cfc923cb3
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-design-draft-1024x768-01.png	87346cab160d4df13ac7dfff9dede7f3806d3966a151f5aad319bdc4e40fea68
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-design-draft-1440x1000-01.png	157eb5a9efd86ef81a3afc5279c20088c8163e693f42fabc7f89590e8da73ae6
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-design-draft-390x844-01.png	dae4f155a62cac8a2959f36ded8422724336e362d4da823d7f011935d75c7624
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-design-draft-768x1024-01.png	275747d4c6c7ceff479f9e0e18cb1b444d86c5104eadf3c5bfb7b971333d4551
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-phase-5-as-built-1024x768.png	dc67e846d77aed5eae473897a47355c68db3d17d7a4c646a27950a276fd6f5bc
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-phase-5-as-built-1440x1000.png	e4379d2e165abb8336e1cd2f9585a82a4520b00a6a5f15fa0a2ca5a698d4c3b2
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-phase-5-as-built-390x844.png	a6318043f2eb719146f45ad8a3842cdea2121570c146cca695bd444b2a7889b2
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-phase-5-as-built-768x1024.png	5d2d9c54bb5413adc434d4ebd19f10ecc657c8e1cafdfd59f309b65b4cc22edf
docs/ui/pages/backoffice-equipe-registre-personnel/references/wave-e-phase-5-as-built-inscription-390x844.png	70a779230c1d2e5d4e71bdc7b43e853137703966b4164e287353ec200bdb9c1f
docs/ui/pages/backoffice-equipe-salaries/ACCEPTANCE_CHECKLIST.md	4f67e38c5d99c668467717c6ec22d3f0b65ea050f472d7b33de07f7c28ee7712
docs/ui/pages/backoffice-equipe-salaries/DATA_AND_INTERACTION_SPEC.md	ae436e3a996727ed60dc7f38e774043192035a0389b9a2f183053fce28639e2e
docs/ui/pages/backoffice-equipe-salaries/DESIGN_HANDOFF.md	e542ce5a1fa1f0980a1862e2c23ef45924189c402a84ea9e5d5df0863ba769e6
docs/ui/pages/backoffice-equipe-salaries/IMPLEMENTATION_PLAN.md	092301cb0d16bd76b1b3a61327114279dd1a81aa70ace7a5c2fa712daccd6162
docs/ui/pages/backoffice-equipe-salaries/PRODUCT_SCOPE.md	802ff0e2fca1746e5cc2f5bd6e509131bec0062b1726ce16405b19e226417e35
docs/ui/pages/backoffice-equipe-salaries/README.md	2beb72988f4c15acc86fb0d93dbcbf6c24dce5b7bb0a48cbf572e79e70fecc03
docs/ui/pages/backoffice-equipe-salaries/UI_SPEC.md	4e07217e7c8c7916b3eddfc80a67e134efcc1973385d02b12ebd7601c6ddc043
docs/ui/pages/backoffice-equipe-salaries/prompt-provenance.json	f9a34c5e9410505c51992f8563ffc74a3397e5c99660f55099958fd7e85e1675
docs/ui/pages/backoffice-equipe-salaries/prompts/00_REPOSITORY_ANALYSIS.md	81a6b69bb8bdf1e9ad0916d684d518a2677bea0e871115480ca6e86fd106ce7b
docs/ui/pages/backoffice-equipe-salaries/prompts/01_VISUAL_BASELINE.md	e413b4d12749b223b1e2eba0d442ffcfc585466b9354d04a996d8a9796bf409f
docs/ui/pages/backoffice-equipe-salaries/prompts/02_COMPONENT_REFACTOR.md	6306b154c1fb4ad6e9dd54c8eff4c7befff3c8aa6f09c5d7e224bdbe0d00fe37
docs/ui/pages/backoffice-equipe-salaries/prompts/03_INTERACTIONS.md	7e3a7bc7b0688f22f95326b12392ca965a55a8573361d413253256cfbba0966c
docs/ui/pages/backoffice-equipe-salaries/prompts/04_DATA_INTEGRATION.md	27d3138837903049b58eb0f56ac842e9b123abdd910642f246838cb1ab70613a
docs/ui/pages/backoffice-equipe-salaries/prompts/05_VISUAL_QA.md	be70755afbacba47b306470e084dd76daa0122ea2740cb02322bf79b3d1fcfe4
docs/ui/pages/backoffice-equipe-salaries/references/CURRENT_UI_AUDIT.md	1466e19980618fa7d523d96cbbcbea93add69034150aa48dec7e34e8e6c25c89
docs/ui/pages/backoffice-equipe-salaries/references/README.md	4a8ab04ed4847081f65c26fc636339ff69da69e0ac7fd1e4582fb0ba6588ba90
docs/ui/pages/backoffice-equipe-salaries/references/design-proposal-desktop-01.png	17b60d1ea64f3833beebbf7d95295a2f1d5582df697d5ed09a79e358e321b08f
docs/ui/pages/backoffice-equipe-salaries/references/design-proposal-mobile-01.png	db4706c874d4f90196217990e4295579128ec2973444bef05f8e456c99e44694
docs/ui/pages/backoffice-equipe-salaries/references/documents-design-proposal-desktop-01.png	ac99db67e3302e775f909d3d3a755430eab1f10c61cf8b1aaea28d46e05374a2
docs/ui/pages/backoffice-equipe-salaries/references/documents-design-proposal-mobile-01.png	30569baa2cfce20003f00509f8573eee4990503c953e12bd5d1d3725243be695
docs/ui/pages/backoffice-equipe-salaries/references/documents-design-proposal-tablet-1024-01.png	6063e5a95f3e852a41ea5dd9704c16f43753273a5606360dcc659839ba039817
docs/ui/pages/backoffice-equipe-salaries/references/documents-design-proposal-tablet-768-01.png	4bfcde08f10e054d1a017b460be3c75e88c6c77ff885a22067392ace12347487
docs/ui/pages/backoffice-equipe-salaries/references/documents-phase-5-as-built-1024x768.png	53cfaf83631ae2db84999e657ab13da10f5a65c5aab43df7e3a5783e8016133c
docs/ui/pages/backoffice-equipe-salaries/references/documents-phase-5-as-built-390x844.png	17b5b264946321e250e2e1acb9e13a65e0668b9aab7fe2edf5f76c91d9259c43
docs/ui/pages/backoffice-equipe-salaries/references/documents-phase-5-as-built-768x1024.png	669bd5bfc5323dacb3d5ad1495030ffb10c8e35c472d09698c2587da6b762bb6
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-design-draft-desktop-1440-01.png	f45f76df8b1e206d84097ef7f5f4bb586e9f969a00b1ecbe7e5ae21a275fb9ca
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-design-draft-desktop-1440-02.png	a2a5f8542b27fdb7083f150a18a81353bba0afd5d6d3ffaf2592fb3cb3b7234b
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-design-draft-mobile-390-01.png	227ffad1e842c02562bb5f47afe030501521ce043c592894a8e9c25ddc74a274
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-design-draft-tablet-1024-01.png	a116080b3192118fe53f91e4048c6018b36b77da82d135763eb5ef76f6c2d55b
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-design-draft-tablet-768-01.png	baca498839f42cd2db5bf04842f449bd058e3b3339ff82f8ecfc06408f3f5d5b
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-phase-5-as-built-1024x768.png	687dd751a63757ae67a567b3b7714d574dd4858a5a8af4983968e3041935a151
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-phase-5-as-built-1440x1000.png	1425ac7931f43978c606afcb79f7fac0ea1eaeb29595dfbf516994697832b129
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-phase-5-as-built-390x844.png	0719b9f7600569953302ef32c6c8ee8ea196770a67bebbf537680cc88ae33bfa
docs/ui/pages/backoffice-equipe-salaries/references/documents-wave-b-phase-5-as-built-768x1024.png	40dc73e03a9aafda4a1a230cf4fb1a03cb2d0ab5c85f1ca46bda8a1d4e844161
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-as-built-1024x768.png	e91101bf0574ce030466e812d1f53b963ad5f5e636e386bc20c91b814ce1cf2a
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-as-built-1440x1000.png	f77007152bc5bcbb1bb53f62bcce2ec27faaacd3fc7f28f46728c4eb7d406462
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-as-built-390x844.png	87b97a5ef6a9ff1042a02659b25171ea647d3cf55cee5ce12112d3a351abf324
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-as-built-768x1024.png	7ca930a71470f83d7df1ffcacfde22ab65a9f292ba192dd1742ea6f559a0c2b6
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-dirty-close-390x844.png	bc70727c8919cb17d655b3bd22b673e7c87c484103c687d2f7d290b513603b7c
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-duplicate-1440x1000.png	12aff8a064f3ec3111cc7519b57132f1025dfad97363773013082b6bd30831b3
docs/ui/pages/backoffice-equipe-salaries/references/f02-phase-1-success-1440x1000.png	8fad02aa17277556434ba2fcf5a140ee5eb56e2ff7ee1c32cafb88a355a9d0de
docs/ui/pages/backoffice-equipe-salaries/references/f03-phase-1-dirty-close-390x844.png	8877c23def04420b6a57743baec926b54a9ba99a2659dd39deb903ea9ada5c8e
docs/ui/pages/backoffice-equipe-salaries/references/f03-phase-1-edit-baseline-1024x768.png	78010fb797b35df15cf8a3d544729470bb7f35c67d18eb859744fe55c6a1cfaa
docs/ui/pages/backoffice-equipe-salaries/references/f03-phase-1-edit-baseline-1440x1000.png	754837ead6a4ee4553320b63fe9d156a3667365177b26986bfaf4e783c96369c
docs/ui/pages/backoffice-equipe-salaries/references/f03-phase-1-edit-baseline-390x844.png	4d8a60a090dd139b598da3bfd394767779896e5fd3d5c522ffedc2cac4540e08
docs/ui/pages/backoffice-equipe-salaries/references/f03-phase-1-edit-baseline-768x1024.png	2046ff4192254cc2205ffdc09915eae3096ae6300ecdaf7e87c623fd9fc5a863
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-design-draft-desktop-1440-01.png	0bb37eb97fc509722bdebf290bffa2cf9bfce89b4b36ed4121a8aff707a1d81c
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-design-draft-mobile-390-01.png	1578350692791527e17c11641a2282f05234d2776b0cff331046676cc2aea9ec
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-design-draft-tablet-1024-01.png	effd3a14739b7083c27cbe8d001c8c7b982ce8a0567d591125551c0d30ae9414
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-design-draft-tablet-768-01.png	f04b7ab930e4bf03f20eebcd4bafbda680bbd65d67890939805c9bacbaf22d93
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-1024x768.png	80c3274c4c16b43fbfc8cedfc846c1485ae0b593cb920d8a21819bb9f80f2797
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-1440x1000.png	70654296d0c64fe84acb331ce44b9fa6eef799b8b68a2ff7a67e9da50ef67dcc
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-390x844.png	9f23aa8d5079fd86b4b96ad0bb6d1d9f6487a29d89dfd0ae677c8299e47042dc
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-768x1024.png	4a526813265a0147bbb058447c9b5b415139062de3dd4b9d5311f6add6202571
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-employment-1024x768.png	a9cdd470a29006d2ca72923b2c0ec17031578b3aff2b8d63cacb06a18a433ffc
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-employment-1440x1000.png	68443c3359d8b3c23ec4d441c6c6c674792b3061dc28b1fe2945952884902c5d
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-employment-390x844.png	63f4d472a242bcca637a1b5f05b813412e4406f67e4df33498ef4e51ced3327e
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-employment-768x1024.png	53d4923426bfbbc201c502ac692090fec8afe96c7c511593ef5837c812fdd1af
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-identity-1024x768.png	66123653cfae4b42351b07d199db71f8a508df5502170fc82687956195a6d45c
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-identity-1440x1000.png	72b1d2de3e098fba6604b53e8d01c247d13e8a85cdaac2754a965344db99d22f
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-identity-390x844.png	ed2eb662b6db337a4d966f801420d5f88eb3c789294b2690b67ebb92c277f09e
docs/ui/pages/backoffice-equipe-salaries/references/wave-c-phase-5-as-built-identity-768x1024.png	4c62702daeef96353d9d345a8d03bc1eaeb46ecdd30294746c67a6056ec80f5e
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-design-draft-1024x768-01.png	80d97f7f46a6b9c365fe44d4258f65c6c8bec87336455ba7cca03fd3310d7d5d
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-design-draft-1440x1000-01.png	f46e67b828e933b1a2933d3d31a44e3d812dd33b716bcf4808acc90174454a7a
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-design-draft-390x844-01.png	c64a2139f9eecfbac35e4d50d29022d869f4d94f15241a4d7362cdcd4547cd55
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-design-draft-768x1024-01.png	77cf748d039c6ebb44197c02ec76ee22c4072b09a5feb239ecccb3658e7d6233
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-0-containing-page-1024x768.png	f0ad420908978c0ec0bbd3fffbea296f5691e6515c8e2524f28d7ef8615da184
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-0-containing-page-1440x1000.png	e9567a1ead384fdfba284789455fd8b32f72f0ccc2f5cd88ebf6295ffc1d367e
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-0-containing-page-390x844.png	edc5ac101412b1c475327015e4c398b9d08228d095c789948d77bd96b9b43c3e
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-0-containing-page-768x1024.png	2a6de34b111b74a8399489fb02eea3b4649bb2d945a7d6a85e7acdd738f24edc
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-1-prototype-1024x768.png	ab0f1ae91f48b0514459bd37908785428a7ed3beda472d64b83470d0cb044a30
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-1-prototype-1440x1000.png	afef48e513137afe7ef1e9339c366ba585daf942e3a9a72b4a5a7dcd6e5bebc7
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-1-prototype-390x844-detail.png	d63ff65cb49de108d0f4e7416c524316e921f6bb57a55290ca34c2d99c79cb12
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-1-prototype-390x844.png	785a5608462bf0ec33a382790a22df2d21a6b7aa3295f775e5b31b264773f018
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-1-prototype-768x1024.png	59a15c622f1bad4c37fab212a7dc1116b3cd92072f08ad6493a12e71b4659551
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-5-as-built-1024x768.png	c9d60c8202b959d3b8d68f00a775f6c5ad303c7d816f2f396d87455925b6f6db
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-5-as-built-1440x1000.png	1b859a262ac0f71b48d4888e03fb4581c449d776626bd10f787643fd7119d6bf
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-5-as-built-390x844.png	2bdbfbf534fe0776a3f36898455078054444470932b2778b4c1b5f326c607c24
docs/ui/pages/backoffice-equipe-salaries/references/wave-d-phase-5-as-built-768x1024.png	59aa05dcd33a0355205d31a1a591d345d1ef7951043a70e9d7b248ff4bf3ca7d
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-design-draft-1024x768-01.png	0e7bc1a6e3738797d627354f4c5e885ea3a3a536cf6587d1d847511add0be355
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-design-draft-1440x1000-01.png	2a2a4d5b724b214c3b0db65a5d327b02bd21f42e04227d8645f7796f70a1260d
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-design-draft-390x844-01.png	4565599e8f8fee8bb4df6383ddf840d9397e5598fcd4afbc8abd7d431e966808
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-design-draft-768x1024-01.png	89d8545dd27f50136cbc2b6cde4172ca1d8a272ce5ca507204aedc362a6c4bc2
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-phase-5-as-built-1024x768.png	4e6d251ce1d7b6a28bd451576fb3dfd8376af28993af7c3a1f571ee294a9c33e
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-phase-5-as-built-1440x1000.png	01112b188707584bed54b2712e0bfe21147f7c05d43d1ec535cd750bc827e692
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-phase-5-as-built-390x844.png	6f0a95a485a29279defdc512f3ac30cbb98b72cf8d4ca4cf5e00b47b28a2717c
docs/ui/pages/backoffice-equipe-salaries/references/wave-f-phase-5-as-built-768x1024.png	3b7eb3aee403106af966eb4b9a9eb228f6f19de10c4bfe9b5a130bf06c8bd45a
docs/ui/pages/backoffice-pointage-employee/ACCEPTANCE_CHECKLIST.md	cbcc464c79e57f3bc34c49989d936b1dc2411839b552a159e407a407c72166ed
docs/ui/pages/backoffice-pointage-employee/DATA_AND_INTERACTION_SPEC.md	25ffcdbb137b26568a01373c6a55c3ea714f97d70978c3c22310433bd40d68fd
docs/ui/pages/backoffice-pointage-employee/DESIGN_HANDOFF.md	d94fc07f4e318bda95507904640e5bd80f9f5bacc251babfbf85f7bc0fc56cae
docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md	b7dfc8937893032253f801160c1e9fa21e2c8cd34439c0b80e9eb38e7ef5606e
docs/ui/pages/backoffice-pointage-employee/PRODUCT_SCOPE.md	16a14204820f4a1b2033f26dca03494db9e5e61b28474c87216ce206062582d8
docs/ui/pages/backoffice-pointage-employee/README.md	77377af7a5f09d4884541e3a90de151e0ae11223b73e66f2dc57cfb08765d902
docs/ui/pages/backoffice-pointage-employee/UI_SPEC.md	cd109fb341545a280189d92b891506b9211134600720cf5d2b9b107563aacb45
docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json	04c6c99bf8067e848cc4df1f0f871fd43bdf1ec964d786f2617dcca4692b8a61
docs/ui/pages/backoffice-pointage-employee/prompts/00_REPOSITORY_ANALYSIS.md	7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c
docs/ui/pages/backoffice-pointage-employee/prompts/01_VISUAL_BASELINE.md	d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119
docs/ui/pages/backoffice-pointage-employee/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/backoffice-pointage-employee/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/backoffice-pointage-employee/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/backoffice-pointage-employee/prompts/05_VISUAL_QA.md	5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0
docs/ui/pages/backoffice-pointage-employee/references/README.md	e2ddabc5a6a004441847e71629b84281eeac075c41a195eea8955f5d30a72a45
docs/ui/pages/backoffice-visibilite-reputation-satisfaction.zip	502b7e540b47c4ed3e03259479e09196050ed44b8194d964587b259cc186d443
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/ACCEPTANCE_CHECKLIST.md	1f703c1a2b64ef629bc35962c808ef211f3a2de5befd77173e6678c46a19df2b
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/DATA_AND_INTERACTION_SPEC.md	7cd469c70e8bf869b5dd26b7e9ce1dacd8c6ce56be7b7542e99d9a1cdfe4fbac
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/DESIGN_HANDOFF.md	6a6eecfd891180ff7f16b02dac6638483db5330eebf4fac8814fbcb27ec1c153
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/IMPLEMENTATION_PLAN.md	e1139dc42f9444c0bddeef450cc8eda83aa63db94de9ebe1fa060ded4e77be99
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/PRODUCT_SCOPE.md	97effa96174067d8256d14be8e548884772925908b9549ffcb2c19dade3d441d
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/README.md	1fb3ee2f46d0021fcaec8078c266fca04c111034bf1208af9446931b92e8bd13
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/UI_SPEC.md	4d496a7987235ffc0369e6a60c79fd527dd5b6ac6d4d215882025b28c652d69c
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompt-provenance.json	42fd26d95c2cd076ad21105214402d08f408a49b6248a235a4e9d68433a6f603
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/00_REPOSITORY_ANALYSIS.md	7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/01_VISUAL_BASELINE.md	d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/prompts/05_VISUAL_QA.md	5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/README.md	46b903f95defceae2d524114e8c6c47bac63d03c6deda137f80d00ec51dc142c
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/baseline-owner-1024x768.png	fb7f2f1f30e6e96aa0f303885fe8fe4220f4bdbe6479a0d36eca5d382afe93f1
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/baseline-owner-1440x900.png	b5aac03f067d4ea8661b35a99797e0cb639e3a0bdba4e77da5ff9842436f7f8f
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/baseline-owner-390x844.png	45c5b79d653275ed31785cbfcf35d75a6d06875f01ebe0ce87f0162e39916c66
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/baseline-owner-768x1024.png	08b1b0309d058f850c68df310a75620908347cf958c51621df49ba62ce3890a8
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/proposed-owner-1024x768.png	a0aeebe4cdc0040650246faa0c2f8a0eeeb248b90a27a796f1f1218f67fba281
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/proposed-owner-1440x900.png	f70e8edeee2711973bb418588006c486fa9864cb873059158c18aeaf3409c95c
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/proposed-owner-390x844.png	170232505d2341305847dcfcb976009bc31ea6c4577040e053559417e3c86a70
docs/ui/pages/backoffice-visibilite-reputation-satisfaction/references/proposed-owner-768x1024.png	2e95945d094a20263f302ce4fe56daaa57bdbb830920243eabd94ba10b79c0e2
docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md	56b888efe7a3a7a3f0612249c55adc9ede2bf176ca5b5d96c038afab6ff06908
docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md	c7c5d5ddc4196652ef55d0d23ff86103b9f062f6a44f1d4e7194939981f4f99d
docs/ui/pages/establishment-general-information/IMPLEMENTATION_PLAN.md	d56698956e0b22ae6dc4eca6cc2eefee48c52da25a549bc93c6a60bf4c299ae6
docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md	089bd74747079e5144a0248ab48772ba808ca568c6cfea554d5b7fe8a83eca81
docs/ui/pages/establishment-general-information/README.md	a72b94f2714bffcd6bd548dbc7b622f2890fa9defd9e38f4b2efe659960754c8
docs/ui/pages/establishment-general-information/UI_SPEC.md	b41eeedb19b56bebc05ad2017c9c0831be0b282cc8293350af84f9a67be71db8
docs/ui/pages/establishment-general-information/prompt-provenance.json	ebb329205cdedf2b8d1a811dd5c8ba73a7fb7d91293a67a4e6a7969fb3005861
docs/ui/pages/establishment-general-information/prompts/00_REPOSITORY_ANALYSIS.md	17117b7609e7c0d47416ba2844a16bd9955f6a6c29c2a8997052503996886eae
docs/ui/pages/establishment-general-information/prompts/01_VISUAL_BASELINE.md	8e97f8d9cd6f70ea0b43430a7e99e829eb375c84ab0c85a1874bf9262a907e82
docs/ui/pages/establishment-general-information/prompts/02_COMPONENT_REFACTOR.md	79039020d833d4df79a5f00dc332c3d7d803b8a44aab8130e7489765a484f7d2
docs/ui/pages/establishment-general-information/prompts/03_INTERACTIONS.md	cee585eb8b3fac5981ba9e5dad33a1416e86b5ec2f3dd1415055bbb13dd1de30
docs/ui/pages/establishment-general-information/prompts/04_DATA_INTEGRATION.md	0827f11ee34c77ba1d085b5df50afb40fefb83456c791b44de3cb1a4d035fa0b
docs/ui/pages/establishment-general-information/prompts/05_VISUAL_QA.md	3036c467b6a38ab7079596959ccf04a1bcd033cc4716a60d368cd65933c1e1da
docs/ui/pages/establishment-general-information/references/README.md	73f53ecb69805024e1abe0b2a0dc8509dc3bd4b9435674eb9d356a6fcfc6b865
docs/ui/pages/establishment-general-information/references/establishment-general-information-desktop-reference.png	eb8290d36841f2dd3718375d90914bd7454355abb919d19299c08c0dc3760947
docs/ui/pages/hours-services/ACCEPTANCE_CHECKLIST.md	f88ff3c25e82d1484179845683772ca720464c5418906cdedc0ce1b8cf174575
docs/ui/pages/hours-services/DATA_AND_INTERACTION_SPEC.md	68b3cd906bb9cb20f4295d64a9d65cc1712705c68c34a6f32614d255301a5e47
docs/ui/pages/hours-services/IMPLEMENTATION_PLAN.md	156f5945eeb1b682b4ecbd496236e6d8e731c78b0430c50bc2e7ed4bf2bf1efc
docs/ui/pages/hours-services/PRODUCT_SCOPE.md	ef970f89e19aef5da3f475ba20eab59bb7b6d137b684bd34b1965821068c1c7a
docs/ui/pages/hours-services/README.md	c8d563b01d97b2e8589ed9373653b11faf9a413a3a157e8e441409d71155b60d
docs/ui/pages/hours-services/UI_SPEC.md	6be88b329fabd0b37b4342692daf69408519a3c812741ff02f0fee767c418abf
docs/ui/pages/hours-services/prompt-provenance.json	8a19041cba222517d54da4fea14266286c5a6d7363fcfb2e7390ff8be53abf67
docs/ui/pages/hours-services/prompts/00_REPOSITORY_ANALYSIS.md	c2b52e83d16a3cfbb942b8fd05d8ebc31626fa17ff8e87b67d9cc825f64dff46
docs/ui/pages/hours-services/prompts/01_VISUAL_BASELINE.md	7fa194f13da7fa4d0fbd5ff2c306baa5edfae12db998659e5033d2864897acf0
docs/ui/pages/hours-services/prompts/02_COMPONENT_REFACTOR.md	0fa285bde7fb49031ee5ebf3f339ad7d0a195528cb0bfe388653dd6d3d92680a
docs/ui/pages/hours-services/prompts/03_INTERACTIONS.md	2ec1cf943c2a66a559561dc9b102c6f81d30cd3e7073e39aee8d95431d285ea1
docs/ui/pages/hours-services/prompts/04_DATA_INTEGRATION.md	527b45c67684abfed5f9825efc9b4a861e9759e0bc5bf703db13013b4c107955
docs/ui/pages/hours-services/prompts/05_VISUAL_QA.md	01fe08d11bab3d724f519bc68bcfc410491ab295f3cb68f1f3e4fc02fc853512
docs/ui/pages/hours-services/references/README.md	5dc3f7c1c4210a3ca57d344e046e6bc80d718b03d4fc1869d308205fdd8a0404
docs/ui/pages/hours-services/references/desktop.png	5e14686ad256bf4b4aaa6cb962393cbffb970d010ef700944ff38b451946acbc
docs/ui/pages/pos-kitchen/ACCEPTANCE_CHECKLIST.md	9aea85c66384f4134ff4f98775950618c66c124563cb197f6e74540b98dc4197
docs/ui/pages/pos-kitchen/DATA_AND_INTERACTION_SPEC.md	f0f73c66bcb298b5122e8a0cb22229eb56d120a61483a9e150b15eec527c211b
docs/ui/pages/pos-kitchen/DESIGN_HANDOFF.md	1118bc5f3b0401a069e08324953fbc3e0cceb7c9dabcc88ef112e0842aa01eca
docs/ui/pages/pos-kitchen/IMPLEMENTATION_PLAN.md	6b6fedc655ec80a0c7fe593510aac1e92f354549a5cf59141a3704af797448fc
docs/ui/pages/pos-kitchen/PRODUCT_SCOPE.md	c0f48152933c158c74408d4fc562f8ed7c1cc6af507ede488df1e51169214a86
docs/ui/pages/pos-kitchen/README.md	fc14f09f9c5104c4bc8cfccd5d3f31b1ae0bbcda4e615e0ee3e96c97328c1d1a
docs/ui/pages/pos-kitchen/UI_SPEC.md	44bb50deea5105e61e0ae099ba21c5fae560a97ad0e93597d92e807ac2c1d606
docs/ui/pages/pos-kitchen/prompt-provenance.json	a55bff0d84adb32df9829b30f85cb15090df4cabac340147e02db805df4aebb2
docs/ui/pages/pos-kitchen/prompts/00_REPOSITORY_ANALYSIS.md	8c72e16a28289ed2409d93a0fc9c476af7501fbea3c82b972ec3b1062d938aef
docs/ui/pages/pos-kitchen/prompts/01_VISUAL_BASELINE.md	cd68779ee3b0b7dcc1c7e405c397b27b7703d1a0cd73d1e46bccecee997bb41a
docs/ui/pages/pos-kitchen/prompts/02_COMPONENT_REFACTOR.md	c6892a0bbf288dc8447d610cf4648619e7b1c485bd4eab9a99729ee8b251e708
docs/ui/pages/pos-kitchen/prompts/03_INTERACTIONS.md	0933646f149d7b8137d73b83228fbf78b8c9864ef9084053428c7ea4a4d53270
docs/ui/pages/pos-kitchen/prompts/04_DATA_INTEGRATION.md	c5767a73f8c87a9320e54a5bdc74545420bc0e19a824a98560a99e451e1b5391
docs/ui/pages/pos-kitchen/prompts/05_VISUAL_QA.md	5d989ba8fae0a44c98524370bb659ede30528e24190561bcac326722928f244c
docs/ui/pages/pos-kitchen/references/README.md	e652e31ba098eb4c3b62f8d525a75789ca72dd85e0e176510d7471cc00691f59
docs/ui/pages/pos-kitchen/references/draft-tv-completed-items-grouping-16x9.png	f7e7ca07a9f600bc2cc275190695c894a2c1e8c14c4cda36daa8b9ed96a1d7b5
docs/ui/pages/pos-kitchen/references/draft-tv-dense-command-grid-16x9.png	cd81c812983c6d2241610e435c27ae30c0eab9ed7c64272126fd303282fd3821
docs/ui/pages/pos-kitchen/references/draft-tv-entrees-first-auto-columns-16x9.png	48b6441f924fa10c603ede3527890d2aaf47284c474f776ff1d58b76a5f4a234
docs/ui/pages/pos-kitchen/references/draft-tv-full-allergy-notes-16x9.png	a4d1b594718ab900cec86a4eecb2fb65e750a8e5750f5e8fc13dcaa207a81eef
docs/ui/pages/pos-kitchen/references/draft-tv-independent-ticket-scroll-16x9.png	9efd784a0121519e785bfde7a1ea00f17f0b2bd859fa04c35f347a8a2f45d658
docs/ui/pages/pos-kitchen/references/draft-tv-variable-ticket-length-16x9.png	5f10e99e31323df40316e964bb2deb098a9761be9bce2c8740a2906e922d9a88
docs/ui/pages/pos-kitchen/references/phase-0-current-empty-1366x768.png	d134ea415c5a7373925bcf6bb099d575175cf2fd1e3b6be88927c02aab2019c8
docs/ui/pages/pos-kitchen/references/phase-0-current-empty-390x844.png	508ae88778496fcf0c7609e9fb9f12ca978005adfa3f1eb69cc888d91210b8a3
docs/ui/pages/pos-management-catalog/ACCEPTANCE_CHECKLIST.md	329eff25feda0ab322c83cee07b9de64ef0a329dd3ef3ade95057bf884a4edbe
docs/ui/pages/pos-management-catalog/DATA_AND_INTERACTION_SPEC.md	918602c5528bbe2ecb7122b0a66e771e8402cf56ba3916e3a2d09dea2f8ef0de
docs/ui/pages/pos-management-catalog/DESIGN_HANDOFF.md	4b725a3ade67718e49c084d9e160c8316300c302e957018c97c7d9d44d7d93de
docs/ui/pages/pos-management-catalog/IMPLEMENTATION_PLAN.md	57f22d4997472e318153d1fafebfc4307a5ab2615005663a8491bc0467c126b3
docs/ui/pages/pos-management-catalog/PRODUCT_SCOPE.md	bdcc904f32850bf43619994d7a69a164c4dd491391ede2b8ede941f7bfc3bf0a
docs/ui/pages/pos-management-catalog/README.md	ca2f2b27e4478119d1a89b25de153d1a27bca30d3106fbb6ce9b7bbbad17e6d0
docs/ui/pages/pos-management-catalog/UI_SPEC.md	c430bf9b2d10e63730bd8d85d86058ff235c91d2f4a5c5982af1df04f63475ec
docs/ui/pages/pos-management-catalog/prompt-provenance.json	f10d875fcb9b3c055446dcd33875280872c9d1bf44115005a0fb79eca1b39070
docs/ui/pages/pos-management-catalog/prompts/00_REPOSITORY_ANALYSIS.md	7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c
docs/ui/pages/pos-management-catalog/prompts/01_VISUAL_BASELINE.md	e3db0f4087ca5b38109c6d595c0c30ee30bff35dfef4773fef6d6c8f9b360edf
docs/ui/pages/pos-management-catalog/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/pos-management-catalog/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/pos-management-catalog/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/pos-management-catalog/prompts/05_VISUAL_QA.md	beb16be7f9672bc0abf38fb8c3bcda0431f79d264747b74a26efb987319e5837
docs/ui/pages/pos-management-catalog/references/README.md	c6009a6d24d271b9714fbb405c65fab9eb6b8b80abff5ec7c726193576d5be2a
docs/ui/pages/pos-management-catalog/references/current-baseline-1366x768-full-page.png	dbfa53862be90b71ba4b2745139171c8e7c75eac96e34abe7e57738df43573cb
docs/ui/pages/pos-management-catalog/references/current-baseline-1366x768.png	c40daf40c84436d42a6802d6e83e3b9028540f7d7865fef088e9e666878fedf2
docs/ui/pages/pos-management-catalog/references/current-baseline-edit-item-dialog-1366x768.png	37cda29c30259ddbaa1aeb82e6cc015fa798b32cdf8129516dbd0d069aee4a5f
docs/ui/pages/pos-management-catalog/references/design-proposal-01.png	2130bb049b20c49666191238b590792db6764bd127dda5a389496a3b9a6c5f29
docs/ui/pages/pos-management-catalog/references/design-proposal-02.png	f2cc33c8b372f612300dad576f3c6eeb6e7fee001d5051092e19ef283bde0f23
docs/ui/pages/pos-management-catalog/references/phase-01-implementation-1366x768.png	902b7c32b412df03251416cefadf1fd1c392c0ec6f5c92aa477158ca047a683b
docs/ui/pages/pos-management-catalog/references/phase-01-implementation-390x844.png	e818ea0e05c42ac052a0cbe890dfe42539c52d26e01cb08d66564f7c1f5e4b68
docs/ui/pages/pos-management-catalog/references/phase-01-implementation-edit-item-1366x768.png	0968ddbb87a20abaf8873d4d6c095a51459708193ef204b146e793f192ad5335
docs/ui/pages/pos-management-catalog/references/phase-01-implementation-edit-item-390x844.png	dc48096effc5411370258f77c42e4cb4e2cfc44a73e3c0efee40789fc4a3e597
docs/ui/pages/pos-management-catalog/references/phase-02-regression-1366x768.png	902b7c32b412df03251416cefadf1fd1c392c0ec6f5c92aa477158ca047a683b
docs/ui/pages/pos-management-catalog/references/phase-03-conflict-feedback-1366x768.png	584fc9640eafc19a152403df7158570d4290b2e173cad4bd77931194985b6bd9
docs/ui/pages/pos-management-catalog/references/phase-03-success-feedback-1366x768.png	46abf5100833a064320a13913903a37b48e74b941cbf07398655de529762b036
docs/ui/pages/pos-management-catalog/references/phase-03-success-feedback-390x844.png	11518f44de9748612ae498398bfc66571ba379e008021c55990262361cefa97b
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-1024x768.png	90cd80463f221a09754fbb160b158d8afbeb95367cc47b4cb8b04ea1b3b4c52a
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-1366x768.png	902b7c32b412df03251416cefadf1fd1c392c0ec6f5c92aa477158ca047a683b
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-390x844.png	e818ea0e05c42ac052a0cbe890dfe42539c52d26e01cb08d66564f7c1f5e4b68
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-768x1024.png	b28e912695b70fb6023aae95920126a3c7d7e5356238e74b0b040d9711c3bc57
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-edit-item-1366x768.png	dac0dd94a3f1b60cc14b8e8719e44cd54b6c1cb183df3e6fab79b2b6cbb95820
docs/ui/pages/pos-management-catalog/references/phase-05-as-built-edit-item-390x844.png	033b59a42d9e93843cd6285dbccf5d620249d3aecafdc11f52e5e81758c1d0d2
docs/ui/pages/pos-management-combos/ACCEPTANCE_CHECKLIST.md	a7773fa4d606c641a8741ff5ae04393c250b1f2e2410d5cf273975120f3fd148
docs/ui/pages/pos-management-combos/DATA_AND_INTERACTION_SPEC.md	f97a927767dbd51fdf446d7bcbcfdd8570855657c017f60efc329aba01bc7c24
docs/ui/pages/pos-management-combos/DESIGN_HANDOFF.md	b4f8e907f7ee5c42bc92e491facc2058fcb1e493f85e64439b6a170560a756bd
docs/ui/pages/pos-management-combos/IMPLEMENTATION_PLAN.md	e0436ed484d5aa39cf91be77dc3280bc77bad131fcc213441fee5eaadf3a2669
docs/ui/pages/pos-management-combos/PRODUCT_SCOPE.md	6bc6daf3678afea385f4abcbcc3971f70f17cc13befe170e15caddc7fa8e5abd
docs/ui/pages/pos-management-combos/README.md	8cfb95a3c6a42ea2e246d7092390654e1450499bdb04320cba31de120d1c50a9
docs/ui/pages/pos-management-combos/UI_SPEC.md	524e1b6e764713c897c3c940ccac7b087be43d72aa401c88e738bd1e18637da3
docs/ui/pages/pos-management-combos/prompt-provenance.json	d157bc648bfe518786137c06d702219d991187310bb64420a5b2954b10aa863d
docs/ui/pages/pos-management-combos/prompts/00_REPOSITORY_ANALYSIS.md	4317945ce4541d027a6ad6a612e657b7ceef36971a3ae0108df0f1b422109132
docs/ui/pages/pos-management-combos/prompts/01_VISUAL_BASELINE.md	5136e92c3322cb7d2e2e6fd1f80106c81c05746a47bffe5d22375b85eacfaa7c
docs/ui/pages/pos-management-combos/prompts/02_COMPONENT_REFACTOR.md	019d5ed3a6b06b5a1783aef3910f4743595629cbf98991737084884d2347405f
docs/ui/pages/pos-management-combos/prompts/03_INTERACTIONS.md	56a6533ef1bb065e4f88f50706204884905ba8ab86c68f2aec8c1492d5b17001
docs/ui/pages/pos-management-combos/prompts/04_DATA_INTEGRATION.md	b528242522259338512beec0a8630105ed29278a173af10ce28a8231d0390e07
docs/ui/pages/pos-management-combos/prompts/05_VISUAL_QA.md	b387f393d2192da4b646f5a5c81a7f5c9680ef1880cf54be2bab264b08b50c80
docs/ui/pages/pos-management-combos/references/README.md	41bec137ad671bb17a8e8ab441c4ded0fdb4f85d0714928b1bd44a79deba9354
docs/ui/pages/pos-management-combos/references/current-baseline-1366x768.png	d4bef6a2e85560ae22cb11aaf1154e8fb145389cde7d2cb08e64c27591aa204a
docs/ui/pages/pos-management-combos/references/current-baseline-edit-rule-dialog-1366x768.png	7e49ad069be8b5446d255846cf43a33b4aec2fd00097d0404712e3dba38b37cb
docs/ui/pages/pos-management-combos/references/design-proposal-01-desktop.png	52d988569b440513f06e2803643444dd53e75a1e4cf8d4769f55b49f45c7bcb3
docs/ui/pages/pos-management-combos/references/design-proposal-02-rule-editor.png	67603d661453c3d9799c3025d0fd4cffa1e37caf45d8a850772693cf36159605
docs/ui/pages/pos-management-combos/references/design-proposal-03-narrow.png	6f27a5470f865f8a27fd237af0ea95658f2949fc68a89c0d3d6f8425266527ef
docs/ui/pages/pos-management-combos/references/design-proposal-04-suggestion-config-desktop.png	089929ed7d886ef0ee7ac444e8c627afd8104eeb95e7bcefc56951f41f76d809
docs/ui/pages/pos-management-combos/references/design-proposal-05-suggestion-config-narrow.png	13015d513773ffd8258d262dc188f1020213d08e9e0289b6eacee22bb6d3ef25
docs/ui/pages/pos-management-combos/references/phase-01-implementation-1366x768.png	378b8fd0a2d4ef67d2c987341a24e2a21f5f2668a536b71d8b70c7e2476465b3
docs/ui/pages/pos-management-combos/references/phase-01-implementation-390x844.png	c2005212a0968fc8bfdff6f42c8a2419aa5b3397e425eb5a73847624d7ff737e
docs/ui/pages/pos-management-combos/references/phase-05-as-built-1024x768.png	6a566dd16dfe13fd4b1ce9c6d605e1440e482d9e531da68537c4ddb424651aea
docs/ui/pages/pos-management-combos/references/phase-05-as-built-1366x768.png	d9c59fb7bd45be42d9a615820aa38c7f9599621bcb344efd572f0232e84de882
docs/ui/pages/pos-management-combos/references/phase-05-as-built-390x844.png	e077903bd8dc73e81e510ef279e361e86eb17443b7919ddbf9582cdef74ec7a6
docs/ui/pages/pos-management-combos/references/phase-05-as-built-768x1024.png	5b1f9d22c6ccd2715051f1acd73b54bf182798caca8541c5b999a7bf4249e632
docs/ui/pages/pos-management-combos/references/phase-05-rule-dialog-390x844.png	180c1036e0232751327b65f18bf8ba84e89bc09e29d61f17857c1ecc3457d803
docs/ui/pages/pos-management-combos/references/phase-5-suggestion-config-1024x768.png	2d9f2d6fa14dd2a1a4422773d2b456c3fbbcf21e78b4ecbc1cb71f3fe5e7f5f1
docs/ui/pages/pos-management-combos/references/phase-5-suggestion-config-1366x768.png	a84820fcc2cd5bbb48995c32dc67f611cb861be03ac68e3512e07eb903053a01
docs/ui/pages/pos-management-combos/references/phase-5-suggestion-config-390x844.png	92b779427e47f27c20f022efe5e5f5c140b231a1b750d8e4bc065706232bcbaf
docs/ui/pages/pos-management-combos/references/phase-5-suggestion-config-768x1024.png	1fbdd29da19cc9bee6f1553e0004f414a28aa36770f2f039157a95aee542b99d
docs/ui/pages/pos-management-establishment/ACCEPTANCE_CHECKLIST.md	704d09d14ee726dc42e916e73a0383ca852a54e7cf000a3f752b009c52486d68
docs/ui/pages/pos-management-establishment/DATA_AND_INTERACTION_SPEC.md	46d6e955cc69d325d8df59fdd134d747f54f96f9515a89d2d806b19d9e74c43f
docs/ui/pages/pos-management-establishment/DESIGN_HANDOFF.md	2960d1866162e3e9d857784eb39932b208a8e3664677ab7c1d5c6362d0419166
docs/ui/pages/pos-management-establishment/IMPLEMENTATION_PLAN.md	8033edaf3422269a159050c2372c5d25ec7546e7109db761c4df2be914d2d137
docs/ui/pages/pos-management-establishment/PRODUCT_SCOPE.md	35ac0dd56bbfccb691a48f3c68a86236de47fcbbc42382efd15c013a69b8b985
docs/ui/pages/pos-management-establishment/README.md	f9d874cd7df9ed424102862dc12b00c4180d321b370002087e7e8f094f45641b
docs/ui/pages/pos-management-establishment/UI_SPEC.md	bdedbb731d2c3e9d0dbaca89aaf11ce4faaf5da5891d656bd543e43378f18d92
docs/ui/pages/pos-management-establishment/prompt-provenance.json	2e6c07e222c5749e6ae6791b498f39b68d58dfe80bb45f1d33c96a34eb7293a8
docs/ui/pages/pos-management-establishment/prompts/00_REPOSITORY_ANALYSIS.md	401d2128c96d9f4e43c8b43e1aad03aa5c4e3a9845a0ba4418807f5e368b557b
docs/ui/pages/pos-management-establishment/prompts/01_VISUAL_BASELINE.md	59f96d8abaaa44cc7a8d935ccc1334d0e60800559953621ef825c5d01f6b8336
docs/ui/pages/pos-management-establishment/prompts/02_COMPONENT_REFACTOR.md	f0a739c1ab94e36cc796a259bbdcfbae40f955be7daf7378c2d3bc19c0198bdd
docs/ui/pages/pos-management-establishment/prompts/03_INTERACTIONS.md	d3a43f906cf369883c746038f882620aea0810829013f035d080b634386a59f1
docs/ui/pages/pos-management-establishment/prompts/04_DATA_INTEGRATION.md	c171e69dc97d19a982bba4abac4a8b4552ec73796e84ff9e48df851867c1d50a
docs/ui/pages/pos-management-establishment/prompts/05_VISUAL_QA.md	233853967b28293b1baec688d94e52c5b4527fd01e054beb5585c5bc332fdfc5
docs/ui/pages/pos-management-establishment/references/README.md	b5e56dbfc862561f992796712980322ea3323b0c0f0969e8d0e7e7d5706dca20
docs/ui/pages/pos-management-establishment/references/design-proposal-01-desktop.png	08faad618cd221defc57b5c925a1c3350f592d941174a8fad7006b38f762d6f4
docs/ui/pages/pos-management-establishment/references/design-proposal-01-mobile.png	6182d33900de0f7602e190e4ec3ae85984330625a8a903708a3ec0c88410d306
docs/ui/pages/pos-management-establishment/references/phase-05-as-built-1024x768.png	a3532b73e8d4946b31de268161ece2c1be22a360ffe536648b541580069ac961
docs/ui/pages/pos-management-establishment/references/phase-05-as-built-1366x768.png	681706de6bb5083a03e7f0cc6d98b9b99ac26e7aeec606f479e0025123126c06
docs/ui/pages/pos-management-establishment/references/phase-05-as-built-390x844.png	881ba8c3909ba827702ee8b6ce3edf1e29e1bf085c75f53e133cf98e3f6b4b30
docs/ui/pages/pos-management-establishment/references/phase-05-as-built-768x1024.png	be14fa423c6d8dd27497229eb2f2207757202e6043a2b2bae7d79412a82c4d66
docs/ui/pages/pos-management-home/ACCEPTANCE_CHECKLIST.md	3e57ab680961a00cad03fd39782e750e4cacbce4174610db8f7d68a443d30b22
docs/ui/pages/pos-management-home/DATA_AND_INTERACTION_SPEC.md	ffcdf79996340cd0e2091d87e555821c1aafb99f59a5527e3b047f6c94a507a9
docs/ui/pages/pos-management-home/DESIGN_HANDOFF.md	1dd1934c320482340a947e86b552fcdc839b6199dc5c5f8423942f312f79ec1b
docs/ui/pages/pos-management-home/IMPLEMENTATION_PLAN.md	74811794d10b3b0bb225e8c846cdbd361d2846b8c8ad2e8ea79a6f0a596fb198
docs/ui/pages/pos-management-home/PRODUCT_SCOPE.md	5e525fde0f8be939572e9fa9290ffa3853864e4f90d0cbadcada4a1c439b5e07
docs/ui/pages/pos-management-home/README.md	18696b7dc18af0e13529139a3173dfd8cfeaa3b315942a1bca6a0913cd179690
docs/ui/pages/pos-management-home/UI_SPEC.md	8632e4dd664bc799bd3766879cf7c0844d757547be26951609260b5aae5a6b98
docs/ui/pages/pos-management-home/prompt-provenance.json	5d274c994dd061028e938acc8f57a74b0e743680e818753e1a4b07d31c0d5dbb
docs/ui/pages/pos-management-home/prompts/00_REPOSITORY_ANALYSIS.md	6ddf86b4481f95c3714a2e558d31879e7b397ed5f9123eaa07e395e5acfb27f3
docs/ui/pages/pos-management-home/prompts/01_VISUAL_BASELINE.md	fb03d6901da64e6bf46ba13a8c6b700ea76ce13440b7fa6a19b2f8607d6ba608
docs/ui/pages/pos-management-home/prompts/02_COMPONENT_REFACTOR.md	d0f8d9aa8d16bcb045c27f7dd9e9a25cc2d83c7d0563fe73014f3f885cc7adb8
docs/ui/pages/pos-management-home/prompts/03_INTERACTIONS.md	10f6713dba84af42101fcf542064c192dd49e392fa92d4d3922686533ce8acf0
docs/ui/pages/pos-management-home/prompts/04_DATA_INTEGRATION.md	28008254663d376eef12aba9863d03c9b0c6dc2b37824cb16229f2f1e1b272c8
docs/ui/pages/pos-management-home/prompts/05_VISUAL_QA.md	be6e60cb77d9947faed7370cad8c8f22c04215a2c6bf2ff1f9032829e902da70
docs/ui/pages/pos-management-home/references/README.md	9e3f8ecfe2c372df36c62780e9df39209cedf8684c1f22c5e804fe203188cf68
docs/ui/pages/pos-management-home/references/current-baseline-1366x768.png	2d7bbe5e3603c1964a97adf69ed9253c073a469defa8e1c416e2360ea8cc89f3
docs/ui/pages/pos-management-home/references/current-baseline-390x844.png	861a338ce497ca08223df552f570573c6b3f11a1c4bf93edceca0ab45ea60e77
docs/ui/pages/pos-management-home/references/design-proposal-01-desktop.png	bcd76595413ef74099b7b3814a35ba2c13830e08e21e635167f18990c0524441
docs/ui/pages/pos-management-home/references/design-proposal-02-narrow.png	2cb110fbd3b719e0b6d92ade40ec8f9c4bd3c008345dc2c1defc0d14ee9379ff
docs/ui/pages/pos-management-home/references/phase-01-implementation-1366x768.png	b27b8861c5f9d29cc6f3d05b47b1d3c6ee979aa309bd17be490ff52d5b434255
docs/ui/pages/pos-management-home/references/phase-01-implementation-390x844.png	0183873cc007a2460d9b14afd2d0aa9ddc4c8fd781f5873c573fc85be1649957
docs/ui/pages/pos-management-home/references/phase-05-as-built-1024x768.png	4b956a31ba288a0fa1498857c27b0eddfad6a28200abd3458fc589af658d4483
docs/ui/pages/pos-management-home/references/phase-05-as-built-1366x768.png	b27b8861c5f9d29cc6f3d05b47b1d3c6ee979aa309bd17be490ff52d5b434255
docs/ui/pages/pos-management-home/references/phase-05-as-built-390x844.png	0183873cc007a2460d9b14afd2d0aa9ddc4c8fd781f5873c573fc85be1649957
docs/ui/pages/pos-management-home/references/phase-05-as-built-768x1024.png	5da76214e3ae160dc5bbfe6474d32816805d37eacb4c111c8c17028d78aac4bf
docs/ui/pages/pos-management-printing/ACCEPTANCE_CHECKLIST.md	a4939cfa4d55bd4d90f769e4fbaa311ac509470cde97e02284e3f77f2a0478a6
docs/ui/pages/pos-management-printing/DATA_AND_INTERACTION_SPEC.md	450211c63c7a5290258512e6f75d8ec40d94fc89b87be43d5f563aa5f4e32c2e
docs/ui/pages/pos-management-printing/DESIGN_HANDOFF.md	1eeadf85049791086eaa4d9377586b1d70a3b285390e2139f37fe9dd1156726d
docs/ui/pages/pos-management-printing/IMPLEMENTATION_PLAN.md	5609e9bc6187688f3a1b3f700122016db897b61e817d4e1b731ab56a55cf33d7
docs/ui/pages/pos-management-printing/PRODUCT_SCOPE.md	8b87c36825f7af84dc55880668127ec45369efd4e00026f24fc5ac52e400ad02
docs/ui/pages/pos-management-printing/README.md	73db1648fde4b8eb830e6ded8d91f84784410934707061dfad3a95bea19e56d1
docs/ui/pages/pos-management-printing/UI_SPEC.md	45b3d2673dc57a6cf30225aa209337cb60c0a265fdecfd17fb5947e866ac3e28
docs/ui/pages/pos-management-printing/prompt-provenance.json	f7109cf40085443f9c3f17c16642c5ae71a32696cb5101d818a8407211e70b0e
docs/ui/pages/pos-management-printing/prompts/00_REPOSITORY_ANALYSIS.md	982495c25d21af127ad50cb359d0fc6c31dd6af7867290b0319334fce9b39588
docs/ui/pages/pos-management-printing/prompts/01_VISUAL_BASELINE.md	8f3d940f3762038a9a2b2d95decd5ed5330751c00bece8c1b73cad8fb978c33e
docs/ui/pages/pos-management-printing/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/pages/pos-management-printing/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/pages/pos-management-printing/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/pages/pos-management-printing/prompts/05_VISUAL_QA.md	beb16be7f9672bc0abf38fb8c3bcda0431f79d264747b74a26efb987319e5837
docs/ui/pages/pos-management-printing/references/README.md	fb5cd98156d0e49f3b473380d6d2feaa0dab52ac0d08e90d6974dd785c6288e1
docs/ui/pages/pos-management-printing/references/current-baseline-1024x768.png	9b5c92b28554fa5bfccfbab63392316f1faf524218b14c544c3b0d8fd3112527
docs/ui/pages/pos-management-printing/references/current-baseline-1366x768-middle.png	e88d272788d0f5eb3b70ce32a58340ad6b4b4fe46e0ce7409585045a8f4741fa
docs/ui/pages/pos-management-printing/references/current-baseline-1366x768-queue.png	ff8922d2308c6d1a0369be2686f0ec58bb20e2add81f88f4e996ad8aea225a9a
docs/ui/pages/pos-management-printing/references/current-baseline-1366x768-tickets.png	541893b81ac4009c1e8a0f85c2e756570d9a5a48f68cc427da04321ec88a668f
docs/ui/pages/pos-management-printing/references/current-baseline-1366x768.png	6840892bce3ff28f918b7d4f3b6a6bbb8fe67b2ab47c8c7afddedf7c8f26542b
docs/ui/pages/pos-management-printing/references/design-proposal-01.png	459e6be9014fc859e41fa6a386c53819fbfd0f8b1873e537313a62491d187a4a
docs/ui/pages/pos-management-printing/references/design-proposal-02.png	db0258554046a5b5b4a7a4eee979cad39ad68fb28b0c5e8235a17860a6fa59e8
docs/ui/pages/pos-management-printing/references/phase-01-implementation-1366x768.png	90b6263cd1be68e2d0f7033697d02fb43d7658bd08b8dd55329309fdcfe4e177
docs/ui/pages/pos-management-printing/references/phase-03-validation-error.png	c2d915ef08455c0ebd433944fecb822988ec1c35b552d02133815ee7d579e367
docs/ui/pages/pos-management-printing/references/phase-05-as-built-1024x768-settings.png	980cd4a87bb6dd51f50af6fcaa159c1c04fd06870359c758dc86ae000653bd74
docs/ui/pages/pos-management-printing/references/phase-05-as-built-1024x768.png	3677808b955b7bc933f37dfbf50708b731dc10763a42da630ae2f62f1065371b
docs/ui/pages/pos-management-printing/references/phase-05-as-built-1366x768-account-menu.png	2d6ecca9ccabd4a331339f20b99b3cc57692e66ea2f327b3d99beb8643650643
docs/ui/pages/pos-management-printing/references/phase-05-as-built-1366x768.png	f3ae7248ab399de0259c58ee2fc08f365880adf4d74d2ef9e0e2a6521682f70d
docs/ui/pages/pos-management-printing/references/phase-05-as-built-390x844.png	ef8ebd65b8074f9271401cffcc993ae8f52b681a9a901d73066c3c9d4cb051ff
docs/ui/pages/pos-management-printing/references/phase-05-as-built-768x1024.png	5e71771081878a39e77ea4e3f715532efa49e78e283c856fe1af1e004d5b2859
docs/ui/pages/pos-management-reports/ACCEPTANCE_CHECKLIST.md	448b72146f3bf679fa91f74af7742fe80f90f6a1fe188e950c09cdd264971815
docs/ui/pages/pos-management-reports/DATA_AND_INTERACTION_SPEC.md	b9e9d5a4e7414d1a6a60699d419658519c085fbdbf68ef138910929ea55977f4
docs/ui/pages/pos-management-reports/DESIGN_HANDOFF.md	f3bca1c70718e333e18b915cd9b1e1e08b89ed804e50e82177ab49544a094960
docs/ui/pages/pos-management-reports/IMPLEMENTATION_PLAN.md	beedf300f3628d3997064041b9d68680cf50b21f13bd70a66f73b23bebf0c402
docs/ui/pages/pos-management-reports/PRODUCT_SCOPE.md	e5dac60e6e9fa5413f2d0b94cf2f4ee1098300ddfc006f2f37b5fe8aea9d1f73
docs/ui/pages/pos-management-reports/README.md	8d3d3600100c0659c12a3de49ce76e969eba6f76c8868971c34cc41f950a5646
docs/ui/pages/pos-management-reports/UI_SPEC.md	e6feef03a218c0d728faf3021d85dfb1d43b8afaabd5b12db43f5a98fa1e01a7
docs/ui/pages/pos-management-reports/prompt-provenance.json	79221c93aea92724d3ecf8d203926bcf466540eff970d5703480b7598a5a7616
docs/ui/pages/pos-management-reports/prompts/00_REPOSITORY_ANALYSIS.md	a61ec5499260f781eb846ccba87047a3e53ec907e64e53ad877ff217aa25c139
docs/ui/pages/pos-management-reports/prompts/01_VISUAL_BASELINE.md	e21c28f890fbf5891f373fcc02696ce63d22bd8f298de58ce6d958c050d811e4
docs/ui/pages/pos-management-reports/prompts/02_COMPONENT_REFACTOR.md	0639f5c297fdbac9c302288b28dc5802ce5db128ea638486432b1ec25326805c
docs/ui/pages/pos-management-reports/prompts/03_INTERACTIONS.md	1254e41090852461ad3cde5399522e84243eec1d4d65add43370977a9dc663b8
docs/ui/pages/pos-management-reports/prompts/04_DATA_INTEGRATION.md	774df8dc3f71bfb667b7e072f15201a53fa9f2810fd7921bbbc4b1d66ffe76da
docs/ui/pages/pos-management-reports/prompts/05_VISUAL_QA.md	87c52b29b25e944fddf65b01963d5d514a498f3c707c152ba8597adc42addf44
docs/ui/pages/pos-management-reports/references/README.md	0ff00fa5d44ac08d0f9b05c26bb72f2066365fea2fc8ca59533a51e407108099
docs/ui/pages/pos-management-reports/references/design-proposal-01-desktop.png	19ae32b8153d58fdbfbd357b35df806a9c1ccb003d4b43e4dc8102d6ed11d6c0
docs/ui/pages/pos-management-reports/references/design-proposal-01-mobile.png	a4566cefabee19402b9b152e4297ad96dedcf1801e80c123abc96c2bb7afa31a
docs/ui/pages/pos-management-reports/references/design-proposal-02-mobile.png	78d1c0e4628c9321e8096bafec23de8783e2e1f4119cf9d893ecb55ce963d8f9
docs/ui/pages/pos-management-reports/references/phase-05-as-built-1024x768.png	22ae3b124921cf46c694baf2f19b9d581d164c5121c08313907087de9e2ae03d
docs/ui/pages/pos-management-reports/references/phase-05-as-built-1366x768.png	a2df2b78b7598ab13b195616b49c9eb534854f06a818267a986e3bbb5e77280d
docs/ui/pages/pos-management-reports/references/phase-05-as-built-390x844.png	feed0c2b0591a6ab3d2507f59a0ab12635e404451ed4bc82ed843cb2d6059006
docs/ui/pages/pos-management-reports/references/phase-05-as-built-768x1024.png	ad9909fa7007704d2b97d87eee09153985c096beecdabc72a9c25d10a16f6d57
docs/ui/pages/pos-management-reports/references/phase-05-empty-390x844.png	5d0ffc29ceead09a72ecc3e595accab29575e382535967c6764227f16607971e
docs/ui/pages/pos-management-reports/references/phase-05-error-390x844.png	c24f97fb4f475d3ee9d6cac585866e413b401a903acbbe128d8595bf33f2aab0
docs/ui/pages/pos-management-users/ACCEPTANCE_CHECKLIST.md	002e637252771fb212c19f0050a428908601db4d40e8df76c49ed0ab913f6d45
docs/ui/pages/pos-management-users/DATA_AND_INTERACTION_SPEC.md	a52b82d7bf51e11cb870c7f77805db6002ecf0f2a5be9a0c29c3b3dad843ac20
docs/ui/pages/pos-management-users/DESIGN_HANDOFF.md	bbdca8cf4786c10ce438000c1084e2a713df0c98dc4aa68ae1bc2598dd281fc4
docs/ui/pages/pos-management-users/IMPLEMENTATION_PLAN.md	8dd30bbe339c59c33f79675b39146ca0992a3451d87fc3078df43ed4bca0e983
docs/ui/pages/pos-management-users/PRODUCT_SCOPE.md	b427980fba82bf933efb3b4f4287dc22a02a53dc0d0f51faa2f487c76471bc2a
docs/ui/pages/pos-management-users/README.md	4e099b8f6c46d922d34ee19010f16b7a8a6df6894bf8f6855fcb63248c48c662
docs/ui/pages/pos-management-users/UI_SPEC.md	2e83bd75979af4fa8e4d60001203603fa1d308394a5217b4220c8da4fd22af43
docs/ui/pages/pos-management-users/prompt-provenance.json	73a21d073620f8eba81b083cd8f0f7fbba21b80a0345c930be1602a7942a8191
docs/ui/pages/pos-management-users/prompts/00_REPOSITORY_ANALYSIS.md	b6ff8fadca8373217d67d200b171c73814f1c02ac014276324aefd038621bf32
docs/ui/pages/pos-management-users/prompts/01_VISUAL_BASELINE.md	b9db608ee39b860accf69571bc740f95e64c6890ecfbec0506e7bd0f80f1bd4f
docs/ui/pages/pos-management-users/prompts/02_COMPONENT_REFACTOR.md	4b5375a955062416a666c156cd9d59f24badc1f05b4cd18bd6ef4ec05a9d1d01
docs/ui/pages/pos-management-users/prompts/03_INTERACTIONS.md	899c5875b19b68862124ab72d29db2600dfc8ae2f5d12c2108c188c72a8349a2
docs/ui/pages/pos-management-users/prompts/04_DATA_INTEGRATION.md	7af4b1ff05f55f435563e9074170351d3248dcc243040c1baa018c7204275cc9
docs/ui/pages/pos-management-users/prompts/05_VISUAL_QA.md	f697f4006ddf7d574a9e58d8236dccfa042b8bad23eddcf803dc16c2a7373127
docs/ui/pages/pos-management-users/references/README.md	bf58fd515bd3f07051f90c100de1d09aec3780363a2cce71be79e42313995141
docs/ui/pages/pos-management-users/references/current-baseline-1366x768.png	39c46c85c6ef3987ee2b01c766e01c9a91738ce2ec3fb4a949cea2f5c2388236
docs/ui/pages/pos-management-users/references/current-baseline-edit-user-dialog-1366x768.png	de0813af925b118bf8c00dc523e28dba1a1b8cdab8bd7b61added35831c87313
docs/ui/pages/pos-management-users/references/design-proposal-01-desktop.png	394e9d943cc1bf3c4d30a60b6ae7e45d5cf01602e1c3a655fc55ee56841be0ce
docs/ui/pages/pos-management-users/references/design-proposal-02-edit-user.png	ac76b518dae6e8648e8f4d759b661d94e04457803920d85c333385657369910d
docs/ui/pages/pos-management-users/references/design-proposal-03-narrow.png	78a7caff155b89d98fe24ddd2374c4d06c3b0eb8e4f04789fd0f9b7712fb979b
docs/ui/pages/pos-management-users/references/phase-01-edit-admin-1366x768.png	ded402f69fce47f073937b18e7cfc398859f3f74a7b57150bf11b2f0508a156d
docs/ui/pages/pos-management-users/references/phase-01-implementation-1366x768.png	9c63bbfa8fee8f20f6ec5413ffab244154e252a2ab587f5ca72324a234b02c8a
docs/ui/pages/pos-management-users/references/phase-01-implementation-390x844.png	5add3d5bd310611a65b07ba5d029d63a87d1143a0eeca34321c217b6550adc77
docs/ui/pages/pos-management-users/references/phase-05-as-built-1024x768.png	8eec11245d21da588517ae064a93c35574efd88466eaf56a71c2b0b98c939026
docs/ui/pages/pos-management-users/references/phase-05-as-built-1366x768.png	c6f78d325615a3da97d2caad006361ee4539476c71d3d6f75edfc04fb800a91f
docs/ui/pages/pos-management-users/references/phase-05-as-built-390x844.png	2e23e3f304e6756c72b9b908e090b111417708b8722299546133f753b551ca4a
docs/ui/pages/pos-management-users/references/phase-05-as-built-768x1024.png	3f4cab36ddde6147310158da6cebe20de423c638b8cbf51655295fad489a62fc
docs/ui/pages/pos-management-users/references/phase-05-edit-admin-390x844.png	086c8ce840b9af4ed57251913595619d574d02270596925711a660f29f480175
docs/ui/pages/pos-management-users/references/phase-05-success-1366x768.png	50a5703e67d65dbde554cc928737e31d3d2c9b15a70d2a4c83f90a2b62c8c411
docs/ui/pages/pos-management-users/references/phase-05-validation-390x844.png	aa0ec5a0f3e7348bf691eaa1882224afdc2c5e593248563b3453fe80b8e31ea1
docs/ui/pages/pos-order-detail/ACCEPTANCE_CHECKLIST.md	7f332efcc111b6f357cd435c7683fa451ef5c0ef60bee1d0772617c47ea12e6a
docs/ui/pages/pos-order-detail/DATA_AND_INTERACTION_SPEC.md	6e9a79ade0821e711cf46c40e9ef9ea5d5b56b96f90af97132f671438680612f
docs/ui/pages/pos-order-detail/DESIGN_HANDOFF.md	91ffc0025ef57fbaa23cdb7e00c7bd91a274b951b2bff4b8394960f951bba389
docs/ui/pages/pos-order-detail/IMPLEMENTATION_PLAN.md	c38fc8b44910a0b49ad71609c751bffec95db326ce488d6772b051063bb01149
docs/ui/pages/pos-order-detail/PRODUCT_SCOPE.md	212c3b4c0f23668ca57c093eae23f8463d519132cab34559644f01472c30d184
docs/ui/pages/pos-order-detail/README.md	44f43b3f7b0252da6293e681bbab4409a14744d586c1fa636586ed320919545c
docs/ui/pages/pos-order-detail/UI_SPEC.md	ffe4f088f2b5e8d559f9483b331122bc95a1e031e92115497e1ce522bd12a2d2
docs/ui/pages/pos-order-detail/prompt-provenance.json	c43a2eae4c12a441dac8337f8ccdd648ac4168307426e6103c54e4e42f2dd3c8
docs/ui/pages/pos-order-detail/prompts/00_REPOSITORY_ANALYSIS.md	2f7a47fd894c34f7f77b9980a557254fef85daf08a64dc1449406651b5ebbc68
docs/ui/pages/pos-order-detail/prompts/01_VISUAL_BASELINE.md	a8666a60e93b2ab6481a2911f14988e91f1f603cc71471b6200a9f52dee32f41
docs/ui/pages/pos-order-detail/prompts/02_COMPONENT_REFACTOR.md	838a699b05f8bfa749ae8aae2c3bb4cc007661e0a469caf62eec2a1a933e5fde
docs/ui/pages/pos-order-detail/prompts/03_INTERACTIONS.md	a53a9958d8c19fe39c4cb4c1b5129e647a2e785313829d6c32a42905cc41655e
docs/ui/pages/pos-order-detail/prompts/04_DATA_INTEGRATION.md	170afacf304436751d46925e6cddad092c5057cb0e4bf9e2cf500ff970e66fc2
docs/ui/pages/pos-order-detail/prompts/05_VISUAL_QA.md	774e9c448809ae15c7f1a1e5cad939160acd4864b5bb4c99d1b78f8af3997dc0
docs/ui/pages/pos-order-detail/references/README.md	f578b7f412fc4c7c40b1ed4a3703dd445468daaef36e1fbea21027202f55bf37
docs/ui/pages/pos-order-detail/references/draft-order-detail-1024x768-v2.png	73f68558a88d3a3132fe6b371a04a2099727649893ee2f63d0a1c3facdf34fca
docs/ui/pages/pos-order-detail/references/draft-order-detail-1024x768.png	f9b96e83e41e43c8bf6e2ab6045d46044f7b37d0414d510694204c65e34fcbe3
docs/ui/pages/pos-order-detail/references/draft-order-detail-1366x768-v2.png	9200d9ade81ee0fd16e19a4e9f8eb2c3990735cf324311ffbeb87d0ca1ce7a15
docs/ui/pages/pos-order-detail/references/draft-order-detail-1366x768.png	dd981ca0f2e153cd24f3bca59f8fa033b8cd59efabc343c2a3ec18c925463311
docs/ui/pages/pos-order-detail/references/draft-order-detail-390x844-v2.png	2520bea9f63b1e718f9dc26f8b11ced516aa119441dcb6288d834a133f21ba19
docs/ui/pages/pos-order-detail/references/draft-order-detail-390x844.png	115a4b73c85a83af6bd5649356a700e5fe73af6800fb46357b040350d4a23be5
docs/ui/pages/pos-order-detail/references/draft-order-detail-discount-disclosure.png	5310509a40e78d47ba666fae2a34c72a54b118d9a1bc055e6815ccc1fc681ab5
docs/ui/pages/pos-order-detail/references/draft-order-detail-state-studies.png	bbba8648901b46c3bb034cf57ed5afc0baa7429867ad06be668eae209cb0730b
docs/ui/pages/pos-order-detail/references/phase-0-current-paid-1280x720.png	41f70982fe0a90ef2fa9cc0e56fbcdf70567529cea75cb5a559f4951653a38b8
docs/ui/pages/pos-order-detail/references/phase-0-current-paid-390x844.png	03dd35ae7b8df7f85093abd5e9a2f9ba844f4cac083a5d2532f1bfecef4e811e
docs/ui/pages/pos-order-detail/references/phase-1-paid-1024x768-collapsed.png	996d4a3bf3c7f1d4b34209b79dbef253e71031251b718554686cd7be8a81b671
docs/ui/pages/pos-order-detail/references/phase-1-paid-1366x768-collapsed.png	67c33160da4c3386e0c176b501c0ada985b902668a04333117c0237cff7819f0
docs/ui/pages/pos-order-detail/references/phase-1-paid-1366x768-expanded.png	2cff95e3e57d38307d7ab81c232ee6081474bf9502074ce4aaf1c30195812cb2
docs/ui/pages/pos-order-detail/references/phase-1-paid-390x844-collapsed.png	6c33bf7561b716a38916e8dcf11d5a9f0ca2ce2669bb2fe152086abd4edef6c0
docs/ui/pages/pos-order-detail/references/phase-1-paid-390x844-expanded.png	841378825bb253dc3bf0e7e762d2d005fb9ff94b90759e36679605e9b13851f3
docs/ui/pages/pos-order-detail/references/phase-1-paid-768x1024-collapsed.png	95b953af08d9c6b5d0aa341fa21f80ab6c377b1426aab47ac42e59b2297a9883
docs/ui/pages/pos-order-detail/references/phase-2-paid-1366x768.png	595e942dc3b30f81fe934e8914784b39f523c452bb18bc1d50a23a4a059005ee
docs/ui/pages/pos-order-detail/references/phase-2-paid-390x844-collapsed.png	75abe2cab1bc0b070e748edfe185cf0fb52e22ca3b4683c5ab5c042bc90ab4a9
docs/ui/pages/pos-order-detail/references/phase-2-paid-390x844-expanded.png	546fa2e4b20a33cd69986b1249931d1c322d8e5e6a5c8fe547b63e8a5801521a
docs/ui/pages/pos-order-detail/references/phase-3-paid-1366x768-expanded.png	e2496c3837e92a9638aa5695e03f2f3e69bb1d4f7f5840d2ad2777a930ce4c40
docs/ui/pages/pos-order-detail/references/phase-3-paid-390x844-collapsed.png	42554dcbfaf6dd8a4ecc95183db90e7993419f22179cd15e8a995544f0255748
docs/ui/pages/pos-order-detail/references/phase-3-paid-390x844-expanded.png	24d4e1d63093b71b4aae25bf656aa2fe5c5b35bda1903b062d32341bac485866
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-1024x768-collapsed.png	30f80adcf0c76796d22e1dee9b688fb3141aca2eeae17de0c326abf73ae97f71
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-1366x768-collapsed.png	276bafce81344315f5419d6d377b29a492943d518eb4943544664156d34a9ee5
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-1366x768-expanded.png	490101b36aee9449e00751c8f9b0aa20c5502ff8b9d05f5f0e95032bbe406759
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-390x844-collapsed.png	9599f501ee80ca12b01b78566c87ae87a210393a62df54b574d7a6b0ab065bc5
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-390x844-expanded.png	b7e5638d5c2a03f047f7f677741cda18dc44cb445b43d3096669c794fc41e62e
docs/ui/pages/pos-order-detail/references/phase-5-as-built-paid-768x1024-collapsed.png	c8b3d1de76a39e669c0f080a45dce6999f3377086abb6aecaad224bf508cd93c
docs/ui/pages/pos-order-detail/references/receipt-phase-1-desktop-1366x768.png	859c13b49e87033659c9a7d5261dad9325168e84f4729f9abdef1abb0f722706
docs/ui/pages/pos-order-detail/references/receipt-phase-1-mobile-390x844.png	574501567e7161b11db28fad1f4abdd3df69cf481907d8b1cdc1f82d062403af
docs/ui/pages/pos-order-detail/references/receipt-phase-1-state-board.png	37f952e7d70459dee2f62684621c10b390db9603c426f5496d41e654aca697c5
docs/ui/pages/pos-order-detail/references/receipt-phase-1-tablet-1024x768.png	c0d1252c89683eef7c64973d140b81df313aaf67046f60a2058ab9058370a209
docs/ui/pages/pos-order-detail/references/receipt-phase-1-tablet-768x1024.png	5e10abf4b4f9e1e163f913db4f2c59f94a6448605fe2caa3f8c8bec94799620a
docs/ui/pages/pos-order-detail/references/receipt-phase-5-as-built-1024x768.png	073c68769cf4f85b11eedc0033d0c1d700be24bd00a90af078525f10f306c30a
docs/ui/pages/pos-order-detail/references/receipt-phase-5-as-built-1366x768.png	2eafe84264bb21a627be5ce252d87080b507f75ed6bd3ec7e4892d639b8484c9
docs/ui/pages/pos-order-detail/references/receipt-phase-5-as-built-390x844.png	fec41ef78e8bc3f64df392a85fb8dfc9c3ea52a441373e6dddaed441620ea6b4
docs/ui/pages/pos-order-detail/references/receipt-phase-5-as-built-768x1024.png	f12c50082c91478c2ffd6179fdff164a7e2e96cf8ae3bd07e440a390892dbc05
docs/ui/pages/pos-order-detail/references/visual-correction-paid-1024x768.png	f5cf871e372992da9e2e3f5293ac0e7594f25f70ecda543d36db4eb6ed25ace2
docs/ui/pages/pos-order-detail/references/visual-correction-paid-1366x768.png	c025a24801c3980ae8ab7183b8353b3f32a5b3573ff1ecf2b3ab5115e4f6a321
docs/ui/pages/pos-order-detail/references/visual-correction-paid-390x844-expanded.png	6fed3aaa023b178a6968d8e4759885ae0fc9827a87513e020bd8f4a084f9a4b6
docs/ui/pages/pos-order-detail/references/visual-correction-paid-390x844.png	9b2bd3255282bb71b9499278340a02f5dc27dfab33e5bb041c10ecf8262ef3ec
docs/ui/pages/pos-order-detail/references/visual-correction-paid-768x1024.png	6c6f6e440a103813efc3a5637cffa2c520e6b73ac6b135ca980ec63a580f9f65
docs/ui/pages/pos-order-entry/ACCEPTANCE_CHECKLIST.md	008cdd37f17bc6b4789127e4c407e37e870acd3f45a9cecc47d516477e14a9b2
docs/ui/pages/pos-order-entry/DATA_AND_INTERACTION_SPEC.md	c92f4323ca7e067e2999b402b7788a6b30a8ecef830732f67e29b75fd37dd311
docs/ui/pages/pos-order-entry/DESIGN_HANDOFF.md	a90b541cd37b3a249dbe808a96d6dc7f6d9242baef0c12a46dae522ed9b7eb6a
docs/ui/pages/pos-order-entry/IMPLEMENTATION_PLAN.md	7bc2db6eb3a8fbd1f2059271e84835b906f5581cc724e96c9a2d9b91597e3374
docs/ui/pages/pos-order-entry/PRODUCT_SCOPE.md	7ff9252ad224648d1b4831017f52c98e0cc3a0974e2bac0dc8350582979ce7f2
docs/ui/pages/pos-order-entry/README.md	29d5d3b5a2d251a0bb92bde7d1ec28d47e95a7b7fd365dfcc55a21067f190282
docs/ui/pages/pos-order-entry/UI_SPEC.md	ef94d2724577f75bfa14d33fa575d446cbc0a42f07035c5bb65dec5a49d3aca5
docs/ui/pages/pos-order-entry/prompt-provenance.json	48cba2d3f1e4d8d21adf3c3c5b06b452d156b6e02c24d9755c0f1e53ffb78d4b
docs/ui/pages/pos-order-entry/prompts/00_REPOSITORY_ANALYSIS.md	7d6b435d99a573660c830b44098e48fd9dfb8c7f416ea38349e7fac74bd70be6
docs/ui/pages/pos-order-entry/prompts/01_VISUAL_BASELINE.md	68f636a4fef2403496074a697a6b7728b6bb06d61c3527011b2ea872eae9e54a
docs/ui/pages/pos-order-entry/prompts/02_COMPONENT_REFACTOR.md	b2b44baefc22731b4a24ac87fb14d576fdf510a52774b251c6884072643e066e
docs/ui/pages/pos-order-entry/prompts/03_INTERACTIONS.md	ba71ad24139f6bcffcf3e2ee07d34d41811824b8a1e9bce4e6fc76c609f904a3
docs/ui/pages/pos-order-entry/prompts/04_DATA_INTEGRATION.md	24b1d6d53fc780393eb82f43e2542640ef2f660532b5da96033015840770939d
docs/ui/pages/pos-order-entry/prompts/05_VISUAL_QA.md	daef6753a3340015a1939b23d3a072bf9930c542839c4f9e3a899668b45774fd
docs/ui/pages/pos-order-entry/references/README.md	face546ed99afe4956949fb3d49223ec1a9971533b0525cb6f0c0e757ce2417a
docs/ui/pages/pos-order-entry/references/current-baseline-1366x768.png	63491cfff6cc1513ea084fd4d5b57e7528c60e8044e1b38a8b79382ba3b5b6b7
docs/ui/pages/pos-order-entry/references/design-proposal-01-desktop.png	20de12f0cf7e1f1f9122f16bc8d5991795c1dcfa45b80848097938cfeeba45c6
docs/ui/pages/pos-order-entry/references/design-proposal-02-narrow.png	1a0a336d8604d9caeda1dc93484170648996d6dac1a13fa022f4a6b2b1505f51
docs/ui/pages/pos-order-entry/references/phase-05-as-built-1024x768.png	2e327934fe1cafdd63036adbc909d04de46246b81005e2e2830403dbf22cebd4
docs/ui/pages/pos-order-entry/references/phase-05-as-built-1366x768.png	668156c7674287340b6902d924177f4d1843ca9c845b64543e89c6f6ea92210e
docs/ui/pages/pos-order-entry/references/phase-05-as-built-390x844.png	3f40af8fc23c84348eaad671594d96e7f90b05b49a887e7cd094c63e786d9552
docs/ui/pages/pos-order-entry/references/phase-05-as-built-768x1024.png	a689629194f2054d75bd66012640d7695562b98db5bfd8858003fd2887f4641b
docs/ui/pages/pos-order-entry/references/phase-05-validation-390x844.png	ff6a1523f60871f02fd588a78c2aee42bd4517edec269824d5ad6b9e5c7d350d
docs/ui/pages/pos-order-items/ACCEPTANCE_CHECKLIST.md	3b8a1fc81cb957cc07b224d69c455ed47b57bb9aa2aed6e9032a60efe32c6ac2
docs/ui/pages/pos-order-items/DATA_AND_INTERACTION_SPEC.md	d38ae8272b9115f26119b0a2f37971ed4e0bcac4391525d64f472362c0ff50da
docs/ui/pages/pos-order-items/DESIGN_HANDOFF.md	e44b682977c2b2c630bdeded656d532d1607d584be2c996041d5567544b9f089
docs/ui/pages/pos-order-items/IMPLEMENTATION_PLAN.md	65e96fee9b264a309a895ee04ea189f53c293ea358f647a54e75dd49b6342a39
docs/ui/pages/pos-order-items/PRODUCT_SCOPE.md	f3f93eeca250011048462361aafa23515e218c22519034031eb9a53bd288e7d9
docs/ui/pages/pos-order-items/README.md	325a5ee95ac50650a08bb0fa306bf7c5af1f898e4739e9d825b3aed14e8d58ce
docs/ui/pages/pos-order-items/UI_SPEC.md	57b9b1dcebcf4100dd48d1bc82691be1de9e2fe5b02867b50e671b842fd30a86
docs/ui/pages/pos-order-items/prompt-provenance.json	bc3f436172c4da8e28abb84d402a992b98062e9b0aeeb1684faa8187324f45d4
docs/ui/pages/pos-order-items/prompts/00_REPOSITORY_ANALYSIS.md	86600299e219e4b0ca4736682674bc6f4d85ea28ff017b394302f6653e7cfe84
docs/ui/pages/pos-order-items/prompts/01_VISUAL_BASELINE.md	84241b28235a55fcc7e4c81d913b833b33cf76c48a496aea29679fe2a7e5a0ad
docs/ui/pages/pos-order-items/prompts/02_COMPONENT_REFACTOR.md	4dcb767d87a858be26ab3e81a5b993afefcd96b08e3ab2b163b188cf075195a9
docs/ui/pages/pos-order-items/prompts/03_INTERACTIONS.md	ad3356cd31e867b37999193a686315fc4ee98c45147dce53b83f5b4f5b7a423f
docs/ui/pages/pos-order-items/prompts/04_DATA_INTEGRATION.md	2ed73a250818abdd534ab642d876a9a92eae2ff09809bb65cd2aa72c89c0dc8e
docs/ui/pages/pos-order-items/prompts/05_VISUAL_QA.md	79fcd169edecf27fa37cc9cef4a95207048952fc4d22123f7345408ca8ca6aa4
docs/ui/pages/pos-order-items/references/README.md	f7d2aa709d7f6d0566441ba30368209368b57a6ef4379a89188676431cf2e52e
docs/ui/pages/pos-order-items/references/design-proposal-01-desktop-v2.png	9f966c04476a1badab207e631b27beaf1fefff88fb258cf44686fbbee780492c
docs/ui/pages/pos-order-items/references/design-proposal-01-desktop.png	b42966f78b7f2ea2f3c4e5593b7df92d62a4731b1861159eae7e841c9cbee3c4
docs/ui/pages/pos-order-items/references/design-proposal-02-narrow-v2.png	ac9e6ec77215bb87488ed4a3cb44bf30071cc59969258b52e7734f69f85d851b
docs/ui/pages/pos-order-items/references/design-proposal-02-narrow.png	e7369acfc42b4c39c55dc66699fa768d9689f5c5cd32e13fe3f1a62d45a056ae
docs/ui/pages/pos-order-items/references/design-proposal-03-send-success.png	b8dbd8463e76982792e6e10f465d06665e2c870df98938f7367a504f7c385d47
docs/ui/pages/pos-order-items/references/design-proposal-04-combo-suggestions-desktop.png	f97bcdccc52d6be84f1fe49f71f7cd0a0dd4c8fb37fc4715fac15116ff69a838
docs/ui/pages/pos-order-items/references/design-proposal-05-combo-suggestions-narrow.png	ba479195ccabb3d5934556803328ab0436d7a6a8293a6424584f957bf7a57fe1
docs/ui/pages/pos-order-items/references/phase-0-combo-suggestions-current-1366x768.png	c2933ed96205e8cc6dac6c64a5cb13e5194789af5e5113b76f2899cb14fcafd2
docs/ui/pages/pos-order-items/references/phase-0-current-1366x768.png	42f294df8a923a9147fc1ca6753bdc777ff7fbd4a910593a02af0ecd5fb835ae
docs/ui/pages/pos-order-items/references/phase-5-as-built-1024x768.png	f75e51497692ef30ee1dab8e85c2bc4c40d2695c732f1d38f99fbded7663c3ac
docs/ui/pages/pos-order-items/references/phase-5-as-built-1366x768.png	1d3129cf32aab0dd7432bcea29cdea02dd6fea1b217c5542355ef4e91ccde706
docs/ui/pages/pos-order-items/references/phase-5-as-built-390x844.png	f584fb3d84fa41de43202dd50651e64e94173d1eb5650d359c595259e4392af4
docs/ui/pages/pos-order-items/references/phase-5-as-built-768x1024.png	279440287ae70063d272fa6ba495040b4d7e07e909c9160b3c180b51cbed328e
docs/ui/pages/pos-order-items/references/phase-5-combo-suggestions-1024x768.png	31e60ee8c537c21290ceb34a3e36c1a7afdb41d4560751263dc5969e63588f5b
docs/ui/pages/pos-order-items/references/phase-5-combo-suggestions-1366x768.png	c9514ae50c44df7c973bed2911c7c76a02576d57db8fd087af7c656073e5c90c
docs/ui/pages/pos-order-items/references/phase-5-combo-suggestions-390x844.png	5794dc2bbe8f908fc6e6cf87a03ede31e19ceda053b0382b58e9884e8e76d2cc
docs/ui/pages/pos-order-items/references/phase-5-combo-suggestions-768x1024.png	489472aed80163f4c935fc13554f4819e4f855d496c6fe807b186ae6d06a64a5
docs/ui/pages/pos-orders-home/ACCEPTANCE_CHECKLIST.md	6bcb581f5b454e7c1e5c8dffc1f87c85fad66c6427025dd536c2c2826874a22d
docs/ui/pages/pos-orders-home/DATA_AND_INTERACTION_SPEC.md	bf798fd5650bd870a5ec6228500512f7f22b140231f58ed409fe255541bb3436
docs/ui/pages/pos-orders-home/DESIGN_HANDOFF.md	e1fa4905b616b5b5a9737249428cab1151d430c33c6bb3cb002ee7639e62b659
docs/ui/pages/pos-orders-home/IMPLEMENTATION_PLAN.md	e19af0839a51aeed011cebcb9cda901a6f5884ce2a65b0c092796b6d84d49a69
docs/ui/pages/pos-orders-home/PRODUCT_SCOPE.md	906355c6d1f00dd321c723951c1add5f14fd1103f8ed2313cddbe9d9e983e7ae
docs/ui/pages/pos-orders-home/README.md	d878e96619fbcc5eab37b0b0f502035ece867064ba784a292f984ff48c81c5ca
docs/ui/pages/pos-orders-home/UI_SPEC.md	69bfd01e1cc4bb40acea771f7280fd95effc0fb1ef0ab9872bc7754369beec92
docs/ui/pages/pos-orders-home/prompt-provenance.json	1a8b8cf32ca3511809f8aa2fa52f175e480fc4d4e9eb4e2a87d790b3ebc05011
docs/ui/pages/pos-orders-home/prompts/00_REPOSITORY_ANALYSIS.md	84dbc196b3e2453c2f9ba9d0ef6d19eb7ba0308ebbf0a39c9fcf24742672c09f
docs/ui/pages/pos-orders-home/prompts/01_VISUAL_BASELINE.md	5c1ad831bf1df6b54164c6a16af22a0afa6499ecfbac75fd17f4f439dc9b4d16
docs/ui/pages/pos-orders-home/prompts/02_COMPONENT_REFACTOR.md	978bc414b65c75bab5adc784b89679d2999ec5dea6223231a10bea7008a02253
docs/ui/pages/pos-orders-home/prompts/03_INTERACTIONS.md	ad640e12c90c2ebf3ec5f7f5d4221ce1b67aaf987f44f9a8e1459a676f98f9da
docs/ui/pages/pos-orders-home/prompts/04_DATA_INTEGRATION.md	38a281f71422767263f79c40b858f30f60cbbad6b3b658071f12df30fd123fd6
docs/ui/pages/pos-orders-home/prompts/05_VISUAL_QA.md	f64ee89afc574b4c3666e1f875d7fe76aff9d9c4d3c0b203c9d81d5e5239458c
docs/ui/pages/pos-orders-home/references/README.md	4d5f66b1ee5803f5b4a26dd732f514e00384e74f7a577230370bc92c143546c8
docs/ui/pages/pos-orders-home/references/full-viewport-home-1366x768.png	23800117f5db1e97754a64a17213e5f175cc397386f30cb247b522304d3ac7da
docs/ui/pages/pos-orders-home/references/full-viewport-home-390x844.png	7fb475dee391335cdf016e722138277dc34393d8c44d1f5181f8f72ca51b22f6
docs/ui/pages/pos-orders-home/references/header-direction-full-width.png	0532299d0d6812e6b04bbe4f1a0ed8ae6ba1fe9e45230be8eb49fced586170e9
docs/ui/pages/pos-orders-home/references/phase-0-current-1366x768.png	6905b0d8a95556f2c3e572195e567604dd3293b22b5076951337aded0f527945
docs/ui/pages/pos-orders-home/references/phase-0-current-390x844.png	95ed458318795c77b38835cf18db041b89b395b9b4fd049b92ee28f675b7e95d
docs/ui/pages/pos-orders-home/references/phase-1-header-1024x768.png	a859ed7c46c23300282466fbbe240197f52e91e60f369cbef7afa38308e891c8
docs/ui/pages/pos-orders-home/references/phase-1-header-1366x768.png	4487444e8116fed9724f46935a71e7a7ff46563045353402dbba63e3e1d0f850
docs/ui/pages/pos-orders-home/references/phase-1-header-390x844.png	3e21e76b9dbaa69ca2f19d5d4c6df4e79514c56eb009d12d039ab29f187540c8
docs/ui/pages/pos-orders-home/references/phase-1-header-768x1024.png	413c0fb3148eea0faf66f527ebaed12119370c286b161aedbd158bf56d278bee
docs/ui/pages/pos-orders-home/references/phase-1-header-secondary-menu-1366x768.jpg	86f93abb2d9ebc569ac01f7766222bdbb49f03a978a01be4a9b9f77cd43114bf
docs/ui/pages/pos-orders-home/references/phase-1-header-secondary-menu-390x844.jpg	890ffad33424f1cdc8878005b30cf5c96c1d181ae71b37b080946e448d2d404d
docs/ui/pages/pos-orders-home/references/phase-2-shared-header-menu-1366x768.jpg	39de85fd2216e459ce6e8d24cd1b242a7a1a8b8b9b24ccb74cd8a3556fbbaf9e
docs/ui/pages/pos-orders-home/references/phase-2-shared-header-menu-390x844.jpg	890ffad33424f1cdc8878005b30cf5c96c1d181ae71b37b080946e448d2d404d
docs/ui/pages/pos-orders-home/references/phase-3-interactions-1366x768.png	f762b078a1ab2d06dfc7be4ebde16b14aaec84e21f9f3de695062e54520a12a7
docs/ui/pages/pos-orders-home/references/phase-3-interactions-390x844.png	d719b7042f3386ca414a7c7ddb46c925a8f8a2dc0795df598f2698f48706fcd6
docs/ui/pages/pos-orders-home/references/phase-5-as-built-1024x768.png	f9b6b751aa538ee86f5a7e51f432f0ca7362fd6a4cf13f6f56e1daa37ae3391a
docs/ui/pages/pos-orders-home/references/phase-5-as-built-1366x768.png	3ebaddc65828a98abef7970a828c2cf9babec8b0312a08a909e91a080b7d88dc
docs/ui/pages/pos-orders-home/references/phase-5-as-built-390x844.png	3e99f8bba3882e5344edc43b180f12c7ad140bd61590b13e9137994837cf8060
docs/ui/pages/pos-orders-home/references/phase-5-as-built-768x1024.png	cb436b462d2f45f4368b28a5781249ee3bd2f161a3fca455883cfbd48afd3db6
docs/ui/pages/today/ACCEPTANCE_CHECKLIST.md	70e583aeb9d50c1e7d8bdb2146f49684571bfd73ea28bb00a07514b883f56aac
docs/ui/pages/today/DATA_AND_INTERACTION_SPEC.md	e0be65d2a689528088a05fbd242c715132d6cf4ea5de4d045182d222d92330fd
docs/ui/pages/today/IMPLEMENTATION_PLAN.md	972bf180d81f4e7ba8d9106277fe41159ce6663329727c8360cca529d1af79f6
docs/ui/pages/today/PRODUCT_SCOPE.md	8e285e5cf270423ea75f4e31a862049c47970e34effb9bdca244bdc3039b7766
docs/ui/pages/today/README.md	d96bd4fb0d0a92c479f4b7a1012f158cb2dbbd06d02cf0764dcb74155e51dcea
docs/ui/pages/today/UI_SPEC.md	cf405072dfae8b654aa261c54990cdc38d1bcae793e9ad5688cc79f0711b58a2
docs/ui/pages/today/prompt-provenance.json	478827434bbe9083eb14706d807e06c3906dab884ec0fca15f3620aa2be2c2a0
docs/ui/pages/today/prompts/00_REPOSITORY_ANALYSIS.md	c0b9f66a166acdbddfe673b59762c39045096be5612d0899266ca44f2b2f0229
docs/ui/pages/today/prompts/01_VISUAL_BASELINE.md	efa409e68647dd5388b656b5c7e24f44e2673ed5361e97a76ed658313d887cf2
docs/ui/pages/today/prompts/02_COMPONENT_REFACTOR.md	a198e36586bccab82a6eb7fb2314658de3122a10ca7fe018dea7e3a42d765f96
docs/ui/pages/today/prompts/03_INTERACTIONS.md	15f05a5a4221dc378e6b128292ca0553454f344b021b28f8c4527a2dea9a799a
docs/ui/pages/today/prompts/04_DATA_INTEGRATION.md	14b937dbc09d86201ebf99cfadd33964f94455e0978fffc06afe2a92a4cb2f49
docs/ui/pages/today/prompts/05_VISUAL_QA.md	2326260c23b360324560c8e4b7051c7448e26ba650782fe98c3897fe110f1daf
docs/ui/pages/today/references/README.md	1163eb26800079289b4be31b470db9c09ef37f729ef7c8157c92e1b5e9bcde9d
docs/ui/pages/today/references/today-dashboard-approved.png	bfeb7a4f0bb4bd5c2968b4e525076615670d3e9dad5c16779bdf7d59a0ffb1c9
docs/ui/references/README.md	c31e361201daaa477d132357c87ced737e318c29639b0185274029ed863cbbcd
docs/ui/references/yuta-shell-brand-reference.png	a17d70072df3993906cd64cb1a75d2cc09d186e1f5c87ff40834a30385d8693d
docs/ui/templates/README.md	13474b5d4b6c535fcdb87a83b1ceb30a17a23d8a4b1811f6afc7836b13a77bc5
docs/ui/templates/page/ACCEPTANCE_CHECKLIST.md	de2338d66fe29c54ee7373de4bfdaa6fc10359480b3090e95f03f6c9c2fc4b29
docs/ui/templates/page/DATA_AND_INTERACTION_SPEC.md	dcd4b30b030ae5b201175f6fe37d82092f81ef01c705829b5c85f0e84a6e0fb7
docs/ui/templates/page/DESIGN_HANDOFF.md	a4e5830167a6c69d2297a9e0633f3c8bbc6a58346a6cd3ebd804b450d426ee93
docs/ui/templates/page/IMPLEMENTATION_PLAN.md	4f1566a3a1d22ec73bd24e3f972bd3c6d7649a34c0dd22ab595faf1d22f865eb
docs/ui/templates/page/PRODUCT_SCOPE.md	4388799035ef400aff67a25a39ff3e80a046d7bb0dca837c8810a15e883f89e4
docs/ui/templates/page/README.md	26a2c3246c95e27d0cb146adb972c423e7ec5df92a86059736263b5200ea5bb8
docs/ui/templates/page/UI_SPEC.md	f37870364638a4f7fbfcb4627dd74438532b8c317dd76a0ee9193e1436973046
docs/ui/templates/page/prompt-template.json	c8110f3b4c413ffa892ba0e89ce27e63714279bd4062fb397ce2ba9a7bd72a9c
docs/ui/templates/page/prompts/00_REPOSITORY_ANALYSIS.md	7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c
docs/ui/templates/page/prompts/01_VISUAL_BASELINE.md	d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119
docs/ui/templates/page/prompts/02_COMPONENT_REFACTOR.md	8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac
docs/ui/templates/page/prompts/03_INTERACTIONS.md	e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388
docs/ui/templates/page/prompts/04_DATA_INTEGRATION.md	f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79
docs/ui/templates/page/prompts/05_VISUAL_QA.md	5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0
docs/ui/templates/page/references/README.md	3873fa018f8d3622ae250d1e280347f193d3c966c760c115a6aac054df474f94
exports/README.md	20fd98924bca5045284f5c6e48a8576044f848dfe25de9ead3d4e0b1e1c7e4ff
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/.openspec.yaml	000332a82b7e5c59ebbdf5b875ae7ef9d2a0aeebb9d259bdc6c0c62e7ac5d179
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md	cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/design.md	6dbac8106a80165a7e7bb7ec8c3346980199a70e2ee13fc44a78822da37be873
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/proposal.md	77fd805c12a72d659f118cd813bb8a197ff57cd6fb6e363449e74fd3048f7eb3
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/specs/establishment-profile/spec.md	2253f7791b9feef29534f363d8e16612f9a8ffb4e03888948f6795269add5939
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/tasks.md	eb08d5a1a0049981f4dac900809dd27536d010971a9703383d4e8f7b67ee4031
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/.openspec.yaml	000332a82b7e5c59ebbdf5b875ae7ef9d2a0aeebb9d259bdc6c0c62e7ac5d179
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/analysis.md	88a4bf5b6ba44ca4be4fe631d04d49b867b6685f8c689a3c6e0ccb6c9c3cf6ff
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/design.md	0acf4049546b8eb8df144fdd4b8bad8d499b20f6cd9381faf329820b134cfcf2
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/proposal.md	356b47691970101a0e760da13d559895d24d7347cb177cdbd97c86c32259d3fe
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/specs/authorization/restaurant-knowledge/spec.md	41ccb74dffcd56f5c23760a4bb11efbbf4363697feb1651980c27ef5134c67e0
openspec/changes/archive/2026-08-30-restaurant-knowledge-authorization/tasks.md	d4b5d3d69523fbe7c3cec221be2aecc1f6979a7bfd3556e9519bf46fa1925219
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/.openspec.yaml	000332a82b7e5c59ebbdf5b875ae7ef9d2a0aeebb9d259bdc6c0c62e7ac5d179
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/analysis.md	3e79cd9d7f8464edf9d5eda3d2c03da1f5716af024ab3717465df467afce7ea8
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/design.md	89afc116d25482e91b40efc299bf32ac5168d960b3369abf62746b089a85b295
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/proposal.md	071b1300029075719d69954f2fafe707173145d6e75a54c17251eb2c0be46ddc
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/specs/restaurant-knowledge/concept-history/spec.md	6a9b186070a8b2d9b02072ca109f256fed188babd1817726438f02bf8bc9893b
openspec/changes/archive/2026-08-31-restaurant-knowledge-concept-history/tasks.md	dec47e0a5dfcd68ae88ca91b7dd60a0c9fa26e69f6f999a39960de13c86d135c
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/.openspec.yaml	77d7cfec1b467e81653377cbae8284b75a000eb976bfac5d7b5bab1398e40ed0
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/analysis.md	fbf4fabcc6ef28420c33b42db89608dacfa6a9accb52ef39cde183628c9fe6a7
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/design.md	ecc8eb49d983ce2fb71b7e66590bd37e18c3b0f2515a676b2d0b04511d8e25c6
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/proposal.md	48a1c22588d7785520cd0fbc99aaf1845029bafbf84675888fc3e2a8b96d4b1d
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/specs/restaurant-knowledge/cuisine-know-how/spec.md	5b923da9db3095d1e216301875cb4d3d247763fb4ba5f0b6bb3c291f1b1444e7
openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/tasks.md	123d957497bfdbbbd213760c3bc17f456073854673afc17c0441e7edad73a9cb
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/.openspec.yaml	9b39fd3f7d550b8d1a8b1d0181ee1e7e12ffd354a71b985aa5e5dc9ce6851850
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/analysis.md	bd7e2df308415adc95b17ff1002c775d12e6fbc66c8526a466a2efb9bca37aa9
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/design.md	64228423fc7e3b0b94acb0f69ff13ae0b70f814426e6272b25b1a2dd1298edfb
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/proposal.md	4b1cf04bbab4711918cee0166261f9c135d0db9911349c5ddaafca7757e992c3
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/specs/restaurant-knowledge/customer-experience/spec.md	d028bcbbb1cec1dfb5c84c91174d1ea55985b7e056d776294626a1940f098ff6
openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/tasks.md	c51c921d6b706d00dc3c55b8eaf0ad8fa8f747c8f6183ae572abac734af4f4a8
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/.openspec.yaml	0bef269fccb851f89db8bcb9586024b9f089fe3f8a9870a9080886b45971850b
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/analysis.md	6203a25f11b83f80af89ec5f20cfa4d98df23659ff1b82f9c8c86a17f4fa35fb
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/design.md	2d10088d01fd4102a1e16e4eb81e33f024d921601691574b0dc59c5a85626169
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/proposal.md	a58e71eef2dbce764191dc0250cc812e00123fcb31fc2b7c98b5016db0e2d6c4
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/specs/restaurant-knowledge/communication-identity/spec.md	a6b0d54a741ad8ac17c668c0fe3f8f8b8927fc9e7e1747e760e91b1131db408f
openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity/tasks.md	f190145165616bd15d3d4341ddc246327d6dc1541f91ede2d62157e57ce6fd11
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/.openspec.yaml	9b39fd3f7d550b8d1a8b1d0181ee1e7e12ffd354a71b985aa5e5dc9ce6851850
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/analysis.md	7c0372d810a33b6828ad1014976d0685b35e112de6af8fedd7fdf016cf92ec95
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/design.md	fe99db86abcbafa624da5a7c2a272f31d1f5a85b38ccd125202afff3a872d76d
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/proposal.md	1538e96384b77c3cbc37a119dff4251b797744ab338175bb4d5e1c8cc8dc83d0
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/specs/restaurant-knowledge/team-culture/spec.md	0e7aa521a264b03cde23eefab5034d2b69019537809dd5a34f9b2b584d5b4d44
openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/tasks.md	363cfb9bcb9521c77d9b51b018df7d2cbc85e11e8c53d7d70d1ab9351942f200
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/.openspec.yaml	6766e675615f87c16f60cf61d6cff3c8149687bb14bf8d1f4451537b72fdea72
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/analysis.md	09d50e50cb9a37af7df402025319078ddff446c146c67284f56278131dd25445
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/design.md	d931e22022dc4a047a78d1fb276a60cb2b232797ebb78a68c11a5eb0e703cfd6
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/proposal.md	9aa477361db22e88bfd6ceefd22b4a7975c1792daee3013da849116244fc913c
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/specs/personnel/reconstructable-value-history/spec.md	0841018f7318820ab52bae6685d58ee4227b207d0ce1520f3eb2dcd3aca7f496
openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history/tasks.md	64a432441091321be49d72b964c078d94b3f0726fedc0ad3a67b5f2d6ba387a6
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/.openspec.yaml	0bef269fccb851f89db8bcb9586024b9f089fe3f8a9870a9080886b45971850b
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/analysis.md	adfc226bc6cf2804833a099c1317bcad7f6e9939262accbe1da5bb23188d01e6
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/design.md	b9f8d2475a8f3e9506ca67ef00f46245ee5792c2117db39e94611fa0cdf0a368
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/proposal.md	dc874fbeb79d43ef31e9d109360033a46aea5c8f97beebb73abd538e300764e8
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/specs/restaurant-knowledge/validated-knowledge/spec.md	9fd953a0a931593137dcc3f2d7c420906e087fa395251e17fe7bfd7328e7445c
openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge/tasks.md	e941a3a9885901086b8e254b4412d8b76527d028095fc5d424dd9bd4d7a10c4f
openspec/changes/archive/2026-09-04-formalites-authorization/.openspec.yaml	6766e675615f87c16f60cf61d6cff3c8149687bb14bf8d1f4451537b72fdea72
openspec/changes/archive/2026-09-04-formalites-authorization/analysis.md	c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4
openspec/changes/archive/2026-09-04-formalites-authorization/design.md	4f8b77b216fb820bd637a6661d164bcf998fde5c26a76e4d236d1652ab1b194d
openspec/changes/archive/2026-09-04-formalites-authorization/proposal.md	2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613
openspec/changes/archive/2026-09-04-formalites-authorization/specs/authorization/formalites/spec.md	601dd1417ac25527f201fdb3b95488b98474f6514ecfb0c428f68584d118ba46
openspec/changes/archive/2026-09-04-formalites-authorization/tasks.md	3d22add75fccb9ab2d48ff808afd1a0e23d81b7119f9bc54cfb14c4dd4595dc4
openspec/changes/archive/2026-09-04-next-generated-types-bootstrap/.openspec.yaml	3994c732a35b66600bfde953f28a4169ca9138804c634a11e1775a1bd1594896
openspec/changes/archive/2026-09-04-next-generated-types-bootstrap/analysis.md	322846fe2553a9579b64d8afce607388b7f92f1d55787b32c8491ca9599cc59a
openspec/changes/archive/2026-09-04-next-generated-types-bootstrap/design.md	52468e84e4287c0fa2b87c758cd4d1b6fa7835dd15b3d110372072eff430fbd3
openspec/changes/archive/2026-09-04-next-generated-types-bootstrap/proposal.md	036e03c7e588d8970dc7255d364ab489612952edcf74f7633ba65e472817b18f
openspec/changes/archive/2026-09-04-next-generated-types-bootstrap/tasks.md	4eea496c5fb7c4fc6d54ba13386a3e029bd95a4f686ec68936d551201222ec98
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/.openspec.yaml	f2a6161f0ba072ce18a67b898c5bf5e732ff953ff4584d8e40a51a8d7db19ea3
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/analysis.md	11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/design.md	83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/proposal.md	2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/specs/formalites/persistent-draft-foundation/spec.md	c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850
openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation/tasks.md	3088d958c101ae3184638451d3e2cefe1d2c53d7fe2d9c35fe3cac42beca1d35
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/.openspec.yaml	4335374069fa3e46cb56363f52c324d241941b2def3fe11275cce6a577eb2b3f
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/analysis.md	6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/design.md	c165a8ae8b21f78dd33dbd12d634bf52e9cf6acd65d4385e36ce5656981fd07d
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/proposal.md	ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/specs/authorization/platform-admin-formalites-template-administration/spec.md	c2ff7c618b2d050f0fa259f2e01d226870446638c1138a9cf2a7cd0a6bb45dfb
openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/tasks.md	d669403109e378954abed0f9ac4ce219b64312387436710a69ab89fc43378db9
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/.openspec.yaml	2ab2c83aadbdd12752ebfeb970c28b4828916be298e2724e2e1a17e69f58217c
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/analysis.md	02c0213d17c754b3617738da4c4ef04aca4566e3ec42d669192cbe086b2a1f4d
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/design.md	3ab0ee2c9c84df1ef58157b3e026fab551cc973d88dd77448c0caa2a774f8582
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/proposal.md	12f138ad7de17186a313e14a08cb26f4f06333be2a03f8fc2445a63f8338ad61
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/specs/reputation/review-social-links-configuration/spec.md	ba36028f4d8461ca8f8742eff00d81ad14e45ee14ffbabc0b4787749679dad07
openspec/changes/archive/2026-09-06-reputation-review-social-links-configuration/tasks.md	4782ceb0b2279bbc30227a0bdf8c767a8fe47a3c5b6a43bfbbf3f29bcd979590
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/.openspec.yaml	84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/analysis.md	1cf8a62d41994d8a33ce56dfc03659a5a609f7b42e2a19acd7365fe2f5b9db1d
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/design.md	9759d0fc4487fa0e037622e16f24308054480eb453a44ac027579a084e6ea6b1
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/proposal.md	53bc674bb634576506bc50cb94bb38ab9a939939f6cc2c7fc8695647c45f6d7e
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/specs/formalites/template-legal-review-governance/spec.md	9105bd3d7eace661169fda7717a8fb934916c4fc35209ccffc2264f1755e370e
openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/tasks.md	29692d7060e99253fc733a30de4ba9a3185f56cb3de2e57a00265f60f301eece
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/.openspec.yaml	4335374069fa3e46cb56363f52c324d241941b2def3fe11275cce6a577eb2b3f
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/analysis.md	fe06a094fb0b3772cbcd2b1ca8b222055ad96f2f00e54c06451e1b7adb40f0ed
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/design.md	27537f0287bfec6c5ad6d211e143fdbec6a11ccb0e60fff04ae7dd9c32371dfa
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/proposal.md	900e2c99c7f88d655a02ddc4b58d2dc5a61c140b1dea29319546d84458627494
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/specs/authorization/pointage/spec.md	55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/specs/pointage/authority-foundation/spec.md	3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613
openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/tasks.md	20de1adeb010dd5c26395488ddb4c5acfbfcd93dc86fbd77cc06bedbed2491a5
openspec/changes/async-interaction-feedback-foundation/.openspec.yaml	4335374069fa3e46cb56363f52c324d241941b2def3fe11275cce6a577eb2b3f
openspec/changes/async-interaction-feedback-foundation/analysis.md	7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39
openspec/changes/async-interaction-feedback-foundation/design.md	0aa7c42257e6e9e11827c1e41a1d8dd61e96cc5391561ba75e51cbe546224138
openspec/changes/async-interaction-feedback-foundation/proposal.md	c973917e01917c17bb9399330312a9c7b7003ae920a11f0e0e50f876d879908e
openspec/changes/async-interaction-feedback-foundation/specs/frontend/async-interaction-feedback/spec.md	46840b69a936b96e9e6c49bee6330ea1a6206774f7aea7483dbabda4f159cb8e
openspec/changes/async-interaction-feedback-foundation/tasks.md	83d2f48a336c309087ce361b6f396964734869588cb657d250fa3ecbdb55eb49
openspec/changes/feedback-public-trusted-boundary-hardening/.openspec.yaml	2ab2c83aadbdd12752ebfeb970c28b4828916be298e2724e2e1a17e69f58217c
openspec/changes/feedback-public-trusted-boundary-hardening/analysis.md	3d41d7ad9664a3468d6956fccec4a486a779e87b7debad2d63776d2a2573c2ba
openspec/changes/feedback-public-trusted-boundary-hardening/design.md	6a7eb14a75f96585451bbf45f7d9da9e46f1992728c8606c6cccdb6d0ec3968b
openspec/changes/feedback-public-trusted-boundary-hardening/proposal.md	89d08d9ddf5ea11af8c7eb5b6530c27e4b359167150bc45641d5750d8c42b9c1
openspec/changes/feedback-public-trusted-boundary-hardening/specs/public-feedback/trusted-boundary/spec.md	f42e82be1b20031f7d48b5b48a59137f3d33e0b56bd3b5fb03a22c102c6c631c
openspec/changes/formalites-legal-template-foundation/.openspec.yaml	26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820
openspec/changes/formalites-legal-template-foundation/analysis.md	c40e395a230518bb5ff2073204fb44ae083eee5a2b833898c58287d326d6a4c1
openspec/changes/formalites-legal-template-foundation/design.md	d6db50dc5db2a64e29e8b8a5148011bda1b4bb46127101fdf188e3b7a3526cf5
openspec/changes/formalites-legal-template-foundation/proposal.md	61d51cce2ddc75acd050ca0317865e3ddc60e38f41c8e7e2047e4d2a28a9951c
openspec/changes/formalites-legal-template-foundation/specs/formalites/legal-template-foundation/spec.md	b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418
openspec/changes/formalites-legal-template-foundation/tasks.md	0ee125edc4bb4261d745629387e2126c14097fc6b15573725c1cff7028ed2d40
openspec/changes/pointage-usable-raw-clocking/.openspec.yaml	84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e
openspec/changes/pointage-usable-raw-clocking/analysis.md	f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146
openspec/changes/pointage-usable-raw-clocking/design.md	be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9
openspec/changes/pointage-usable-raw-clocking/proposal.md	d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1
openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md	1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66
openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md	4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e
openspec/changes/pointage-usable-raw-clocking/tasks.md	8cb14531f9c230f025e460ea7f0a8b2208cee4904c789a353e12718240c6f1db
openspec/changes/preserve-establishment-owner-invariant/.openspec.yaml	4335374069fa3e46cb56363f52c324d241941b2def3fe11275cce6a577eb2b3f
openspec/changes/preserve-establishment-owner-invariant/analysis.md	637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2
openspec/changes/preserve-establishment-owner-invariant/design.md	7fdb0b52facf7fec81cd75580e63ec748281a11e18a7e2aeff1a8dadf09e7ad8
openspec/changes/preserve-establishment-owner-invariant/proposal.md	7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8
openspec/changes/preserve-establishment-owner-invariant/specs/authorization/establishment-owner-preservation/spec.md	44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5
openspec/changes/preserve-establishment-owner-invariant/tasks.md	6f34cbc604ead4ae600941a9a4c7ba2bae53c8051316ffa29b9b0c959f0f5ae9
openspec/config.yaml	d8d2b2aefd4b52e48d3e419b94234460a158820ab3aeb3325ced92d9d4965d8a
openspec/schemas/yuta-spec-driven/schema.yaml	23ecc50057c4d68342c1688ef5723c3cabe75fe8a549a1401a998cfff605dba9
openspec/schemas/yuta-spec-driven/templates/analysis.md	9316072f629760dc918915c6fdaf298413ff6ccb47ee1bae467f27d88ee8e37e
openspec/schemas/yuta-spec-driven/templates/design.md	e47df296318c6622f0b0911407e16b1578169403b96f61bf35fe1db7f7b417d6
openspec/schemas/yuta-spec-driven/templates/proposal.md	ea0879a322bb1a3c6e3002c67b5a29e31120dcb17219e3000d43775f48481284
openspec/schemas/yuta-spec-driven/templates/spec.md	1f370642f106589d901c0568e81b5f7741e9289da48df41b70dd21ad99592a0c
openspec/schemas/yuta-spec-driven/templates/tasks.md	b2a6a4c08c15f347a1d8c3e2d43e0c8fb066dc5cc0feb795f47555f176f9c421
openspec/specs/authorization/formalites/spec.md	1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616
openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md	3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2
openspec/specs/authorization/pointage/spec.md	871df9f0cbc1cbabd19ef79a9226baeae4e7ed57c852eeb2f601feaac22bdd2b
openspec/specs/authorization/restaurant-knowledge/spec.md	f924222ae59f13937da91c5272a26a6050e16dbe3b2ee994b823297d5e393322
openspec/specs/establishment-profile/spec.md	d435e2e9bbaa4dd49e177fdaf0b0f19fbaad50f2b010d7cd1257eed097bd0dba
openspec/specs/formalites/persistent-draft-foundation/spec.md	b4c8077df69c7da638627836255b0a64a3b9b342751964bebe6860183c1b768e
openspec/specs/formalites/template-legal-review-governance/spec.md	cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22
openspec/specs/personnel/reconstructable-value-history/spec.md	67c9dff9f78d80f8a9669763e718229df931e8d8f5395fc9284c6aac964abb63
openspec/specs/pointage/authority-foundation/spec.md	6c57de01c3c83502253df8ea59410c3d3e4f453fef64d7700ad775b487b10cdb
openspec/specs/reputation/review-social-links-configuration/spec.md	80a228f2fad6431d817218e9fde147159f583fab4f6bfd495e73d9d9e0d2c756
openspec/specs/restaurant-knowledge/communication-identity/spec.md	156e0e05aa4a3b72145ffad5c3dc38ae5a73213a1744d679777850ace4cd7323
openspec/specs/restaurant-knowledge/concept-history/spec.md	93ece2037955b7b208f506cf7581a9adf45ffe9570783828e159a5fef2fc25c1
openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md	90e46a1a4e0c2f13679c3eb15cbb560b84b7b4206b1a09ff926f01b7f6624928
openspec/specs/restaurant-knowledge/customer-experience/spec.md	1fd47662b8122bde0b2a5029af246f39bf78efad6796b9712f2cff6dc6a254f8
openspec/specs/restaurant-knowledge/team-culture/spec.md	e4af63e50baed2262a18868fd8072ea050d494ce168cc1d0860322651f4d3166
openspec/specs/restaurant-knowledge/validated-knowledge/spec.md	203d674ad3f0afc1b4462b5584ca597412e09bf0a2c40f9b7937d736d7a73a70
output/pdf/YuTa_Workflow_v3_DOCUMENTATION_FINAL_LAYOUT_AND_CONTENT_FIXED.pdf	16998bfc5912dae1e657298de08bdc49aee9fc7361432cd2dbcfb1d8cb1d0d0c
output/pdf/YuTa_Workflow_v3_FINAL_LAYOUT_FIXED.pdf	fcd1e6fe7eefe5fe810b0f538d1123a533df3921baa7d2df31dfd5c46d806288
package.json	fc6fdde9d6ee80a5a8861c94082c64829a18dafde2eae238f5d1cbc4e0d31595
packages/auth/AGENTS.md	2f860c08506f1e5e0a1c362e14e63c0292fc06960257560a2b9b741707ac9e57
packages/auth/package.json	10ac434cf34f96f8f948b933aa4d76a16fefeb9612c4460a511cfd434d2d6899
packages/auth/src/contracts.ts	6592d2680e10b0af3533d81905616cfb502a88a5f739b8b5f55dcffaf93ba7fc
packages/auth/src/formalites-template-system-authorization.ts	816b912b7cd4b9408d50f4ae4d01832499e87b452661143cac6dbcb0886cace2
packages/auth/src/index.ts	b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634
packages/auth/src/password.ts	363e67b70e0737805950b6bf19a1c85a3f96da590a55a3e36c1b6ab5cbdd72f5
packages/auth/src/pointage-credential.ts	8b294113e7a97fb83e5acff5df96224ed4c18d73d60c46a63abf824c37195fa1
packages/auth/src/post-login.ts	741e498a9a7cd8ed39eee62d66e0cbf4f202dd07a16437554663548196ff680a
packages/auth/src/session.ts	278d08effc39d90cfe147bd45182a6e80d76ff5641f94d3d1bc302fd8063f5a1
packages/auth/src/tokens.ts	43bda54e69d99983333cbeb89c694c958952ab7b648d71de9d3e42944c113d2f
packages/auth/test/auth.test.ts	aea15268f7616f4cfab48393c2fbe0a1e6ac833ad43535b425983b0a16f33c9e
packages/auth/test/formalites-template-system-authorization.test.ts	93911ec279fa61f20f2f9af3b0fdb6cc591d1ba88fd6eb1ae2f344f45c52de89
packages/auth/test/pointage-credential.test.ts	6ea66dbb73a82f8586575c15f049be3ee0832987888045a593b982001c1479a0
packages/auth/test/post-login.test.ts	ed05963a323ff7a820c9923500d1d9c719ac3cad07c257342271da2d02a2b610
packages/auth/test/session.test.ts	457fb52af3c72cb79b8b1f0367b4164cc14bca25b026de59d1ad63c30cecc867
packages/auth/tsconfig.json	8b2782f531c62fe7cfe43382ebd65e7f92697eeb38b478682a33083c7b280526
packages/booking/AGENTS.md	f85ead13d4a712ff27424437f912cfd8e388a749caf71c14e226a14054047edd
packages/booking/package.json	6f2f1ece3b2fa86dc84d376fedf8dd26091b15ab16c93885f7c838f033e146a5
packages/booking/src/index.ts	921b6140e72236ea6d22edccb7fd9b88c3db77a3dd0acffef39937af4d720fc3
packages/booking/test/booking.test.ts	f478ec8c76a362802b14a5d7b8f0c05464b9a7196d2eb81aecd38c1f37a63858
packages/booking/tsconfig.json	a593119c3ad401910e2c70ea0dd5ba2ce90b3ee59cb49b2d8bc51b446328cc8f
packages/contracts/AGENTS.md	c9f7045ba8e318a90f0cda8477d89baf4d481738ba31eeb2451b062d44ab7240
packages/contracts/package.json	a8001e1bc9f0cd514e40b0b12a759f1c608514aa77778043aedf7cfa5d7f59f8
packages/contracts/src/cloud-admin/index.ts	1c38d15d393178bdddd4624f92be2930cee0a80d4b09dbaf5b9307d869b566e6
packages/contracts/src/common/index.ts	484025aa7517dc94c9636b6dd6e75037b1be20e52eb962977c13a68517171905
packages/contracts/src/display/index.ts	3541fb83d6debdfb908c6d1a11940e98d4594c2d220b86eace0cb7b1417d72a5
packages/contracts/src/establishment-profile/index.ts	eeb0323ad2c6b06a2059b13a1abc41f1d245e30632b4769a7759107e00c69c62
packages/contracts/src/formalites/index.ts	cd09c92e05c5e12e74a9c6d7746cf698911c4359c7c8a3ef25521b02bf91cd04
packages/contracts/src/index.ts	ce44e688cea68cee2291db00a89207b5ae95086c3ef9de2df649858aa7378a44
packages/contracts/src/local-pos/index.ts	adb389f59994217f0e1e51b05d17eef030f88113a990ce0aee0967fc9b5052fa
packages/contracts/src/orders/index.ts	9fb5df055abf3253881bb6b12df724c0546f4b2f6ea40a26ebbe7d039dcaea0a
packages/contracts/src/personnel/index.ts	833d0017753b4a1bb245e5c01473d4c34ccf8ffaf77c572105d414b845308690
packages/contracts/src/reputation/index.ts	d0b67b273b94dfb9f262de9a133bdcbc69d65c86880d1fc6adf6a4447a0df752
packages/contracts/src/reservations/index.ts	59c3652ff369e769596ac64c42641c0c304d7215ae8bb0de033126dc3b7dc18c
packages/contracts/src/tenant-foundation/index.ts	c5e2aa544ff1a9c9cda108a7924acfe5f87622cd1160c2ab2939ff541fbc8596
packages/contracts/test/contracts.test.ts	d763665b7801ae9c897faaed438b967006d9a71c4c87c7d29816f8b0c42b74fe
packages/contracts/test/formalites.test.ts	6e27637c05e7c04d9a68d0e621f608267c2aca66d2177f421bfad177a113c772
packages/contracts/test/personnel.test.ts	c0de46cf385c42921b31d0c638ed0648900f01ebb51958ae0016d865c5c11a2d
packages/contracts/test/reputation.test.ts	d7143b5bb4d61e55330a56414d37216253a448c83e776d760429f2778046f394
packages/contracts/tsconfig.json	a593119c3ad401910e2c70ea0dd5ba2ce90b3ee59cb49b2d8bc51b446328cc8f
packages/core/AGENTS.md	6b58515bceda6817f5e666fe781f3a52c56e2e9c85e73f35798a9fc19c0b1dde
packages/core/package.json	ed812c9017816ef8a44cfe47958fd229246bef977480a1f2bc47e8d8bfaabb21
packages/core/src/combos.ts	04a427e73873d72275c0a906fd759240b3e6b8d7137c50d4a9677244c3e2d0d3
packages/core/src/dates.ts	1a4d58a5612f21fcf1b7a472aa770bb94f79f8fd679adf24c256018dcaaedf18
packages/core/src/formatting.ts	3aff707ad47698fcc153129c8d71e221d64755e6a0e107f38f37e5ca3b343334
packages/core/src/index.ts	1164b2a81d740366bb668a867670cc2193a350e0212acb47fe0f0682ab5ee03a
packages/core/src/tools.ts	a4ba682f8c1b1133caaaf9baccac99d240084c69d77b54fd703fc111e6bdb3c0
packages/core/test/combos.test.ts	e6fc67a1b1425284a38476105742c11d772f5e1509892fc800c5c8add55bb8e0
packages/core/tsconfig.json	1b27af1e7a06dfcb34c5ee93d4ec8570a4404983b69565d849ea25e51154bfb1
packages/core/vitest.config.ts	beba2d94a63554b5f8877b173949e58fcc3f6d9a0a87d1930ba669353ba74a70
packages/db-cloud/.env.example	676a209ecaff1e7cc5beef3367b0716dff028c0e9d3209dc7e8b8a536d60e8db
packages/db-cloud/AGENTS.md	7f67419748eed6786bda01f0ec35f5076da559d44a85b1e775f66957f7274daa
packages/db-cloud/drizzle.config.ts	ac2c0b57296a8e487c1a715c366d3fdadddb97a142579e3888550737dbd3674b
packages/db-cloud/drizzle/0000_initial.sql	76c5a9ceb8fa58c033e98fe4824840def01a39cd9ddb6e94f6f6af9d9e93fa18
packages/db-cloud/drizzle/0001_amused_wrecker.sql	2742f9a249a6948561da5dece043ab589c53424c5ed678199194d362d8bc1cca
packages/db-cloud/drizzle/0002_bumpy_elektra.sql	21243f1e8cabc335139e390e87b6d519d1874ab794aa76d963e44b547261242a
packages/db-cloud/drizzle/0003_small_raider.sql	9d75269e74c1be067bd55dfe3c97bec838225a771b6d710693dc243063784b8c
packages/db-cloud/drizzle/0004_previous_gravity.sql	8ed2409051abe6f96d5bb977d622e4305ed43a291319ef9c8c23fd896ecf49d0
packages/db-cloud/drizzle/0005_lean_zzzax.sql	de8359745374df2e02e2071835e85f4d30ca68d018c63c678a6c1e9771517ccb
packages/db-cloud/drizzle/0006_aromatic_boom_boom.sql	8b99befbd80ff7f9c397bdaadacfb7ab822c0bb1c8556f916ce1d4cd499e2cb7
packages/db-cloud/drizzle/0007_happy_master_chief.sql	3299af4ea18fcc506af4f43eb1039e66863e1805079a8f23c70309beb0a8494d
packages/db-cloud/drizzle/0008_omniscient_colonel_america.sql	623f83ae4327f7387e9b7344e7dad0b35a9f67ddac8e96d214a2756a4b7bf090
packages/db-cloud/drizzle/0009_heavy_sauron.sql	15da1abad384d710fee0f85bd13258467e91f18df0a3caab5a4cfacc56a31cf3
packages/db-cloud/drizzle/0010_gifted_roland_deschain.sql	8a8940886831ae23ba3c0ec6b3395ce93142ff5d7713db1991b0eb4baef44ac5
packages/db-cloud/drizzle/0011_restaurant_knowledge_concept_history.sql	8daffa9df3cfc37e3e723308777f7882643526932cf5cf71debaa41c44efec22
packages/db-cloud/drizzle/0012_restaurant_knowledge_cuisine_know_how.sql	d5bd3d1d7e5598f1889163644e6bf74b351d7192dd39c2b00042ae21f2f813c3
packages/db-cloud/drizzle/0013_restaurant_knowledge_customer_experience.sql	075d219efa79f9eb925d34863cbcf8aaecf1a43c44c72dabd0fccc1ef7d46518
packages/db-cloud/drizzle/0014_restaurant_knowledge_team_culture.sql	e2c40e0441c3da500a221b57d181267f3ba15cb9dc9cd993bf1f31cdbcd62a2c
packages/db-cloud/drizzle/0015_restaurant_knowledge_communication_identity.sql	6ce2782ca102009597a7fb5d7cb73b60c63bc3c24a259ca72a7efc8a8af5e524
packages/db-cloud/drizzle/0016_restaurant_knowledge_validated_items.sql	4d64b96241fe9ddcb9edc5287d314e755ef4ebb21281bdce3b44e2e2c9b6cf9c
packages/db-cloud/drizzle/0017_whole_warbound.sql	da44f6697cbf3933fd95484fef2727e48a88ac5cd1d421780ecb789b5ec7b623
packages/db-cloud/drizzle/0018_elite_hardball.sql	98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75
packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql	143b6d1e47f92336b4359c4c85a17487ead97416afbbe2c0fd0b99880c0e7056
packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql	690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b
packages/db-cloud/drizzle/meta/0000_snapshot.json	75086e8b7a0eb17174f765aec9537e71bcb0e774ef05ed7e73ae8a4a7e12e49e
packages/db-cloud/drizzle/meta/0001_snapshot.json	f2fa84d91362dbec21f7f8f85ee3c03b1f6d751739da93c3374af6ceade68076
packages/db-cloud/drizzle/meta/0002_snapshot.json	5b047f116e96d7dfb64c9072c6d26157c96791d0ef058e2ec59061b216d75f34
packages/db-cloud/drizzle/meta/0003_snapshot.json	9468f2723702308be1b23b0c80160c069b3a46975f9a1fd031b26f36e7153701
packages/db-cloud/drizzle/meta/0004_snapshot.json	57fd3427fc9aec97dafd77d8b643efd611c8c12a65bf64f8cd39a30e8cdb99ad
packages/db-cloud/drizzle/meta/0005_snapshot.json	7109ff799c71fde11b6f525e828b11d57b2731598779948f4c2bebf5bc2ecb8c
packages/db-cloud/drizzle/meta/0006_snapshot.json	f729248590dcc711e05a46e3ad756b4b789affd485131799bc069d15537fb936
packages/db-cloud/drizzle/meta/0007_snapshot.json	9be05c6ec7d1c2c68f6731289fff95efa1ef5e7a6309745ac10593cdef2e245e
packages/db-cloud/drizzle/meta/0008_snapshot.json	2e742120524620e7389731b83da36719bec8e107b4d1841c8e8afeb1d26c95a0
packages/db-cloud/drizzle/meta/0009_snapshot.json	fb6099d284bff9976010c5ca50a58f71a7d9188978206baee0f4cacdc33eb082
packages/db-cloud/drizzle/meta/0010_snapshot.json	3d18a0e5349007bf5cdd741c0f742db112075da5a743e014b7539482842cdd2f
packages/db-cloud/drizzle/meta/0011_snapshot.json	e997a937c036eef36efff3708c7f01691a77bca0d7982b987b18a759c71be5b4
packages/db-cloud/drizzle/meta/0012_snapshot.json	78bfbd520781589d5509d1f28ebba3249e28adfb2932756eff33821328e19e7c
packages/db-cloud/drizzle/meta/0013_snapshot.json	b50aaa51aa9bd97c5fa36e3ea5027982cca20b345fa2d74f555bc294778a23d8
packages/db-cloud/drizzle/meta/0014_snapshot.json	2a353328c9b76c27350fa5374b8b4cdfb55e745b453930b40cda2321f4728d00
packages/db-cloud/drizzle/meta/0015_snapshot.json	b4ad465af34ff105074fe72e26260863c10cff38725562ac0242127b8c2ade8f
packages/db-cloud/drizzle/meta/0016_snapshot.json	28e3c65cb32594869a517fe8ac769580c1d46517942e91a25a9285c30f5a5537
packages/db-cloud/drizzle/meta/0017_snapshot.json	617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6
packages/db-cloud/drizzle/meta/0018_snapshot.json	07ede7f42b4f1f744e700d5603b6dbfd69d867aefc86d498295251628035e0ee
packages/db-cloud/drizzle/meta/0019_snapshot.json	3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49
packages/db-cloud/drizzle/meta/0020_snapshot.json	b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8
packages/db-cloud/drizzle/meta/_journal.json	64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997
packages/db-cloud/package.json	41ed11a63bb4ad798acee7fa969459319f9079146723cb062c58d8ebdcda3693
packages/db-cloud/src/access-audit-repository.ts	cc219a274b64f0769e587fd3777043e46ae0f05f1f974e1d3f49c318ab4f7c2c
packages/db-cloud/src/auth-repository.ts	c220660703d60aede32e587de2d1ce5704e4464dcd1dc0db9e0202162a17786d
packages/db-cloud/src/booking-repository.ts	44d8742f2dd4dca29c3ce12a4e93a9fdba3f132d36a2c10226e09209a9559ccd
packages/db-cloud/src/client.ts	1ff38d9fcab239518f5ce3a15273afc8a58a70fb351dd09884e4388629f60a06
packages/db-cloud/src/demo-seed.ts	99c037044bc774390835991a928f30f91a53723befa68290f37d138049dcd4d6
packages/db-cloud/src/env.ts	6ee7f75505758492d9fdab095eee5b2c4cd81a4048530fa2f41ea4c585c705cb
packages/db-cloud/src/establishment-profile-repository.ts	9103495e967f9aa5336705c776510d8ced4dcd74b8d461973f94d16761bd5609
packages/db-cloud/src/formalites-legal-template-domain.ts	985b91cd04b41559185b7462ccfd67b7e738bba0ab6efae951c4ab83c9528ccd
packages/db-cloud/src/formalites-legal-template-repository.ts	4ad3349d11a38ebf5da67787bbe00a3a1500005c07278869306ecd087cd5a6e6
packages/db-cloud/src/formalites-personnel-draft-domain.ts	117d22ae1f3a5ff92a926a615dd6fae75989e61d0f1d9ef88365b4aba09e1043
packages/db-cloud/src/formalites-personnel-draft-repository.ts	d3c371c6e3b22ba4ffa3bccc4cf77f83493ca58bebe8e2a48974ff6b9d054418
packages/db-cloud/src/index.ts	7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0
packages/db-cloud/src/personnel-action-overview-repository.ts	a3c0f691e8a6290ec6d8f57d8e963e1890ab94b78809e6beaacc21aadd4e862b
packages/db-cloud/src/personnel-contract-amendment-repository.ts	56fe9db455eacf3adf2f3e2303ae8f881aa6b0a50a753c77697f812e00da1316
packages/db-cloud/src/personnel-document-repository.ts	016f68c3fa1e6094d5a74e5290110c8344060e378e6bc0f69b453d3c722d9783
packages/db-cloud/src/personnel-history-cutover.ts	68242dd4a1f7dab648be83d0a1ac0257480ea85493dee23160f25127afec928b
packages/db-cloud/src/personnel-history-domain.ts	c68739ed397596493821eb2025c7b3ef73551f28713c288a442d18395aafb156
packages/db-cloud/src/personnel-register-repository.ts	0b83ed93c4c36d91b1d0dda1b6610703898c067d8c63022ebbc3344effa7630a
packages/db-cloud/src/personnel-repository.ts	28cbb0fb44b28bec110c32486ca99d6c64215918d9e8114e2d340b63e2e499c0
packages/db-cloud/src/pointage-repository.ts	4cfcfc4f5287590fde3ff44062a97efe1bd256771774495ae0ce91ab488034d8
packages/db-cloud/src/reputation-repository.ts	1bdbad6e2f9b6d964b83ced0a8f2549805a8d3a57bbe5f9c77ff5d3464d047c2
packages/db-cloud/src/reputation-review-social-links.ts	7c92e70b9635717f8249f5bf7eed447c464f95a64aee31ff8c92793e241921a4
packages/db-cloud/src/restaurant-knowledge-repository.ts	4a0a0e685182325d74296d06fadcbe0152d7b70f4fa9828f82b5bed553d26032
packages/db-cloud/src/schema/auth.ts	c67ddc9c1ff551ff1b0c86489a133b55f80f670818fd786132db1ffcef132bc2
packages/db-cloud/src/schema/booking.ts	19f30ad535cb2175cc7780574071ab151ee318ba4bb7dd5620b794c69fdf74c7
packages/db-cloud/src/schema/formalites-legal-templates.ts	27a235157b543dca2723a6ce27e796939b88f451ba8d927e2c6d2a9a441709ab
packages/db-cloud/src/schema/formalites.ts	bf7be60d7c9957683e84ad990c513e91e023ae1ab8096d8c7e5d50eb8ea694c8
packages/db-cloud/src/schema/index.ts	1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15
packages/db-cloud/src/schema/personnel.ts	a6a5ccc7949bc80cf80d05be13a01e67d7f5d6494663d497294d30c6afed23cf
packages/db-cloud/src/schema/pointage.ts	19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6
packages/db-cloud/src/schema/relations.ts	0c189d866b2cef0129efb5f8b3dbadd8e3d2687a07cb746b7131a14924630126
packages/db-cloud/src/schema/reputation.ts	3a5da535dda36c409092a3f25422c90bdc17bafab8c8cfbfa7f17da52884c02e
packages/db-cloud/src/schema/restaurant-knowledge.ts	cf917ff9349ba2acf42f9d067138091b5c3e79dfe8d063e135cd8787210b28ae
packages/db-cloud/src/schema/tenancy.ts	cca3f0fa4f36c19dcfff2df0cb74baeb3a6dd514ec60aec8e9e6080bf716a656
packages/db-cloud/src/schema/users.ts	a064283055022ccb7ae3f87fb941b3725dc014d38c9d96d472a9428ae4247da6
packages/db-cloud/src/seed.ts	68388d53f1275f34acb8af2d08c3734d382c639dbdd65d37f13eece98cfc470a
packages/db-cloud/src/tenant-adapters.ts	662bc164f5d92865ee7e18ab07eb1068a2aa09f562923d5b68c14786d14169fa
packages/db-cloud/src/tenant-foundation-repository.ts	351adc7424a73fe0cbd550122d0f850c719c06364997a03396af7e1851ad2c25
packages/db-cloud/src/tenant-user-repository.ts	609b2eb9a100cf6091095fb0058bd6e35d4b6e7ceb9e4daa2aabe92b2ac1ebb3
packages/db-cloud/test/access-audit-repository.integration.test.ts	d4d75c0aa8eb5e686eb081086f0c421198613817b03f70f67b96acc97b3bd0cb
packages/db-cloud/test/access-audit-repository.test.ts	dd6779ad1ccf084b6e9ec01a6047f23304538eb105a2d3d0167395dff28bdf43
packages/db-cloud/test/auth-password-reset.integration.test.ts	c1871f76ce010249d19eb3963fc5b1850c73f8bc323f2e751da20ad1858070bf
packages/db-cloud/test/auth-selection.integration.test.ts	abcdbfcb72a7ff06f6d22979cdf6356a5abba0bd4a520be1fd43c86b6bf30f08
packages/db-cloud/test/booking-capacity.integration.test.ts	7953fd286df3607bb74d22f096dce8c220581384f8e3337cb3b116407f15157a
packages/db-cloud/test/booking-reliability.integration.test.ts	13ec4cf60713d5952d3ec2e7b2dc32f3494150347d4fe12470078e096dea6cd3
packages/db-cloud/test/booking-repository.integration.test.ts	dbd33f804c5b75f443f9b5bf89ac26f8993f2a251f409383cd5e16c1b24747ce
packages/db-cloud/test/formalites-legal-template-domain.test.ts	6442d51a9b53e17bcf2ce2dae98dc4057feb1ba77566b6a3638703398c39f8db
packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts	c9bff13ce5ac7d5281028e7b15fbfdd20f9b3398d16e5db5a97443a4557bc912
packages/db-cloud/test/formalites-legal-template-repository.test.ts	5a186b21d57a2175707f4639c32bc9460987e6ba5856fb2289cfa923f51f5c15
packages/db-cloud/test/formalites-personnel-draft-domain.test.ts	6d7c6118b47749363fe72be1ffc2f94418a954558f445443b20717c3419cbafd
packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts	726b6fc077e09cbe679be150f7bdbfdeeccd7ddad48034727f2268b5e11d9861
packages/db-cloud/test/formalites-personnel-draft-schema.integration.test.ts	4ae58e5991069b06f6ef81e8e65df2b554506352147cca2bd0afa54f3992cebc
packages/db-cloud/test/personnel-action-overview-repository.integration.test.ts	19b71b00a3a1dc48ccdceabd6a807244800f4f1b681326484585b8600ec35dce
packages/db-cloud/test/personnel-contract-amendment-repository.integration.test.ts	569ebc48408e946757a5f5a0516335642e2a3acbc7c499bcb25ecb459b196bc1
packages/db-cloud/test/personnel-document-repository.integration.test.ts	5016026342895a835e95be031f27a149052e278507ca4f668556b4767d4b0fbd
packages/db-cloud/test/personnel-history-cutover.integration.test.ts	00e70b83b109b11e106d45e73ac58c11e10c6fbb7b799fcd6b458803eb7c87a8
packages/db-cloud/test/personnel-history-cutover.test.ts	fbd6ff55478922b8239bd216c361f184b12987f6bf3581819a3402267d9dd6f9
packages/db-cloud/test/personnel-history-domain.test.ts	b51dce0a88f8ebb9da51c497d052b48b238d803f81f1f94fdb56a887a18c86cd
packages/db-cloud/test/personnel-register-repository.integration.test.ts	30a636b00dceb64494071dd17de17f8841c3832d0e14a571a1281d446072ec6a
packages/db-cloud/test/personnel-repository.integration.test.ts	cdfa71ef0c39c4ace3015848c3a4168d547a203e005b7bc18bebc97e15c129eb
packages/db-cloud/test/pointage-repository.integration.test.ts	4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1
packages/db-cloud/test/pointage-schema.test.ts	e1026fbfc7adef0773a916ed230d302005c09c711c61503159799f35f5e1b090
packages/db-cloud/test/reputation-repository.integration.test.ts	9b827ad231644f56940d1ef36af67ff6e4d93c4a4b11ce9bf502b6a1e73655e4
packages/db-cloud/test/reputation-review-social-links-inventory.test.ts	1596fef51c8b2b7590ca6439530dc7abd28d0edb0ab0155611fbd7c80fe973ed
packages/db-cloud/test/reputation-review-social-links.integration.test.ts	dea7284075aef73c48d41f9cdd3c46aa6b4cb5525ce0cee559997728c39d7464
packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts	ed28fd59507c8d05fa9cd8c5ca006d0aabe05403f02325ef44e8ef5abe90c05d
packages/db-cloud/test/schema.integration.test.ts	72c097f1007c641527ec31f5c0a4b3055a5a1044d99501cd2a026c1e9163b3e9
packages/db-cloud/test/schema.test.ts	55a4a6e3147216132d036e03968b34243bff34bdf07c5bd515b9572e6c693bc1
packages/db-cloud/test/seed-encoding.test.ts	d57afb64768d38d570fa3128a49868d1494bb557f8cd79dd19db0e014cb0dee6
packages/db-cloud/test/tenant-foundation.integration.test.ts	1b8e0901ed7147222b50b69638dc6946f729659330c90a46b8100fb976b7036a
packages/db-cloud/test/tenant-isolation-helper.test.ts	af515f3d36f3e391e20952a6e2e85c661e7565238be224ac67183283d844f5da
packages/db-cloud/test/tenant-isolation-helper.ts	988b5290a865708d022099ca34f88270afd9c7af2b3763b18ebe05974b656548
packages/db-cloud/test/tenant-user-repository.integration.test.ts	e7784767b6600b9110d72798a7949e29193a19965a3db507908fc3ddad795724
packages/db-cloud/tsconfig.json	27cf6a2a17b53b2a0b31efdeeb04eae024726279408ef30ab30c9d111da20737
packages/db-pos/.env.example	958870cd1e97a89a2690d0eb2ff642f615c1965edd42078dae6b378b2434d3a0
packages/db-pos/AGENTS.md	dc4af3ef38b5000398f094505af29bb37193f30cc026b501af5eff16a7f98ae2
packages/db-pos/drizzle.config.ts	141950720dca9791c9615a3a23a9b9b4724ac60066691c46167bb375e91c8eaf
packages/db-pos/drizzle/0000_initial.sql	7336221b832c4d4adb172816535897a967221842354a65ad447ebf472efdc8b5
packages/db-pos/drizzle/0001_local_auth.sql	b5f4283b4866e4449e7551ec9378d6ba8aacc2303c0390e9263b4ca36dfb0888
packages/db-pos/drizzle/0002_print_settings.sql	67cf05a6666bea0c99b26a04a820d0095ed4415876c046d1622d096e430f77cf
packages/db-pos/drizzle/0003_print_ticket_spacing.sql	e83d2ae1e13aa082897cfe298313c61760f9c13684779d0e241450f67d1010d5
packages/db-pos/drizzle/0004_far_kat_farrell.sql	5b12f2f4fae4c64c9cedb570628acba658c04f4bd98037eb63d7afcb96da6dfe
packages/db-pos/drizzle/0005_child_menu_nem_choice.sql	4580d3cfebd59223ef2e273ac7a80e4d0b04c608ae1631334be8bc6c6677fe80
packages/db-pos/drizzle/0006_exclude_mix_luna_from_formulas.sql	649e367034d434148c654d1fa618c3f6fae1af62773b04605d9ca6b428ddcae4
packages/db-pos/drizzle/0007_local_instruction_settings.sql	e82c02eb8d92aee9d56e613c223d648e6b8ee1f5a1e4ecb6fb48d7e15c80af87
packages/db-pos/drizzle/0008_goofy_dark_beast.sql	6dd8235869c3ae5a94516104e625dceb5a7010b28314ca697326905fd20d2302
packages/db-pos/drizzle/0009_fearless_blonde_phantom.sql	eca0a2253a5bcf2cdb58f5851a9f73d0aed919f85119bd1ea0029ccc0acc9c2e
packages/db-pos/drizzle/0010_chubby_proemial_gods.sql	8ca115cde8fc713518e7cf19e713006a2e062efb6956a08600ac2e693b9f1d9d
packages/db-pos/drizzle/0011_clever_groot.sql	603b435b70933772aee5b9b4c36c5e51ecb740996ac3478f86662a5c027affb3
packages/db-pos/drizzle/meta/0000_snapshot.json	fab0469ccef07393ac933136b5a8b79e9150dfd28575a895639788253b1c78f0
packages/db-pos/drizzle/meta/0001_snapshot.json	afa5d1997e4b73cf22646a32bff74943772820b656f3ce1c07f04d1290d13544
packages/db-pos/drizzle/meta/0002_snapshot.json	e0e2d6d24a31f1241857378177de0bedb379e69102114e2bf80bd23b343ddbf7
packages/db-pos/drizzle/meta/0003_snapshot.json	5b8e299967b1e31a972ac421d8dfa9fa5d2ef04dae9e4a32a3acfdd5f3fff30c
packages/db-pos/drizzle/meta/0004_snapshot.json	85d09c2bd7c524153fed44d24324702e37885e05581f7e8e2fac64f1e76a453a
packages/db-pos/drizzle/meta/0005_snapshot.json	5dce87aa6dae9a0872e17316618383736b9a8dc8b6a153130175ecd338bfd076
packages/db-pos/drizzle/meta/0006_snapshot.json	88fa58f223992ea6d1c9a7aecf8776c912605a3ff187fcd6525e38d36a1ad4f8
packages/db-pos/drizzle/meta/0007_snapshot.json	613b60ad45d1f799b67b2a208e8e4dcfcc4771023073a5ea05c2b29c9b18e756
packages/db-pos/drizzle/meta/0008_snapshot.json	8c046cecf15d8658c5c56026e32e68b346a7c4a2ded4438e2dadd205a667b424
packages/db-pos/drizzle/meta/0009_snapshot.json	57d5e61a2f2ce648505b4a193afb081d47d0f7cdd50e35cfeb38d0c78cece142
packages/db-pos/drizzle/meta/0010_snapshot.json	87309581f3f640ef2564156b0b426ec6af4e57311e0a7a79807e45435a03fcf9
packages/db-pos/drizzle/meta/0011_snapshot.json	04d0f97e814cc160d0a2bf18581c49c5e0ee9db6d80287e7d992235f6e9fe1c6
packages/db-pos/drizzle/meta/_journal.json	f718caff7909e3116626e1525b4b5af0bc6caf0df28f6ffaadb6cdf349fea1a9
packages/db-pos/package.json	75c660481430d448bdbf7c2827cc94344a8b125916aaa6e43cb1b23c818a0bbc
packages/db-pos/src/client.ts	ac43dd0b7ad0431ff594b8656c0c89f15b2bc96a96faf30f4be1a1bd6c389d7a
packages/db-pos/src/env.ts	9f94f69e5e4d2cefe9e013d389693ec1d3531c862fec86d38e832c86aa171cf5
packages/db-pos/src/index.ts	a4a296ee2cf6288f2d0bb0fb29681bf83ab0174ec5a2c6c5bad2a926e54a3bb7
packages/db-pos/src/local-auth-crypto.ts	bd8376c528c584a7fb9e1b735f9cac95f6f86dc2faea7d2b71369f737c856db5
packages/db-pos/src/luna-instruction-seed-data.ts	18317bb0f3c8d307b0db8e6131b34327a1186726d348e7d2e1f34749a420dc65
packages/db-pos/src/luna-seed-data.ts	4ae077aa937e5c057880e1cc93c46c1f8f95175c532e87d90e4f265e819e0384
packages/db-pos/src/schema/auth.ts	c868485aae5a61629e7105c55a1039631c81963b929d34bee576fd6de3073659
packages/db-pos/src/schema/catalog.ts	3a55275c0a416096a600bd835faac70db9d714e8414ebd9f9ad5cdc650d58e59
packages/db-pos/src/schema/combos.ts	bc404b6642b96e1b14288306a3fef41afe87486207f3e6a0ae36cba6ffa20a5d
packages/db-pos/src/schema/enums.ts	b384072fbf2f0eef69baeec3f7f9044955783798f07081783a3f8463d79dbe5d
packages/db-pos/src/schema/establishment.ts	30a244a17d8d3126cf3202419f876df9ed86d27894ba5d5c49fad2450cc07cf4
packages/db-pos/src/schema/index.ts	7ca785616579897a886132d986383507784b46ab25bbf3a2009e67aaf76a7ebd
packages/db-pos/src/schema/orders.ts	7c120df50f4addb9e96277b12f9d5fda12116249ee979514635b00778821740b
packages/db-pos/src/schema/payments.ts	02a6485dabe96161583c5a1ec8769bbedfd73750a20d30fc87b08de3bfaa035c
packages/db-pos/src/schema/printing.ts	8826d090a966539b60c2014fa3c456f15c70ecfd567cfdb884199b8bb2ee88bf
packages/db-pos/src/schema/users.ts	acc7cc0c89c73cdb70aa8a736b635d5d0ab59756b7e3741cc9d4d1d5282c2460
packages/db-pos/src/seed.ts	76c7d72b7b7d6c37bb9fa789a9d07fb2793ed926d16111bc29bd45524cb4be54
packages/db-pos/test/local-auth-crypto.test.ts	552b45460212a6c1fcf2cb4e3c34bc68b4c042f46e6821451093e88c7620ca71
packages/db-pos/test/luna-seed-data.test.ts	9c54735bcc636087acb8a50210566f4a6f655d50f36ee16e59d0feb7331b45bb
packages/db-pos/test/schema.integration.test.ts	dcb83aa3d26969e4b68e8b03021a0bf1496e9011bf4ea153c33e4c107bd1beca
packages/db-pos/test/schema.test.ts	fb09293c6910394788090668ecae29fc97cf83fb27cabd29b494ec8d0ea8f503
packages/db-pos/tsconfig.json	27cf6a2a17b53b2a0b31efdeeb04eae024726279408ef30ab30c9d111da20737
packages/tenant/AGENTS.md	56901da6379759a67ef6a8f706389f750f89a4064a60e8042721eefb2095b008
packages/tenant/README.md	5df2df87816a029ea6e853e400b399a4081556e460b0cf019d43e9f28778bcf2
packages/tenant/package.json	aa663297447a7e6c7f88bea918826058a12a76e4a63dbab1ffdcc041dddec21c
packages/tenant/src/foundation.ts	f7024a7fa5e42d04b18fa76d94f7f6af0fee0d4cb28242db68af1828e29ca8ef
packages/tenant/src/index.ts	5ad7c716281c9e499767bb0d897f18a598a09a65475a968b8db53cd183b39851
packages/tenant/test/foundation.test.ts	bf81a1ce2ba4c525cc349c0dbd2906eb2ee0a818c17f04bad61d4f8920f8c1c4
packages/tenant/test/tenant.test.ts	de9ad0b29d7acd7197ca686d19aa469cfaf7d4a4194113291470d2d52e079310
packages/tenant/tsconfig.json	a593119c3ad401910e2c70ea0dd5ba2ce90b3ee59cb49b2d8bc51b446328cc8f
packages/ui/AGENTS.md	b239d0dd19028ba1377b0f573a7510c63a224279d28ee141b3cffdb2d3240e2e
packages/ui/package.json	3ae136a14ac79d142de9061bb9a409db3507d96ae89089cbaa765e8fbfa976b2
packages/ui/src/action-panel.tsx	23b0f1eba74cf5017baf5928cb83e501d3851c49fd4a9b635764d165fb551db9
packages/ui/src/alert.tsx	2efbd7d6ab13639cbe1ee2322ea4a2999fd69eb827b47edf0a5a683d3e208fec
packages/ui/src/app-shell.tsx	460499fbbe2223a735c5d99770c82fd804367bcd0d341df6e8597cf714132a7e
packages/ui/src/assets/yuta-logo.svg	c4137f0c11dccba6efd26e6622ada66c78fb88692c3e2e35465168e12059312e
packages/ui/src/avatar.tsx	89a026e48da52c141cf94338adb5cb4bef33d391f0a0f0159c68b7c3f57824d3
packages/ui/src/badge.tsx	236aca52ce5ad6ddc636fe762b41bc922921991e9ceeb451ac04391174b8e255
packages/ui/src/bulk-action-bar.tsx	e3dc2848239b87355d552869ad3da9f200762ab4be7eef9b44dc3b175c9a2f9d
packages/ui/src/button.tsx	dc47524730777c84bac11b00f18bacc1ebc084c5df21583df5e56d85f8879fb9
packages/ui/src/card.tsx	459f18c7e6d05ec71d03e89400dd730358150f2ac14ef80da1088a8c53afefa8
packages/ui/src/checkbox.tsx	53d00858f6e4513b3d6288065d6ec4624b72644ae56723b7820183c4ca57f001
packages/ui/src/confirm-dialog.tsx	001d9b3ca4195a8cccb83e00c2d001aa935858731a25e4913ffc6a7495831a3f
packages/ui/src/data-table.tsx	24afe1541ad605a77d52fcf702cdb0456e9dafc93f9d5cb47a3d6bd40d8539ba
packages/ui/src/dialog.tsx	82c6b3286f432e60c9c76ff00cb8afd9cf93d659896e6369fdc75662f7d5832c
packages/ui/src/dropdown-menu.tsx	483035a187e4879358a4d4c79169ce472c7bc9c0c5644596d29b5aaf0c84613f
packages/ui/src/empty-state.tsx	d01ea0ef51039ac5206e6fe4f01d9dc55f8696f8f0e90f4b372e0e5906374107
packages/ui/src/error-state.tsx	51b95d986817f4b579ae759d7ad3e0389d702baebfc3adb4ddde1b22bab64991
packages/ui/src/filter-bar.tsx	1ac208740dfc3a28ee923ef7d510030475eb95c0d55e9e838628010c81cea07b
packages/ui/src/form-field.tsx	b9f22c81509c941d2415ff82f9fdab3841b2daf04022cec0c427d55af5321a47
packages/ui/src/icon-button.tsx	b7fc006e5ff21a339ffbcfae9b7bc89c765eca04e65367cc8b5f859558e942a1
packages/ui/src/icon-tile.tsx	58880253ac4547f8a3347e49784344ca53062d2d2a2ca0b779d2d9d740fe035a
packages/ui/src/index.ts	ba8a9a3f0b41736294396036dd9fbca4684e3dc7f1123fe10d93245c36ee8f6d
packages/ui/src/input.tsx	66f65f4e30711119d2f92dd38ed0b5b19df056387ceea977c410d0147f99b913
packages/ui/src/kitchen-ticket.tsx	3ca3bbed988abd903dba07edf64b2ce83695967f3e14282615718f87378d3dc7
packages/ui/src/label.tsx	ef5bbeff7ab32659c2bb533340719d25e8783e2b42eb41c9943a7e2732badeac
packages/ui/src/list-row.tsx	e1626f0cccdd833ec7736e8ed1e944da5e7bd0f2881a822448b6e99495a21a71
packages/ui/src/loading-overlay.tsx	aea8f8f590f397c2eddf95ac53c05555bfdc1a65c03c92249a99a1beee9800ea
packages/ui/src/metric-card.tsx	f963f03f9b27da3c720781e270c83536667532812c364cd7b8f27ca613a4c231
packages/ui/src/order-card.tsx	95f1a3ebf368a4b3ff748ccdb59ec1c7c4a07e0b7d5d252596f12ca02c8d3d9b
packages/ui/src/page-header.tsx	e45a8a9b1a3201e25bd9554c5d96944ed1dc7edee5a5c1b1a0c8fbb24bf5a883
packages/ui/src/pagination.tsx	0da47d8d2dbfe8c394b5967d796517b03f63f94a4063ecfe4c15cdcad2a726e2
packages/ui/src/panel.tsx	188b003f53b28ff0dfc28d47fed05848103e7cb1fd152e78c9041c9f509d40da
packages/ui/src/popover.tsx	9ddf7b5f10f8e8028515395431e544e25e7a2b039b57505105b9cedf2c4288b5
packages/ui/src/progress.tsx	542e7bae0152cb7bad26df34376f0345d87f4f15abf86a2c2f8b64963e0b445b
packages/ui/src/radio-group.tsx	ec67e3a85a7aeacb2df3ae45390c1b3c9a5a98acf4eb1d491e2b399dfcf9c04c
packages/ui/src/segmented-nav.tsx	32656650bbbbc8defd167b8a891706bee04c65fb887a576fb154b9b13dfac1b5
packages/ui/src/select.tsx	f9a6692325c8edc605b596e57a8a0212d498ec9670f05ddaf2581115f06ef1f7
packages/ui/src/separator.tsx	6165de8ad3b5201106cdb984fa79430f1afd6180885df9600cca1c0881553120
packages/ui/src/simple-table.tsx	00cfe2c611b19c112c391a385b3dcb5d10629e82890db1901ecb554aaa090375
packages/ui/src/skeleton.tsx	cf4ba09ded4b1a57ff23aa2f7f6b96b288c6d4579783077af1f5fb377865e778
packages/ui/src/sonner.tsx	9229bc4493f73693a8a0d1b7253c704927d3d099b15667a58f0acd13acb1f664
packages/ui/src/stat-card.tsx	91cd4c689b3753887baff30636e3fe929a9abefdc3934f67a8b703c43d134a1f
packages/ui/src/status-badge.tsx	d8367644fbd735288b3a02a435ab45aaafeb619c3127286f2072c53b52e4fa19
packages/ui/src/styles/global.css	78a58bbb56c56aa17b442e677cfad61bf380f0df768ff748f78030b4d1ac9b81
packages/ui/src/styles/tokens.scss	877b344856e1833658ff8706659d4c7bb69e85d79e28642710944f996f696134
packages/ui/src/switch.tsx	73b195dbb56bdd2c1c6066a6c6b8fc19a84cf2f3530cdf9cde11dfb87743ee3b
packages/ui/src/table-card.tsx	78c5a2e4d6b66be1080b274a36e5bf796f7602c064230b0bc3c1047888f81bfc
packages/ui/src/tabs.tsx	7e1ac1c129195a6f70acdfe7281d30a608cc108dda4173ab6bc852daebfb11ca
packages/ui/src/textarea.tsx	411d7f3335b72a4180489c600f396447b053d59ba61c389baf1f46da70071864
packages/ui/src/tooltip.tsx	c888132efb98947d64dc420ef6caba58a37a941a7fb491262b5f30676a994df3
packages/ui/src/utils.ts	9304a861c8673bee09e0f12de31773abbde503b02e59dfd74763ddec2e37cf05
packages/ui/src/yuta-brand.tsx	007a4aad19edf5223aaab85c1829353fc13a6c0d5f311c2dc976e4ee72b4ac2d
packages/ui/test/button.test.tsx	ac71a029743bd944c67cef49398f76696beecca94d546c4297b66ed2c8be68f4
pnpm-lock.yaml	1ccc65b174137c8e4a15aa655f4c32e7e4fa736d55982ec7f41c3c85db733275
pnpm-workspace.yaml	216f05878a23275868f217a7b1233b754f7773360e2f7bbab12625e6bd139c85
scripts/check-documentation-consistency.mjs	0daf0325143ce5c2cb8fcf7c201e08cf6a8728fb50b23d2ee1f4b72798eebb51
scripts/check-import-boundaries.mjs	8212275d658475d06bf171f0c6b3897f69857e51b0b2bf60c36752f01041e995
scripts/check-ui-pack.mjs	205c8184a8af54d39a5c16aae98334f76f47ad893621daff70cc1a03d24f5397
scripts/create-ui-pack.mjs	8372288d44752c6d74da51603d49ac0216bc32ec037f18eff7d851c42aa2e4ff
scripts/generate-next-types.mjs	f4c4f981923b851ae7598301d607e8f0b5917ba5269f7bce30bdcfd9b110df78
scripts/next-generated-types-bootstrap.test.mjs	3de15afdbcea8b0cdb8c3ed025290bbbe484c1d2085d9752eedf91523ac8e615
scripts/reset-dev-databases.mjs	577e0c00f0d2fa9521ec928610a45d1e21632d058aa914949ddeb4e097886d9c
scripts/sync-dev-env.mjs	fde2ee6cb4d0ed05c0770e476fef5b35e22afc40f4af32fcb4e438243e4b3eef
scripts/test-pos-offline.mjs	ef08133a64c67a5dae5c5a4b5845a2f95286d9397af77b7678d993c522fd8764
scripts/test-receipt-preview.mjs	9f631cc9ad820bb3b4845ab7f45432ccd141b4d976bba73f41d9a2f005a0a321
scripts/ui-pack-tooling.mjs	efa2f22d5d4cf00fa382421f3431fa1718fe21caa4a73bacb9bb61a343227651
scripts/ui-pack-tooling.test.mjs	304535aae0ded3cd8a1da8832d88aed699d7140d2594b87a2f4b6836428a29f3
```

### Exact baseline Git status

```text
 M apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx
 M apps/backoffice/src/components/backoffice/backoffice-frame.tsx
 M docs/CURRENT_STATE.md
 M docs/MODULE_REGISTRY.md
 M docs/PRODUCT_KNOWLEDGE.md
 M docs/architecture/AUTHENTICATION.md
 M docs/architecture/IDENTITY_AND_MEMBERSHIP.md
 M docs/architecture/OVERVIEW.md
 M docs/features/identity-access/README.md
 M docs/features/personnel/README.md
 M packages/auth/src/index.ts
 M packages/auth/src/session.ts
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/index.ts
 M packages/db-cloud/src/schema/index.ts
 M packages/ui/package.json
 M packages/ui/src/button.tsx
 M pnpm-lock.yaml
?? apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx
?? apps/backoffice/src/components/backoffice/logout-submit-button.tsx
?? apps/backoffice/src/server/pointage/
?? apps/backoffice/test/general-information-form.test.tsx
?? apps/backoffice/test/google-location-submit-button.test.tsx
?? apps/backoffice/test/logout-submit-button.test.tsx
?? apps/backoffice/test/pointage-foundation-inventory.test.ts
?? apps/backoffice/test/pointage-foundation.test.ts
?? docs/reviews/async-interaction-feedback-foundation/
?? docs/reviews/formalites-legal-template-foundation/
?? docs/reviews/formalites-template-legal-review-governance/
?? docs/reviews/platform-admin-formalites-template-authority-foundation/
?? docs/reviews/pointage-authority-and-access-foundation/
?? docs/reviews/pointage-usable-raw-clocking/
?? docs/ui/pages/backoffice-pointage-employee/
?? openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/
?? openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/
?? openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/
?? openspec/changes/async-interaction-feedback-foundation/
?? openspec/changes/formalites-legal-template-foundation/
?? openspec/changes/pointage-usable-raw-clocking/
?? openspec/specs/authorization/platform-admin-formalites-template-administration/
?? openspec/specs/authorization/pointage/
?? openspec/specs/formalites/template-legal-review-governance/
?? openspec/specs/pointage/
?? packages/auth/src/formalites-template-system-authorization.ts
?? packages/auth/src/pointage-credential.ts
?? packages/auth/test/formalites-template-system-authorization.test.ts
?? packages/auth/test/pointage-credential.test.ts
?? packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql
?? packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql
?? packages/db-cloud/drizzle/meta/0019_snapshot.json
?? packages/db-cloud/drizzle/meta/0020_snapshot.json
?? packages/db-cloud/src/formalites-legal-template-domain.ts
?? packages/db-cloud/src/formalites-legal-template-repository.ts
?? packages/db-cloud/src/pointage-repository.ts
?? packages/db-cloud/src/schema/formalites-legal-templates.ts
?? packages/db-cloud/src/schema/pointage.ts
?? packages/db-cloud/test/formalites-legal-template-domain.test.ts
?? packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts
?? packages/db-cloud/test/formalites-legal-template-repository.test.ts
?? packages/db-cloud/test/pointage-repository.integration.test.ts
?? packages/db-cloud/test/pointage-schema.test.ts
?? packages/ui/test/
```

## Current approval and pre-Apply stop

Approval binds the prior exact packet SHA-256
`9ba2b59a1d0075155570b72965b1107dc992a21e5c198fe466a0807d222a036a`,
Tasks `8cb14531f9c230f025e460ea7f0a8b2208cee4904c789a353e12718240c6f1db`,
UI Implementation Plan
`b7dfc8937893032253f801160c1e9fa21e2c8cd34439c0b80e9eb38e7ef5606e`,
and Design `be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9`.
All four hashes,25 packet artifact hashes,11 exact snapshots and six prompt
copies matched before this approval metadata update. Planning approval is
valid; the implementation baseline is separately blocked, not silently rebased.
Historical review requests and NOT_GRANTED wording below remain the exact
previous planning evidence; this current-user approval supersedes that status
only, not any technical, Product, legal/privacy or production boundary.

Fresh preflight at the approval timestamp, HEAD
`defbc50eba3952fa2e7b1c016637daf083b18c65`, found these intended existing paths
different from the planning-time byte baseline:

| Path                                          | Planning baseline SHA-256                                        | Observed preflight SHA-256                                       |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/db-cloud/src/index.ts                | 78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1 | 7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0 |
| packages/db-cloud/src/schema/index.ts         | 934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264 | 1f71e967a4bd17d07c4fb09c777a979ce4b9646dbdc1d8c79d15815001d5ee15 |
| packages/db-cloud/drizzle/meta/\_journal.json | 855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665 | 64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997 |

Baseline hashes were captured during this task's read-only planning inventory;
the final guard-correction inventory proved all original outside bytes unchanged.
Current Git diff shows added Formalites repository/domain/schema exports and
journal entry0020_formalites_legal_template_foundation. Its SQL/snapshot/schema
and implementation files are present as unrelated untracked work. They were
not generated or edited by this Pointage attempt. HEAD diff also includes the
pre-existing Pointage foundation; it is not an attributed raw-clocking diff.

The protected packages/auth/src/index.ts remains exactly
`b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634`;
its unrelated Formalites hunk is untouched. No attempt to remove, move,
normalize, absorb or overwrite any concurrent work was made.

Current user explicitly requires STOP if an intended path has drifted.
That condition was met before implementation. Do not infer permission to
accept a new journal/schema/export baseline merely because the drift appears
additive. Require explicit human direction for a coordinated fresh baseline
or an authorized isolated checkout, then repeat the complete pre-Apply review.
No remaining technical owner/security constraint is waived by that choice.

Read-only checks executed: git status --short; git rev-parse HEAD;
openspec status --change pointage-usable-raw-clocking --json;
openspec instructions apply --change pointage-usable-raw-clocking --json;
exact Get-FileHash SHA-256 checks and packet snapshot/provenance comparison;
git diff -- packages/db-cloud/src/index.ts packages/db-cloud/src/schema/index.ts
packages/db-cloud/drizzle/meta/\_journal.json.
CLI schema yuta-spec-driven, state ready,0 complete/32 remaining does not
override the operational STOP. No implementation phase was started.

APPLY: BLOCKED

Tasks: 0/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Implementation path set: empty. Implementation diff: empty; no Pointage
migration generated, no SQL/snapshot/journal changed by this attempt.
Empty implementation-diff SHA-256:
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
Disposable DB/runtime-writer evidence: NOT_RUN. Focused/broader implementation
tests/builds: NOT_RUN due preflight STOP. The20/62 mapping remains planned,
not implemented. No database/provider/fixture/attendance operation or Browser
QA occurred. Only this approval/preflight metadata was recorded.
All seven blockers and synthetic/disposable-only authority remain unchanged;
real attendance and production enablement remain NOT_AUTHORIZED.
No formal VERIFY, QA, Gate3, sync/archive, deploy or lifecycle promotion.

Administrative checks after recording this stop: pnpm docs:check (exit0),
pnpm architecture:check (exit0), pnpm -r --if-present typecheck (exit0),
and pnpm exec prettier --check
docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md
(exit0). Packet integrity:25 hashes/11 snapshots/six prompt copies MATCH;
removing only new approval/preflight metadata reconstructs the exact approved
packet hash. These checks do not complete an Apply task or formal VERIFY.

# Tasks / Implementation Plan Review

Status: AWAITING_HUMAN_REVIEW

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

## Bounded guard correction — current review revision

Current-user decision: CHANGES_REQUIRED, planning only. The previous packet
was marked CHANGES_REQUESTED before editing; this regenerated packet stops
again at AWAITING_HUMAN_REVIEW. No Product, Spec or Sensitive Design change.
Previous packet SHA-256:
`22e8a70b61d9a209bd3d5f6a485d8d2a8c46bd14e9fff9c12eb53d4a5b827238`.

Using change: pointage-usable-raw-clocking. The named yuta-run-change skill
preserved the review stop; openspec-update-change was used for this expressly
authorized revision of existing planning artifacts only. No Apply.
Before writes: current packet hash,25 artifact hashes,11 snapshots and six
canonical prompt copies matched; no unexplained planning-path/hash drift.
Earlier approved Proposal/Analysis/Specs/Design/UI sources remain intact,
including the previously authorized historical README metadata exception.

Only three existing files change in this revision:

- openspec/changes/pointage-usable-raw-clocking/tasks.md;
- docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md;
- this02c-implementation-plan-review.md.

No new file is created. Tasks changes are limited to the F6 guard row,
code-span protection of the environment-variable literal in command
prerequisites, and strictly necessary alignment of that F-table. UI plan
changes are limited to its QA disposable-guard paragraph. No other Tasks or
UI-plan text changes: exact expected-output comparison passed after those
bounded substitutions/alignment. The32 checkbox lines and complete20/62
traceability section are byte-identical. F1-F8, S1-S9, U1-U8, R1-R7 IDs,
four phases, allowlists, authorization, continuation, atomic raw/receipt,
time/concurrency/replay, manager/employee scope, shared-device behavior,
post-Apply VERIFY/QA/Gate3 boundaries and all non-scope remain unchanged.

Exact approved Design D1 guard carried into both plans:

- `NODE_ENV` is development/test, with the remaining approved D1 flags,
  VERCEL absence, loopback binding and configured test-origin requirements.
- Case-sensitive whole-string database-name rule:
  `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`.
  The complete name must be consumed; no substring/glob/multiline or
  final-newline exception and no normalization.
- Exact URL hostname allowlist: `localhost`, `127.0.0.1`, `[::1]`.
- URL validation precedes the identity probe.
  `SELECT current_database()` equals the parsed name exactly; the actual
  name independently passes the same exact whole-string rule.
- No provider instantiation, fixture, migration or attendance write before
  all guards pass. Reject `yuta_cloud`, staging/production, non-loopback,
  malformed/prefix/suffix/whitespace/newline/encoded aliases,
  query/fragment overrides, mismatched names and failed/missing probe.
- Integration and Browser QA must not bypass or weaken these guards.

Literal environment names and regex are protected as inline code so Markdown
formatting cannot reinterpret underscores as emphasis. Every disposable-rule
occurrence is compared character-for-character with unchanged Design D1,
including the regenerated exact snapshots. The prohibited malformed variants
are absent; no invalid preimage is reintroduced in a historical diff.
Before hashes are retained as evidence instead:
Tasks `20907c524c003b265f5867be805e283f0c23e5873353aca7cf4c171b195e4cb0`;
UI plan `1df6120c3d061a7445bdc5b4badaa57918ed0936437719b96ad60676c1066f56`.
Current exact output hashes appear in the artifact table below.

Fresh revision baseline:2026-09-08T09:27:58.9886497+02:00;
HEAD defbc50eba3952fa2e7b1c016637daf083b18c65. All2517 out-of-scope files
remain byte-identical, aggregate SHA-256
b0b078ac27dec16d363fe22adf684c9b6779523016201aea47da77e58bce64c7.
All scoped files except these three also remain byte-identical. This includes
approved Design, Specs, UI README, five reviewed UI documents, no-image
metadata, sealed prompts/provenance and prior gates. No code, migration,
normative main Spec, archive or unrelated dirty hunk changed.

Checks rerun for this revision: strict OpenSpec, docs:check,
architecture:check, workspace typecheck and UI pack passed; scoped formatting
is check-only, including this packet after regeneration. Full format:check
still exits1 with the same exact67 unrelated warning paths; none modified.
Exact commands/results below are retained and re-evaluated, not inherited PASS.
No database, migration, attendance operation, implementation test suite,
build or Browser QA was run for this planning-only correction.
Runtime test guards described here were inspected as planning literals, not
claimed to be implemented/tested runtime code.

Apply authorization: NOT_GRANTED.
Real employee attendance: NOT_AUTHORIZED in development, staging and production.
Production enablement: NOT_AUTHORIZED.
Synthetic/disposable attendance only; all seven legal/privacy/provenance
blockers remain unresolved. Next step is human review of this exact revised
planning set, not Apply.

## Request and workflow placement

Earlier user instructions approved the exact Sensitive Design/UI set and authorized only
Tasks, Implementation Plan, embedded Technical Implementation Contracts and
completion of the stable UI pack. Subsequent explicit user permission:
"Cho phép cập nhật metadata/liên kết README". No code, migration, database
operation or Browser QA was authorized or performed.

This packet is the explicitly requested planning-review stop. The current
YUTA workflow lists no dedicated Tasks review filename; this bounded
02c-implementation-plan-review.md is review evidence for the user-required
stop, not a new OpenSpec artifact, a workflow-policy change or Gate3.
No 03-final-review.md or qa/ evidence has been created.
The named yuta-run-change skill kept approval/gate boundaries and required
hash checks; openspec-continue-change supplied the actual Tasks dependency,
language/template and output path. No generated skill/schema/config was edited.

RAW OPENSPEC STATUS: schema yuta-spec-driven; all five planning artifacts done;
isPlanningComplete=true and CLI isComplete=true describe artifact completion,
not implemented work, Apply permission, formal VERIFY or QA.
YUTA OPERATIONAL READINESS: planning ready for human review; 0/32 Apply tasks
complete; Apply authorization NOT_GRANTED.

## Approval and exact preservation

Approval-bound Sensitive packet before metadata:
1c85afad05da8d238fd73ba64d737bcf0d8598aa2b4b8fa12a4096f90fababf9.
All14 inherited/reviewed hashes and embedded snapshots matched before writes.
The approval update changes only top-level review metadata. Removing that
metadata and restoring its former top status reconstructs exactly the original
packet hash above. No historical snapshot/body was rewritten.

Design remains be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9.
Proposal/Analysis, both delta Specs and earlier Gate1/Gate2 packets unchanged.
The two exact capabilities remain pointage/raw-clocking (13 requirements /
41 scenarios) and authorization/pointage (7 /21), total20/62.

Five existing UI files are byte-identical: PRODUCT_SCOPE, UI_SPEC,
DATA_AND_INTERACTION_SPEC, DESIGN_HANDOFF, ACCEPTANCE_CHECKLIST.
Their historical DRAFT/no-Tasks/not-yet-approved wording and unchecked planning
boxes are deliberately retained under user's lock. Current README metadata and
this packet record the new approval; no stale historical text is used to infer
Product changes or deny the user's current planning instruction.
README original hash:
449f78b735ddb91988af48efb443401c33e518319c7fc8c8d78f0db5d59e9d2d.
Only authorized metadata, impact flags and completion/approval links changed;
the exact diff is below. Current hash is in the table. This named exception
must be carried forward at resume; it does not authorize any other drift.

## Selected phases, contracts and completion criteria

| Apply phase                | Tasks            | Embedded contract rows | Why required                                                                                                                                       |
| -------------------------- | ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Foundation / Data        | 1.1-1.8, 8 tasks | F1-F8                  | Portable continuation/stateGuard, three additive tables, constraints/triggers, migration and actual disposable runtime-writer proof.               |
| 2 Service / Domain         | 2.1-2.9, 9 tasks | S1-S9                  | Derived state, authoritative time, dual identify, continuation, atomic commands/replay, scoped manager server read and provider/audit integration. |
| 3 Employee Transport / UI  | 3.1-3.8, 8 tasks | U1-U8                  | First employee route and exact bounded HTTP DTOs, cache/CSP, approved French states and shared-device recovery.                                    |
| 4 Integration / Regression | 4.1-4.7, 7 tasks | R1-R7                  | Full20/62 test mapping, concurrency, isolation, DB/time/privilege proof and integration completion checks.                                         |

Total32 tasks, all unchecked;32 technical contract rows. UI phase labels follow
the explicit user request, not extra template phases. UI prompts00-05 are
mapped checkpoints; their human stops remain applicable, and05 belongs to QA,
not Apply. Each master task has an observable test/evidence criterion.
All20 requirement headings and62 scenario headings are mapped exactly to
planned task IDs, Design sections and code/test paths; automated enumeration
finds no missing/extra heading. Assertions must implement source WHEN/THEN/AND,
not merely quote headings.

The complete master Tasks and page Implementation Plan are embedded below.
They define exact expected file ownership/allowlists, dependencies, stop/
rollback boundaries and commands. Future generated migration SQL/snapshot name
must be resolved from current journal after Apply approval, not fabricated now.

## Critical Design proofs preserved

- Dual identify/state.read guards with current scope/Personnel/version checks,
  chain validation/derive and same-transaction continuation commit before
  combined token/state output; no partial identify-only authority.
- Same dossier lock order coordinates employee mutation with reset/lifecycle/end;
  same-ID intent replay and distinct IN/OUT contention; stale OUT A cannot close B.
- Raw events sole canonical evidence; derived sessions only. Immutable raw and
  receipt pair; orphan raw-only or receipt-only COMMIT rejected via mutual
  scoped deferred constraints; no new attendance source in metadata.
- Continuation immutable scope/dossier/digest/credential/version/issue/absolute
  fields; only capped monotonic idle/one-way end; actual restricted writer and
  effective-grant proof, no owner fallback or production-role claim.
- Full-string disposable name and loopback checks, parsed name equal to
  SELECT current_database(), actual-name revalidation before provider/write.
  Browser QA cannot bypass any test-environment or runtime-writer gate.
- Microsecond server clock, equal-time ordinal, backward clock/corrupt-chain
  denial, DST/timezone history, midnight grouping and denied post-departure OUT.
- Strict origin/header/DTO/cache/CSP boundaries, no serialized trusted context,
  memory-only identity/token/tuple, end/generation/bfcache/late-response isolation.
- Existing six operations, OWNER/MANAGER exact grants and STAFF denial;
  no manager UI, crypto redesign, standalone credential revoke/suspend or
  upcoming-issuance rule. Missing/untrusted provider fails before credential
  processing; both distributed limiter dimensions retained.

## UI pack completion and provenance

Stable home: docs/ui/pages/backoffice-pointage-employee/, no new/v2/final folder.
Package status implementation-ready denotes complete planning inputs only.
No implementation, formal VERIFY, Browser QA or production readiness is claimed.

No-image is now explicitly approved from the reviewed written direction.
references/README.md records NONE/NONE, human decision/date/source and no image/
screenshot/mockup claims. No image was generated.
The existing generator rejects an existing destination and has no merge mode;
it was not run. Missing six prompts were copied byte-exact from current
docs/ui/templates/page/prompts/, with prompt-template-v1, actual source/copy
SHA-256s, localModificationState NONE, provenanceStatus PROVEN, and current
HEAD generation commit. Source content and snapshots match exactly.
No validator/template/prompt rules were edited to make the pack pass.

Initial pack check after completion exposed seven README impact-metadata
findings; corrected only authorized metadata fields/links. Final result:
UI page-pack validation passed (1 package(s), 0 warning(s)).
Initial scoped format diagnostic named only new Tasks and Implementation Plan;
their draft text was formatted via stdout and applied as a patch. No formatter
write touched any existing reviewed UI document; five locked files unchanged.

## Validation commands and observed results

These are planning validation results only. They are not post-Apply technical
compliance, VERIFY or QA evidence.

| Command                                                                                   | Exit/result                                                                                                           |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| openspec validate pointage-usable-raw-clocking --strict                                   | 0 — Change 'pointage-usable-raw-clocking' is valid.                                                                   |
| openspec status --change pointage-usable-raw-clocking --json                              | 0 — yuta-spec-driven; Tasks exists; planning artifacts done.                                                          |
| pnpm docs:check                                                                           | 0 — Documentation consistency check passed (36 current documents).                                                    |
| pnpm architecture:check                                                                   | 0 — runtime imports, database URLs, client boundaries and migration baselines valid.                                  |
| pnpm -r --if-present typecheck                                                            | 0 — Scope15 of16 workspace projects; all participating typechecks completed.                                          |
| pnpm ui:pack:check backoffice-pointage-employee                                           | 0 — 1 package,0 warnings.                                                                                             |
| Scoped Prettier command below                                                             | 0 — All matched files use Prettier code style.                                                                        |
| pnpm exec prettier --check docs/reviews/pointage-usable-raw-clocking/02b-design-review.md | 0 — All matched files use Prettier code style.                                                                        |
| pnpm format:check                                                                         | 1 —67 pre-existing out-of-scope files; no cleanup performed.                                                          |
| Requirement/scenario/task enumeration and snapshot/hash checks                            | 20 requirements,62 scenarios,32 unchecked tasks; exact heading map complete; protected bytes/six prompt copies match. |

Exact scoped planning formatting command:

```text
pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/tasks.md docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md docs/ui/pages/backoffice-pointage-employee/README.md docs/ui/pages/backoffice-pointage-employee/references/README.md docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json "docs/ui/pages/backoffice-pointage-employee/prompts/*.md"
```

This packet is additionally checked by its exact path after assembly.
No new source test/build/DB/migration/browser command was executed for this
planning revision. Focused future auth/contracts/db-cloud/Backoffice commands,
migration generation/execution, separate foundation DB suite, broader
test:cloud/build:cloud and guarded local server are listed verbatim in Tasks.
Test selectors describe future files, not claimed existing test implementations.
No imaginary lint/e2e command, new dependency or script was introduced.
Full formatting diagnostics list only unrelated existing paths; the appended
warning list below preserves the actual failed broad-check result.

## Post-Apply sequence — not Apply work

APPLY → formal VERIFY + Technical Compliance Matrix → QA → Gate3.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN — planning marker; no evaluated protocol status yet.

Only after Apply completes, rerun/re-evaluate scoped code diff,20/62 traceability,
all32 contract rows, migration/disposable-runtime proof and focused/broader
commands with actual logs, hashes and deviations. Apply tests do not
automatically become formal VERIFY PASS.

Only after formal VERIFY PASS, separately run required Browser QA under
YUTA_QA_PROTOCOL on the real Next route + migrated disposable PostgreSQL +
approved injected synthetic test provider, with actual restricted writer.
Viewports:1440x900,1024x768,768x1024,390x844. Cover all14 visible states,
keyboard/touch/accessibility/overflow, unknown-result recovery and shared-device
navigation/cache/race cases. No mocked-success screenshot or real attendance.

Only after Apply complete, technical compliance PASS, VERIFY PASS and separate
QA PASS may03-final-review.md be created with hashed real QA evidence.
No QA NOT_APPLICABLE for this UI-affecting change. Environment blockage must be
reported honestly and prevent a ready Gate3 packet.

## Current blockers and required next authority

No newly discovered Product/security/architecture decision changes the approved
build scope. Required safe disposable DB/writer availability and actual
browser environment have not been established or exercised now; missing proof
must block the relevant future execution instead of relaxing security.
The broad formatting debt is unrelated and not silently reported PASS.

Current implementation/test/QA data authority: SYNTHETIC / DISPOSABLE ONLY.
Real employee attendance: NOT_AUTHORIZED in development/staging/production.
Production trusted-client-address provider: NOT_AUTHORIZED / NOT_IMPLEMENTED.
Production enablement: NOT_AUTHORIZED.

All seven unresolved blockers remain: exact retention duration;
deletion/anonymization; legal hold; backup-retention interaction; employee
notice; detailed audit visibility; trusted production client-address provenance.
Disposable runtime-role proof cannot clear production role/readiness gaps.
No synthetic employee field/category/enum/permission/runtime classifier.
No legal cleanup policy, keep-forever assumption, production fallback provider
or enablement switch can be inferred from this plan.
All functional non-scope and raw/Personnel/Planning ownership remain intact.

Next required authority: human review of this exact Tasks/Implementation Plan/
contract/UI completion set and separate explicit Apply authorization.
Recommendation: review planning only. Do not deploy, enable, sync, archive or
promote any lifecycle/readiness field.

## Exact artifact hashes — current reviewed and inherited set

SHA-256 over exact file bytes. Sorted repository-relative paths below.
Command: Get-FileHash -LiteralPath <exact-path> -Algorithm SHA256, lowercase.
The table binds each delta separately and records current metadata-only
approval/README changes. This packet's self-hash is reported externally after
final write, not embedded recursively.

| Path                                                                                 | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md`                    | `ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557` |
| `docs/reviews/pointage-usable-raw-clocking/02-specs-review.md`                       | `c5a7fd21c9fb04ea8f3617463241fc0ec8b41ea6e69b6074da5fefe98f0da566` |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`                     | `9627eb9fabe81bfb1408724100e470c7dbdc96a8fcf15bbedd2fc6597e21bad5` |
| `docs/ui/pages/backoffice-pointage-employee/ACCEPTANCE_CHECKLIST.md`                 | `cbcc464c79e57f3bc34c49989d936b1dc2411839b552a159e407a407c72166ed` |
| `docs/ui/pages/backoffice-pointage-employee/DATA_AND_INTERACTION_SPEC.md`            | `25ffcdbb137b26568a01373c6a55c3ea714f97d70978c3c22310433bd40d68fd` |
| `docs/ui/pages/backoffice-pointage-employee/DESIGN_HANDOFF.md`                       | `d94fc07f4e318bda95507904640e5bd80f9f5bacc251babfbf85f7bc0fc56cae` |
| `docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md`                  | `b7dfc8937893032253f801160c1e9fa21e2c8cd34439c0b80e9eb38e7ef5606e` |
| `docs/ui/pages/backoffice-pointage-employee/PRODUCT_SCOPE.md`                        | `16a14204820f4a1b2033f26dca03494db9e5e61b28474c87216ce206062582d8` |
| `docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json`                  | `04c6c99bf8067e848cc4df1f0f871fd43bdf1ec964d786f2617dcca4692b8a61` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/00_REPOSITORY_ANALYSIS.md`       | `7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/01_VISUAL_BASELINE.md`           | `d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/02_COMPONENT_REFACTOR.md`        | `8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/03_INTERACTIONS.md`              | `e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/04_DATA_INTEGRATION.md`          | `f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79` |
| `docs/ui/pages/backoffice-pointage-employee/prompts/05_VISUAL_QA.md`                 | `5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0` |
| `docs/ui/pages/backoffice-pointage-employee/README.md`                               | `77377af7a5f09d4884541e3a90de151e0ae11223b73e66f2dc57cfb08765d902` |
| `docs/ui/pages/backoffice-pointage-employee/references/README.md`                    | `e2ddabc5a6a004441847e71629b84281eeac075c41a195eea8955f5d30a72a45` |
| `docs/ui/pages/backoffice-pointage-employee/UI_SPEC.md`                              | `cd109fb341545a280189d92b891506b9211134600720cf5d2b9b107563aacb45` |
| `openspec/changes/pointage-usable-raw-clocking/.openspec.yaml`                       | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md`                          | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                            | `be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9` |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md`                          | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` |
| `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md` | `1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66` |
| `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`  | `4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                             | `8cb14531f9c230f025e460ea7f0a8b2208cee4904c789a353e12718240c6f1db` |

## Scoped writes and preserved checkout — prior completion evidence

Prior pack-completion writes:10 new planning/UI files,2 existing metadata updates,
plus this new review packet =13 paths. None is implementation or migration.
Git reports these homes as untracked directory groups, so Git diff alone
cannot prove scope; exact file snapshots/hashes below include each new file.

- `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`
- `docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md`
- `docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json`
- `docs/ui/pages/backoffice-pointage-employee/prompts/00_REPOSITORY_ANALYSIS.md`
- `docs/ui/pages/backoffice-pointage-employee/prompts/01_VISUAL_BASELINE.md`
- `docs/ui/pages/backoffice-pointage-employee/prompts/02_COMPONENT_REFACTOR.md`
- `docs/ui/pages/backoffice-pointage-employee/prompts/03_INTERACTIONS.md`
- `docs/ui/pages/backoffice-pointage-employee/prompts/04_DATA_INTEGRATION.md`
- `docs/ui/pages/backoffice-pointage-employee/prompts/05_VISUAL_QA.md`
- `docs/ui/pages/backoffice-pointage-employee/README.md`
- `docs/ui/pages/backoffice-pointage-employee/references/README.md`
- `openspec/changes/pointage-usable-raw-clocking/tasks.md`
- `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md`

Baseline time:2026-09-08T08:42:09.9842999+02:00.
HEAD: defbc50eba3952fa2e7b1c016637daf083b18c65.

Outside these three scoped homes, the initial2516 files retain the exact
aggregate SHA-256 f13175c7f9de6eb985f31df73efb8dbca938103fe929f4357488f75958fe88e8.
A concurrent out-of-scope new file appeared:
openspec/changes/formalites-legal-template-foundation/tasks.md,
SHA-256 f044288dfacf994f1ca197ca7e4c0fff1c084d52e4b31235294116a2f53d03f1.
It was not written, edited or attributed by this task. The all-outside count
therefore became2517 and digest
b0b078ac27dec16d363fe22adf684c9b6779523016201aea47da77e58bce64c7.
Excluding just that new concurrent file restores the initial2516 count and
exact original digest; all original external bytes remain unchanged.

The outside inventory includes normative main Specs, all archives, application/
package code/tests/manifests/migrations, existing Formalités auth export hunk
and unrelated dirty UI work. No implementation, normative Spec, archived file
or existing unrelated byte was changed by this planning revision.
No destructive command or database operation was run.

Deterministic outside-inventory check (read-only, PowerShell; path+TAB+hash
joined LF, UTF-8 without trailing LF):

```powershell
$ErrorActionPreference='Stop'
$taskPaths=@(git ls-files --cached --others --exclude-standard | Sort-Object -Unique)
$taskRows=@(foreach($taskPath in $taskPaths){if(Test-Path -LiteralPath $taskPath -PathType Leaf){[ordered]@{path=$taskPath;sha256=(Get-FileHash -LiteralPath $taskPath -Algorithm SHA256).Hash.ToLowerInvariant()}}})
$taskScoped=@($taskRows|Where-Object{$_.path.StartsWith('openspec/changes/pointage-usable-raw-clocking/') -or $_.path.StartsWith('docs/reviews/pointage-usable-raw-clocking/') -or $_.path.StartsWith('docs/ui/pages/backoffice-pointage-employee/')})
$taskOutside=@($taskRows|Where-Object{$_ -notin $taskScoped -and $_.path -ne 'openspec/changes/formalites-legal-template-foundation/tasks.md'})
$taskString=(@($taskOutside|ForEach-Object{$_.path+[char]9+$_.sha256})-join [char]10)
$taskDigest=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($taskString))).ToLowerInvariant()
[ordered]@{time=(Get-Date -Format o);head=(git rev-parse HEAD);scoped=$taskScoped;outsideCount=$taskOutside.Count;outsideSha256=$taskDigest;status=@(git status --short)}|ConvertTo-Json -Depth 4 -Compress
```

Fresh Git status was unchanged as a path-status list (untracked directory
grouping hides newly added files, hence the byte inventory). Captured status:

```text
 M apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx
 M apps/backoffice/src/components/backoffice/backoffice-frame.tsx
 M docs/CURRENT_STATE.md
 M docs/MODULE_REGISTRY.md
 M docs/PRODUCT_KNOWLEDGE.md
 M docs/architecture/AUTHENTICATION.md
 M docs/architecture/IDENTITY_AND_MEMBERSHIP.md
 M docs/architecture/OVERVIEW.md
 M docs/features/identity-access/README.md
 M docs/features/personnel/README.md
 M packages/auth/src/index.ts
 M packages/auth/src/session.ts
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/index.ts
 M packages/db-cloud/src/schema/index.ts
 M packages/ui/package.json
 M packages/ui/src/button.tsx
 M pnpm-lock.yaml
?? apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx
?? apps/backoffice/src/components/backoffice/logout-submit-button.tsx
?? apps/backoffice/src/server/pointage/
?? apps/backoffice/test/general-information-form.test.tsx
?? apps/backoffice/test/google-location-submit-button.test.tsx
?? apps/backoffice/test/logout-submit-button.test.tsx
?? apps/backoffice/test/pointage-foundation-inventory.test.ts
?? apps/backoffice/test/pointage-foundation.test.ts
?? docs/reviews/async-interaction-feedback-foundation/
?? docs/reviews/formalites-legal-template-foundation/
?? docs/reviews/formalites-template-legal-review-governance/
?? docs/reviews/platform-admin-formalites-template-authority-foundation/
?? docs/reviews/pointage-authority-and-access-foundation/
?? docs/reviews/pointage-usable-raw-clocking/
?? docs/ui/pages/backoffice-pointage-employee/
?? openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/
?? openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/
?? openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/
?? openspec/changes/async-interaction-feedback-foundation/
?? openspec/changes/formalites-legal-template-foundation/
?? openspec/changes/pointage-usable-raw-clocking/
?? openspec/specs/authorization/platform-admin-formalites-template-administration/
?? openspec/specs/authorization/pointage/
?? openspec/specs/formalites/template-legal-review-governance/
?? openspec/specs/pointage/
?? packages/auth/src/formalites-template-system-authorization.ts
?? packages/auth/src/pointage-credential.ts
?? packages/auth/test/formalites-template-system-authorization.test.ts
?? packages/auth/test/pointage-credential.test.ts
?? packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql
?? packages/db-cloud/drizzle/meta/0019_snapshot.json
?? packages/db-cloud/src/pointage-repository.ts
?? packages/db-cloud/src/schema/pointage.ts
?? packages/db-cloud/test/pointage-repository.integration.test.ts
?? packages/db-cloud/test/pointage-schema.test.ts
?? packages/ui/test/
```

## Exact authorized README metadata diff — unchanged prior approval evidence

Original preimage is the exact embedded README snapshot in approved Gate2b;
current result is embedded below and bound by its current SHA-256. The diff
uses one full-context hunk to make unchanged Product/UI prose visible.

```diff
--- approved/docs/ui/pages/backoffice-pointage-employee/README.md
+++ planned/docs/ui/pages/backoffice-pointage-employee/README.md
@@ -1,125 +1,169 @@
 # Pointage employee

+Status: Approved Design; implementation planning AWAITING_HUMAN_REVIEW
-Status: Draft design package — AWAITING_HUMAN_REVIEW

 Visibility: Engineering

 Owner: YUTA product and engineering

 Protocol revision: 4

 Application: `apps/backoffice`

 Target type: `PAGE`

 Route / entry point: `/pointage/[establishmentSlug]`

 Runtime family: `cloud`

 Page classification: `NEW_PAGE`

 Implementation class: `integrated`

+Package status: `implementation-ready`
-Package status: `design`

 Scope status: `APPROVED`

 Reference status: `NONE`

 Inventory status: `COMPLETE`

 Baseline status: `NOT_APPLICABLE`

 Design prompt status: `READY`

 Shared context status: `RESOLVED`

+Prompt snapshot topology: GENERATED_SNAPSHOTS
+
+Prompt provenance: prompt-provenance.json
+
+No-image reference reason: Human-approved written state-driven Design provides
+the required hierarchy, French copy and state behavior. No image is needed;
+no image or screenshot is claimed. See [reference metadata](references/README.md).
-No-image reference reason: Written state-driven design proposed; human approval
-is still required. No image or screenshot is claimed.

 UI_AFFECTING: YES

 BROWSER_QA_REQUIRED: YES

 ## Current implementation

 The root Backoffice document and Pointage authorization/credential foundation
 exist. The employee route, continuation, raw events, transport and Browser QA
 do not. Full read-only inventory: [DESIGN_HANDOFF](DESIGN_HANDOFF.md).
 No current employee screen exists; baseline capture is not applicable.

 ## Authority

 Root/scoped AGENTS, current product and architecture docs, the current UI
 workflow and [Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md) precede this
 draft. Exact approved scope/hashes are in [PRODUCT_SCOPE](PRODUCT_SCOPE.md).
 Shared rules: `docs/ui/YUTA_FRONTEND_RULES.md`
 ([source](../../YUTA_FRONTEND_RULES.md)).
 [Technical Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md)
 selects security/time/transaction behavior; this pack cannot expand it.

 ## Documents

 - [PRODUCT_SCOPE](PRODUCT_SCOPE.md)
 - [DESIGN_HANDOFF](DESIGN_HANDOFF.md)
 - [UI_SPEC](UI_SPEC.md)
 - [DATA_AND_INTERACTION_SPEC](DATA_AND_INTERACTION_SPEC.md)
 - [ACCEPTANCE_CHECKLIST](ACCEPTANCE_CHECKLIST.md)
+- [IMPLEMENTATION_PLAN](IMPLEMENTATION_PLAN.md)
+- [Reference metadata](references/README.md)
+- [Sealed prompt provenance](prompt-provenance.json)
+- [00 Repository analysis](prompts/00_REPOSITORY_ANALYSIS.md)
+- [01 Visual baseline](prompts/01_VISUAL_BASELINE.md)
+- [02 Component refactor](prompts/02_COMPONENT_REFACTOR.md)
+- [03 Interactions](prompts/03_INTERACTIONS.md)
+- [04 Data integration](prompts/04_DATA_INTEGRATION.md)
+- [05 Visual QA](prompts/05_VISUAL_QA.md)

+Pack completion metadata: the previously partial Design-stage pack now has its
+Implementation Plan, six canonical prompt snapshots and no-image metadata.
+The generator was not run: it refuses an existing destination. Missing prompts
+were copied byte-exactly from the current canonical template, then hashed and
+sealed with their actual source revision and current Git commit. No pre-seal
+customization or invented provenance. The validator is run without modification.
-This is a partial pre-approval Design pack, not the final implementation-ready
-package. No IMPLEMENTATION_PLAN, phase prompts, generated provenance, reference
-images or code are created. The current generator creates artifacts explicitly
-forbidden before Sensitive Design approval, so it was not run. The full-pack
-validator's structural missing-file findings must be reported honestly, not
-fixed with placeholder plans or forged generated provenance.

 ## Shared UI context

 NO_APPLICATION_SHELL. Reuse root typography, semantic tokens and shared
 primitives. No cloud-account chrome, restaurant selector, manager sidebar,
 mobile navigation or invented shared shell. See the four-layer context matrix
 and self-contained written design prompt in DESIGN_HANDOFF.

 ## Protected invariants

 Own minimal state only. Current eligibility and exact authority on every
 protected read/mutation/replay. No clock backdating, Planning rounding,
 history/totals, durable browser employee identity or offline fallback.
 A receipt is not a second attendance source. Shared-device clearing and
 unknown-outcome recovery remain explicit. Test data is synthetic/disposable
 only; real attendance and production enablement remain NOT_AUTHORIZED.

 ## Change impact

+Current writes: planning completion files and authorized README metadata/links
+only in this pack; approval metadata and planning review recorded separately.
+Five existing reviewed documents remain byte-identical. Their historical
+DRAFT/pre-approval labels and unchecked planning boxes are retained by explicit
+user instruction; current approval/completion status is recorded here.
-Current writes: six Design-stage documents in this directory, technical Design
-and its review packet; Gate 2 approval metadata recorded separately.

 Future proposed boundaries (not authorized Apply): Backoffice employee route
 and server Pointage consumer, @yuta/contracts DTOs, @yuta/auth state-guard
 primitive, @yuta/db-cloud raw/receipt/continuation persistence.

 Cross-application impact: no local/public application change.
+
+Files expected to modify: Isolated exports and foundation integration only;
+exact paths and dirty-hunk protections in master Tasks / IMPLEMENTATION_PLAN.
+
+Files expected to create: Approved employee page, transport, domain, DTO,
+persistence and tests; exact path keys in master Tasks / IMPLEMENTATION_PLAN.
+
+Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.
+
+Database change: YES
+
+API or contract change: YES
+
+Permission/auth change: YES
+
+Runtime/device change: NO
+
+These flags describe approved Design impact, not Apply authority. Existing six
+operations and grants remain unchanged; no new runtime/device, only approved
+cloud synthetic-test composition.
-Database change: PROPOSAL.
-API or contract change: PROPOSAL.
-Permission/auth change: PROPOSAL — existing six operations, no new grant.
-Runtime/device change: NO new runtime/device; cloud synthetic test composition.

 ## Design approval

 Scope: exact revised Gate 2 Specs APPROVED_FOR_DESIGN.
+Design, layout, copy and no-image direction: APPROVED by explicit current-user
+instruction on the exact Sensitive Design packet. Approval recorded 2026-09-08.
+Source: [Sensitive Design review](../../../reviews/pointage-usable-raw-clocking/02b-design-review.md).
+Subsequent user permission: README metadata/completion links only; no changes
+to approved Product/UI/Design content in the other five documents.
+Tasks and implementation planning are authorized; Apply is not.
+The master plan has four Apply phases; UI prompts are mapped checkpoints,
+not extra Apply phases. See IMPLEMENTATION_PLAN for execution and human stops.
+
+Apply authorization: NOT_GRANTED.
+Production enablement: NOT_AUTHORIZED.
+Package status implementation-ready denotes pack completeness, not Apply,
+implementation, successful QA or production-readiness approval.
-Design, layout, copy and no-image direction: AWAITING_HUMAN_REVIEW.
-No implementation/Tasks authority. No phase execution order or prompts yet.

 ## Stop conditions

 Stop for a Product/authority conflict, unsupported Personnel projection,
 production provider, real attendance data, new permission/runtime, raw mutation
 or expanded visible behavior. Do not weaken Specs for implementation convenience.

 ## Final delivery and as-built status

 Implementation: NOT_STARTED.
 Functional/regression QA: NOT_RUN.
 Visual/browser evidence: NOT_RUN; required after implementation.
 As-built documentation status: PENDING.
 Only planning inventory is complete, not the UI or its QA.
```

## Broad formatting diagnostics — not repaired

```text
$ prettier --check .
Checking formatting...
[warn] .agents/skills/openspec-apply-change/SKILL.md
[warn] .agents/skills/openspec-archive-change/SKILL.md
[warn] .agents/skills/openspec-continue-change/SKILL.md
[warn] .agents/skills/openspec-explore/SKILL.md
[warn] .agents/skills/openspec-new-change/SKILL.md
[warn] .agents/skills/openspec-propose/SKILL.md
[warn] .agents/skills/openspec-sync-specs/SKILL.md
[warn] .agents/skills/openspec-update-change/SKILL.md
[warn] .agents/skills/openspec-verify-change/SKILL.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md
[warn] docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
[warn] docs/features/establishment/general-information/README.md
[warn] docs/features/establishment/README.md
[warn] docs/features/personnel/README.md
[warn] docs/PRODUCT_KNOWLEDGE.md
[warn] docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md
[warn] docs/reviews/async-interaction-feedback-foundation/02-specs-review.md
[warn] docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md
[warn] docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md
[warn] docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md
[warn] docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md
[warn] docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md
[warn] docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md
[warn] docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md
[warn] docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md
[warn] openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md
[warn] openspec/changes/async-interaction-feedback-foundation/analysis.md
[warn] openspec/schemas/yuta-spec-driven/templates/design.md
[warn] openspec/schemas/yuta-spec-driven/templates/proposal.md
[warn] openspec/schemas/yuta-spec-driven/templates/spec.md
[warn] openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
[warn] openspec/specs/restaurant-knowledge/validated-knowledge/spec.md
[warn] Code style issues found in 67 files. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
```

## Exact planning artifact snapshots

Each snapshot is the exact UTF-8 file text, LF line endings and final newline.
Hash validation compares decoded snapshot bytes with the actual file; no
formatter is allowed to rewrite sealed prompts or locked approved documents.

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md

```text
# Pointage employee — Implementation Plan

Status: AWAITING_HUMAN_REVIEW

Visibility: Engineering

Application: apps/backoffice

Route: /pointage/[establishmentSlug]

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED

## Authority and exact phase mapping

The [master Tasks / Implementation Plan](../../../../openspec/changes/pointage-usable-raw-clocking/tasks.md)
owns the four Apply phases, 32 unchecked tasks, embedded contracts and complete
20-requirement / 62-scenario traceability. This page plan specializes the
Employee Transport / UI phase; it creates neither an additional Apply phase nor
new Product/security authority. The [approved Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md)
and byte-locked PRODUCT_SCOPE, UI_SPEC, DATA_AND_INTERACTION_SPEC,
DESIGN_HANDOFF and ACCEPTANCE_CHECKLIST remain the reviewed sources.
The README records current approval; historical DRAFT/pre-approval labels and
unchecked planning boxes in those five documents are preserved by explicit
user instruction, not a request to reopen their approved content.

| Canonical UI checkpoint | Placement in this change                                                    | Execution boundary                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 00 Repository analysis  | Read-only pre-Apply refresh of DESIGN_HANDOFF inventory and approved hashes | Stop on drift/conflict; do not rewrite locked documents or generate an image.                                                        |
| 01 Visual baseline      | Apply phase 3, task 3.4, after phases 1-2 supply the actual consumer        | Approved written no-image direction; no fixture-success route. Retain prompt's review stop.                                          |
| 02 Component refactor   | Apply phase 3, task 3.4                                                     | Meaningful route-local responsibilities only; no shared primitive/global-shell changes.                                              |
| 03 Interactions         | Apply phase 3, tasks 3.5-3.7                                                | Exact state/clearing/recovery behavior; no extra domain rules.                                                                       |
| 04 Data integration     | Apply phase 3, tasks 3.1-3.3/3.8 coordinated with master phases 1-2         | Approved Design binds the exact new DTO/API/schema boundaries; stop for any new/unapproved boundary and for missing Apply authority. |
| 05 Visual QA            | Separate post-Apply QA, after formal VERIFY PASS                            | Not an Apply checkbox. Real-route evidence at all four viewports; no automatic lifecycle promotion.                                  |

The prompt snapshots refer to current shared governance instead of copying it.
Read this plan and master Tasks before executing a prompt. A sealed prompt,
implementation-ready package or passing pack validator never grants Apply.
Keep per-prompt human stops; the combined phase label does not waive them.
The user's four-phase grouping takes precedence over optional template labels.

## Phase 0 — repository analysis refresh

Current target is NEW_PAGE / integrated / NEW_CAPABILITY_DISCOVERY.
The existing root document owns fonts/styles; the authenticated restaurant
shell is a different subtree. NO_APPLICATION_SHELL is approved.
Foundation credential service/repository and Personnel fields exist; the new
employee route, raw evidence, continuation consumer and browser transport do not
exist at this planning checkpoint. Baseline is NOT_APPLICABLE, not a fabricated
screen capture. Inventory details remain in DESIGN_HANDOFF.

Before any Apply, reread root/scoped AGENTS, docs/README.md, CURRENT_STATE,
AUTHORITY_MODEL, current architecture/auth/tenancy/database/Personnel docs and
the approved change. Follow docs/ui/README.md, YUTA_FRONTEND_RULES.md,
BACKOFFICE_FRONTEND_RULES.md, DESIGN_TO_CODE_WORKFLOW.md,
DELIVERY_WORKFLOW_MODES.md and PAGE_PACK_PROTOCOL.md. Resolve current shared
exports/tokens from packages/ui/src/index.ts and styles/global.css.
Do not reproduce their component/token catalog here.

Recompute all approved hashes/path sets and fresh Git status. The checkout has
unrelated tracked edits and untracked foundation files. Preserve the exact
Formalités export hunk in packages/auth/src/index.ts, existing journal/history,
shared async UI work, Google selector and backoffice-frame changes. Save exact
pre-Apply bytes, distinguish new raw-clocking files from pre-existing untracked
foundation and stop if overlapping work cannot be isolated.

## Expected change impact

Files expected to modify: only isolated exports and foundation integration
listed in master Tasks AUTH/DATA/DOMAIN/DTO/UI_TEST; no shared UI, global CSS,
root layout, manager placeholder or authenticated shell modifications.

Files expected to create: exact PAGE, HTTP, HEADERS, DTO and UI_TEST paths in
master Tasks. The page entry orchestrates neutral content; route-local client
owns only the live interaction. Server-only handlers/services own trusted
scope, auth, persistence and transactions. No generic app/components folder.

Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.
Cross-application impact: NO; no other app/runtime modification.
Database change: YES, approved additive cloud Design, future Apply only.
API or contract change: YES, only approved D8 employee endpoints.
Permission/auth change: YES, bounded Pointage continuation; no new grant.
Runtime/device change: NO new runtime/device; guarded cloud local-test composition.

## Approved visual implementation

Use UI_SPEC's French copy and written layout: one centered responsive content
column, narrow gutters at least16px, maximum480px visual target using existing
spacing conventions, controls at least48px, long names wrap. Existing Geist
Sans/Inter fallback and semantic tokens; shared primitives only as needed.
No-image reference is intentional and human-approved, recorded in
[references/README.md](references/README.md). No screenshot/mockup provenance
is claimed. Do not generate an image merely to populate references.

Reuse in order: current feature/app component where suitable, compose shared
primitives, then create meaningful route-local components. No speculative
shared component/API or new library. The PAGE ownership list separates
credential entry, active state/receipt and interaction/client logic. Keep
database/auth primitives out of browser imports. No application shell,
account area, navigation, establishment/employee chooser or manager control.

## Interaction and integration implementation

| State family                        | Implementation obligation                                                                                                               | Planned proof                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Credential entry / identify pending | Mask eight digits, explicit French-labelled submit, no duplicate request; clear PIN when identify settles; no prior employee data.      | DTO/UI_TEST and real-route QA.                                       |
| NOT_CLOCKED_IN / CLOCKED_IN         | Own name, current state and open-session start only; no previous departure/history/totals.                                              | Current scoped Personnel/state tests and response field allowlist.   |
| Mutation pending                    | Freeze UUIDv4 requestId + kind + stateGuard; disable duplicate action, keep Terminer available; no optimistic success.                  | Interaction tests and real DB delayed-response QA.                   |
| CLOCK_IN / CLOCK_OUT receipt        | Render only committed joined receipt; at most10s then end, or earlier expiry.                                                           | Real receipt with original server instant and UI timer tests.        |
| State / request conflict            | Distinct approved French messages; refresh current state and require explicit new action; never rebase automatically.                   | Stale OUT A/B and same-ID/different-intent tests.                    |
| Unknown result                      | Live tuple recovery/resend only, same identity; UNCONFIRMED does not prove no commit; no auto new ID.                                   | Real commit/lost response/recover, DB count remains one.             |
| Access failure / rate limit         | Non-enumerating messages; no credential/dossier/lifecycle disclosure; no automatic retry or employee residue.                           | Provider/limiter/authority tests and real-route UI checks.           |
| Cloud unavailable                   | Neutral unavailable or explicit unconfirmed mutation; never offline accepted evidence or queued mutation.                               | Actual unavailable connection/server observations.                   |
| End / neutral                       | Clear personal DOM/token/tuple synchronously and increment generation; abort/drop late callbacks. Local clearing is not remote end ACK. | Timer/event tests, two-user browser inspection and end/commit races. |

Successful identify must separately authorize pointage.employee.identify and
pointage.employee.state.read with current scope/Personnel/version guards,
validate/derive the raw chain, and commit continuation before exposing combined
token/state. Do not render an identify-only partial response. All state/mutation/
replay checks remain current; reset/expiry/end deny old continuation.
No merging exact operation IDs or broader employee/session grants.

Token is ptc1\_ opaque256-bit, memory-only; server absolute120s/idle60s,
no background heartbeat or durable browser state. On Terminer, expiry, hidden,
pagehide, navigation, refresh, back/forward, pageshow, bfcache, duplicate tab or
restart return to neutral and reject old-generation responses. Clear before
bfcache snapshot as well as pageshow; Cache-Control alone is insufficient.
No localStorage/sessionStorage/IndexedDB/history.state/URL/cookie/channel
identity/token persistence or handoff.

Use D8's strict4KiB JSON allowlists and dedicated Authorization header, exact
configured Origin, credentials omit and cross-site rejection. All personal
endpoints POST and no-store; context GET/HTML/RSC neutral only. Apply route-only
nonce CSP and security/cache headers; no existing unrelated route effects.
No raw rows, trusted context, secrets, identity payload logs or analytics.

After local tuple clearing, fresh identification can display current state
only; no restored receipt history/search. Server-confirmed own end serializes
with command locks; lost network means only local clearing is confirmed until
server expiry/end commit. Never fabricate an attendance auto-close.

## Functional and integration completion checks — Apply only

Run exact focused commands C8-C11 and negative inventory from master Tasks,
then broader C12/C13 with safe environment boundaries. Check component
ownership/imports, strict DTO serialization, cache/nonce behavior and
generation/timer logic. These are implementation checks, not formal VERIFY
or completed Browser QA. Do not create QA_REPORT or Gate3 during Apply.

Actual current command families:

- `pnpm --filter @yuta/contracts test`
- `pnpm --filter @yuta/auth test`
- `pnpm --filter @yuta/db-cloud test`
- `pnpm --filter @yuta/backoffice test`
- `pnpm test:cloud`
- `pnpm build:cloud`
- `pnpm docs:check`
- `pnpm architecture:check`
- `pnpm -r --if-present typecheck`
- `pnpm ui:pack:check backoffice-pointage-employee`
- `pnpm format:check`

Scoped Prettier is check-only for approved bytes. Exact planned focused file
selectors, migration commands and separated disposable databases are in master
Tasks; do not use ordinary .env.local or broad integration opt-in indiscriminately.
Future QA server command: `pnpm --filter @yuta/backoffice dev --hostname 127.0.0.1`.
Do not run it during planning or imply the page exists.

## POST-APPLY VERIFY PLAN

After32 Apply tasks complete, independently re-evaluate approved Specs/Design
against actual current code, tests, exact scoped diff and changed artifact
hashes. Master Tasks defines the Technical Compliance Matrix F1-F8, S1-S9,
U1-U8, R1-R7, migration/privilege/time proof and command/results/deviations.
Apply checks are inputs to a fresh evaluation, not automatic formal PASS.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

## QA PLAN — after formal VERIFY

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES. QA has not been evaluated.
Use docs/YUTA_QA_PROTOCOL.md. QA NOT_APPLICABLE is not valid here.

Real implemented Next route plus migrated disposable PostgreSQL, actual
restricted writer and approved injected synthetic trusted-address provider are
mandatory. Require `NODE_ENV` development/test and all other Design D1 environment gates.
The URL hostname allowlist is `localhost`, `127.0.0.1`, `[::1]`; the exact
case-sensitive whole-string database-name rule is
`^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$`.
After the URL guard, `SELECT current_database()` must exactly equal the parsed
name and independently match that same exact rule. No provider instantiation,
fixture, migration or attendance write before all guards pass. Reject
`yuta_cloud`, staging/production, non-loopback, malformed/prefix/suffix/
whitespace/newline/encoded aliases, query/fragment overrides, name mismatch or
probe failure; no normalization. Browser QA may not bypass or weaken this guard.
No mocked-success screen is final evidence. No production provider or real data.

| Required viewport | Evidence                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| 1440x900          | All applicable state families, keyboard/focus and column hierarchy.        |
| 1024x768          | Shared-tablet landscape, touch targets, pending/end/conflict/recovery.     |
| 768x1024          | Shared-tablet portrait, two-user clearing/navigation and state layout.     |
| 390x844           | Narrow layout, long-name wrap/zoom/reflow, no overflow or clipped actions. |

Cover all14 UI state rows from UI_SPEC, both committed mutations, multiple
sessions, stale two-tab OUT, same-tuple timeout recovery, reset/expiry/departure,
10s receipt/end, hidden/pagehide/pageshow/bfcache/back/refresh/duplicate/restart,
late response after clearing and subsequent employee isolation.
Inspect storage/cache/HTML/RSC/URLs/history/network diagnostics for prohibited
residue without recording secrets. Capture truthful local versus remote end.

Create real QA_REPORT.md, screenshot-manifest.md and actual PNGs only later
under docs/reviews/pointage-usable-raw-clocking/qa/. Manifest requires path,
SHA-256, viewport/state/scenario/role/route/capture conditions and synthetic-only
provenance. Nonvisual auth/DB claims need tests, not screenshots alone.
If environment is unavailable, report BLOCKED_BY_ENVIRONMENT; do not fabricate
PASS. In-scope defects require re-VERIFY and affected QA again.

## Stop conditions and delivery

Stop for artifact/hash drift, unsafe dirty-hunk overlap, changed Product/
Personnel authority, new grant/provider/runtime, unsafe database/role,
unapproved UI/data read or inability to preserve shared-device isolation.
No stage can clear the seven legal/privacy/provenance blockers.
No real attendance in development/staging/production; no synthetic classifier.
No manager UI, history/totals, raw mutation, Planning/payroll/local/offline scope.

The existing five reviewed UI documents stay byte-locked under current
authority. Later as-built synchronization must record evidence in allowed
metadata/review locations and request explicit permission before touching their
locked content. Do not mark Package status implemented until implementation,
VERIFY, mandatory QA and authorized as-built synchronization are complete.
Planning review now: AWAITING_HUMAN_REVIEW. Apply authorization: NOT_GRANTED.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json

```text
{
  "schemaVersion": 1,
  "topology": "GENERATED_SNAPSHOTS",
  "sealed": true,
  "templateRevision": "prompt-template-v1",
  "generation": {
    "commit": "defbc50eba3952fa2e7b1c016637daf083b18c65"
  },
  "prompts": [
    {
      "filename": "00_REPOSITORY_ANALYSIS.md",
      "templateSource": "docs/ui/templates/page/prompts/00_REPOSITORY_ANALYSIS.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c",
      "snapshotSha256": "7ecab8ffd6d97de28f463d521172be6de8f66b7e3074e5e90e88f53f41ea394c",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    },
    {
      "filename": "01_VISUAL_BASELINE.md",
      "templateSource": "docs/ui/templates/page/prompts/01_VISUAL_BASELINE.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119",
      "snapshotSha256": "d3075806ae38d0f9f6a945b3b42d1f3b8d7e2bd9eafa712a73587744c9f46119",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    },
    {
      "filename": "02_COMPONENT_REFACTOR.md",
      "templateSource": "docs/ui/templates/page/prompts/02_COMPONENT_REFACTOR.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac",
      "snapshotSha256": "8b134cd4b462562416fb5c2e57c23eb4675a26eff7ea75fdfae44727b74648ac",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    },
    {
      "filename": "03_INTERACTIONS.md",
      "templateSource": "docs/ui/templates/page/prompts/03_INTERACTIONS.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388",
      "snapshotSha256": "e27c12d152d9270229eed6951898ab6f5e477d7d12ff9c170f4522ed45f00388",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    },
    {
      "filename": "04_DATA_INTEGRATION.md",
      "templateSource": "docs/ui/templates/page/prompts/04_DATA_INTEGRATION.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79",
      "snapshotSha256": "f878f959d3afee428e67620c74f4c75231d2c7816f23cbf7fc6c701067538e79",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    },
    {
      "filename": "05_VISUAL_QA.md",
      "templateSource": "docs/ui/templates/page/prompts/05_VISUAL_QA.md",
      "templateRevision": "prompt-template-v1",
      "templateSha256": "5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0",
      "snapshotSha256": "5f31ec1c2a2bcfd3129643931e188365f9608958f1f8bd697ae7854e292eaad0",
      "localModificationState": "NONE",
      "provenanceStatus": "PROVEN"
    }
  ]
}
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/00_REPOSITORY_ANALYSIS.md

```text
# Codex Prompt — Phase 0: Repository Analysis Gate

Do not change code in this phase.

Read root `AGENTS.md`, `docs/README.md`, `docs/CURRENT_STATE.md`, the nearest
application `AGENTS.md`, current architecture/product/feature/operations/QA
docs, `docs/ui/README.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, target-application
UI rules, this page package, the current implementation/tests,
`packages/ui/src/index.ts`, and semantic tokens.

Return an **Implementation Inventory** with exactly these sections:

1. Target application and real route/screen.
2. Target type: `PAGE`, `SCREEN`, `SURFACE`, or `FLOW`.
3. `NEW_PAGE` or `EXISTING_PAGE`.
4. Implementation class: visual-only, interactive, integrated, or
   device-coupled.
5. Route/shell/container files and nearby conventions.
6. Auth, tenant, public-resolution, local-session, or standalone-local boundary
   that actually applies.
7. Data owner/source and persistence boundary.
8. Transport/contracts used by the screen.
9. Current loaders, server actions, local API commands, mutations, validation,
   and transaction owner as applicable.
10. Polling, offline, retry, provider, printer, or device behavior as applicable.
11. Shared UI primitives/tokens already used or suitable for reuse.
12. Existing tests protecting the target behavior.
13. Current documentation that is authority for the target.
14. Protected business/runtime invariants that UI work must not break.
15. Current visual baseline and browser/device evidence for an existing screen.
16. Conflicts between the requested design/reference and current implementation
    or domain.
17. Unsupported concepts requiring product, schema, contract, or device
    approval.
18. Expected change impact: files to modify/create, packages affected, and
    cross-application impact.
19. Database, API/contract, permission/auth, and runtime/device change flags as
    `YES`, `NO`, or `PROPOSAL`.
20. Exact repository commands that exist for verification.
21. Proposed files to change in later phases.
22. Shared UI context sources at YUTA-global, application, section/flow, and
    page levels, including approval state and conflicts.
23. Exact shell/navigation mode, owner, header/sidebar/account behavior, real
    routes, responsive rules, and forbidden invented elements.

For an existing integrated or device-coupled screen, explicitly state that
fixture replacement is forbidden.

After the inventory, complete `DESIGN_HANDOFF.md` without changing application
code:

1. Complete the shared-context matrix and select exactly one shell/navigation
   mode. If a missing or conflicting shared decision would materially change
   the design, set `Shared context status: BLOCKED` and stop; never ask the
   design tool to invent the missing context.
2. Assemble a curated design-tool bundle containing applicable approved shared
   references, exact reuse/adaptation/exclusion rules, real routes, common
   responsive/state constraints, and the page-specific hierarchy.
3. For `EXISTING_PAGE`, capture the current authenticated browser/device
   baseline and record route, state, viewport/device, date, and runtime/session
   conditions. If capture is unavailable, record the exact blocker and set the
   baseline status to `BLOCKED`; do not substitute a code-derived description
   for visual evidence.
4. For `NEW_PAGE`, set the baseline status to `NOT_APPLICABLE` and record that
   no current screen exists.
5. Prepare a self-contained, ready-to-use design-generation prompt for
   ChatGPT/ImageGen or another approved design tool. Ground it in the inventory,
   approved capabilities, protected invariants, resolved shared context,
   required states, target viewport/device, and unsupported concepts.

The Phase 0 handoff output is therefore the Implementation Inventory, resolved
shared-context bundle (or explicit blocker), current baseline evidence, and the
design-generation prompt.
Stop after this handoff. Do not generate a mockup or implement Phase 1
automatically.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/01_VISUAL_BASELINE.md

```text
# Codex Prompt — Phase 1: Visual Baseline

Use the approved Phase 0 Implementation Inventory as the behavioral and visual
baseline.

Do not begin until product scope and the visual reference/no-image decision are
approved, `Shared context status` is `RESOLVED`, and the package is
`implementation-ready`.

If `NEW_PAGE`, typed fixture data may be used only when this page package
explicitly permits it.

If `EXISTING_PAGE`, refactor the real implementation in place. Preserve the
identified auth/session boundary, data loading/transport, actions/mutations,
validation, business invariants, polling/offline/device behavior, and tests. Do
not replace real data with fixtures.

Use the reference image only for hierarchy, proportions, density, spacing, and
visual tone. Do not copy navigation, raw colors, fields, permissions, APIs, or
device behavior from it.

Reuse the current application shell, `@yuta/ui`, semantic tokens,
`lucide-react`, and app-specific typography.

Apply the approved global/application/section context exactly as documented.
Do not add or replace a header, sidebar, navigation item, account area, shared
state pattern, or cross-page component absent from that context. A page-local
reference cannot authorize shared application UI.

Use the target application's viewport/device profile. Do not assume Backoffice
widths for another application.

Report files changed, preserved invariants, commands, browser/device evidence,
intentional deviations, and unresolved conflicts. Do not perform Phase 2
automatically.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/02_COMPONENT_REFACTOR.md

```text
# Codex Prompt — Phase 2: Component Refactor

Refactor only after the Phase 1 visual baseline is reviewed. Preserve the
approved appearance and all Phase 0 protected behavior.

Extract components by business responsibility, state/mutation ownership,
testability, or server/client/runtime boundary. Keep page-specific components
near the route, keep Server Components by default, isolate minimal client
boundaries, and reuse `@yuta/ui`.

Do not create thin wrappers solely to reduce line count or promote a component
to `@yuta/ui` before independent reuse is demonstrated.

Do not move trusted data loading, authorization/local-session checks,
transaction logic, printer/device ownership, or domain calculations into
client presentation code.

Run affected existing typechecks/tests and provide browser evidence. Do not
perform Phase 3 automatically.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/03_INTERACTIONS.md

```text
# Codex Prompt — Phase 3: Approved Interactions

Implement only interactions approved by current product documentation and this
page package.

Preserve the target application's actual trust model: cloud
authorization/tenant scope, public-resolution boundary, local POS session,
standalone-local ownership, or another repository-defined boundary. Do not
assume a Backoffice tenant model.

Preserve current mutation/action/transaction ownership, validation,
destructive confirmation, merge/replace rules, dirty-state behavior, polling,
retry, offline recovery, device behavior, and idempotency where applicable.

Do not add a state/form/data library for one page when the repository already
has an established approach.

Test applicable keyboard, touch, focus, pending, validation, success, error,
degraded, retry, and recovery behavior. Report exact commands and results. Do
not perform Phase 4 automatically.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/04_DATA_INTEGRATION.md

```text
# Codex Prompt — Phase 4: Data Integration or Extension

First map the current domain, data owner, transport/contracts, and trusted
runtime boundary to the approved UI.

For an existing integrated screen, do not rewrite data access merely because
the visual composition changed.

Preserve the target application's actual scope and ownership model. Do not
inject organization/establishment tenancy into local POS or other runtimes that
do not use it, and do not bypass cloud tenant rules where they apply.

Stop for approval before adding or changing a field, enum, permission, API
route, contract, schema/migration, transaction rule, runtime dependency, device
setting, printer route, or persistence owner.

Run only affected repository commands that actually exist. Include local API,
database, offline, and device tests when the approved change touches those
boundaries. Do not perform Phase 5 automatically.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/prompts/05_VISUAL_QA.md

```text
# Codex Prompt — Phase 5: Visual and Operational QA

First verify that applicable functional/regression checks have passed. If they
failed, report the regression and stop visual parity work unless the failure is
explicitly accepted as a blocker.

Use target-application UI rules/product docs and this page package to determine
the required viewport/device matrix. Do not use a global Backoffice width list.

Capture browser evidence for the target screen and compare it with the approved
hierarchy/reference. Fix major differences in shell alignment, proportions,
density, spacing, typography, semantic color, responsive behavior, overflow,
focus, and touch behavior without changing protected business/runtime behavior.

Compare global/application/section shared UI separately from page-specific
content. Confirm that shell, navigation, account/session presentation, common
states, and responsive behavior match the resolved shared context and that no
page-local design has introduced cross-page UI or dead navigation.

Verify truthful loading, empty, unauthorized/forbidden, pending, validation,
conflict, error, degraded/offline, device, success, retry, and recovery states
that apply to the target.

For operational/device-coupled screens, also verify that UI state does not
overclaim local service, database, printer, worker, or physical-device success.

Run exact existing repository checks defined by the target app/page. Report
commands and results, browser/device evidence, intentional deviations, deferred
work, and risks. Synchronize the stable page package with the as-built result,
including deviations and final evidence, before setting `Package status:
implemented`. Do not claim visual parity, lint, or a successful check without
evidence.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/README.md

```text
# Pointage employee

Status: Approved Design; implementation planning AWAITING_HUMAN_REVIEW

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/pointage/[establishmentSlug]`

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implementation-ready`

Scope status: `APPROVED`

Reference status: `NONE`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

No-image reference reason: Human-approved written state-driven Design provides
the required hierarchy, French copy and state behavior. No image is needed;
no image or screenshot is claimed. See [reference metadata](references/README.md).

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

## Current implementation

The root Backoffice document and Pointage authorization/credential foundation
exist. The employee route, continuation, raw events, transport and Browser QA
do not. Full read-only inventory: [DESIGN_HANDOFF](DESIGN_HANDOFF.md).
No current employee screen exists; baseline capture is not applicable.

## Authority

Root/scoped AGENTS, current product and architecture docs, the current UI
workflow and [Backoffice rules](../../BACKOFFICE_FRONTEND_RULES.md) precede this
draft. Exact approved scope/hashes are in [PRODUCT_SCOPE](PRODUCT_SCOPE.md).
Shared rules: `docs/ui/YUTA_FRONTEND_RULES.md`
([source](../../YUTA_FRONTEND_RULES.md)).
[Technical Design](../../../../openspec/changes/pointage-usable-raw-clocking/design.md)
selects security/time/transaction behavior; this pack cannot expand it.

## Documents

- [PRODUCT_SCOPE](PRODUCT_SCOPE.md)
- [DESIGN_HANDOFF](DESIGN_HANDOFF.md)
- [UI_SPEC](UI_SPEC.md)
- [DATA_AND_INTERACTION_SPEC](DATA_AND_INTERACTION_SPEC.md)
- [ACCEPTANCE_CHECKLIST](ACCEPTANCE_CHECKLIST.md)
- [IMPLEMENTATION_PLAN](IMPLEMENTATION_PLAN.md)
- [Reference metadata](references/README.md)
- [Sealed prompt provenance](prompt-provenance.json)
- [00 Repository analysis](prompts/00_REPOSITORY_ANALYSIS.md)
- [01 Visual baseline](prompts/01_VISUAL_BASELINE.md)
- [02 Component refactor](prompts/02_COMPONENT_REFACTOR.md)
- [03 Interactions](prompts/03_INTERACTIONS.md)
- [04 Data integration](prompts/04_DATA_INTEGRATION.md)
- [05 Visual QA](prompts/05_VISUAL_QA.md)

Pack completion metadata: the previously partial Design-stage pack now has its
Implementation Plan, six canonical prompt snapshots and no-image metadata.
The generator was not run: it refuses an existing destination. Missing prompts
were copied byte-exactly from the current canonical template, then hashed and
sealed with their actual source revision and current Git commit. No pre-seal
customization or invented provenance. The validator is run without modification.

## Shared UI context

NO_APPLICATION_SHELL. Reuse root typography, semantic tokens and shared
primitives. No cloud-account chrome, restaurant selector, manager sidebar,
mobile navigation or invented shared shell. See the four-layer context matrix
and self-contained written design prompt in DESIGN_HANDOFF.

## Protected invariants

Own minimal state only. Current eligibility and exact authority on every
protected read/mutation/replay. No clock backdating, Planning rounding,
history/totals, durable browser employee identity or offline fallback.
A receipt is not a second attendance source. Shared-device clearing and
unknown-outcome recovery remain explicit. Test data is synthetic/disposable
only; real attendance and production enablement remain NOT_AUTHORIZED.

## Change impact

Current writes: planning completion files and authorized README metadata/links
only in this pack; approval metadata and planning review recorded separately.
Five existing reviewed documents remain byte-identical. Their historical
DRAFT/pre-approval labels and unchecked planning boxes are retained by explicit
user instruction; current approval/completion status is recorded here.

Future proposed boundaries (not authorized Apply): Backoffice employee route
and server Pointage consumer, @yuta/contracts DTOs, @yuta/auth state-guard
primitive, @yuta/db-cloud raw/receipt/continuation persistence.

Cross-application impact: no local/public application change.

Files expected to modify: Isolated exports and foundation integration only;
exact paths and dirty-hunk protections in master Tasks / IMPLEMENTATION_PLAN.

Files expected to create: Approved employee page, transport, domain, DTO,
persistence and tests; exact path keys in master Tasks / IMPLEMENTATION_PLAN.

Packages affected: @yuta/backoffice, @yuta/contracts, @yuta/auth, @yuta/db-cloud.

Database change: YES

API or contract change: YES

Permission/auth change: YES

Runtime/device change: NO

These flags describe approved Design impact, not Apply authority. Existing six
operations and grants remain unchanged; no new runtime/device, only approved
cloud synthetic-test composition.

## Design approval

Scope: exact revised Gate 2 Specs APPROVED_FOR_DESIGN.
Design, layout, copy and no-image direction: APPROVED by explicit current-user
instruction on the exact Sensitive Design packet. Approval recorded 2026-09-08.
Source: [Sensitive Design review](../../../reviews/pointage-usable-raw-clocking/02b-design-review.md).
Subsequent user permission: README metadata/completion links only; no changes
to approved Product/UI/Design content in the other five documents.
Tasks and implementation planning are authorized; Apply is not.
The master plan has four Apply phases; UI prompts are mapped checkpoints,
not extra Apply phases. See IMPLEMENTATION_PLAN for execution and human stops.

Apply authorization: NOT_GRANTED.
Production enablement: NOT_AUTHORIZED.
Package status implementation-ready denotes pack completeness, not Apply,
implementation, successful QA or production-readiness approval.

## Stop conditions

Stop for a Product/authority conflict, unsupported Personnel projection,
production provider, real attendance data, new permission/runtime, raw mutation
or expanded visible behavior. Do not weaken Specs for implementation convenience.

## Final delivery and as-built status

Implementation: NOT_STARTED.
Functional/regression QA: NOT_RUN.
Visual/browser evidence: NOT_RUN; required after implementation.
As-built documentation status: PENDING.
Only planning inventory is complete, not the UI or its QA.
```

### Exact artifact: docs/ui/pages/backoffice-pointage-employee/references/README.md

```text
# Pointage employee — Reference Metadata

Status: Approved no-image reference decision

Visibility: Engineering

Reference file: NONE

Reference status: NONE

Approved scope/date or review note: Current-user Sensitive Design approval
recorded 2026-09-08 on the exact Design/UI packet; subsequent explicit
permission allows only README metadata/completion links to change.

Purpose: The employee surface is a bounded, state-driven interaction with
approved written hierarchy, French copy, responsive behavior and shared-device
isolation. UI_SPEC and DESIGN_HANDOFF contain that written visual direction;
no image is required to implement it.

Provenance: Explicit human approval of the existing written/no-image Design
set, recorded in
[02b-design-review](../../../../reviews/pointage-usable-raw-clocking/02b-design-review.md).
No generated image, screenshot, mockup, capture session or external reference
is claimed. This directory intentionally contains metadata only.
Current completion and approval metadata: [page README](../README.md).

Intentional non-authority: A visual reference does not define routes, Product
scope, authorization, permissions, contracts, APIs, persistence, runtime/device
ownership, business logic, legal policy or production readiness.
Browser QA screenshots will be actual synthetic-route evidence after formal
VERIFY, not retrospective design-reference provenance.
```

### Exact artifact: openspec/changes/pointage-usable-raw-clocking/tasks.md

```text
# Pointage usable raw clocking — Tasks and Implementation Plan

Change: pointage-usable-raw-clocking

Schema: yuta-spec-driven

Status: AWAITING_HUMAN_REVIEW

Sensitive Design: APPROVED — exact reviewed bytes, not implementation approval.

Apply authorization: NOT_GRANTED

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Production enablement: NOT_AUTHORIZED

## Authority and planning boundary

Kế hoạch này chỉ chuẩn bị Apply. Không checkbox nào được đánh dấu hoàn tất.
Approved [Proposal](proposal.md), [Analysis](analysis.md), hai delta Specs và
[Design](design.md) giữ nguyên bytes; P1-P14, 20 requirements / 62 scenarios
không thay đổi. Design D1-D12 và revised D4/D6 là technical authority.
Gate 2b approval và metadata-only README exception được ghi tại
[review](../../../docs/reviews/pointage-usable-raw-clocking/02b-design-review.md).
[UI Implementation Plan](../../../docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md)
chuyên biệt phase 3, không tạo kế hoạch Product hoặc attendance source thứ hai.

Synthetic/disposable-only là current change authorization cho development,
tests và Browser QA; không là domain invariant, field, enum, employee category,
permission hoặc runtime employee classifier. Real attendance:
NOT_AUTHORIZED ở development, staging và production. Không production
TrustedPointageClientAddressProvider/default. Giữ cả bảy blockers: exact
retention duration; deletion/anonymization; legal hold; backup-retention
interaction; employee notice; detailed audit visibility; trusted production
client-address provenance. Production runtime-role proof chưa có và không
được suy ra từ disposable tests.

Explicit non-scope giữ nguyên toàn bộ Proposal và R13: không manager hoặc
credential-management UI, history/totals/prior clock-out, monthly dashboard,
break/pause/meal/manual adjustment/correction/auto-close/weekly acknowledgement,
Planning/Today/reconciliation/rounding/anomalies, day/payroll allocation,
HS/HC, absences, jours fériés, avantages en nature, payroll/TESE/closure/PDF/export,
session/materialized projection table, credential crypto/grant redesign,
standalone revoke/suspend, upcoming-issuance rule, global identity, Personnel
write-back, new app/topology, POS/Site Agent/Display/db-pos/offline queue/sync.
Không deploy, enable, sync/archive hoặc promote lifecycle/readiness.

## Implementation sequence and repository reality

Chỉ bốn Apply phases được user yêu cầu, theo dependency 1 → 2 → 3 → 4.
Foundation hiện có credential primitives, scoped issue/reset repository,
candidate/client limiter, audit và exact six-operation service. Chưa có raw
tables, continuation consumer, employee route/API hoặc reducer. Vì vậy cả Data,
Domain, Transport/UI và Integration đều cần; không thêm phase theo template.
UI prompts 00-05 là checkpoints của UI workflow, không sáu Apply phases mới.
Phase 00 là read-only preflight; 01-04 thuộc phase 3 khi có approval tương ứng;
05 chỉ sau formal VERIFY trong QA. Giữ các human stop của prompts; không coi
approval kế hoạch này là approval tự động cho checkpoint execution.

Repository root: D:/working/yuta/yuta-resto. Nearest instructions:
AGENTS.md; packages/auth/AGENTS.md; packages/contracts/AGENTS.md;
packages/db-cloud/AGENTS.md; apps/backoffice/AGENTS.md.
Không có scoped AGENTS sâu hơn tại planned Pointage boundaries khi lập kế hoạch.

Authorities cần đọc lại trước Apply: docs/README.md, docs/CURRENT_STATE.md,
docs/AUTHORITY_MODEL.md, docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md,
docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md,
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/architecture/AUTHENTICATION.md,
docs/architecture/TENANCY.md, docs/architecture/DATABASE_BOUNDARIES.md,
docs/decisions/ADR-003-database-ownership-boundaries.md,
docs/features/personnel/README.md, normative pointage/authority-foundation
và authorization/pointage. UI: docs/ui/README.md, YUTA_FRONTEND_RULES.md,
BACKOFFICE_FRONTEND_RULES.md, DESIGN_TO_CODE_WORKFLOW.md,
DELIVERY_WORKFLOW_MODES.md, PAGE_PACK_PROTOCOL.md và stable page pack.
Post-Apply QA: docs/YUTA_QA_PROTOCOL.md.
Các paths UI vừa nêu nằm dưới docs/ui/, không phải root. Không copy toàn bộ rules.

### Dirty-worktree preflight — mandatory before any future code edit

Planning baseline HEAD: defbc50eba3952fa2e7b1c016637daf083b18c65.
Fresh status/hash evidence nằm trong planning review. Đây không phải clean
checkout. Foundation implementation còn untracked; auth export có Formalités
hunk; db-cloud exports/schema journal và nhiều unrelated files dirty.
Trước Apply phải recompute từng approved artifact hash/path set, fresh Git
status và exact bytes cho tất cả intended existing/new paths.

Đặc biệt packages/auth/src/index.ts: giữ nguyên unrelated Formalités export
hunk; chỉ thêm isolated Pointage export sau khi đối chiếu byte/hunk baseline.
packages/db-cloud/src/index.ts, src/schema/index.ts, drizzle/meta/\_journal.json
cũng phải preserve existing foundation/unrelated content, không regenerate
hoặc overwrite history. Existing untracked foundation files thuộc user, không
được coi là new files của raw-clocking. Nếu intended path đã xuất hiện/đổi,
hunk không isolate được, hoặc cannot produce exact attributable diff: STOP
trước edit; không reset/checkout/stash/format toàn repo.

Mọi paths bên dưới là allowlist dự kiến, không blanket permission cho directory.
Generated migration names chỉ được resolve từ current Drizzle output sau Apply
approval: một next journal entry, SQL và snapshot tương ứng; không pin sequence
0020 hoặc rewrite migration 0019. Nếu output cần thêm unrelated schema changes,
STOP thay vì tự absorb chúng. Không thêm dependency/package script/framework.
Điều chỉnh file ownership hoặc technical behavior ngoài allowlist cần review.

### Planned path keys

Các keys dưới đây rút gọn traceability, không che file scope.

| Key          | Exact expected paths / ownership                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH         | New packages/auth/src/pointage-continuation.ts; packages/auth/test/pointage-continuation.test.ts. Modify packages/auth/src/index.ts for isolated exports only. Preserve pointage-credential.ts crypto.                                                                                                                                                                 |
| DATA         | New packages/db-cloud/src/schema/pointage-raw-clocking.ts; packages/db-cloud/src/pointage-raw-clocking-repository.ts. Modify packages/db-cloud/src/schema/pointage.ts only required credential composite unique key; src/schema/index.ts and src/index.ts isolated exports.                                                                                            |
| DBTEST       | New packages/db-cloud/test/pointage-raw-clocking-schema.test.ts; packages/db-cloud/test/pointage-raw-clocking.integration.test.ts; packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts; packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts.                                                                                  |
| MIGRATION    | Future generated packages/db-cloud/drizzle/<next-generated>.sql, drizzle/meta/<next-generated>\_snapshot.json and one additive drizzle/meta/\_journal.json entry. Exact names/hash set must be recorded from actual generation before migration execution. No migration created during planning.                                                                       |
| DOMAIN       | New apps/backoffice/src/server/pointage/raw-chain.ts; raw-clocking-service.ts; raw-clocking-runtime.ts; raw-clocking-test-boundary.ts; raw-clocking-manager.ts. Existing service.ts, authorization.ts and index.ts only bounded foundation integration/exports if needed; six-operation catalog unchanged.                                                             |
| SERVICE_TEST | New apps/backoffice/test/pointage-raw-chain.test.ts; pointage-raw-clocking-service.test.ts; pointage-raw-clocking-runtime.test.ts; pointage-raw-clocking-manager.test.ts.                                                                                                                                                                                              |
| DTO          | New packages/contracts/src/pointage/index.ts and packages/contracts/test/pointage.test.ts; isolated export in packages/contracts/src/index.ts, no manifest/subpath addition.                                                                                                                                                                                           |
| HTTP         | New apps/backoffice/src/server/pointage/raw-clocking-http.ts; apps/backoffice/src/app/api/pointage/[establishmentSlug]/context/route.ts; identify/route.ts; state/route.ts; clock-in/route.ts; clock-out/route.ts; recover/route.ts; end/route.ts under the same API prefix.                                                                                           |
| PAGE         | New apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx; \_components/pointage-employee.tsx; \_components/pointage-credential-entry.tsx; \_components/pointage-active-interaction.tsx; \_lib/pointage-interaction.ts; \_lib/pointage-client.ts under the same page prefix.                                                                                   |
| HEADERS      | New apps/backoffice/src/proxy.ts with matcher limited to Pointage page/API; no current proxy/middleware found. Compose route nonce/security headers without changing other routes or root/authenticated layouts.                                                                                                                                                       |
| UI_TEST      | New apps/backoffice/test/pointage-raw-clocking-http.test.ts; pointage-interaction.test.ts; pointage-raw-clocking-inventory.test.ts. Existing test/pointage-foundation-inventory.test.ts may receive only historical-foundation versus bounded-new-consumer assertions; never remove security denials.                                                                  |
| DOC          | Existing docs/architecture/AUTHENTICATION.md, docs/architecture/DATABASE_BOUNDARIES.md and stable page pack for eventual accurate implementation/QA notes only. No Product Knowledge/Registry/Current State/Personnel lifecycle promotion; preserve dirty hunks. Approved five UI documents stay byte-locked unless later review explicitly authorizes as-built edits. |

Future code/tests use English identifiers/comments. OpenSpec task explanations
use Vietnamese per schema; UI pack and technical docs use English; employee
copy remains approved French.

## 1. Foundation / Data

### TECHNICAL IMPLEMENTATION CONTRACT — Foundation / Data

Owner: Pointage raw evidence; @yuta/db-cloud persistence/transactions;
@yuta/auth portable crypto only. Boundaries: AUTH, DATA, DBTEST, MIGRATION.
Sources: scoped auth/db-cloud AGENTS; DATABASE_BOUNDARIES/TENANCY; Design
D1, D2, D5-D7, Migration Plan; raw R3/R5 and auth A6. No framework or DB in auth.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                                                                                                                                                            | Required evidence                                                                                                                                                                                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Add opaque 32-byte CSPRNG continuation, ptc1\_ plus 43 base64url chars, SHA-256 digest and timing-safe checks; isolated HKDF stateGuard key label yuta/pointage/raw-state-guard/v1, length-delimited org/est/dossier/head-or-START HMAC; no existing credential crypto redesign or secret output.                                                                                                                                                        | AUTH vectors, malformed input/collision injection, scope separation, timingSafeEqual call/length paths; no plaintext persistence/logging.                                                                                                                                                                                 |
| F2  | Exactly three new tables. Raw UUIDv7, full scoped dossier FK, contiguous bigint ordinal, CLOCK_IN/OUT, DB instant microseconds and calendar context. Receipt scoped UUIDv4 request key, version-1 intent fingerprint and event link only, no duplicate canonical attendance facts.                                                                                                                                                                       | DBTEST shape, keys/FKs/indexes; no session/projection/correction/Planning/classifier fields.                                                                                                                                                                                                                              |
| F3  | Event/receipt mutual scoped FKs INITIALLY DEFERRED NO ACTION, non-deferred unique keys; same transaction must insert both. Raw/receipt UPDATE/DELETE and TRUNCATE rejected by database enforcement.                                                                                                                                                                                                                                                      | Raw-only/receipt-only COMMIT fails; valid pair commits once; direct SQL with actual writer cannot alter/delete/truncate or cross scope.                                                                                                                                                                                   |
| F4  | Raw INSERT trigger takes scoped dossier lock, validates complete chain/next kind/ordinal, captures one DB clock instant and current lifecycle/calendar; no caller time/ordinal authority.                                                                                                                                                                                                                                                                | Invalid alternation/gap/cross-dossier/corrupt chain/backward clock denial; microsecond preservation and accepted-time lifecycle assertion.                                                                                                                                                                                |
| F5  | Continuation fields/keys exactly D6, including credential full tuple unique/FK. Immutable binding/digest/version/issued/absolute columns; NOT NULL/CHECK and OLD/NEW IS DISTINCT FROM trigger; only live monotonic idle and one-way DB-timestamp end update.                                                                                                                                                                                             | Every immutable column denied; idle decrease/over-cap, expired/ended revival denied; repeated end preserves timestamp; concurrent touch/end serializes.                                                                                                                                                                   |
| F6  | Before provider instantiation or fixture/migration/attendance write: flag true, `NODE_ENV` development/test, VERCEL absent, configured loopback origin/server; URL hostname allowlist `localhost`, `127.0.0.1`, `[::1]`. Exact case-sensitive whole-string match `^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$` consumes the entire parsed name; `SELECT current_database()` must return that exact name and independently pass the same exact rule. | Reject `yuta_cloud`, staging/production, non-loopback, malformed/prefix/suffix/whitespace/newline/encoded aliases, query/fragment override, name mismatch or missing probe; no normalization. No browser/environment-derived synthetic employee classifier. Integration and Browser QA cannot bypass/weaken these guards. |
| F7  | Generated/journaled additive migration and exact SQL for approved triggers/constraints only. Existing foundation migration/journal bytes preserved except one new entry; no backfill/seed, no db:push/manual alternate history.                                                                                                                                                                                                                          | Review generated SQL/snapshot/journal and clean-base plus foundation-upgrade disposable migration; rerun migration no-op; clock test override removed before proof.                                                                                                                                                       |
| F8  | Dedicated disposable non-owner/non-superuser writer: only required SELECT/INSERT and continuation UPDATE(idle_expires_at, ended_at); no broad/inherited/PUBLIC/SET ROLE/DDL or destructive grants. No owner fallback; bounded repo touch/end only.                                                                                                                                                                                                       | Catalog/effective privilege probes plus actual writer negative SQL; owner/writer identities distinct; inability to prove privileges blocks runtime/test composition. No production role claims.                                                                                                                           |

Rollback/recovery: stop/disable synthetic composition; rollback uncommitted
transaction, retain committed raw evidence. No DROP/truncate/down migration
or destructive cleanup of evidence in an existing database. Disposable fixture
lifecycle only within verified newly provisioned test database, never shared
volumes/databases. No production provisioning. Missing safe disposable resource,
unexpected generated schema or inability to enforce trigger/privilege/paired
commit semantics: STOP; don't weaken enforcement to pass.

- [ ] 1.1 Implement F1 portable primitives and isolated export; verify AUTH unit vectors, invalid token lengths, digest/guard separation and no secret persistence.
- [ ] 1.2 Add F2 raw/receipt schema and scoped keys/indexes; verify DBTEST shape and cross-scope FK assertions without session or classifier tables.
- [ ] 1.3 Add F5 continuation schema/credential tuple key and bounded repository methods; verify immutable-field and TTL/end method contracts in tests.
- [ ] 1.4 Add F3/F4 database enforcement and transaction support; verify raw-only/receipt-only commit, invalid chain and raw/receipt mutation rejection on PostgreSQL.
- [ ] 1.5 Enforce F5 continuation triggers and F8 writer boundary; verify each immutable column, effective privileges, monotonic idle/cap and no ended/expired revival with the runtime writer.
- [ ] 1.6 Implement F6 reusable synthetic test-boundary validation and disposable harness; verify parsed/actual name equality and full unsafe-environment rejection before provider/write.
- [ ] 1.7 Generate F7 next additive journaled migration after fresh journal review; verify exact generated path set, unchanged foundation history and empty/upgrade/no-op disposable migration proof.
- [ ] 1.8 Complete F2-F8 database integration regressions using separate connections and actual restricted writer; collect command exits, schema/privilege/migration proof without claiming formal VERIFY.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

Owner: Backoffice Pointage server; Personnel retains dossier/name/lifecycle;
DB repository owns storage/locks, auth owns portable primitives. Paths DOMAIN,
SERVICE_TEST, DATA and DBTEST bounded methods/tests, AUTH consumed not redesigned.
Sources: Backoffice/db-cloud AGENTS, AUTHENTICATION/TENANCY, Personnel authority,
Design D2-D10; all A1-A7 and raw R1-R10. No new shared package or grant.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                                                                 | Required evidence                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Pure full-chain reducer validates scope, contiguous ordinal, alternating kinds, nondecreasing instants/calendar/linkage; derives sessions/state only, max one open, sequential sessions unlimited, no fabricated close or cache/table authority.                                                                                                              | SERVICE_TEST raw-chain cases for all four transitions, multiple sessions, absent OUT and every corruption category; 503 on impossible persisted chain.                                                                      |
| S2  | Accepted instant = single post-lock DB clock_timestamp(), timestamptz(6), lossless UTC text/epoch microseconds; equal instants ordered by ordinal, backwards denied not clamped. Retain IANA zone/offset/business date; group by IN business date across midnight and later timezone/tzdb changes.                                                            | Microsecond round-trip, equal/backward instants, DST repeated local labels, zone-change historical stability; no Date truncation/browser backdate/Planning rounding.                                                        |
| S3  | Successful identify: verified credential → exact identify → current scoped Personnel eligibility → memory candidate → separate exact state.read plus current scope/lifecycle/version → raw-chain validation/derive → final dual checks → continuation INSERT/COMMIT → combined token/state. No partial protected payload or identify-only persisted issuance. | Deny state.read after identify succeeds; scope/lifecycle/chain/DB faults at each boundary; no exposed token/name/state or partial continuation commit. Unknown COMMIT may leave only fully dual-authorized expiring orphan. |
| S4  | Continuation bound to current credential version, 120s absolute/60s idle, no heartbeat/mid-interaction rotation; all three exact employee operations check current eligibility and trusted scope. Fresh token on fresh identify; own end is continuation termination, no new catalog operation/grant/revoke.                                                  | TTL/end/reset rejection on state/mutation/replay; inclusive entry/final departure, before/after/missing lifecycle denial; no generic cookie/cloud/Personnel/POS authority.                                                  |
| S5  | READ COMMITTED; organization FOR SHARE → establishment FOR SHARE → scoped Personnel FOR UPDATE → continuation FOR UPDATE; validate current scope/version/lifecycle and reread chain after lock. Receipt lookup before new transition; guard protects exact observed head, no auto-rebase. Lock 2s, statement 5s.                                              | Multi-connection competing IN/OUT; reset/lifecycle/end serialization; stale OUT of A cannot close later B; rollback all writes on final lifecycle/TTL failure at actual accepted instant.                                   |
| S6  | UUIDv4 request + exact kind/guard fingerprint version 1 (D6 ordered JSON array); same ID/intent joins original immutable raw receipt after current authority, different intent 409; scope/request identity not authority. Recovery only known tuple, UNCONFIRMED not failure proof.                                                                           | Same-ID double submit one pair; replay after current state changes; unknown commit + same tuple returns original instant; old credential denied; newly identified current credential may recover known own tuple.           |
| S7  | Manager read is server function only, exact establishment.read with fresh active matching OWNER/MANAGER membership; STAFF/employee denied. REPEATABLE READ snapshot + fresh authorization after read. Only current-day raw events and current open session, including earlier-day opening.                                                                    | Cross-tenant/sibling-establishment/role/grant/membership-race denials; no closed history beyond day, monthly/payroll/audit or manager transport.                                                                            |
| S8  | Minimal scoped Personnel id/givenNames/familyName/entry/departure projection, trim/join name only. Audit uses existing minimized taxonomy/exact operation attribution, no credential/token/guard/name/raw/receipt body logs, no competing attendance metadata.                                                                                                | Selected/serialized field allowlists; audit/log capture negative tests and exact deny attribution; no Personnel write/list/details/history permission.                                                                      |
| S9  | Runtime composes only approved injected synthetic provider after F6 and writer proof; missing/untrusted provider before credential processing, existing distributed candidate 5/client 30 per 15min with 15min block preserved. Generic failure mappings; no forwarded/unknown-client/candidate-only default.                                                 | Spy proves no credential hash/lookup on failed provenance; distributed limiter regressions and scope isolation; no production/default provider export/composition.                                                          |

Rollback/recovery: abort whole uncommitted operation; uncertain commit stays
unknown until exact authorized receipt recovery. Never delete accepted evidence,
auto-close, replace scope, relax eligibility or reuse superseded authority.
If minimal Personnel projection conflicts with actual authority, exact locks
cannot coordinate existing reset/lifecycle writers, or new grant/owner needed:
STOP at Design/Control Tower; no silent Spec edits.

- [ ] 2.1 Implement S1 pure reducer; verify all transitions, multiple sessions, max one open, corrupt-chain fail closed and no fabricated evidence.
- [ ] 2.2 Implement S2 lossless time/calendar handling and S5 stateGuard integration; verify microseconds/equal-clock/DST/timezone/cross-midnight and stale head denial.
- [ ] 2.3 Implement S3 dual-guard identify and S8 minimal Personnel projection; verify each partial-failure point denies both protected state and usable token.
- [ ] 2.4 Implement S4 scoped continuation validation/touch/end and exact three-operation eligibility; verify expiry, end, reset and entry/departure boundaries without catalog changes.
- [ ] 2.5 Implement S5 atomic transition transaction and final accepted-instant guards; verify lock ordering, rollback, stale OUT and multi-connection competing commands.
- [ ] 2.6 Implement S6 committed replay/recover; verify same ID/intent receipt, different-intent conflict, unknown commit and current-authority recheck.
- [ ] 2.7 Implement S7 minimal manager server read; verify OWNER/MANAGER versus STAFF/employee, active membership race, bounded day/open-session projection and no manager API.
- [ ] 2.8 Compose S9 test-only runtime and S8 minimized denial/audit handling; verify prerequisite ordering, distributed candidate/client limits, generic failures and no secret/identity leak.
- [ ] 2.9 Complete SERVICE_TEST/DBTEST contract regressions for S1-S9; collect exact assertions/results and preserve all unchanged foundation security tests.

## 3. Employee Transport / UI

### TECHNICAL IMPLEMENTATION CONTRACT — Employee Transport / UI

Owner: @yuta/contracts serialization-safe strict Zod DTOs; Backoffice Node
handlers/server authority; route-local client presentation state only.
Paths DTO, HTTP, HEADERS, PAGE, UI_TEST. Sources: scoped contracts/Backoffice
AGENTS, Design D1-D4/D8-D11, approved UI_SPEC/DATA_AND_INTERACTION_SPEC,
shared/app UI rules, UI Implementation Plan. No application shell or shared UI edits.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                           | Required evidence                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| U1  | Strict 4KiB JSON allowlists: identify credential, state/end empty body, IN/OUT requestId+observedStateGuard, recover same tuple+kind. Only neutral context GET; protected data POST. No trusted IDs/roles/context, browser accepted time or extra fields.                                                               | DTO strict/unknown-key, length, UUID, token/guard/kind and bounded serialization tests; no DB import/browser secret dependency.                                    |
| U2  | Exact D8 context/identify/state/clock-in/clock-out/recover/end handlers under approved prefix, Node runtime, delegated exact operation guards. Dedicated Authorization: Pointage, credentials omit, exact configured Origin and Sec-Fetch-Site rejection; no wildcard CORS/generic session.                             | Real handler tests for methods/body/origin/cross-scope/status, 204 own end, no extra operation or route.                                                           |
| U3  | Neutral dynamic HTML/RSC; private no-store/revalidate0 page and data; route-only nonce CSP and cache headers per D10, no personal SSR/URLs/analytics/logging/service worker. No other route/header behavior changes.                                                                                                    | Header/nonce/HTML payload tests, dependency inventory, negative cookie/cache/CORS/secret diagnostics.                                                              |
| U4  | One responsive column under existing root fonts, NO_APPLICATION_SHELL; approved French copy and shared Card/Input/FormField/Button/Alert/Skeleton/StatusBadge as needed. Layout/semantic tokens/Lucide only, accessible keyboard/focus/touch.                                                                           | Route composition inspection, field/status accessible names, no sidebar/account/navigation, no horizontal overflow at QA viewports later.                          |
| U5  | Credential entry/identify pending/both states/mutation pending/both receipts/state conflict/request conflict/unknown/access failure/rate limit/unavailable/end-neutral. No optimistic success; no history/totals/prior OUT, no employee chooser. PIN clears on identify settle; receipt max10s.                         | State transition tests for all approved visible states, no protected rendering on partial identify, no duplicate submit or auto retry.                             |
| U6  | Memory-only token/identity/guard/tuple; end/hidden/pagehide/navigation/idle/absolute reset synchronously removes personal DOM/memory, aborts callbacks and increments generation; pageshow/bfcache/back/refresh/duplicate/restart neutral. Local clearing is not remote ACK; server end/expiry semantics remain honest. | Generation/late-response tests, boundary timer tests, no durable storage/URL/history/channel/cache; future real-browser adversarial navigation + sequential users. |
| U7  | Freeze request identity+kind+guard before first mutation; while live, retry/recover exact tuple only, never new ID on timeout or automatic stale rebase. After clearing forget tuple and show fresh current state only; remote outcome remains unknown without receipt.                                                 | Unknown-before/after-commit recovery, UNCONFIRMED behavior, conflict refresh explicit new action, lost tuple does not fabricate failure/event/history.             |
| U8  | UI invokes only composed cloud consumer; no DB/auth primitives/trusted context in client; integration uses real synthetic migrated DB for final evidence. Unit fixtures may isolate deterministic state logic only, not a mock usable route or final success proof.                                                     | UI_TEST route/contract/source inventory plus future real-route Browser QA; no mock-success screenshot, new library, global CSS or unrelated shell changes.         |

Rollback/recovery: fail closed to neutral/unavailable UI; end clears locally
without claiming remote end. No offline queue, token persistence, extra retry
identity or browser scope fallback. Unsupported Product/UI change, shared
primitive/global shell need, transport widening or inability to protect cached
personal DOM: STOP; no authority via visual reference.

- [ ] 3.1 Implement U1 strict DTOs and isolated contracts export; verify bounded bodies and exact response allowlists with DTO tests.
- [ ] 3.2 Implement U2 approved Node handlers and transport adapter; verify exact methods, current operation checks, origin/header validation and non-enumerating statuses.
- [ ] 3.3 Implement U3 route-scoped nonce/cache security boundary; verify neutral HTML/RSC, no-store and no effect on non-Pointage routes.
- [ ] 3.4 Compose U4 approved employee page and meaningful route-local components; verify named exports, shared primitives/French labels and no application shell.
- [ ] 3.5 Implement U5 approved visible states and receipt lifecycle; verify no optimistic success, no forbidden employee output and accessible state transitions.
- [ ] 3.6 Implement U6 memory-only clearing/generation isolation; verify late response, timers, visibility/navigation/bfcache event logic and no durable personal state.
- [ ] 3.7 Implement U7 exact-tuple mutation/recovery client; verify duplicate submit, unknown result, conflict refresh and clearing without new-ID retry.
- [ ] 3.8 Complete U8 transport/interaction integration tests on approved consumer boundaries; collect implementation evidence without declaring Browser QA/VERIFY PASS.

## 4. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

Owner: existing auth/contracts/db-cloud/Backoffice test owners; no new runtime.
Paths AUTH tests, DBTEST, SERVICE_TEST, UI_TEST; DOC bounded implementation
notes subject to exact dirty-hunk isolation. Sources: preceding contracts,
20/62 Specs traceability, Design Verification Design and QA protocol.
Contract IDs R1-R7 below are technical contract rows; Spec R1-R13 are separately
labelled as Spec IDs in traceability.

| ID  | Binding technical requirement                                                                                                                                                                               | Required evidence                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Complete all 20 requirement / 62 scenario assertions, not heading-only coverage; exercise WHEN/THEN/AND with identified code/test paths.                                                                    | No unmapped source scenario, exact future test names/locations and command results; immutable approved source hashes.                               |
| R2  | Multi-connection database concurrency covers distinct IN/OUT, same-ID submit, stale OUT A→B, reset/lifecycle/end races and unknown COMMIT recovery.                                                         | Barrier-controlled competing writers; SQL raw/receipt counts/linkage and original instants, no accepted duplicates/orphans.                         |
| R3  | Adversarial current-authority tests cover three employee operations, dual identify, manager grants, org/est/dossier/credential binding, missing/untrusted provider and both distributed limiter dimensions. | Denials produce no protected payload/illegal side effect; spoofed headers and unsafe environment rejected before credential work.                   |
| R4  | Real disposable migration/writer/trigger proof plus microseconds/DST/timezone/departure and corrupt-chain denial.                                                                                           | Fresh+upgrade migration results, privilege inspection and real SQL denials, exact database identity; deterministic clock helper isolated/restored.  |
| R5  | Browser interaction regression implementation tests protect every visible state, unknown-result tuple and shared-device generations; no final QA claims from unit/handler tests.                            | UI_TEST focused outputs and complete post-Apply real-route scenario plan, no mock success substituted.                                              |
| R6  | Negative-scope/dependency/audit/cache inventory and bounded accurate technical docs; preserve existing foundation tests, Formalités hunks and other modules.                                                | Exact scoped diff, no local/POS/offline/Planning/payroll/canonical-session/classifier/new-provider/grant; no lifecycle promotion or secret logging. |
| R7  | Apply completion checks/tests collect attributable evidence only; do not determine formal Technical Implementation Compliance, VERIFY or QA, and do not create Gate3 packet.                                | Completed task outcomes with commands/exits/skips, scoped code/test diff and unresolved deviations handed to separate post-Apply evaluation.        |

Rollback/recovery: fix in-scope implementation defects and rerun affected tests;
unsafe environment or changed authority → STOP. Never make a test pass by
removing required denials, downgrading DB evidence to mocks or broadening scope.
No deploy/enable/sync/archive. No legal/privacy policy execution.

- [ ] 4.1 Complete R1 test mapping for all 20 requirements/62 scenarios; verify every source assertion has actual implementation/test reference and no unmapped case.
- [ ] 4.2 Add R2 multi-connection race/recovery regressions; verify one accepted pair and original receipt for each competing/replay scenario.
- [ ] 4.3 Add R3 hostile scope/lifecycle/provider/rate-limit regressions; verify no partial authority/display and no fallback on prerequisite failure.
- [ ] 4.4 Complete R4 migrated disposable DB/runtime-writer/time/corruption proof; verify real SQL outcomes, safe database identity and restored real clock.
- [ ] 4.5 Complete R5 interaction/navigation/recovery regression code and test assertions; verify late responses cannot restore prior interaction; formal Browser QA remains later.
- [ ] 4.6 Complete R6 negative inventory and bounded accurate technical documentation; verify exact scoped diff preserves dirty foundation/Formalités/UI work and all non-scope/readiness blockers.
- [ ] 4.7 Run R7 implementation-completion checks/tests and collect evidence; verify all Apply outcomes are evidenced, without declaring TECHNICAL IMPLEMENTATION COMPLIANCE or VERIFY/QA PASS and without creating 03-final-review.md.

## Commands and evidence plan

Các commands sau tồn tại trong current manifests/CLI. Test file selectors bên
dưới là planned files sẽ được tạo trong Apply; chưa chạy, không giả rằng file
hoặc script mới đã tồn tại. CWD là repository root trừ khi ghi rõ.
Không thêm lint/e2e/db script tưởng tượng.

| Key | Exact command                                                                                                                                                                                                                                                                                                                                                                                             | Intended use / prerequisite                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | `openspec validate pointage-usable-raw-clocking --strict`                                                                                                                                                                                                                                                                                                                                                 | Planning and formal VERIFY; exact two delta paths.                                                                                           |
| C2  | `pnpm docs:check`                                                                                                                                                                                                                                                                                                                                                                                         | Planning and Apply/post-Apply docs consistency.                                                                                              |
| C3  | `pnpm architecture:check`                                                                                                                                                                                                                                                                                                                                                                                 | Planning and every affected dependency/import/environment/migration boundary.                                                                |
| C4  | `pnpm -r --if-present typecheck`                                                                                                                                                                                                                                                                                                                                                                          | Workspace diagnostics; preserve unrelated failures and report them, not silent PASS.                                                         |
| C5  | `pnpm ui:pack:check backoffice-pointage-employee`                                                                                                                                                                                                                                                                                                                                                         | Stable pack structure/lifecycle/provenance, not subjective UI or implementation PASS.                                                        |
| C6  | `pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/tasks.md docs/ui/pages/backoffice-pointage-employee/IMPLEMENTATION_PLAN.md docs/ui/pages/backoffice-pointage-employee/README.md docs/ui/pages/backoffice-pointage-employee/references/README.md docs/ui/pages/backoffice-pointage-employee/prompt-provenance.json "docs/ui/pages/backoffice-pointage-employee/prompts/*.md"`    | Scoped planning formatting; check only, no formatter write on byte-locked docs. Review packet checked separately by exact path.              |
| C7  | `pnpm format:check`                                                                                                                                                                                                                                                                                                                                                                                       | Broader diagnostic; pre-existing formatting failures do not authorize cleanup.                                                               |
| C8  | `pnpm --filter @yuta/auth test test/pointage-continuation.test.ts test/pointage-credential.test.ts`                                                                                                                                                                                                                                                                                                       | F1 plus unchanged foundation crypto.                                                                                                         |
| C9  | `pnpm --filter @yuta/contracts test test/pointage.test.ts`                                                                                                                                                                                                                                                                                                                                                | Strict DTO and projection contracts.                                                                                                         |
| C10 | `pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts test/pointage-raw-clocking.integration.test.ts test/pointage-raw-clocking-migration.integration.test.ts`                                                                                                                                                                                                                     | Explicitly enabled, guarded disposable DB and restricted writer; skipped tests are not proof.                                                |
| C11 | `pnpm --filter @yuta/backoffice test test/pointage-raw-chain.test.ts test/pointage-raw-clocking-service.test.ts test/pointage-raw-clocking-runtime.test.ts test/pointage-raw-clocking-manager.test.ts test/pointage-raw-clocking-http.test.ts test/pointage-interaction.test.ts test/pointage-raw-clocking-inventory.test.ts test/pointage-foundation.test.ts test/pointage-foundation-inventory.test.ts` | Service/HTTP/interaction/foundation isolation.                                                                                               |
| C12 | `pnpm test:cloud`                                                                                                                                                                                                                                                                                                                                                                                         | Broader suite without unsafe integration env; record skipped DB suites separately.                                                           |
| C13 | `pnpm build:cloud`                                                                                                                                                                                                                                                                                                                                                                                        | Broader existing cloud build and client/server dependency checks; never production enablement.                                               |
| C14 | `pnpm db:cloud:generate`                                                                                                                                                                                                                                                                                                                                                                                  | Future Apply only after fresh baseline and schema review; inspect generated output before any migration.                                     |
| C15 | `pnpm db:cloud:migrate`                                                                                                                                                                                                                                                                                                                                                                                   | Future Apply only on verified newly provisioned disposable target under owner; fresh/upgrade/no-op proof. Never general .env.local fallback. |
| C16 | `pnpm --filter @yuta/backoffice dev --hostname 127.0.0.1`                                                                                                                                                                                                                                                                                                                                                 | Future real-route QA only, explicit guarded synthetic composition/origin and restricted runtime writer.                                      |
| C17 | `pnpm --filter @yuta/db-cloud test test/pointage-repository.integration.test.ts`                                                                                                                                                                                                                                                                                                                          | Separate guarded foundation disposable DB, not raw-clocking DB; preserve existing suite's own target guard.                                  |

F6 validation/probe must precede C15 and C10 fixture writes/provider; a safe
read-only database-name probe does not authorize migration on an unsafe target.
CLOUD_DATABASE_URL is injected via an approved local test environment, never
printed/committed; YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true only after safe
selection, YUTA_POINTAGE_SYNTHETIC_TEST_MODE=true for raw runtime,
POINTAGE_TEST_ORIGIN=http://127.0.0.1:3001, `NODE_ENV` development/test, no VERCEL.
Use separate migration owner and runtime-writer connections, record identities
without credentials. Never run broad test:cloud with a shared writable database
integration opt-in: older suites have their own guards/setup/cleanup. Run C17
in its separate foundation-only disposable target or report exact blocker.
No database setup/provision/migrate/seed/test execution during this planning turn.

## POST-APPLY VERIFY PLAN

Plans only until all 32 Apply tasks complete. Formal VERIFY is a new evaluation
after Apply, using openspec-verify-change and current workflow/authority reads.
Do not promote Apply test collection directly to formal PASS without reviewing
current bytes, command results, scope and any changed code since those runs.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

Build the Technical Compliance Matrix in post-Apply VERIFY evidence with
exactly all applicable F1-F8, S1-S9, U1-U8 and R1-R7 contract rows (32 total).
For each row: constraint → authoritative Spec/Design section → actual scoped
code path/line → test assertion/command/log hash → PASS or FAIL, with deviations.
No empty row, inferred PASS or checklist-only evidence. A requirement's R label
is not a substitute for the corresponding technical contract row.

Re-evaluate the following separately:

- Recompute approved Proposal/Analysis, each Spec, Design, task/pack/provenance
  and gate hashes/path sets; check authorized metadata exceptions separately.
- Replace the planned 20/62 mapping below with actual code/test lines and exact
  assertion evidence, checking every WHEN/THEN/AND against current behavior.
- Fresh Git status, HEAD and sorted exact allowlist. Review scoped
  `git diff --no-ext-diff --binary -- <explicit tracked path list>`;
  include each new untracked implementation file using
  `git diff --no-index --binary -- /dev/null <exact new path>` on a compatible
  Git invocation, or an explicitly documented deterministic byte snapshot.
  Exit 1 for a no-index difference is expected, not a test failure.
  Exclude pre-existing untracked foundation and unrelated dirty hunks using the
  saved pre-Apply byte baseline, not HEAD alone. Hash exact attributed diff
  bytes, prove it reverses against current files to that baseline, and record
  full sorted implementation path set. Stop if attribution is not reproducible.
- Rerun focused C8-C11, C17 in separate safe target and migration/database proof
  C10/C15; record generated SQL/journal/snapshot hashes and both migration
  directions (empty→current; foundation→current), runtime role effective
  privileges, trigger denials, clock restoration and actual database identity.
  Skipped/no-database tests cannot satisfy F3-F8 or R2-R4.
- Rerun C1-C5, scoped formatting on actual changed files, C12/C13 and broader
  formatting diagnostic C7; attach exact command/cwd/exit/result/time and skips.
  Type/build cache generation is not implementation attribution.
- Record deviations, pre-existing failures and new blockers honestly. Correct
  in-scope defects then rerun impacted VERIFY evidence; changed Product,
  security/ownership or incompatible durable boundary returns to earlier gate.

Only when every matrix row passes and approved behavior matches code with no
critical unresolved issue may the later evidence record
`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and `VERIFY: PASS`.
Failure/blocked environment stays explicit; no QA progression on failed VERIFY.
Neither result grants production use or sync/archive.

## QA PLAN

Separate subsequent evaluation under docs/YUTA_QA_PROTOCOL.md, only after
formal VERIFY passes. UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES.
QA status currently NOT_RUN (planning marker, not an evaluated protocol result).
Later evaluated status must be PASS, FAIL or BLOCKED_BY_ENVIRONMENT;
NOT_APPLICABLE is invalid for this change.

Required environment: actual implemented Next route on loopback + journaled,
migrated disposable PostgreSQL + approved injected synthetic trusted-address
provider + actual restricted writer. All F6 guards apply to QA without bypass.
Only synthetic people/credentials/attendance. No mocked-success screenshot,
real employee data, production provider or staging/production enablement.
Use current available browser tooling; no new visual/e2e dependency authorized.

Run the full page-pack state matrix at 1440x900, 1024x768, 768x1024 and 390x844:
credential entry/identify pending; NOT_CLOCKED_IN/CLOCKED_IN; mutation pending;
both committed receipts; state/request conflicts; unknown-result recover/resend
same tuple; generic access failure; rate limit; unavailable; end/neutral.
Also inspect keyboard/touch/focus/labels/live announcements/long-name wrap,
zoom/reflow/overflow. Preserve French copy and NO_APPLICATION_SHELL.

Adversarial real-route scenarios: IN/OUT/re-identify multi-session;
two tabs/stale OUT across A/B; actual commit with lost response then exact
recovery; reset, expiry60/120, departure midnight; Terminer/receipt10s;
hidden/pagehide/pageshow/bfcache/back/refresh/duplicate/restart; delayed old
response after clearing; subsequent employee cannot see prior state/receipt.
Prove local clearing versus remote end ACK/lost network truthfulness, and no
personal residues in browser durable stores/HTML/RSC/cache/URLs/history/channels.
Backend manager roles/isolation need service/DB evidence, not invented manager UI.

Future evidence under docs/reviews/pointage-usable-raw-clocking/qa/:
QA_REPORT.md, screenshot-manifest.md and actual PNG captures. Manifest records
relative path, SHA-256, actual viewport, scenario/state/role, route, capture
conditions/time and synthetic-only provenance. Screenshots/logs must exclude
plaintext credential/token/guard/trusted context. Screens show observed UI;
SQL/handler/race proofs support nonvisual security claims. Link report and
manifest from eventual Gate3. No qa/ artifacts created during planning.

If environment unavailable: use only safe repository-defined recovery, record
BLOCKED_BY_ENVIRONMENT and stop; never fabricate screenshot/QA PASS. Defects
require in-scope fix then formal VERIFY and affected QA rerun.

## Gate 3 boundary

03-final-review.md may be created only after Apply complete, Technical
Implementation Compliance evaluated PASS, formal VERIFY complete PASS, and
separate mandatory QA complete PASS with hashed real-browser evidence.
Do not create/prepare an awaiting-review Gate3 packet during Apply or planning.
The user-requested planning review is not Gate3; sync authorization remains
ungranted. Do not sync/archive, deploy, enable Pointage or promote lifecycle.

## Requirement and scenario traceability — planned, not executed

A1-A7 refer to authorization/pointage; R1-R13 to pointage/raw-clocking, in exact
approved heading order as Design's mapping. Every scenario inherits its parent
task/test mapping plus its own exact WHEN/THEN/AND assertions. Test suite keys
expand to exact paths in Planned path keys; final test names must include the
scenario ID. All rows are PLANNED / NOT_RUN. Design remains authority for
mechanisms; this inventory does not rewrite either Spec.

### All 20 requirements

| Spec ID | Exact approved heading                                                         | Design        | Apply tasks                 | Planned code                           | Planned tests/evidence                                           |
| ------- | ------------------------------------------------------------------------------ | ------------- | --------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| A1      | Usable consumer dùng dedicated short-lived Pointage continuation               | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A2      | Continuation chỉ self-only trong trusted binding và closed catalog             | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A3      | Current Personnel eligibility áp dụng cho cả ba employee operations            | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A4      | Committed replay không bypass current authorization                            | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A5      | Expiry reset và interaction end không để lại stale authority                   | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A6      | Continuation không serialize trusted context hoặc persist plaintext credential | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A7      | Usable consumer giữ non-enumeration và trusted-address prerequisite            | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| R1      | Raw clocking sử dụng trusted cloud scope và online acceptance                  | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R2      | Raw command vocabulary và bốn transition outcomes là đóng                      | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R3      | Raw evidence immutable là sole canonical attendance source                     | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R4      | Sessions và current state chỉ derived và không overlap                         | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R5      | Stable request identity bảo toàn committed receipt và replay                   | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R6      | Concurrent competing requests có tối đa một acceptance                         | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R7      | Accepted event time do server quyết định và giữ historical context             | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R8      | Cross-midnight grouping không thay departure eligibility                       | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R9      | Employee chỉ thấy own minimal current state và receipt                         | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R10     | Manager read chỉ server-side và establishment-scoped                           | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R11     | Shared-device UI bảo toàn isolation và trung thực về operation state           | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R12     | Capability giữ fail-closed provenance và tách biệt production policy           | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R13     | Usable slice không mở rộng explicit non-scope                                  | D1,D12        | 3.8,4.6                     | DATA; DOMAIN; HTTP; PAGE; DOC          | DBTEST schema; UI_TEST inventory; post-Apply Browser QA          |

### All 62 scenarios

| Spec ID | Exact approved heading                                   | Design        | Apply tasks                 | Planned code                           | Planned tests/evidence                                           |
| ------- | -------------------------------------------------------- | ------------- | --------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| A1.1    | Tiếp tục own Pointage interaction                        | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A1.2    | Pointage continuation dùng ngoài domain                  | D2-D4,D8      | 1.1,2.3,2.4,3.1,3.2         | AUTH; DOMAIN; DTO; HTTP                | AUTH; SERVICE_TEST; UI_TEST                                      |
| A2.1    | Continuation được dùng cho employee khác                 | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A2.2    | Continuation yêu cầu privileged operation                | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A2.3    | Browser cung cấp trusted-context claims                  | D1,D2,D4,D8   | 1.2,2.4,2.8,3.1,3.2,4.3     | DATA; DOMAIN; DTO; HTTP                | DBTEST; SERVICE_TEST; DTO; UI_TEST                               |
| A3.1    | Identify trước entry hoặc sau departure                  | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.2    | State read ngoài employment period                       | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.3    | Mutation sau departure với session đang mở               | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.4    | Ngày entry hoặc final departure hợp lệ                   | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A3.5    | Không xác minh được lifecycle hiện tại                   | D4,D5,D7      | 2.2,2.3,2.4,2.5,4.3,4.4     | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| A4.1    | Authorized replay                                        | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A4.2    | Prior success nhưng current access mất hiệu lực          | D4-D6         | 2.4,2.6,3.7,4.2,4.3         | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST                                    |
| A5.1    | Continuation hết hạn                                     | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A5.2    | Credential reset nhưng browser còn continuation cũ       | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A5.3    | Interaction đã kết thúc trên shared device               | D2-D4         | 1.3,1.5,2.4,3.6,4.2,4.5     | DATA; DOMAIN; PAGE                     | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| A6.1    | Browser nhận continuation và current-state response      | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A6.2    | Durable browser storage hoặc diagnostics                 | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A6.3    | Technical metadata được tái dùng làm evidence            | D2,D6,D8,D10  | 1.1,1.2,2.8,3.1,3.3,3.6,4.6 | AUTH; DATA; DOMAIN; DTO; HEADERS; PAGE | AUTH; DBTEST; DTO; UI_TEST; post-Apply Browser QA                |
| A7.1    | Missing hoặc untrusted client-address provider           | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| A7.2    | Public access failure                                    | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| A7.3    | Provider composition cần authority riêng                 | D1,D8,D10     | 1.6,2.8,3.2,4.3,4.6         | DOMAIN; HTTP                           | SERVICE_TEST; UI_TEST                                            |
| R1.1    | Employee operation có đầy đủ prerequisites               | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R1.2    | Browser đổi scope hoặc dossier                           | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R1.3    | Cloud hoặc database không xác nhận được kết quả          | D1,D4,D8      | 1.6,2.3,2.5,3.2,3.7,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R2.1    | NO_OPEN_SESSION nhận CLOCK_IN                            | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.2    | OPEN_SESSION nhận CLOCK_OUT                              | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.3    | OPEN_SESSION nhận CLOCK_IN                               | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.4    | NO_OPEN_SESSION nhận CLOCK_OUT                           | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R2.5    | Caller gửi event kind ngoài vocabulary                   | D5,D7         | 1.4,2.1,2.5,3.1,4.2         | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R3.1    | Derived state được tái dựng                              | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R3.2    | Actor yêu cầu sửa hoặc xóa raw event                     | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R3.3    | Technical metadata được dùng làm attendance fact         | D5-D7         | 1.2,1.4,1.8,2.1,2.6,4.4     | DATA; MIGRATION; DOMAIN                | DBTEST; SERVICE_TEST                                             |
| R4.1    | Employee tạo nhiều sequential sessions                   | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R4.2    | Session thiếu clock-out                                  | D5,D7         | 1.4,2.1,2.5,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R5.1    | Cùng identity và intent sau commit                       | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.2    | Cùng identity nhưng intent khác                          | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.3    | Receipt lookup từ employee hoặc establishment khác       | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.4    | Timeout retry                                            | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R5.5    | Replay sau khi lifecycle hoặc authority không còn hợp lệ | D4-D6,D8      | 1.2,1.4,2.6,3.7,4.2,4.3     | DATA; DOMAIN; HTTP; PAGE               | DBTEST; SERVICE_TEST; UI_TEST; post-Apply Browser QA             |
| R6.1    | Hai distinct CLOCK_IN cạnh tranh từ no-open state        | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R6.2    | Hai distinct CLOCK_OUT cạnh tranh đóng cùng session      | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R6.3    | Double submit cùng request identity                      | D5,D6         | 1.4,2.5,2.6,4.2             | DATA; DOMAIN                           | DBTEST; SERVICE_TEST                                             |
| R7.1    | Browser gửi clock hoặc backdated timestamp khác server   | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R7.2    | Actual time lệch Planning                                | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R7.3    | Local date/time cần được diễn giải lại                   | D5,D7         | 1.4,2.2,3.1,4.4             | DATA; DOMAIN; DTO                      | DBTEST; SERVICE_TEST; DTO                                        |
| R8.1    | Session đi qua midnight trong employment period          | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R8.2    | CLOCK_OUT sau departure date                             | D4,D7         | 2.1,2.2,2.4,2.5,4.4         | DATA; DOMAIN                           | DBTEST; SERVICE_TEST; post-Apply Browser QA                      |
| R9.1    | Employee chưa clock-in                                   | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.2    | Employee đang clock-in                                   | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.3    | Minimal Personnel projection                             | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R9.4    | Employee yêu cầu lịch sử                                 | D4,D7,D9      | 2.1,2.3,3.1,3.4,3.5,4.3     | DOMAIN; DTO; PAGE                      | SERVICE_TEST; DTO; UI_TEST; post-Apply Browser QA                |
| R10.1   | Authorized manager đọc bounded state                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R10.2   | Manager thiếu scope hoặc exact grant                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R10.3   | STAFF hoặc employee xin manager read                     | D9            | 2.7,4.3,4.6                 | DOMAIN                                 | SERVICE_TEST; DBTEST; UI_TEST inventory                          |
| R11.1   | Interaction kết thúc trên shared tablet                  | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.2   | Browser khôi phục state cũ                               | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.3   | Mutation pending, success hoặc conflict                  | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R11.4   | Invalid credential, rate limit hoặc lifecycle denial     | D3,D8,D10,D11 | 3.3,3.4,3.5,3.6,3.7,4.5     | HEADERS; HTTP; PAGE                    | UI_TEST; post-Apply Browser QA                                   |
| R12.1   | Thiếu trusted client-address provenance                  | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R12.2   | Production legal policy chưa được duyệt                  | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R12.3   | Capability được triển khai và kiểm tra thành công        | D1,D10,D12    | 1.6,2.8,4.3,4.6             | DOMAIN; DOC                            | SERVICE_TEST; UI_TEST inventory; post-Apply QA environment proof |
| R13.1   | Downstream hoặc ngoài phạm vi yêu cầu capability         | D1,D12        | 3.8,4.6                     | DATA; DOMAIN; HTTP; PAGE; DOC          | DBTEST schema; UI_TEST inventory; post-Apply Browser QA          |

Task count: 32 (8 Foundation / Data + 9 Service / Domain + 8 Employee Transport / UI + 7 Integration / Regression). Completed: 0/32.

TASKS / IMPLEMENTATION PLAN REVIEW

Status: AWAITING_HUMAN_REVIEW

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED
```

## Review stop

TASKS / IMPLEMENTATION PLAN REVIEW

Status: AWAITING_HUMAN_REVIEW

Review status: AWAITING_HUMAN_REVIEW

Apply authorization: NOT_GRANTED

Production enablement: NOT_AUTHORIZED
