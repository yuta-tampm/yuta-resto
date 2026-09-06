# Tasks + Implementation Plan

Change: `next-generated-types-bootstrap`.

Planning status: APPROVED — requirements unchanged. Final Phase 3 closure authorized by explicit current-user instruction; 26/26 tasks COMPLETE after disposal/integrity verification. Gate 3 remains AWAITING_HUMAN_REVIEW; no sync/archive or production authorization.

Schema: `yuta-spec-driven`. Analysis: `NO_SPEC_BEHAVIOR_CHANGE`. `skip_specs: true`; không có delta Specs/Gate 2, không tạo placeholder spec. Design áp dụng và Sensitive Technical Design Gate đã được duyệt. Không còn Open Question ảnh hưởng cách xây dựng.

UI_AFFECTING: NO.

BROWSER_QA_REQUIRED: NO.

QA: non-browser tooling/runtime QA. Không dùng browser screenshots thay thế CLI/process/Git evidence.

Authority: [Proposal](proposal.md), [Analysis](analysis.md), [approved Design](design.md), [Gate 1](../../../docs/reviews/next-generated-types-bootstrap/01-analysis-review.md), [Sensitive Design review](../../../docs/reviews/next-generated-types-bootstrap/02b-design-review.md). Design D1–D9/V1–V14 là acceptance authority của kế hoạch no-spec; không suy approval hoặc lifecycle từ checkbox.

## Revision scope and preserved execution history

Reconciliation 2026-09-04 theo explicit current-user instruction. Approved Design SHA-256: `52468e84e4287c0fa2b87c758cd4d1b6fa7835dd15b3d110372072eff430fbd3`. Gate 1 vẫn APPROVED; chỉ D1/D2/D3/D4 và V2/V5/V6/V9/V12/V14 cùng mapping phụ thuộc được reconcile. Không sửa Design hoặc tạo delta Specs.

`SUPERSEDED_FOR_FAILURE_PROPAGATION`: raw six-command chain/raw-exit assumption của task 1.2 trước đây không còn là implementation requirement. Requirement hiện tại nằm ở 1.8–1.10; CI expression ở 1.3 vẫn đúng. Không biến historical harness PASS thành proof của fail-closed implementation mới.

Giữ nguyên 13 checked outcomes của các lần chạy trước, gồm 1.1–1.7, 2.1–2.4 và 3.1–3.2; checked ở đây là **historical evidence**, không có nghĩa revised bootstrap đã implemented/verified. Source evidence Phase 1/2/3 không bị viết lại. F1/F2 và overall Phase 3 FAIL vẫn được giữ; fixture F2 chỉ diagnostic. Fresh checkout/install, 6/6 happy-path typegen/direct checks/builds, recursive check và tracked-byte stability đã quan sát vẫn có giá trị cho candidate cũ.

**Implementation Plan — bounded return:** sau riêng approval Apply, làm Phase 1 remediation 1.8–1.14 trên state đã untrack; dừng review. Không chạy lại tracking mutation Phase 2. Chỉ sau fresh clean proof + revalidation Phase 2 invariants + exact Formalités protection và quyền tiếp tục phù hợp mới resume remaining Phase 3 3.3–3.8. Task 3.7 yêu cầu post-remediation success/build regression; không lấy historical checkboxes làm substitute. Không retrack, bỏ ignore hoặc phục hồi POS housekeeping. Historical pre-untrack gate dưới đây chỉ là lineage, không yêu cầu quay lại tracked state.

Ba phase giữ tên user yêu cầu. Trong vocabulary workflow: hai phase đầu là repository foundation work; phase cuối là Integration / Regression. Không tạo Data schema, Service, UI hoặc Interaction phase giả.

## 1. PHASE 1 — Bootstrap foundation + pre-untrack proof

- [x] 1.1 Capture pre-Apply provenance: HEAD, Git index, scoped status, byte/path inventory của candidate files, Gate 1/Design hashes và Formalités baseline; verify 4/4 implementation, 18/18 approved entries và supplementary 17-file set MATCH trước bất kỳ edit; isolate overlapping edits hoặc STOP.
- [x] 1.2 Historical implementation only — raw six-command `typegen:next` và harness đã được thực hiện ở Phase 1 cũ. Raw-chain/raw-exit requirement: SUPERSEDED_FOR_FAILURE_PROPAGATION; không dùng completion này làm acceptance của revised D1/D2. Replacement requirement và evidence nằm ở 1.8–1.14.
- [x] 1.3 Chỉnh duy nhất CI typecheck run thành `pnpm typegen:next && pnpm -r --if-present typecheck`; verify actual workflow step, cùng job, no failure-ignore và mọi job/settings khác unchanged theo diff/harness.
- [x] 1.4 Cập nhật minimum bootstrap/direct-app prerequisite trong README và Development Workflow, thêm focused Node tooling harness; verify scoped docs/tests, không thêm pretypecheck/postinstall hoặc sửa app manifests. Phase 2 assertions dùng fixtures, không yêu cầu sửa live ignore/POS sớm.
- [x] 1.5 Dựng faithful isolated snapshot current candidate; verify đủ tracked assets, đúng versions và không symlink/copy node_modules/env/generated cache; loại đúng sáu next-env trong disposable test only, xác nhận sáu `.next` và incremental cache absent; chạy frozen install và ghi exit 0 cùng absent-before-generation proof.
- [x] 1.6 Chạy `pnpm typegen:next` thật trong snapshot 1.5, ghi sáu app generation exits/generated inventory; chạy riêng sáu app typechecks rồi recursive typecheck, tất cả phải exit 0; verify no unauthorized tracked-source drift, không build-prewarm, không nới tsconfig.
- [x] 1.7 Đóng pre-untrack evidence: checklist hard gate dưới đây toàn PASS, hash snapshot/commands/results, before/after Formalités MATCH, scoped diff và Phase 1 contract assessment; nếu FAIL/BLOCKED thì STOP, giữ tracking/ignore/POS nguyên trạng. Không đánh dấu phase hoàn tất chỉ vì warm checkout typecheck PASS.

### Revised bootstrap work — IMPLEMENTATION APPROVED; CURRENT-CANDIDATE PROOF REFRESHED

- [x] 1.8 Thay implementation root `typegen:next` bằng `node scripts/generate-next-types.mjs`; root từ vị trí script, fixed six app/package/order đúng bảng dưới; resolve installed Next 16.2.9 public CLI qua bin metadata và installed TypeScript cho từng app, không private API. Sequential `process.execPath`, `--unhandled-rejections=strict`, argument array, `shell:false`, app cwd, stdout/stderr forwarding. Verify exact mapping/preflight/process options bằng focused tests; không sửa app manifests, aliases khác hoặc CI expression đang đúng.
- [x] 1.9 Implement D2 fresh-result contract: trước mỗi child revalidate target/version, bounded/non-linked/non-tracked generated paths/parents, invalidate chỉ bốn exact files và verify absent; sau exit 0 require regular/non-linked/nonempty, parse diagnostics rỗng và structural references đúng bảng dưới. Verify stale-primed early-exit-zero, missing/empty/malformed/wrong-reference/write-failure/path safety trong tests; không custom generator hoặc log matching.
- [x] 1.10 Implement lock/process fail-closed lifecycle: acquire root single-run lock trước invalidation, reject conflict/known Next locks, release chỉ owned lock trên success và mọi failure; strict child nonzero/signal/spawn failure/120s timeout => nonzero, không later generator; timeout terminate owned child và đợi termination. Verify release/retained foreign lock, terminated-child evidence và no downstream invocation; không kill/remove unrelated process/lock.
- [x] 1.11 Reconcile focused Node harness với real orchestrator contract: cover mapping/preflight, strict spawn, all failure rows bên dưới, freshness/structure, lock cleanup, path/link safety, CI conjunction và preserved aliases/ignores/POS. Verify `node --test scripts/next-generated-types-bootstrap.test.mjs` PASS; không giữ simulated shell-chain tests như acceptance của real Next failure.
- [x] 1.12 Revise chỉ README và Development Workflow để supported prerequisite luôn là `pnpm typegen:next` trước direct/recursive check; document exclusive checkout và recovery/rerun, raw per-app Next chỉ diagnostic không equivalent fail-closed bootstrap. Verify docs/architecture/scoped formatting và scoped diff; CI expression chỉ inspect, không sửa lại khi còn đúng.
- [x] 1.13 Prove revised bootstrap từ **một new faithful isolated current candidate** dùng exact-byte protocol dưới đây: frozen install; sáu next-env/.next và incremental states absent trước generation; 6/6 actual validated generators + bốn output mỗi app; 6 direct checks; recursive typecheck PASS; before/after tracked path/raw SHA unchanged. Verify same candidate, no build prewarm/cache/env copy, full Formalités checks trước/sau; capture exact commands/exits/outputs và fresh evidence hash.
- [x] 1.14 Revalidate completed Phase 2 invariants without mutation: sáu next-env untracked/đúng sáu root ignore rules, local regeneration không tracked drift, bounded POS deletion vẫn nguyên. Verify original index và all protected Formalités 4/4 + 18/18 + 17/17, immutable historical evidence; issue revised Phase 1 contract assessment/proof identity rồi STOP review. Không resume Phase 3 nếu required proof FAIL/BLOCKED/missing hoặc candidate drift.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 1

**Scope / owner:** YUTA engineering, repository tooling tại `D:/working/yuta/yuta-resto`; revised D1–D4, D8–D9, V1–V6/V9/V12–V14. Historical initial foundation/pre-untrack work 1.1–1.7 giữ nguyên evidence; active remediation 1.8–1.14 chỉ bootstrap/validation và fresh post-transition proof, không thay runtime/data boundary.

**Allowed implementation files:** `package.json`, `scripts/generate-next-types.mjs` (new orchestration/validation only), `README.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `scripts/next-generated-types-bootstrap.test.mjs`. `.github/workflows/ci.yml` là completed Phase 1 path; active remediation chỉ read/verify vì expression hiện khớp D2. Chỉ xem xét exact step edit nếu diff chứng minh expression không còn đúng, phải record deviation trước edit; không sửa CI cho mục đích khác. Evidence trong `docs/reviews/next-generated-types-bootstrap/` và checkbox progress ở tasks này. Temporary test fixtures chỉ trong resolved isolated workspace; không được biến fixture changes thành canonical implementation.

**Authority / constraints:** [root AGENTS](../../../AGENTS.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [development workflow](../../../docs/DEVELOPMENT_WORKFLOW.md), [CI](../../../.github/workflows/ci.yml), [root manifest](../../../package.json), [architecture](../../../docs/architecture/OVERVIEW.md), [ADR-001](../../../docs/decisions/ADR-001-runtime-families-and-product-visibility.md); nearest scoped [Backoffice](../../../apps/backoffice/AGENTS.md), [Web](../../../apps/web/AGENTS.md), [Booking](../../../apps/booking-web/AGENTS.md), [Feedback](../../../apps/feedback-web/AGENTS.md), [POS](../../../apps/yuta-pos/AGENTS.md), [Display](../../../apps/yuta-display/AGENTS.md). Apply đọc lại source hiện tại; không chỉ dựa tên reference.

**Invariants:** exactly six targets theo D1; installed supported Next generator; existing script meanings giữ nguyên; generation lỗi chặn downstream. No arbitrary app selection, dependencies/lockfile upgrade, custom declarations, hidden hooks hoặc real DB/provider requirement. Full Formalités protected set unchanged. Không sửa `.gitignore`, staged tracking entries hoặc POS housekeeping ở phase này.

**Required evidence:** preserve historical 1.1–1.7; active tasks 1.8–1.14, focused `node --test scripts/next-generated-types-bootstrap.test.mjs`, docs/architecture/scoped format, actual clean commands và inventory. Missing harness trước implementation không phải command đã chạy. Windows/POSIX package script semantics và EOL provenance phải ghi nhận.

**Historical hard gate — original Phase 2 entry condition (satisfied before completed transition):** tất cả điều kiện sau phải được chứng minh từ **cùng faithful pre-untrack candidate**:

| Condition                      | Evidence required                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Frozen install succeeds        | `pnpm install --frozen-lockfile`, exit 0                                                             |
| Six next-env initially absent  | Exact six path existence checks trước generation, bao gồm sau install                                |
| Six `.next` initially absent   | Exact app paths, không generated/incremental prewarm                                                 |
| All six generation PASS        | `pnpm typegen:next`, six targets/outputs, exit 0                                                     |
| All six direct typechecks PASS | Six separate package commands/exits                                                                  |
| Recursive typecheck PASS       | `pnpm -r --if-present typecheck`, exit 0 after generation                                            |
| No unauthorized tracked drift  | Before/after source path/hash inventory; chỉ controlled next-env test absence/regeneration được phép |
| Formalités preserved           | Before/after 4/4 + 18/18 + supplemental path/hash MATCH                                              |

Phase 2 MUST NOT begin if any row FAILS, is BLOCKED or has missing evidence. Lưu exact evidence/hash trong Phase 1 review. Candidate source hoặc prerequisite thay đổi sau proof làm proof stale: re-run affected clean proof trước untracking. Approval Tasks không tự cấp quyền bypass gate; nếu user chỉ duyệt Apply Phase 1 thì dừng ở cuối Phase 1 dù PASS.

**Stop conditions:** hash mismatch; unisolatable dirty path; missing asset contamination; unapproved source/tsconfig drift; failed/blocked hard-gate row; need business/permission/runtime/dependency change. Không quy unrelated failure thành chứng minh phải giữ tracked next-env mãi mãi.

**Out of scope:** new tracking mutations/retracking, `.gitignore` edits, POS housekeeping edits; all global exclusions below. No Gate 3 ready claim.

### Active Phase 1 contract — exact targets and outputs

| App path            | Package              |
| ------------------- | -------------------- |
| `apps/backoffice`   | `@yuta/backoffice`   |
| `apps/web`          | `@yuta/web`          |
| `apps/booking-web`  | `@yuta/booking-web`  |
| `apps/feedback-web` | `@yuta/feedback-web` |
| `apps/yuta-pos`     | `@yuta/pos`          |
| `apps/yuta-display` | `@yuta/display`      |

Preflight cả sáu targets trước generation; kiểm lại applicable app/path trước mỗi invocation. Missing target/name mismatch/unreviewed Next version/missing TypeScript hoặc unresolved public CLI => fail closed. Không arbitrary target/filter hoặc skip app. Không global NODE_OPTIONS, pnpm/Next upgrade hoặc single-app option.

| Exact generated file per app  | Required fresh-output validation after exit 0                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `next-env.d.ts`               | Type refs `next`, `next/image-types/global`; exact import `./.next/types/routes.d.ts`                          |
| `.next/types/routes.d.ts`     | `AppRoutes` type alias, `ParamMap` interface; expected exported route/param types consumed by validator        |
| `.next/types/validator.ts`    | Type import `./routes.js`, expected `AppPageConfig` / `LayoutConfig` and Next page/layout validation structure |
| `.next/types/cache-life.d.ts` | Declaration module `next/cache` and `cacheLife` declarations for approved default configs                      |

Mọi file MUST regular/non-linked, nonempty và parse bằng installed TypeScript không diagnostics; bounded structural checks theo revised D2, không reimplement route semantics. Safe parent traversal/containment và Git-tracked rejection **trước unlink**, kiểm lại trước read. Chỉ non-recursive unlink đúng bốn files rồi verify absence. Không delete `.next`, caches khác hoặc arbitrary declarations; unexpected config/output shape phải reject, không skip cache-life. Freshness không dựa mtime/hash cũ/file existence hay log-string success.

**Failure contract:** nonzero child exit, signal, spawn failure, 120s timeout, missing target, package-name mismatch, unreviewed version, unsafe/linked/tracked path, missing/empty/malformed/wrong-reference output, output write failure, premature exit 0 và concurrent invocation => bootstrap nonzero, **không later generator và không recursive typecheck**. Child exit 0 chỉ là necessary condition; mỗi app chỉ được continue sau valid fresh output. Partial generated state không phải success; retry invalidates lại từ đầu, không phục hồi stale bytes.

**Lock/termination:** acquire `.tmp-next-typegen.lock` exclusive ở root trước invalidation; reject concurrent invocation, không xóa foreign lock. Detect `.next/lock` / `.next/dev/lock`; no unrelated process termination/removal. Owned lock release trong success và mọi failure path, kể cả validation/spawn/signal/timeout; contender không được release lock của owner. Timeout terminate child được spawn bởi run này, await actual termination trước close/release/report. Test child không còn sống và downstream trace trống; không dùng status/log alone. Require exclusive checkout, không claim YUTA lock kiểm soát arbitrary external Next dev/build.

**Active remediation exit gate:** 1.13 fresh same-candidate proof tất cả PASS, 1.14 Phase 2 invariants + protected Formalités exact MATCH, applicable focused checks PASS và reviewed scoped diff. Nếu FAIL/BLOCKED/missing thì STOP giữ completed tracking transition, không reverse Phase 2. Sau PASS vẫn STOP human review; quyền planning không cho Apply/resume Phase 3.

## 2. PHASE 2 — Tracking transition + bounded housekeeping

Phase này đã hoàn tất/được duyệt. Các task/contract dưới là preserved transition history, **không lệnh thực hiện lại**. Revalidation sau revised bootstrap thuộc 1.14, không mở mutation allowlist Phase 2.

- [x] 2.1 Recheck Phase 1 PASS evidence/hash/candidate identity và protected Formalités sets; verify hard gate đầy đủ trước mutation, tái chạy proof nếu stale. Không tiếp tục nếu evidence thiếu hoặc chỉ là kiểm tra warm checkout.
- [x] 2.2 Untrack đúng sáu paths D5 bằng scoped `git rm --cached -- <exact paths>` và thêm đúng sáu root-anchored ignore rules; verify local files được giữ, `git ls-files` rỗng, `git check-ignore -v` đúng từng rule, staged deletion inventory đúng sáu, no broad ignore.
- [x] 2.3 Remove only D7 obsolete POS next-env path/state/capture/restore và unused read/write imports; verify diff chỉ các blocks này, `existsSync` và toàn bộ offline business/env/container/process behavior unchanged; chạy harness assertions cho bounded housekeeping và syntax check.
- [x] 2.4 Chốt Phase 2 diff và evidence: exact index/ignore assertions, docs vẫn coherent với approved prerequisite, protected Formalités before/after MATCH; contract PASS/FAIL/BLOCKED. Không gọi tooling complete trước Phase 3.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 2

**Scope / owner:** YUTA engineering repository tracking/tooling; D5/D7/D9, V9/V11/V12/V14. Entry chỉ sau valid Phase 1 hard-gate PASS và Apply authority phù hợp.

**Allowed implementation files:** `.gitignore`, `scripts/test-pos-offline.mjs`, tracking removal của đúng sáu file dưới đây; focused regression assertions trong `scripts/next-generated-types-bootstrap.test.mjs`. Review evidence/tasks progress chỉ thuộc change này. Không mở lại Phase 1 code/docs để lén đổi prerequisite; nếu phải sửa prerequisite thì quay về proof Phase 1.

```text
apps/backoffice/next-env.d.ts
apps/web/next-env.d.ts
apps/booking-web/next-env.d.ts
apps/feedback-web/next-env.d.ts
apps/yuta-pos/next-env.d.ts
apps/yuta-display/next-env.d.ts
```

Ignore rule cho mỗi file là path trên với prefix `/`, đúng D5. Không wildcard `*.d.ts`, không broaden `.next` hoặc integrity policy. Expected staged deletions là implementation diff; không diễn giải chúng là new local generation noise.

**Authority / constraints:** root và six scoped AGENTS liệt kê ở Phase 1; [POS AGENTS](../../../apps/yuta-pos/AGENTS.md), [offline script](../../../scripts/test-pos-offline.mjs), [local-development guards](../../../docs/operations/LOCAL_DEVELOPMENT.md), [workflow integrity](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), approved D5/D7. Không sửa seed, migration test setup, ports, order/report/auth assertions, process/container cleanup, env hoặc device behavior.

**Invariants:** exactly six bounded ignore rules; local regeneration allowed; no restoration of obsolete generated bytes; no new deletion cleanup; no forced Git operation against unrelated staged edits. Giữ baseline tracked source integrity và Formalités exact hashes/path set.

**Required evidence:** exact Git index/diff/check-ignore output, `node --check scripts/test-pos-offline.mjs`, focused harness; scoped format/docs/architecture; Phase 1 linkage và before/after protected-hash comparison. Full two-state offline acceptance vẫn bắt buộc Phase 3, không suy từ syntax PASS.

**Stop conditions:** Phase 1 not PASS/stale, git refuses safe cached removal, unexpected staged source, formalités mismatch, broader ignore or POS refactor needed. Giữ evidence và report; không force/reset/retrack hoặc restore/build/restore loop.

**Out of scope:** all global exclusions; không prod/deploy, không Gate 3 regeneration của Formalités, không thay root/app script meanings hoặc reset unrelated index.

## 3. PHASE 3 — Post-change verification / regression

- [x] 3.1 Fresh isolated post-change snapshot chứa candidate untrack/ignore: verify source inventory, no six tracked next-env/no `.next`/incremental state, frozen install PASS; thực chạy root typegen, six direct typechecks, recursive flow PASS, ghi per-app evidence như Phase 1, no warm-state substitution.
- [x] 3.2 Chạy build cho cả sáu apps D1, required PASS với safe synthetic/app-scoped environment; ghi exact outputs/generated imports và tracked inventory trước/sau. Nếu cần business fix hoặc production env thì STOP, không broaden scope.
- [x] 3.3 Execute toàn bộ actual acceptance matrix N1–N9 dưới đây trên exact-byte qualified isolated per-case fixtures: sáu vị trí real Next config failure, async rejection, premature zero/stale output và mọi process/result/preflight/lock safety failure. Trace actual validated root/CI conjunction để chứng minh no later generator/no recursive check; wrapper preflight missing-target evidence riêng, pnpm `--fail-if-no-match` chỉ diagnostic. Required Windows và Linux/CI execution, không suy Linux PASS từ inspection hoặc focused harness.
- [x] 3.4 Chứng minh typegen/build/dev generation không tracked Git drift: six-path index/ignore checks và before/after tracked hashes. Dev Ready + declaration generation trên từng app với free localhost port where practical; record skipped/blocked app/reason đúng Design V8, không tự claim PASS. Dừng đúng process, không browser/API/data mutation.
- [x] 3.5 Source-integrity negative control chỉ trong disposable fixture: mutate tracked README harmless; Git báo path và diff exit 1, SHA-256 mismatch được review-integrity comparison reject, README không ignored; generated next-env vẫn ignored. Verify không sửa general integrity implementation/rules hoặc Formalités.
- [x] 3.6 Chạy `pnpm test:pos:offline` hai lần trong approved disposable setup: initial POS next-env absent và already generated; verify full acceptance PASS, original cleanup/business assertions giữ nguyên, no capture/restore. Required Docker/container unavailable => BLOCKED, no Gate 3.
- [x] 3.7 Re-run post-remediation normal 6/6 validated generation, direct typechecks, recursive conjunction và six builds trên exact current candidate; preserve prior 3.1/3.2 observations, không reuse chúng như revised-code PASS. Chạy focused tests/docs/architecture/recursive/full format/strict OpenSpec; record Windows và Linux/CI actual execution, same CI ordering/fail-closed expression, docs scope, no excluded drift và all Formalités MATCH. Report unrelated/pre-existing failures riêng, không sửa rộng.
- [x] 3.8 Tạo Technical Compliance Matrix và phase-contract matrix; đánh giá riêng TECHNICAL IMPLEMENTATION COMPLIANCE, VERIFY, QA theo evidence dưới đây. Chỉ chuẩn bị Gate 3 nếu mọi required evidence PASS; packet giữ Sync authorization: PENDING. Dừng review, không sync/archive hoặc tiếp tục Formalités.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 3

**Scope / owner:** YUTA engineering / Integration and Regression; toàn bộ D1–D9/V1–V14. No runtime or Product ownership transfer. Precondition reviewed Phase 1 remediation 1.8–1.14 PASS, fresh same-candidate proof/current evidence, completed Phase 2 invariants revalidated, all protected bytes match và explicit authority to resume. Historical Phase 1/2 approval alone không bypass remediation gate.

**Allowed files:** completion/evidence trong `docs/reviews/next-generated-types-bootstrap/`, tasks checkbox progress; `scripts/next-generated-types-bootstrap.test.mjs` để hoàn thiện scoped coverage. Negative injections vào next.config/README chỉ trong disposable test snapshots. Không mở canonical app config/source allowlist vì test fixture cần mutation. Defect ở prerequisite/tracking: quay owning phase và re-prove gate, không silently broaden Phase 3.

**Authority / constraints:** root/six scoped AGENTS ở Phase 1, [Design](design.md), [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md), [workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [architecture](../../../docs/architecture/OVERVIEW.md), [local-development guard](../../../docs/operations/LOCAL_DEVELOPMENT.md). Non-browser QA dùng actual supported CLI và disposable POS acceptance; DB bên trong test là local disposable đã được script guard, không tạo/edit migration hoặc production execution.

**Required evidence and exact commands:**

| Check                   | Command / method                                                                                                                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean install           | `pnpm install --frozen-lockfile`                                                                                                                                                                                                                         |
| Six generation          | `pnpm typegen:next`, exact D1 targets/order; log every child exit                                                                                                                                                                                        |
| Direct typechecks       | `pnpm --filter @yuta/backoffice typecheck`; `pnpm --filter @yuta/web typecheck`; `pnpm --filter @yuta/booking-web typecheck`; `pnpm --filter @yuta/feedback-web typecheck`; `pnpm --filter @yuta/pos typecheck`; `pnpm --filter @yuta/display typecheck` |
| Recursive flow          | `pnpm typegen:next && pnpm -r --if-present typecheck`                                                                                                                                                                                                    |
| Six builds              | `pnpm --filter @yuta/backoffice build`; `pnpm --filter @yuta/web build`; `pnpm --filter @yuta/booking-web build`; `pnpm --filter @yuta/feedback-web build`; `pnpm --filter @yuta/pos build`; `pnpm --filter @yuta/display build`                         |
| Development smoke       | D6/V8 supported `pnpm --filter <package> exec next dev --hostname 127.0.0.1 --port <free-test-port>` for six D1 packages; only owned process                                                                                                             |
| Failure injection       | Revised D2/V5 N1–N9 exact-byte fixtures, real root/CI run và actual process trace; full protected qualification trước injection/invocation                                                                                                               |
| Missing target          | Actual orchestrator preflight fixtures missing/name-mismatch/version failure, nonzero/no generator; `pnpm --filter @yuta-no-such-bootstrap-probe --fail-if-no-match exec next typegen --help` chỉ compatibility diagnostic                               |
| Generated-state checks  | `git ls-files -- <six exact paths>`; `git check-ignore -v -- <six exact paths>`; `git status --short`; exact tracked-byte/path inventory                                                                                                                 |
| Negative tracked source | `git diff --exit-code -- README.md` expected 1; `git check-ignore --no-index README.md` expected no match; exact-byte SHA-256 mismatch rejected                                                                                                          |
| POS regression          | `pnpm test:pos:offline`, two initial states, script's own safe disposable container/process cleanup                                                                                                                                                      |
| Focused harness         | `node --test scripts/next-generated-types-bootstrap.test.mjs` after it exists; `node --check scripts/test-pos-offline.mjs`                                                                                                                               |
| Repository checks       | `pnpm docs:check`; `pnpm architecture:check`; `pnpm -r --if-present typecheck`; `pnpm format:check`; scoped `pnpm exec prettier --check <approved files>`; `openspec validate next-generated-types-bootstrap --strict`                                   |

No unsupported test command, dependency install from unrelated package or cloud/provider credential needed. Every run records cwd, snapshot SHA/tree, versions, exact command, exit/output, expected versus actual source changes and deviations. Revised orchestrator/evidence là planned, chưa Apply hoặc execute bởi reconciliation này; original command/harness history không bị xóa.

**Invariants:** no partial generation success claim; six-app coverage, no cache masking; failure propagation; exact ignores; source drift detection; unchanged Formalités/permissions/tenancy/runtime/business paths. Git expected Phase 2 deletions are separated from regeneration drift in post-change clean snapshot.

**Stop conditions:** required install/typegen/typecheck/build/offline evidence FAIL/BLOCKED; unexplained tracked drift; any protected hash mismatch; need permissions/production or scope expansion; clean attributed diff impossible. Do not issue Gate 3 ready. Dev smoke availability is treated exactly as Design V8 (coverage limitation requiring review if impractical), not fabricated PASS; other required evidence cannot be waived by that exception.

**Out of scope:** all global exclusions; no browser QA, no source/tsconfig fix to force compiler success, no broad formatting, no Formalités Gate 3 work, no sync/archive/deploy.

### Acceptance fixture protocol — applies to EVERY negative case

1. Capture current candidate với temporary Git index; `git -c core.autocrlf=false -c core.safecrlf=false add -A`, detached `git -c core.autocrlf=false worktree add --detach <isolated-root> <snapshot>`. Resolve/validate exact paths, không stage vào canonical index/branch; ghi original index before/after.
2. Snapshot gồm required approved uncommitted bytes, không old HEAD-only. Frozen install không copy env/node_modules/.next/incremental caches; full candidate path set + **raw SHA-256** MUST match trước synthetic injection. Dùng terminating assertions/`-LiteralPath`, không CRLF/LF-normalized equality.
3. Verify Formalités **4/4 implementation + 18/18 integrity + 17/17 supplemental** trước mutation, rồi trước invocation; bất kỳ mismatch/missing proof => STOP không chạy case.
4. Chỉ inject intended disposable delta; record exact diff/hash, baseline identity, target case/platform/version. Trước invocation và sau test verify toàn bộ paths ngoài injection nguyên exact bytes/set, Formalités vẫn MATCH.
5. Mỗi final acceptance case có isolated qualified initial state. Stale-output case được prime **sau qualification** và ghi rõ generated state; không mang unknown output từ case trước. F2 fixture cũ diagnostic-only, không promotion thành acceptance.

### Actual acceptance matrix — revised V5/V6/V9/V12

Chạy real entrypoint `pnpm typegen:next && pnpm -r --if-present typecheck` bằng platform-supported shell; record exact executable command, cwd, Node/pnpm/Next/TypeScript versions, stdout/stderr, exit/signal và process trace. Probe không được sửa Next exit handling, dùng log-string detection hoặc thay raw Next bằng success/failure stub cho real-Next cases. Chỉ test-infrastructure boundary faults được inject có exact diff/hash trong disposable copy; không thêm runtime test bypass vào canonical orchestrator.

| Case                           | Required executable evidence                                                                                                                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1 — six config failures       | Real Next 16.2.9 config throw tại mỗi fixed app vị trí 1–6, sáu qualified fixtures. Earlier apps validated; failing child/bootstrap nonzero; later generators và recursive check chưa từng invoke.                                                                                           |
| N2 — async rejection           | Actual rejected promise trong config; strict child không swallow failure. Record child/bootstrap exit và no downstream trace.                                                                                                                                                                |
| N3 — premature exit 0          | Prime stale bốn outputs rồi actual early exit 0. Verify old exact outputs invalidated/absent before child; exit 0 không đủ; bootstrap nonzero, no downstream.                                                                                                                                |
| N4 — invalid results           | Tách riêng missing, empty, malformed và wrong-reference fresh output; actual Next success rồi bounded disposable fault before validation nếu cần. TypeScript syntax/structure rejection, no downstream. Không dùng stale byte acceptance.                                                    |
| N5 — write/path safety         | Real output write failure; unsafe/out-of-root, linked/reparse parent/target, nonregular và tracked generated target fixtures. Reject trước unsafe unlink/read; target/source bytes ngoài intended delta nguyên; no downstream.                                                               |
| N6 — process faults            | Spawn error, child signal và 120s timeout. Record exact injection boundary; bootstrap nonzero, child termination đã observed/awaited, owned lock released, no downstream. Không thay timeout thành giả lập duy nhất để claim real-time termination PASS.                                     |
| N7 — locks                     | Hai actual bootstrap invocations overlapping: contender nonzero trước invalidation, foreign lock preserved; owner release khi success/failure. Known Next build/dev lock => reject, không kill/remove unrelated owner. Test owned lock cleanup mỗi failure class N1–N6/N8 khi lock acquired. |
| N8 — preflight                 | Missing target, wrong package name, unreviewed Next version, CLI/TypeScript resolution failure. Actual wrapper nonzero/no generator/no recursive. pnpm missing-filter diagnostic không thay evidence này.                                                                                    |
| N9 — valid success / platforms | Fresh normal 6/6 real Next outputs validated và only then recursive typecheck invoked/PASS. Windows và Linux/CI actual runtime evidence cho success và negative matrix; unavailable required platform/case => BLOCKED, không Gate 3.                                                         |

Focused Node harness hỗ trợ targeted assertions, **không đủ** thay matrix actual-process evidence. Windows investigation chỉ chứng minh feasibility; Linux/CI chưa chạy không được suy PASS. CI YAML giữ expression approved; Linux evidence có thể từ qualified disposable Linux runner thực chạy same expression với repository Node/pnpm versions, không cần sửa CI hay deploy. Ghi environment/source identity và exact-byte qualification trên platform đó; không từ Git-only/EOL-normalized fixture.

No-source-drift và Formalités checks áp dụng cả fixture infrastructure faults; chỉ evidence-bound injection được khác, không sửa business code canonical. Nếu một failure không thể tạo an toàn/reliably => BLOCKED exact row, không loại row hoặc claim PASS từ inspection.

## Technical Compliance Matrix and separate outcomes

Trong VERIFY evidence, mở rộng mỗi row thành exact implementation file/line, command/result/evidence path/hash và `PASS / FAIL / BLOCKED`. Bảng này là **mapping planned**, không có row PASS tại thời điểm authoring. Khi chưa chạy ghi NOT_EXECUTED, không quy thành PASS. Không có spec mapping vì approved no-spec branch.

| Design / technical acceptance                                    | Implementation location                                                       | Executable evidence                                                                                          | Owning tasks                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| Revised D1 / V2 fixed mapping/public CLI/strict sequential spawn | `package.json`, `scripts/generate-next-types.mjs`                             | Mapping/process tests; N1/N2/N8/N9 real invocation trace                                                     | 1.8, 1.11, 1.13, 3.3                |
| Revised D2 / V2/V5 fresh output + structural validation          | `scripts/generate-next-types.mjs`                                             | Four-file invalidation/absence, TS parse/structure, N3–N5/N9                                                 | 1.9, 1.11, 1.13, 3.3                |
| Revised D2 / V5 process and lock lifecycle                       | `scripts/generate-next-types.mjs`                                             | N1–N8 nonzero/no downstream; owned release, foreign lock preservation, actual timeout termination            | 1.10–1.11, 3.3                      |
| D2 CI fail-closed conjunction                                    | Existing `.github/workflows/ci.yml` expression unchanged, validated root exit | Actual same-job expression on Windows/Linux; N1–N9 trace generation versus recursive                         | 1.3 historical, 1.8, 3.3, 3.7       |
| D3 / V6 aliases/direct prerequisite                              | Root/app aliases unchanged; README/Development Workflow                       | Supported root prerequisite, six checks, wrapper preflight (pnpm filter only diagnostic)                     | 1.8, 1.12–1.13, 3.3, 3.7            |
| D4 original pre-untrack proof                                    | Immutable Phase 1/2 evidence                                                  | Original frozen/absent/clean results retained; not repeated by retracking                                    | 1.5–1.7, 2.1 historical             |
| Revised D4/V14 exact-byte fixture provenance                     | Disposable temp-index snapshots, evidence                                     | Full path/raw SHA before injection, outside-delta before/after, Formalités 4/18/17; F2 diagnostic-only       | 1.13–1.14, 3.3–3.7                  |
| D4 post-remediation clean proof                                  | New candidate snapshot and root orchestrator                                  | Frozen install, six absent next-env/.next, 6/6 valid fresh generation/direct checks/recursive, source stable | 1.13–1.14, 3.7                      |
| D5/V9 retained untrack/ignore                                    | Six existing index removals, `.gitignore` unchanged                           | Exact ls-files/check-ignore/path count, no retracking/broad rule                                             | 2.2 historical, 1.14, 3.4           |
| D6/V9 generated stability                                        | Six app typegen/build/dev outputs                                             | Before/after raw source hashes including freshness invalidation; six builds                                  | 3.2 historical, 1.13–1.14, 3.4, 3.7 |
| D6 source integrity                                              | General integrity unchanged; disposable README                                | Git visible + raw SHA mismatch + comparison rejection + not ignored                                          | 3.5                                 |
| D7 POS regression                                                | `scripts/test-pos-offline.mjs` retained bounded deletion                      | Syntax/diff/harness, full two-state offline acceptance, no restoration                                       | 2.3 historical, 1.14, 3.6           |
| D8/V12 minimum docs/test surface                                 | README, Development Workflow, focused harness, orchestration only             | Scoped diff/docs/format, focused tests plus actual N1–N9                                                     | 1.8–1.12, 3.3, 3.7                  |
| D9/V14 Formalités protection                                     | Approved protected baselines; no Formalités edits                             | 4/4 + 18/18 + 17/17 raw path/hash before/after every mutation/fixture invocation                             | 1.8–1.14, 3.3–3.8                   |
| D2 cross-platform / V5/V12                                       | Same Node orchestration; CI expression                                        | Actual Windows + Linux/CI N1–N9 and clean success; inspection insufficient                                   | 3.3, 3.7                            |
| Global exclusions / strict integrity                             | Entire attributed diff/source inventory                                       | Architecture, no dependencies/auth/business/tsconfig/production expansion                                    | all active tasks                    |
| V13 separate closure                                             | Existing VERIFY and QA evidence                                               | Exact checks and separate compliance/VERIFY/QA, strict no-spec validation                                    | 3.7–3.8                             |

Thêm phase-contract matrix: từng invariant/stop condition → authority → owning task/file → evidence → PASS/FAIL/BLOCKED. Không đánh dấu task hoàn tất khi chỉ implementation có mà evidence chưa có.

- **TECHNICAL IMPLEMENTATION COMPLIANCE:** PASS chỉ khi mọi applicable contract row PASS; nếu không, FAIL hoặc BLOCKED với lý do.
- **VERIFY:** độc lập kiểm tra approved Proposal/Analysis/Design/Tasks, source scope, deviations và required evidence; PASS chỉ khi compliance PASS và không required gap. No Specs là expected absence, không blocker hoặc lý do thêm spec.
- **QA:** non-browser tooling/runtime QA, ghi PASS / FAIL / BLOCKED_BY_ENVIRONMENT theo protocol. Docker thiếu ở required offline regression => matrix BLOCKED, QA BLOCKED_BY_ENVIRONMENT, VERIFY không PASS, không chuẩn bị Gate 3.
- Gate 3 chỉ khi cả ba layers PASS và required evidence đầy đủ; giữ `Sync authorization: PENDING`, dừng human review. Formalités vẫn không được sync/archive bởi change này.

## Global preservation and planning boundary

Formalités baseline source: `docs/reviews/formalites-authorization/03-integrity.json` (18 approved entries gồm 4 implementation files) cộng supplemental exact 17-file table trong Gate 1 của change này. Recompute full path set và bytes, không chỉ four-file subset hoặc Git status. Mismatch bất kỳ thời điểm nào => STOP ngay, không rehash/regenerate Formalités để làm hợp thức.

Không sửa Product/auth/tenancy/business application logic, schema/migration, Next/pnpm versions, lockfile, broad `*.d.ts` ignores, general integrity, provider, production. Không stage unrelated work, không force cached removal, không restore/build/restore. Không promote Environment/Production Readiness hoặc lifecycle khác.

Phase 1 remediation/revalidation 1.8–1.14 remains approved and PASS; Phase 2 is preserved without repeated mutations. Task 3.6 remains historically COMPLETE. Final closure completes 3.3/3.4/3.5/3.7/3.8: 26/26 tasks COMPLETE. R1 remains INVALID_NEGATIVE_FIXTURE_DUE_TO_PACKAGE_MANAGER_PRE_RUN_SIDE_EFFECT; R2 remains AGENT_SCHEDULING_ERROR. Qualified replacement evidence and serial harness PASS are retained in [completion evidence](../../../docs/reviews/next-generated-types-bootstrap/03-phase3-completion-evidence.json). The user manually removed the README negative fixture; [closure evidence](../../../docs/reviews/next-generated-types-bootstrap/03-phase3-closure-evidence.json) confirms no residue and unchanged candidate/protected bytes. Final [VERIFY](../../../docs/reviews/next-generated-types-bootstrap/03-verify.md) and separate [QA](../../../docs/reviews/next-generated-types-bootstrap/qa/QA_REPORT.md) assess all required evidence PASS. Historical stopped reports remain intact. No acceptance rerun, planning requirement change, Formalités operation, sync/archive or production operation.
