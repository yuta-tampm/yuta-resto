# Pointage usable raw clocking — Tasks and Implementation Plan

## Current Apply checkpoint — A1.2 PASS; A2.1 audit stop, 2026-09-12

Authority: explicit current-user attachment18536a1a-85c2-4a4b-8e49-41b0182c3c05.
OPTION A / APPROVED_BOUNDED_TEST_SCOPE, test-only. Không sửa production,
Spec, Design, helper DB, dependencies, migration hoặc UI.

A1.2: PASS. CLOUD_AUTH và MEMBERSHIP có composition cùng real repository
trên existing isolated migrated disposable cloud target. PERSONNEL có real
guards/page denial và wrong-domain actor negatives. Planning dùng đúng
human-approved current-surface composition, không invent domain operation.
POS dùng real local-auth service/query adapter cùng HTTP, không claim real
PostgreSQL POS proof. CURRENT_PLANNING_SURFACE_DOMAIN_SEPARATION: PASS.
Executed: Backoffice11, Personnel2, cloud integration4, POS service2, POS HTTP6;
25 focused cases PASS,24 unrelated cases skipped không tính evidence.

Cloud target admission PASS: container
850a960dc4405bd6d64c77797b17dabbe41577a467dda038ebddf7870278673e;
yuta_pointage_raw_clocking_test_c199aec4c9d44c12b979d7c4;
loopback55432, tmpfs/no external mounts, exact historical provenance,
actual database/user and22 existing migration hashes. Không provisioning,
migration, dotenv fallback, provider hoặc attendance write.
Fixture-specific cleanup hoàn tất; container được giữ nguyên.

R1 tiếp tục read-only tới A2.1: continuation yêu cầu dossier khác hoặc đổi scope.
First gap: same-establishment different-dossier continuation-consumer branch
chưa có explicit no-protected-read/write assertion. DTO tests reject dossier
field, nhưng HTTP negative hiện chỉ identify; actual cross-establishment proof
không thay thế exact same-establishment branch. Không phát hiện implementation
defect; không tự sửa test ngoài allowlist.
A2.1: PARTIAL. R1:4 requirements touched/20;5 scenarios evaluated/62,
PASS4/PARTIAL1;57 NOT_ASSESSED_AT_STOP.
A1.1/A7.1/R12.1 source/test evidence không bị thay đổi.

Chi tiết test names, commands, assertions, hashes và checks ở
[02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).
Chỉ năm test paths được duyệt và hai evidence documents thay đổi.
Không thay checkbox; Tasks25/32.

APPLY: PAUSED
Task 4.1 / R1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Bảy blockers giữ nguyên: retention; deletion/anonymization; legal hold;
backup-retention interaction; employee notice; detailed audit visibility;
trusted production client-address provenance.
STOP BEFORE TASK4.2; AWAITING_HUMAN_REVIEW tại A2.1.

## Historical Apply checkpoint — A1.1 PASS; A1.2 read-only audit stop, 2026-09-12

Authority: explicit current-user attachment
a3e707f8-7bd8-4342-8f78-e204e3608840/pasted-text.txt.
Bounded A1.1 exact-operation continuation regression only.
No Product, Spec, Design, runtime, catalog, schema, migration or UI edit.

A1.1: PASS. Current service authority mapping is state →
`pointage.employee.state.read`; CLOCK_IN, CLOCK_OUT and recover of either
kind → `pointage.employee.operation.create`. No recover grant was invented.
`withContinuation` validates the continuation; `authorize` checks current
Personnel/credential and calls `foundation.authorizeEmployeeOperation`.
One existing service test file gained ten focused exact-input/denial cases.
The focused run passed26/skipped66/total92, including16 unchanged current
lifecycle/lifetime cases; skipped cases are not evidence.
A1.1's separately accepted no-generic-authority branch was not reopened.
A7.1/R12.1 runtime/bootstrap/service implementation bytes remain unchanged;
their accepted evidence remains fresh, without rerunning actual processes.

R1 continued read-only to the fourth assessed scenario, A1.2.
Its WHEN presents a Pointage continuation to another domain. Its THEN requires
that domain not accept it as authorization proof. Current source separates
Pointage and cloud sessions, but inspected tests do not assert that reverse
presentation at the cloud session boundary. Rejecting a generic cookie at a
Pointage endpoint is the opposite direction. Null-session mocks and primitive
digest separation do not by themselves assert the A1.2 WHEN.
A1.2: PARTIAL / missing executable assertion, not an observed implementation
defect. STOP at this first gap; no new cross-domain regression or execution.
The accepted A1.1 AND branch remains accepted; this is a different scenario.

R1:3 requirements touched/20;4 scenarios clause-evaluated/62.
PASS3/PARTIAL1/MISSING0/QA_DEFERRED0;58 NOT_ASSESSED_AT_STOP.
No full62-row completed matrix claim;20 requirements/62 scenarios unchanged.
Detailed names, clauses, hashes, scope and checks are in
[02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).

Only source edit: apps/backoffice/test/pointage-raw-clocking-service.test.ts,
114 inserted lines in one block; no existing test behavior replaced.
Old SHA-256:4a139b05bdabe81a6ec2ecab728792a215cd2b74273114f7bb4ae17a6d36b356.
New SHA-256:7d9fdfb5370669de5ac09321cb755b28bedf96c6584cb9615170936cd166ecce.
Checks: focused tests, both typechecks, docs, architecture, strict OpenSpec,
UI pack and scoped formatting PASS. Global format diagnostic exit1,67
unrelated warnings preserved. No lint claim. No DB/build/browser execution.
Concurrent unrelated UI-UX Tasks changes are preserved and not attributed.

APPLY: PAUSED
Tasks: 25/32
Task 4.1 / R1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Synthetic/disposable only. Seven unresolved blockers: retention;
deletion/anonymization; legal hold; backup-retention interaction; employee
notice; detailed audit visibility; trusted production client-address provenance.
Historical E5-IDLE remains UNKNOWN / NOT REPRODUCED /
ROOT CAUSE NOT ESTABLISHED; current traced E5-IDLE PASS is unchanged.
STOP BEFORE TASK 4.2; AWAITING_HUMAN_REVIEW.

## Historical Apply checkpoint — A7.1/R12.1 compositional PASS; A1.1 audit stop, 2026-09-12

Authority: explicit current-user attachment
c046cb0a-66d2-40d5-a06e-5447ce879582/pasted-text.txt.
Bounded security regressions for A7.1/Spec R12.1 only; no full R3/R6.
Schema yuta-spec-driven. Skill yuta-run-change/openspec-apply-change preserves
the first additional missing-assertion stop and no lifecycle promotion.

Exact A7.1/R12.1 WHEN/THEN wording matches the human-approved compositional
proof. No impossible absent-provider/admitted-HTTP state is required.

Part A: two focused runtime unit tests PASS,2 passed/33 skipped/35 total.
Provider absence rejects admission, no returned runtime/facade; repository,
foundation/service factories and all seven foundation methods remain uncalled.
D1a identity/effective-privilege probes still precede provider validation and
are not forbidden credential/limiter work.

Part B: one focused HTTP composition test PASS,1 passed/34 skipped/35 total.
Real runtime factory, HTTP adapter, raw service and credential foundation;
database boundary/repository and bootstrap publication are unit doubles.
Healthy injected provider is127.0.0.1/SERVER_VERIFIED. Baseline and forged
Forwarded/X-Forwarded-For/X-Real-IP requests use identical scoped client/
candidate HMAC identities, preserve client-block429 and credential-denial403,
and never enter raw repository/Personnel/continuation authority or attendance.
No real DB/Next/browser execution occurred in this turn.

Reuse unchanged current actual provider evidence: PID13820,
runIdc199aec4-c9d4-4c12-b979-d7c4d2379442;24 valid trace rows;
provider ENTER14/FAIL15 PROVIDER; READY/publication/fallback0;
raw/receipt delta0;clients0;listener released. No rerun or bootstrap edit.
This unit test is not imported by that actual-process harness.

A7.1: PASS.
Spec R12.1: PASS.
Continue R1 audit: first next scenario A1.1 is PARTIAL.
Existing continuation happy/lifecycle tests do not assert the requested exact
operation passed to foundation for post-identify state/mutate/recover;
the fixture echoes the requested operation. Exact-call sequence/wrong-operation
assertions found in the suite cover identify publication, not continuation
consumption. Current implementation selects correct operation, so this is an
executable evidence gap, not an observed runtime defect.
Owning follow-up is separately reviewed bounded R3/exact-operation regression;
no such edit or execution is authorized here.

R1:3 requirements touched/20;3 scenarios clause-evaluated/62.
PASS2/PARTIAL1/MISSING0/QA_DEFERRED0 assigned;59 NOT_ASSESSED_AT_STOP.
No full62-row completed matrix claim. Remaining inventory/planned mapping stays
unchanged. Exact clauses, evidence classes, paths/names, source hashes/diff and
checks are in [02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).

Only source edit: apps/backoffice/test/pointage-raw-clocking-runtime.test.ts.
Old SHA-256 bb9cd7db7152f7168c7adae80c96b4961b5f13bdf212671717f1e0e9dbd379fe.
New SHA-256 2d181ed875430b09c0a05a4f5ef93b10c5474ca6bc193c3e562a472de4f921dc.
No new path, Product/Spec/Design/runtime/provider/schema/UI change.
Unrelated concurrent UI-UX task activity is not attributed or reverted.
No cache cleanup; preflight inventory2622, not prior2626. Four prior literal
cache paths were already absent before edits, with no Pointage path drift.
Do not claim whole-worktree stability across unrelated concurrent activity.

APPLY: PAUSED
Tasks: 25/32
Task 3.8 / U8: COMPLETE
Task 4.1 / R1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
Full R3: NOT_AUTHORIZED
R6: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Historical E5-IDLE: UNKNOWN / NOT REPRODUCED / ROOT CAUSE NOT ESTABLISHED;
current traced E5-IDLE PASS remains human accepted, no rerun or relabel.
Synthetic/disposable only. Seven unresolved blockers: retention;
deletion/anonymization; legal hold; backup-retention interaction;
employee notice; detailed audit visibility; trusted production client-address
provenance. STOP BEFORE TASK 4.2; AWAITING_HUMAN_REVIEW.

## Historical Apply checkpoint — provider trace hardened; clause-level R1 stop, 2026-09-12

Authority: explicit current-user attachment
fd1d5dd6-7565-47f2-94eb-4429f180c91c/pasted-text.txt.
TEST-EVIDENCE HARDENING ONLY. Skill yuta-run-change/openspec-apply-change
giữ stop tại missing normative assertion, không mở Task4.2/R3/R6.

CURRENT_HARNESS_PROVIDER_UNAVAILABLE_ACTUAL_PROCESS: PASS.
CURRENT_HARNESS_PROVIDER_UNAVAILABLE_TRACE_EVIDENCE: PASS.
Một pure test PASS (1 passed/96 skipped), sau đó đúng một targeted actual
provider test PASS (1 passed/96 skipped, exit0, 21.58s). Không E5-IDLE rerun.
Actual child PID13820/runIdc199aec4-c9d4-4c12-b979-d7c4d2379442:
24 validated trace rows; provider ENTER seq14, FAIL/PROVIDER seq15;
READY successful0, publication0, fallback0, clientsAfter0,
rawDelta0/receiptDelta0; exit1/signal null; independent port3001 release PASS.

Chỉ bootstrap.test.ts thêm49 lines trong3 hunks: local proof assertion,
pure empty/incomplete/READY rejection test và sanitized actual trace output.
Generic requireValid/emitter/launcher/runtime không đổi.
Old SHA-256: 47fa0e73eef08b4cb4b702d38e41e3027bbe96da58dee1a3e58af0d604937bbe.
New SHA-256: d7fe2d0de72a4e5432c6979537ae6d6de1764f8e2ff6a1dffc848ebbf0b240f9.

A7.1 và Spec R12.1: PARTIAL, nhưng trace gap đã đóng.
Clause-level audit thấy missing normative adversarial assertion: hiện có
null-provider rejection; các case có forwarded headers dùng healthy provider
và assert identify200, không assert untrusted-only refusal hoặc việc headers
không thay trusted address/limiter identity. Test mang tên untrusted thực tế
trả null. Không đánh đồng source guard, tên test hoặc startup rejection với
coverage đầy đủ mọi nhánh. Không phát hiện implementation conflict.
Owning future work: Task4.3/R3 provider/limiter hostile-input regressions;
Task4.6/R6 negative inventory. Chưa được phép sửa/chạy các phần đó.

Requirements evaluated2/20; scenarios evaluated2/62; PASS0/PARTIAL2/
MISSING0/QA_DEFERRED0. Remaining60 NOT_ASSESSED_AT_STOP, không giả full
62-row completed matrix. STOP tại missing assertion, không phải tại test PASS.
Historical planned62-row inventory giữ nguyên, không relabel thành evidence.
Chi tiết WHEN/THEN (hai scenarios không có AND), current paths/symbols,
actual trace, exact source diff và checks ở
[02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).

Fresh2626-file inventory: chỉ test và hai approved evidence documents đổi;
79 protected entries khác giữ nguyên; bootstrap là một authorized hash update.
Không new path, không sửa Design/Specs/02b/migration/env/UI/code.
Bốn pre-existing literal cache files cùng unrelated Formalités/UI-UX giữ nguyên.
Backoffice/recursive typecheck, docs, architecture, strict OpenSpec, UI pack
và scoped formatting được ghi kết quả ở02c. Global formatting diagnostic:
67 unrelated warnings, không formatter-write.

APPLY: PAUSED
Tasks: 25/32
Task 3.8 / U8: COMPLETE
Task 4.1 / R1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Historical E5-IDLE: UNKNOWN / NOT REPRODUCED / ROOT CAUSE NOT ESTABLISHED;
current traced E5-IDLE PASS vẫn human accepted. Non-blocking historical
observation, reopen equivalent relevant recurrence, không claim fixed/flaky.
Synthetic/disposable only. Bảy blockers không đổi: retention;
deletion/anonymization; legal hold; backup-retention interaction;
employee notice; detailed audit visibility; trusted production
client-address provenance.
STOP BEFORE TASK 4.2; AWAITING_HUMAN_REVIEW.

## Historical Apply checkpoint — one provider refresh; trace proof incomplete, 2026-09-12

Authority: explicit current-user attachment
99a8f22a-4cc5-44c9-a6b1-c65316a889ef/pasted-text.txt. Đúng một existing focused
provider-unavailable actual-process case đã chạy trên current approved harness.
Không E5-IDLE rerun, broad suite hoặc Task4.2+ execution.

Selected test: PASS, exit0, 1 passed / 95 skipped; 42.14s.
Actual child PID14708/runId1fa09f66-02ab-4efe-bc42-edc326a4b9c1:
provider reached/unavailable1, healthy0, READY0, published0, replacement0,
closedClients2, remainingClients0, child exit1/signal null, listener released,
rawDelta0/receiptDelta0. Post-run PID absence và independent port3001 bind PASS.

CURRENT_HARNESS_PROVIDER_UNAVAILABLE_ACTUAL_PROCESS: PARTIAL.
Lý do: required complete ADMISSION_TRACE_V1 evidence chưa được established.
Current provider case gọi requireValidMessages nhưng không snapshot/format
trace hoặc assert nonempty trace, provider ENTER/FAIL/PROVIDER và no READY trace.
Collector requireValid chỉ kiểm tra sticky invalid flag; empty collector cũng
qua được. Output không có trace rows/last stage/failureClass. Không suy ra
actual sequence từ source hoặc lấy E5-IDLE trace thay cho provider trace.

Runtime negative semantics đã có fresh evidence; historical provider PASS
không được relabel. Full proof chưa PASS nên không resume remaining60 R1 rows.
A7.1 và Spec R12.1 vẫn PARTIAL; no new stale-source finding. Không sửa test,
harness/runtime hoặc tự retry. Minimal next decision: existing provider test
có được bổ sung exact trace-presence/provider-failure assertions và sanitized
formatEvidence output, rồi review exact hash trước một separately approved
rerun hay không. Đây là request, không execution authority hoặc R3 work.

80 protected hashes và toàn bộ 2622-file tracked/nonignored inventory không
đổi trong actual run. Exact evidence, acceptance checklist và final document
hash references ở [02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).
Không đổi checkbox/count hoặc approved contracts.

APPLY: PAUSED
Tasks: 25/32
Task 3.8 / U8: COMPLETE
Task 4.1 / R1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Historical E5-IDLE: UNKNOWN / NOT REPRODUCED / ROOT CAUSE NOT ESTABLISHED;
current traced E5-IDLE PASS vẫn được human accepted, non-blocking historical
observation; reopen nếu equivalent recurrence overlaps normative requirement.
Bảy blockers không đổi: retention; deletion/anonymization; legal hold;
backup-retention interaction; employee notice; detailed audit visibility;
trusted production client-address provenance. Synthetic/disposable only.
STOP BEFORE TASK 4.2; AWAITING_HUMAN_REVIEW.

## Historical Apply checkpoint — U8 accepted; R1 freshness stop, 2026-09-12

Authority: explicit current-user attachment
931c3212-5fba-40e3-a0a7-8f09f8c511c3/pasted-text.txt.
TASK 3.8 / U8: HUMAN ACCEPTED — COMPLETE.
Phase 1, Phase 2 và Phase 3 / U1-U8: COMPLETE.

Task 4.1 chỉ được phép read-only mapping/audit. Fresh preflight khớp 80
protected hashes và exact two-Spec path set. Source inventory vẫn đúng
20 requirements / 62 scenarios; không đồng nghĩa đã audit đủ 62 scenarios.

R1 dừng tại điều kiện stale evidence do current user quy định:
provider-unavailable actual-process PASS được ghi trên ba harness hashes
trước ADMISSION_TRACE_V1; lần chạy current-source mới chỉ chọn E5-IDLE.
Không relabel provider PASS thành current-source, không tự rerun hoặc sửa test.
A7.1 và Spec R12.1: PARTIAL / STALE_ACTUAL_PROCESS_EVIDENCE.
60 scenarios còn lại chưa hoàn tất đánh giá R1; không tự gán PASS/MISSING/
QA_DEFERRED. Exact stale hashes, source assertions và partial gap matrix ở
[02c review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).
Historical planned mapping bên dưới chưa được thay bằng completed current matrix.

Current traced E5-IDLE: accepted current-source evidence, không bị hạ trạng
thái chỉ vì historical Generation A admission failure. Observation cũ vẫn
UNKNOWN / NOT REPRODUCED / ROOT CAUSE NOT ESTABLISHED; non-blocking theo human
disposition, giữ cho R7/post-Apply assessment và reopen nếu equivalent failure
tái xuất hiện. Không claim fixed, root-caused, proven flaky hoặc không thể tái diễn.

APPLY: PAUSED
Tasks: 25/32
Task 3.8: COMPLETE
Task 4.1: PARTIAL
Task 4.2+: NOT_AUTHORIZED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Chỉ synthetic/disposable attendance. Bảy blockers giữ nguyên: exact retention
duration; deletion/anonymization; legal hold; backup-retention interaction;
employee notice; detailed audit visibility; trusted production client-address
provenance. Không source/test/Design/Spec/env/migration/UI-pack edit, DB operation,
actual-process rerun, Browser QA, Gate 3, deploy/enable/sync/archive.
STOP trước Task 4.2; cần human direction về bounded stale-evidence refresh trước
khi tiếp tục R1. Không tự chuyển refresh sang R3 hoặc làm thay R2-R6.

## Historical Apply checkpoint — Task 3.7 / U7, 2026-09-11

Authority: explicit current-user TASK 3.7 / U7 APPLY AUTHORIZATION: APPROVED
(attachment 1c0ab46c-35f1-457f-b753-40e4e53d07a2/pasted-text.txt), cùng
Human clarification approved (90dc3267-ee0a-4d79-a7eb-2df6ec5d0107/pasted-text.txt).
Impact: PAGE_LOCAL trong approved CROSS_MODULE change; schema yuta-spec-driven.
Clarification giải quyết điểm chưa rõ của lượt trước, không sửa Product/Specs/
Design/server/API/contracts. Không rewrite historical observation.

Quyết định con người, không phải inference: mỗi lần bấm “Vérifier le résultat”
gọi recover trước với exact frozen requestId + kind + observedStateGuard và
live continuation. Matching COMMITTED kết thúc bằng original receipt, không
resend. Chỉ exact UNCONFIRMED cho phép tối đa một resend trong cùng click,
với nguyên tuple, không state request xen giữa. Unknown sau resend giữ tuple/
RESULT_UNKNOWN rồi dừng; chỉ click tiếp theo mới mở chu kỳ bounded mới.
Conflict dừng recovery; explicit state refresh thành công bỏ rejected tuple,
cập nhật guard/state; chỉ new explicit action sau đó được tạo new requestId.

Fresh preflight: HEAD 415990386327aaccab3c32b1fef0569a0fde7f3a; 2622
tracked/nonignored files; 80 protected entries khớp. Design SHA-256
67e0920dfe6591612a314e301fec8bed68d0454a65eb103688138d9f69cbf172 không đổi.
Pre-U7 Tasks SHA-256
dbd28e040b7b33c291f43299780c78f7705b10362711b1d5f0e665514b5d551d.
20 requirements / 62 scenarios và exact two-Spec path set giữ nguyên.

Implementation chỉ năm existing approved paths: pointage-employee.tsx,
pointage-active-interaction.tsx, pointage-client.ts, pointage-interaction.ts
và test/pointage-interaction.test.ts. Không new path hoặc inventory-test edit.
Frozen tuple ở controller memory; presentation không chứa ID/guard/token.
Wrapper state/recover stateless, strict existing Zod, credentials omit/cache
no-store/AbortSignal. Không tuple store trong wrapper hoặc retry timer/loop.

U6 vẫn sở hữu clear/abort/generation; mọi recover/state/resend completion
kiểm tra generation và current flight. ACCESS_DENIED clear neutral; 503/
malformed/wrong receipt/network uncertainty không trở thành failed attendance.
State refresh anchor trước request, absolute min(existing, returned bound),
idle chỉ gia hạn bằng explicit successful state response; superseded timer
không clear nhầm refreshed generation. Receipt không có lifetime fields mới.

Apply evidence: 111/111 interaction (66 U5/U6 cases + 45 U7 cases), combined
124/124 với 13 HTTP cases; isolated header 40 passed/5 actual DEV HTTP skipped.
Backoffice và recursive typechecks, docs:check, architecture:check, strict
OpenSpec, UI pack và scoped Prettier đạt. Global format diagnostic exit1:
67 unrelated warnings, không sửa. Nine intermediate expectation failures do
action flag bị đặt nhầm vào identify assertion thay vì mutation assertion;
đã sửa đúng test placement, final full suite đạt.

Các U5 assertions thay đổi chỉ theo U7 authority: unknown có explicit recovery
action; confirmed conflicts có explicit refresh; denied continuation clear;
unavailable mutation giữ unknown. No-success/no-automatic-retry, receipt10s và
toàn bộ U6 privacy/lifetime tests vẫn chạy. /recover không còn thuộc source
prohibition; storage/tenant/secret/heartbeat prohibitions vẫn giữ.
Exact pre/post hashes, evidence mapping và byte-exact U7-only diff ở 02b/02c.

APPLY: PAUSED — U7 COMPLETE; STOP BEFORE TASK 3.8
Tasks: 24/32
Task 3.6: COMPLETE
Task 3.7: COMPLETE
Task 3.8: NOT_STARTED
Task 3.8+ authorization: NOT_GRANTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES.
UI_UX_PRO_MAX_USAGE: OPTIONAL / NOT_USED; approved no-image direction giữ nguyên.
Chỉ synthetic/disposable data. Không build/start, DB/container/migration,
real browser/QA/screenshots, formal VERIFY, Gate3, deploy/enable/sync/archive
hoặc lifecycle promotion. Không thay server/domain, grants, contracts,
migration0021, root/proxy/CSP/cache, env profile hoặc sealed UI pack.
Bảy blockers giữ nguyên: retention; deletion/anonymization; legal hold;
backup-retention; employee notice; detailed audit visibility; trusted production
client-address provenance. Không newly discovered scope/dependency blocker.
Chờ explicit human authorization trước Task 3.8.

## Historical Apply checkpoint — Task 3.6 / U6, 2026-09-11

Authority: explicit current-user TASK 3.6 / U6 APPLY AUTHORIZATION: APPROVED,
attachment fc4142e8-6e34-4ac6-b7bb-06ad1c0ac42c/pasted-text.txt.
Impact: PAGE_LOCAL trong approved CROSS_MODULE change, schema yuta-spec-driven.
Chỉ U6 được thực hiện; U7 chưa được phép. Design/Specs/Product không reopen.

Fresh preflight: 2622 tracked/nonignored files; cả 80 protected path/hash entries
khớp. Approved Design SHA-256
67e0920dfe6591612a314e301fec8bed68d0454a65eb103688138d9f69cbf172;
pre-U6 Tasks SHA-256
85532655f985c028f4991efedc27b3cac36a6c6875f57fd16a26b1c6f2d32636.
Hai delta Specs vẫn đúng 20 requirements / 62 scenarios. Existing U5 sources
được snapshot trước Apply; không sửa unrelated dirty work.

U6 dùng một route-owned generation tăng trên mọi clear. Cùng end primitive
xóa continuation, stateGuard, flight reference, PIN/personal snapshot và ba
timers/deadlines, abort owned requests rồi neutral; own-end chỉ best-effort
với token cũ đã capture, không remote-ACK claim hoặc end retry queue.
Mọi protected async completion/timer kiểm tra captured generation; kết quả
cũ hoặc AbortError không thể restore identity, receipt hay failure.
Không có future retry tuple store; single-attempt mutation giữ nguyên.

Identify lifetime dùng performance.now trước request + server remaining
expiresInMs/idleInMs, bảo thủ trừ toàn bộ round trip; không dùng Date.now.
Absolute fixed; idle không gia hạn bằng activity, render hoặc mutation receipt
vì receipt không có remaining-duration fields. Receipt max10s, có thể clear
sớm tại known idle/absolute deadline. Early timer re-arms cùng deadline;
late timer hoặc operation sau known deadline clear ngay, không extend authority.

Chỉ ba event registrations: visibilitychange(hidden), pagehide và pageshow.
Browser lifecycle callbacks flushSync neutral external-store update; không
cố giữ personal DOM qua snapshot. Actual DOM/bfcache timing vẫn cần Browser QA.
Visible again không restore; persisted/non-persisted pageshow neutral.
Dispose dùng cùng clear primitive rồi detach listeners, không để secret trong
controller. React effect cleanup/reattach không restore interaction. New instance
sau refresh/restart/duplicate chỉ initial neutral, không cross-tab transfer.

Exact source scope: pointage-employee.tsx, pointage-client.ts và
test/pointage-interaction.test.ts. Không file mới; không sửa pure reducer,
credential/active components, inventory/HTTP test, API/server/auth/contracts/DB,
migration0021/proxy/root layout/shared UI hoặc sealed UI pack.
Stateless wrapper chỉ thêm AbortSignal, không retry/recover hoặc new DTO.

Apply evidence: complete interaction suite 66/66 (41 U5 regression + 25 U6 cases);
HTTP adapter 13/13; combined 79/79; isolated header 40/40, năm actual DEV
HTTP tests skipped. Backoffice và recursive typechecks, docs, architecture,
strict OpenSpec, UI pack, scoped format đạt exit0. Global format exit1 với
67 unrelated warnings giữ nguyên. Hai intermediate source-negative failures
do comment chứa chuỗi /recover; sửa comment, không bỏ assertion.
U5 long-wait assertions được cập nhật chỉ để chấp nhận đúng một own-end tại
U6 deadline; duplicate/no-attendance-retry và receipt 9.999/10.000 ms giữ nguyên.
Exact current hashes, generation/deadline matrix và diff ở 02b/02c.

APPLY: PAUSED — U6 COMPLETE; STOP BEFORE TASK 3.7
Tasks: 23/32
Task 3.5: COMPLETE
Task 3.6: COMPLETE
Task 3.7: NOT_STARTED
Task 3.7+ authorization: NOT_GRANTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

UI_AFFECTING: YES; BROWSER_QA_REQUIRED: YES; đây chỉ là Apply evidence.
Không build/start, database/container/migration operations, Browser QA,
Gate3, deploy/enable, sync/archive hoặc lifecycle promotion. Không UI recover,
resend, state refresh/rebase, heartbeat hay storage/channel/service-worker state.
UI_UX_PRO_MAX_USAGE: OPTIONAL / NOT_USED. Synthetic/disposable data only.
Bảy blockers không đổi: exact retention; deletion/anonymization; legal hold;
backup-retention interaction; employee notice; detailed audit visibility;
trusted production client-address provenance. Không mới phát hiện dependency
vượt scope U6. Cần explicit human authorization trước Task 3.7.

## Historical Apply checkpoint — Task 3.5 / U5, 2026-09-11

Authority: explicit current-user TASK 3.5 / U5 APPLY AUTHORIZATION: APPROVED,
attachment 9d196735-6b90-478d-b159-520a5c9796ef/pasted-text.txt.
Impact: PAGE_LOCAL trong approved CROSS_MODULE change. Chỉ U5 được thực hiện;
Task 3.6+ chưa được phép. Không reopen Design, đổi Product/Specs hoặc sealed UI pack.

Fresh preflight: HEAD 415990386327aaccab3c32b1fef0569a0fde7f3a;
Design SHA-256 67e0920dfe6591612a314e301fec8bed68d0454a65eb103688138d9f69cbf172;
pre-U5 Tasks SHA-256 d3b51f21bc04cd63a1b5f358ecf26abead00d8907ce4e5f443ab640b5bebe02b.
Hai delta Specs giữ đúng path set và 20 requirements / 62 scenarios.
Toàn bộ 76 protected hashes khớp trước code edits. Baseline gồm 2618 unique
tracked/nonignored files; existing untracked PAGE components được snapshot,
không ghi đè unrelated hunks.

U5 đã nối form identify và single-attempt CLOCK_IN/CLOCK_OUT tới existing
transport. Strict combined identify response mới cấp protected presentation;
mọi identify settle bỏ PIN. Route-owned controller dùng React subscription,
một in-flight marker chống duplicate/stale completion tối thiểu; reducer chỉ
quản lý presentation. Client wrappers stateless, omit cookies, no-store,
không retry/recover. Chỉ committed receipt có đúng kind/requestId mới được hiển thị;
network/malformed/mismatched response thành RESULT_UNKNOWN, không suy ra event.
Display dùng server instant, stored offset (kể cả seconds), calendar và microseconds;
không current tzdb hoặc browser clock để xác định attendance.

Credential/pending, hai current states, mutation pending, hai receipts,
state/request conflict, unknown, access/rate-limit/unavailable/invalid và
end-neutral đã có. Chỉ own name/current open start; không history/totals/prior OUT,
chooser hoặc visible continuation/guard/requestId. Receipt timer kiểm tra
9.999 ms vẫn receipt, 10.000 ms neutral; explicit end immediate neutral và
best-effort own-end, không hứa remote revocation. Labels, submit keyboard
semantics, live announcements, disabled pending, 48px controls và focus targets
được kiểm tra ở mức component markup/callback/source, không Browser QA.

Không implement U6 idle/absolute timers, visibility/pagehide/pageshow/bfcache
hoặc full generation clearing. Không implement U7 recovery/refresh/rebase/
resend/retry controls; conflict/unknown chỉ hiển thị thông báo và Terminer.
Không claim bounded receipt timer hoặc minimal stale completion guard là full U6.
Không client runtime fixture/provider/default, server/API/domain/auth/DB edit.

Exact code scope: hai existing PAGE components sửa, ba PAGE files mới,
một UI test mới; PAGE entry không đổi. Existing U3 inventory test chỉ đổi
expected RSC client reference từ PointageCredentialEntry sang PointageEmployee
vì U5 chuyển client interaction ownership lên component đó; không weaken
cache/CSP/privacy assertions. Không chạy lại actual Next HTTP trong lượt này.

Apply evidence (không formal VERIFY): U5 41/41; unchanged HTTP adapter 13/13;
isolated U3 headers 40/40, năm actual DEV tests intentionally skipped.
Backoffice/workspace typecheck, docs, architecture, strict OpenSpec, UI pack
và scoped Prettier check đạt exit 0. Global format diagnostic exit 1 với
đúng 67 unrelated warnings, không sửa chúng. Một intermediate timer-test
attempt 39/41 do lấy mốc trước JSON settle; sửa test lấy đúng receipt-visible
transition, giữ assertion 9.999/10.000 ms, final 41/41. Không thay runtime
timer để né assertion. Exact hashes/diff và commands ở 02b/02c.

Late preflight observation, 2026-09-11T14:40:20Z: ngoài phạm vi U5,
openspec/changes/ui-ux-pro-max-integration/tasks.md đã đổi hash từ
4704d0aaa1514d39c13ec802eba5c3adb643beba0375ab2c3d1b2b99e596840c sang
8b6c1e66b910cac432805b8284c151ab09b00eff91eb5caa115932de8dfe1e05.
Không có U5 write vào path này; không quy kết tác giả hoặc sửa/restore nó.
Baseline toàn checkout vì vậy không còn byte-identical. Đây là out-of-scope
concurrent/unattributed drift, không thuộc exact U5 diff. Cả 80 current
Pointage protected paths vẫn khớp, Design/Specs không drift; U5 diff vẫn
reverse-check PASS. Giữ nguyên biến động ngoài phạm vi và dừng trước U6.

APPLY: PAUSED — U5 COMPLETE; STOP BEFORE TASK 3.6
Tasks: 22/32
Task 3.2: COMPLETE
Task 3.3: COMPLETE
Task 3.4: COMPLETE
Task 3.5: COMPLETE
Task 3.6: NOT_STARTED
Task 3.6+ authorization: NOT_GRANTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Bảy blockers giữ nguyên: exact retention duration; deletion/anonymization;
legal hold; backup-retention interaction; employee notice; detailed audit
visibility; trusted production client-address provenance. Synthetic/disposable
data only. Không DB/container/migration/build/start, Browser QA, Gate 3,
deploy/enable, sync/archive hoặc lifecycle promotion. UI_UX_PRO_MAX_USAGE:
OPTIONAL / NOT_USED. Cần explicit human review/authorization trước Task 3.6.

## Historical Apply checkpoint — continuous U3 evidence and structural U4, 2026-09-11

Authority: current-user APPROVED — RETRY U3 LOCAL PRODUCTION-MODE EVIDENCE
WITH ONE CONTINUOUS ORCHESTRATION GENERATION. Execution retry only; Design,
PROCESS_ENV_SHADOW_ISOLATION_V1, Specs, implementation, env, migration và
sealed UI pack không thay đổi. Previous build chỉ là historical evidence,
không được tái dùng cho U3.

Fresh preflight khớp Design SHA-256
`67e0920dfe6591612a314e301fec8bed68d0454a65eb103688138d9f69cbf172`,
pre-execution Tasks SHA-256
`7eca3697ea02b9fe4b05969a5a2d585147e405ceb35ddface0ed3e342e541ea4`,
hai Specs và toàn bộ 76 protected paths. HEAD vẫn
`415990386327aaccab3c32b1fef0569a0fde7f3a`.

Generation `14f3baa8-ce14-41b2-ba8d-9c194d18f2be`, orchestrator PID 15332,
liên tục từ PRECHECK 2026-09-11T14:07:31.618Z tới FINAL CHECKS
2026-09-11T14:09:48.129Z. Một frozen dedicated env object giữ nguyên identity
và từng entry qua fresh BUILD exit 0 rồi START. Re-admission trước START
xác nhận union đúng 8 key names, non-empty shadows, exact categories, tool
identities và hai ports trống. Không serialize/reconstruct profile, không
probe, wrapper file, private flag, functional credential hay fallback.

U3 LOCAL PRODUCTION-MODE IMPLEMENTATION EVIDENCE: PASS.
Actual HTML 200 và RSC/Flight 200 đều neutral, final Cache-Control đúng
`private, no-store, max-age=0`, Pragma no-cache, Expires 0; không public,
s-maxage, Set-Cookie hoặc protected payload. Hai HTML responses có mỗi
21 script tags đều khớp nonce; nonce khác giữa requests, inbound CSP /
report-only / x-nonce không chọn được nonce, không unsafe-inline/unsafe-eval.
Unrelated /, /favicon.ico, /api/pointage-other giữ riêng policy; no-owner
context trả 503 POINTAGE_UNAVAILABLE. Không activate Pointage runtime.

Listener Node PID 13936 thuộc đúng START process tree, chỉ bind
127.0.0.1:3001. Sau evidence, chỉ owned tree được terminate; START exit 1
do chủ động shutdown, không phải spontaneous start failure. Server exit
được xác nhận; ports 3001/65431 trống. Parent vẫn sống qua final checks.

Task 3.3 hoàn tất trước khi đánh giá remaining U4. U4 source/composition
check-only đạt 20 assertions trên existing page/container/credential-entry,
shared primitives/tokens/root fonts: hierarchy, responsive structural classes,
French labels, accessible label association, named exports, 48px control
variants, focus support và NO_APPLICATION_SHELL. Không cần code change.
Active-state/receipt presentation và interaction logic vẫn thuộc U5-U7;
không tạo active-interaction hoặc deferred \_lib files trong retry này.
Credential controls vẫn disabled; đây không phải usable employee workflow.
Viewport, keyboard interaction và visual parity vẫn chờ Browser QA riêng.

Focused U3 invocation đầu tiên chọn 0 tests (45 skipped), không tính PASS.
Chạy lại selector `U3.isolated.header.implementation.evidence`: 40 passed,
5 skipped, exit 0. Actual production HTTP proof ở trên độc lập với các
DEV-only tests bị skip. Backoffice/workspace typechecks, docs, architecture,
strict OpenSpec, UI pack và scoped formatting exit 0; global format exit 1
với đúng 67 unrelated warnings, không formatter-write. Trước checkpoint edits,
toàn bộ 2618 tracked/nonignored baseline files vẫn byte-identical.
Exact commands, timestamps, hashes và sanitized evidence nằm trong 02b/02c.

APPLY: PAUSED — APPROVED U3/U4 CHECKPOINT COMPLETE; STOP BEFORE 3.5
Tasks: 21/32
Task 3.2: COMPLETE
Task 3.3: COMPLETE
Task 3.4: COMPLETE — STRUCTURAL U4 ONLY
Task 3.5: NOT_STARTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Không formal VERIFY, Browser QA, Gate 3, deploy/enable, sync/archive hoặc
lifecycle promotion. UI_UX_PRO_MAX_USAGE OPTIONAL / NOT_USED giữ nguyên.
Synthetic/disposable-only và cả bảy blockers giữ nguyên: retention,
deletion/anonymization, legal hold, backup-retention interaction, employee
notice, detailed audit visibility, trusted production client-address provenance.
Historical DEV cache FAIL và failed orchestration checkpoint bên dưới không
được đổi thành PASS. Tiếp tục 3.5 cần explicit human authorization.

## Historical Apply checkpoint — U3 build-only evidence, 2026-09-11

Human approval: attachment 528d97be-84f7-49ec-901a-6f6e87c6d5b4/pasted-text.txt
approves PROCESS_ENV_SHADOW_ISOLATION_V1 and exactly the Design hash
`67e0920dfe6591612a314e301fec8bed68d0454a65eb103688138d9f69cbf172`
and pre-execution Tasks hash
`2a5dbc287640ffa8be87f6da12d97b0dc14f7b50eed1d31b1f1e1a315bf971be`.
This checkpoint changes execution evidence only, not a contract or checkbox.

Fresh preflight matched both approved hashes, both delta Specs and all 76
protected implementation/migration/UI-pack paths. The production env-file
union remained the approved eight names; no file values were emitted or copied.
Ports 3001 and 65431 had no listener. Node, pnpm shim and COMSPEC identities
were resolved and hashed. Unrelated dirty work was preserved.

BUILD admission passed at 2026-09-11T13:40:43.021Z, generation
`04180af7-0900-44d5-bbab-005753a4bc77`. The exact command
`pnpm --filter @yuta/backoffice build` exited 0 under the frozen reviewed
profile, seven-key OS allowlist and verified COMSPEC arguments. No wrapper
file, env edit, private Next flag, functional credential or fallback was added.

U3 LOCAL PRODUCTION-MODE EVIDENCE: INCOMPLETE.
Stop reason: the ephemeral orchestration ended after BUILD, before START.
Its stdin continuation did not retain the process; the same frozen in-memory
environment generation was therefore no longer available. This is an agent
orchestration failure, not a proven framework defect or environment dependency.
D10b requires STOP on orchestration termination. Do not reuse this build for
START in a different generation or claim build success completes U3.

START, actual HTML/RSC/cache/CSP/route-isolation/no-owner proofs and U4
completion were NOT_RUN. No DB-connection error or credential rejection was
reported by the sanitized build classifier; absence of diagnostics does not
prove no connection attempt. Full DB/provider non-use and effective-value
propagation evidence are not claimed complete. No DB/container/provider setup,
identify, credential submission or attendance operation was performed.

Post-build comparison found all 2618 tracked/nonignored baseline files unchanged.
The owned build process tree exited; ports 3001 and 65431 remained free.
Generated .next output is retained as generated build state, not final U3 proof.
Detailed command results and approval provenance are recorded in the existing
02b/02c review packets. No implementation/test/UI/migration/Spec bytes changed.
The previous DEV exact-cache failure remains historical FAIL.

APPLY: PAUSED
Tasks: 19/32
Task 3.2: COMPLETE
Task 3.3: PARTIAL
Task 3.4: PARTIAL
Task 3.5: NOT_STARTED
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Return for explicit continuation after this mandatory stop. A future attempt
must rebuild and start within one continuously retained admitted generation;
the existing build alone is not reusable evidence. No Design, profile or
implementation workaround is proposed. Synthetic/disposable-only authority
and all seven blockers remain: retention, deletion/anonymization, legal hold,
backup-retention interaction, employee notice, detailed audit visibility and
trusted production client-address provenance. No 3.5, Browser QA, Gate 3,
deployment, enablement, sync, archive or lifecycle promotion.

## Historical U3 environment isolation planning — PROCESS_ENV_SHADOW_ISOLATION_V1

Authority: current-user bounded planning decision và human clarification:
empty-string prohibition là YUTA policy, không phải Next dotenv precedence.
D10b định nghĩa exact 8-key production-file union + 2 fixed evidence values,
7-key OS allowlist, non-empty poison/loopback deny profile và same-generation
build/start propagation. Đây là CROSS_MODULE evidence boundary của toàn
Backoffice process, không đổi Product/Specs/runtime architecture.

SENSITIVE DESIGN — U3 ENVIRONMENT ISOLATION REVIEW
Status: AWAITING_HUMAN_REVIEW
U3 LOCAL PRODUCTION-MODE EVIDENCE:
BLOCKED_BY_ENVIRONMENT_AUTHORITY
APPLY: PAUSED
Tasks: 19/32
Task 3.3: PARTIAL
Task 3.4: PARTIAL
Task 3.5: NOT_STARTED

U3 TECHNICAL IMPLEMENTATION CONTRACT bổ sung D10b admission: inventory đủ bốn
production-loadable env files, không dùng development.local; mọi union key có
non-empty shadow trước Next initialization; không copy/hash/persist file values.
FRAMEWORK FACT: origEnv presence, kể cả empty string, ngăn file selection vào
parsed. YUTA POLICY: vẫn cấm empty-string shadow vì consumer ambiguity.
Không thay đổi F1-F8/S1-S9/U1-U8/R1-R7 khác, four phases hoặc 32 checkboxes.

Exact profile/values, deny-sink port 65431/database yuta*u3_env_blocked, literal
false SSL và loopback NEXT_PUBLIC_APP_URL theo D10b. AUTH_SECRET poison không
đạt minimum 32; nếu consumer đòi valid credential thì STOP, không sửa marker.
Không alias các GOOGLE*\* cũ thành current connector names hoặc bật Personnel
extraction. No provider/bootstrap/synthetic enablement, VERCEL, private Next
flags, broad parent-env inheritance hoặc functional temporary credentials.

Future commands giữ nguyên, chỉ sau approval exact hashes/profile: một
dedicated child env, cùng frozen generation, chạy existing Backoffice build
rồi start --hostname 127.0.0.1 từ repo root theo D10b. Re-inventory/admit trước
từng command; unknown key, forbidden collision, occupied sink, DB attempt,
profile propagation mismatch hoặc unsafe validator requirement đều STOP.
Không thêm script/path, env-file edit hay đổi Pointage child launcher.
Separate @next/env probe NOT_PROPOSED; mọi probe tương lai cần review riêng.

POST-APPLY VERIFY phải re-evaluate D10b admission/propagation cùng D10a actual
final-response proof, không suy ra PASS từ profile hoặc source inspection.
QA vẫn riêng sau VERIFY; UI_AFFECTING YES, BROWSER_QA_REQUIRED YES giữ nguyên.
V1 không phải Browser QA, deployment, production readiness hoặc data authority.
Không probe/build/start/DB/container/migration/test execution trong alignment.

Chưa complete 3.3/3.4; future approved U3 PASS mới cho 20/32, remaining U4
PASS riêng mới cho 21/32, rồi STOP trước 3.5. Historical DEV failed exact-cache
test và 91 PASS / 1 FAIL giữ nguyên; không sửa lịch sử thành production proof.
Các checkpoint cũ bên dưới là history, không cấp approval cho revised bytes.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED
Real employee attendance: NOT_AUTHORIZED

Giữ synthetic/disposable-only và bảy blockers: retention, deletion/anonymization,
legal hold, backup-retention, employee notice, audit visibility, trusted
production client-address provenance. Không deploy/enable/sync/archive.

## Historical Sensitive Design / Tasks alignment — U3 final cache evidence

Authority: explicit current-user planning-only request in attachment
9ef79825-9910-4483-a6d9-ecc08a8fe6d4/pasted-text.txt. Revised exact Design/Tasks
hashes require human review before any implementation resume or build/start.
Only Design, Tasks, 02b and 02c may change in this alignment.

APPLY: PAUSED
Tasks: 19/32
Task 3.2: COMPLETE
Task 3.3: PARTIAL
Task 3.4: PARTIAL
Task 3.5: NOT_STARTED

D10a and Verification Design distinguish the accepted Next 16.2.9 DEV-only
`Cache-Control: no-cache, must-revalidate` from mandatory deployable final
`private, no-store, max-age=0` page evidence. No `public` or `s-maxage`;
additional `no-cache` / `must-revalidate` are allowed. Preserve the historical
91 PASS / 1 FAIL run and its exact failing assertion; no test is edited or
rerun here, and DEV acceptance does not complete U3.

Preserved actual DEV PASS observations: HTML 200, RSC 200, neutral payload,
per-request nonce, all applicable Next scripts matching, distinct nonce on a
second request, rejection of inbound CSP/report-only/x-nonce control,
unrelated-route isolation and normal no-owner API unavailability. DEV must
still exclude public/shared/user-controlled cache policy.

Future U3 evidence is `LOCAL_PRODUCTION_MODE_IMPLEMENTATION_EVIDENCE`, not
deployment/readiness or Browser QA. Existing commands, from repository root:

```text
pnpm --filter @yuta/backoffice build
pnpm --filter @yuta/backoffice start --hostname 127.0.0.1
```

Use the actual filesystem page at
`http://127.0.0.1:3001/pointage/synthetic-establishment`. D10a defines the exact
process-local production-rendering environment, loopback/no-ingress boundary,
effective environment-file preflight, no DB/provider/bootstrap/fallback,
HTML/RSC final cache assertions, fresh production-mode nonce/script proof,
no Set-Cookie/personal payload, isolation, shutdown evidence and STOP conditions.
Inspect inherited and Next-autoloaded configuration without printing values;
existing .env/.env.local must not silently enable DB/provider composition.
No new script/path, environment-file edit or D1b bootstrap is authorized.
If safe isolation or neutral DB-free rendering cannot be established, STOP.

No post-render interceptor or global workaround is proposed. Current proxy,
page, tests, migration and UI pack remain byte-identical. Actual production-mode
failure or ambiguous/cacheable RSC requires review, not silent compensation.
No build/start, runtime test, database/container operation or Browser QA now.

Only future approved U3 PASS may complete 3.3 (20/32); then return to remaining
approved U4, complete 3.4 only on its own evidence (21/32), and STOP before 3.5.
Four phases, 32 tasks, F1-F8/S1-S9/U1-U8/R1-R7 and all 20/62 mappings remain.
The historical checkpoints below are preserved observations, not current
approval of revised bytes or authority to execute superseded instructions.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Real employee attendance: NOT_AUTHORIZED
Production enablement: NOT_AUTHORIZED

P13/P14 synthetic/disposable-only authority and all seven blockers remain:
retention, deletion/anonymization, legal hold, backup-retention interaction,
employee notice, detailed audit visibility, trusted production client-address
provenance. No lifecycle promotion, deploy, enablement, sync/archive or Gate 3.

## Historical Apply checkpoint — bounded U3/U4 interleaving blocked, 2026-09-10

Authority: current-user attachment 24d42afd-c676-4c4e-8f5f-318f38c00f0f,
APPROVED — BOUNDED TASK INTERLEAVING. Order: structural 3.4 prerequisite,
immediate actual-page 3.3 proof, finish 3.4 only after 3.3 passes, stop before 3.5.
Pre-write Git status and all 77 protected hashes matched; three new structural
PAGE files were absent. Approved Design/Specs/U2/migration/UI pack are unchanged.

APPLY: BLOCKED
Tasks: 19/32
Task 3.2: COMPLETE
Task 3.3: PARTIAL — actual final HTML/RSC Cache-Control assertion FAIL.
Task 3.4: PARTIAL — structural prerequisite only; Stage C NOT_STARTED.
Task 3.5: NOT_STARTED

Added only PAGE, pointage-employee and pointage-credential-entry. The actual
neutral route uses force-dynamic/revalidate=0, root fonts, one responsive column,
shared primitives and approved French labels. Credential controls are disabled
pending U5-U7; no collection, submit, mutation, recovery, timer or browser storage.
pointage-active-interaction and both deferred \_lib paths remain absent.

Actual Next 16.2.9 route /pointage/synthetic-establishment returns 200 HTML and
RSC. Framework-script nonce equality, fresh second-request nonce, browser nonce
rejection, neutral payload, unrelated-route isolation and no-owner consumer
denial have implementation-test evidence. Proxy remains byte-identical.
However both final page responses return Cache-Control: no-cache, must-revalidate,
not the required private/no-store/max-age=0. The installed Next development
renderer unconditionally overwrites this header after route rendering
(dist/server/base-server.js, pipeImpl). Proxy unit PASS is not final-page PASS.

STOP: no approved route-local post-render header boundary is established.
Do not modify framework/global config, root layout, bootstrap/listener or shared
policy, switch runtime mode or weaken the assertion. Human scope/technical
review must resolve this exact development final-response boundary first.
No further U4 work or task checkbox completion is authorized by this result.

Final focused run: 91 PASS / 1 FAIL, the failure covers missing private/no-store/
max-age=0 on both HTML and RSC. Exact commands, source hashes, current check
results and diagnostic limitations are in the existing 02c packet.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Real employee attendance: NOT_AUTHORIZED
Production enablement: NOT_AUTHORIZED
Synthetic/disposable only; all seven legal/privacy/provenance blockers remain.
No DB/provider/attendance operation, migration, external design tool, Browser QA,
Gate 3, sync/archive, deployment or lifecycle promotion. Historical checkpoints
below retain their evidence but do not override the current blocked status.

## Historical Apply checkpoint — Task 3.3 partial, 2026-09-10

Authority: explicit Task 3.3 / U3-only approval in attachment
77920891-3e00-421f-aa31-48dc2ae1081f. The approved Design remains
ae9e5c89f3b2e4124ce7ff1e64dcaf3182a285f317be44dd6118f13c96e8656c.
Pre-write status and all 75 protected artifact/source hashes matched the current
checkpoint; both authorized new U3 paths were absent. No overlap was overwritten.

APPLY: BLOCKED
Tasks: 19/32
Task 3.2: COMPLETE
Task 3.3: PARTIAL — header/cache implementation and isolated tests complete;
mandatory neutral PAGE HTML/RSC evidence is unavailable within this allowlist.
Task 3.4: NOT_STARTED; no PAGE implementation authority has been borrowed.

Only apps/backoffice/src/proxy.ts and the planned
apps/backoffice/test/pointage-raw-clocking-inventory.test.ts were added as
implementation/test files. The Pointage-only matcher, fresh server nonce CSP,
private/no-store/max-age=0 headers, no input-header/body copying, and exact
development-only loopback connection allowance have focused implementation
evidence. Existing U2 sources and tests are unchanged.

Remaining assertion: actual employee entry HTML/RSC must be neutral, dynamic,
revalidate=0 and private/no-store, without personal serialized data; rendered
Next scripts must consume the same server nonce as the final response CSP.
The required apps/backoffice/src/app/pointage/[establishmentSlug]/page.tsx does
not exist and belongs to Task 3.4. Proxy unit responses or an absent-page 404
cannot establish this assertion. STOP for scope review; do not create the PAGE.

Focused checks: 39 U3 tests plus 47 unchanged HTTP/runtime regressions PASS.
Backoffice/workspace typecheck, docs, architecture, strict OpenSpec, UI pack and
scoped formatting PASS. Global formatting reports 67 unrelated files; no repair.
Exact commands, limits and hashes are recorded in the existing 02c review packet.
These are Apply implementation checks, not formal VERIFY or Browser QA.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Real employee attendance: NOT_AUTHORIZED
Production enablement: NOT_AUTHORIZED
Synthetic/disposable only. Retention, deletion/anonymization, legal hold,
backup-retention interaction, employee notice, detailed audit visibility and
trusted production client-address provenance remain unresolved.
No Product/Spec/Design/UI-pack change, migration or database operation, new
provider, Task 3.4, Gate 3, sync/archive, deployment or lifecycle promotion.
Earlier checkpoints below are historical and do not override this status.

## Historical Apply checkpoint — Task 3.2 complete, 2026-09-10

Authority: explicit current-user approval in attachment
b8e9e7aa-5abd-4b8e-b420-9dc4654a65bb, exact Design
ae9e5c89f3b2e4124ce7ff1e64dcaf3182a285f317be44dd6118f13c96e8656c
and pre-execution Tasks
4c104534dadeaa5fc00cccf2de5cd0b9a02045d0ac1b60f75fb4615e844345db.

Tasks: 19/32
Task 3.2: COMPLETE
APPLY: PAUSED_AT_SCOPE_BOUNDARY — four-path E5 authorization completed.
Task 3.3: NOT_STARTED; it requires paths outside this bounded evidence allowlist.
E1/E2/E3: PASS, including final-source actual Next admission/re-consumer tests.
E4: PASS by explicit human acceptance; historical CLOSED_TRANSPORT unchanged.
E5: PASS — independent listener loss; all four A-to-B continuation cases;
clean STOP; IPC disconnect; partial startup denial; normal Next no-owner denial;
non-Pointage root-route smoke; independent fresh-process admission.

Final-source focused checks: 109 PASS (8 actual-route cases excluded in the
non-DB run); E5-selected actual suite 5 PASS / 65 excluded; remaining actual
regressions 2 PASS / 68 excluded. Filter exclusions are not PASS evidence.
Every mandatory E5 case ran; accepted E4 was deliberately not rerun or rewritten.
Workspace typecheck, docs, architecture, strict OpenSpec, UI pack and scoped
format checks PASS. Global format check still reports 67 unrelated warnings.
Exact commands, sanitized generation evidence and final source hashes are in
docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Real employee attendance: NOT_AUTHORIZED
Production enablement: NOT_AUTHORIZED
Synthetic/disposable only; all seven production/legal/privacy blockers remain.
No task 3.3, UI, fifth implementation path, new migration, production provider,
formal VERIFY, Browser QA, Gate 3, sync/archive, deployment or lifecycle promotion.
Existing Design, Specs, sealed UI pack, migration/journal/snapshot and unrelated
dirty work remain unchanged. The earlier checkpoint below is historical.

## Historical Sensitive Design — E4/E5 evidence alignment review

Authority: current-user attachment 946adbba-621a-4644-af70-e4a0c6b56685.
SENSITIVE DESIGN — E4/E5 EVIDENCE ALIGNMENT REVIEW
Status: AWAITING_HUMAN_REVIEW
APPLY: PAUSED
Tasks: 18/32
Task 3.2: PARTIAL
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

Human evidence review: E1 PASS; E2 PASS; E3 PASS; E4 PASS; E5 PARTIAL.
E4 observation vẫn CLOSED_TRANSPORT, terminal exit 1, one admission,
clients 0, no replacement, evidence DB retained và exact source restoration.
Đây không phải HTTP 503 hay HMR observation. Nếu dispatch tới trước teardown
thì failure là generic 503 POINTAGE_UNAVAILABLE; nếu listener đã đóng trước
khi response có thể tạo thì refusal/closure hợp lệ. Không delay teardown.

Chỉ Design/Tasks/02b/02c thay đổi trong lượt planning này. Không implementation,
Next/DB/container operations, cleanup, Browser QA, task 3.3 hoặc new path.
Mọi current implementation/migration/UI-pack hash giữ nguyên. Previous Apply
grant không authorize resume: cần explicit approval exact revised Design/Tasks.

U2/U8/R3/R6/R7 MUST theo current D1b E4/E5 alignment trong design.md:

- Fixed TEST_ONLY child launch argv --serve-listener-loss-proof; parse một lần,
  normal [] hoặc exact singleton, reject unknown/duplicate/combined arguments.
  Không flag vào environment/INIT/browser; no post-READY control.
- Same strict INIT once / STOP only; same D1/F6 parent preflight và child
  D1/D1a/F8 exact owned listener, fresh anchor, dual actual clients/privileges,
  synthetic provider/runtime. READY và E2/E3 phải hoàn tất trước loss.
- Child-only one-shot lifecycle gọi public server.close() trên đúng owned
  server; assert thực sự non-listening/address null, invoke existing listener
  prerequisite guard từ lifecycle, không đợi Pointage operation hay gọi STOP
  để giả mất listener. Terminal deny, no replacement; same bounded teardown.
- Existing sanitized statuses/E3 receipt, private exact identity/count/close
  assertions, refused HTTP, parent role counts 0/0 và unchanged persisted
  evidence phối hợp chứng minh named E5-LISTENER-LOSS. E3 receipt không đổi
  nghĩa/schema. Expected exit 1/signal null; private proof assertion failure
  phải kết thúc exit 2 sau cùng bounded cleanup, không bị nhận nhầm là pass.
  Không outbound payload mới; nếu cần receipt mới để prove -> STOP review.
- Mỗi retained-continuation case bắt buộc A -> confirmed exit -> B: A actual
  identify cấp continuation; A bounded bootstrap STOP không Pointage end/
  ended-row write; B new PID/runId/fresh anchor và full independent D1/D1a/F8.
  B chỉ dùng token do A cấp, không identify/cấp token thay thế. Chỉ token ở
  parent memory đi qua restart, không Promise/runtime/client/trusted context.
  Verify A clients closed, continuation chưa ended, original issuedAt/absolute
  deadline không đổi; startup/teardown tính vào real TTL. Nếu lỡ prerequisite
  deadline thì FAIL/inconclusive, không shorten/extend TTL hay override clock.
- E5-DEPARTURE: A cấp continuation rồi dừng không end; parent đặt departure
  sau A exit; B independently re-admit, actual state dùng token của A bị deny.
  Token chưa hết idle/absolute; không protected output/event/receipt.
- E5-RESET: A cấp token rồi dừng không end; parent existing authorized disposable
  reset/regeneration sau A exit supersede old credential; B independently
  re-admit, state bằng token của A trả 403 POINTAGE_ACCESS_DENIED.
  Không admin vào child hoặc widen grants; isolate current eligibility/
  unexpired token, không raw/receipt side effect.
- E5-IDLE: A cấp token rồi dừng không end; B independently re-admit, không
  identify/touch; chờ real DB/server time vượt 60-second idle của A, trước
  absolute. B state bằng token của A bị deny; không revive/touch, raw/receipt
  unchanged. Restart không reset tuổi token.
- E5-ABSOLUTE: A cấp token rồi dừng không end; B independently re-admit trước
  idle deadline của A. B dùng token của A cho valid foreground state reads
  trước từng idle deadline và final denial sau original 120-second lifetime.
  Prove idle advances nhưng absolute của A không đổi/không bị vượt.
  Không B re-identify, revival, raw/receipt side effect, heartbeat mới,
  TTL change, clock override hoặc deadline update cho tiện test.
- Mỗi fresh child có new PID/new runId/fresh anchor/full D1/D1a/F8 trên own
  clients. Không transfer Promise/runtime/client; old continuation data không
  authority. Capture exact final hashes, own named outcomes, real elapsed
  timings, no secret/identity payload. Timeout chứa real waits + teardown.
- Giữ normal no-owner negative, non-Pointage smoke, STOP/IPC/partial-start
  evidence riêng. Không EADDRINUSE/STOP/IPC/E4 thay independent listener loss.
  Không skipped case được tính PASS; full E5 còn thiếu thì 3.2 vẫn PARTIAL.

NO NEW PATH. Future code/test nằm đúng bốn existing evidence paths đã duyệt:
apps/backoffice/src/server/pointage/raw-clocking-bootstrap.ts;
apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts;
apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts;
apps/backoffice/test/pointage-raw-clocking-bootstrap.test.ts.
Không bridge/public operation mới; child private lifecycle/assertions, launcher
fixed launch-only argv và existing bootstrap tests. Nếu cần path khác -> STOP.

Không đổi bốn phases, 32 checkbox tasks, F1-F8/S1-S9/U1-U8/R1-R7 contracts
ngoài bounded evidence supplement này; 20/62 mapping và approved UI unchanged.
POST-APPLY VERIFY phải re-evaluate final evidence độc lập; QA riêng sau VERIFY.
UI_UX_PRO_MAX_USAGE OPTIONAL / NOT_USED. Synthetic/disposable only; real employee
attendance NOT_AUTHORIZED. Bảy blockers vẫn unresolved: retention duration,
deletion/anonymization, legal hold, backup-retention interaction, employee notice,
detailed audit visibility, trusted production client-address provenance.
Không sync/archive/deploy/lifecycle promotion.

## Historical Apply checkpoint — bounded E2/E3 seam

Approval source: current-user attachment 39198d77-8b11-46cb-9ef5-6974e2aac964.
Approved Design: cf9054b04a36ca3bf3384504b49dbfcfff0e17f57080b558c01339a629d02ae0.
Approved Tasks preimage: b6f6c8e07db6b1894d6992701d7fc7523939fe2149bc8341e460d7c05b0f5f49.
Recorded: 2026-09-09T21:06:53Z.

APPLY: BLOCKED
Tasks: 18/32
Task 3.2: PARTIAL
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

The approved four-file correction is implemented. E1 actual routes, E2 exact
reserved promise and E3 independent resolver/reference proof passed against the
current implementation. E3 is NOT actual Next HMR evidence. The historical
mtime failure remains failed. No task checkbox changed; task 3.3 did not start.

E4 controlled source-byte test passed its bounded teardown assertions: terminal
exit 1, no replacement admission, zero remaining runtime clients and byte-exact
restoration. Observed denial was CLOSED_TRANSPORT, not an observed generic HTTP
503; E4 is PARTIAL against the complete human acceptance wording, not waived.
E5 is PARTIAL: fresh process admission, retained-continuation departure denial,
normal Next no-owner denial, STOP and IPC-loss teardown were exercised.
Independent post-READY listener-loss evidence, non-Pointage smoke and the full
isolated reset/idle/absolute/lifecycle continuation matrix remain incomplete.

STOP for review: the owner-held listener is private; the approved parent channel
is INIT once then STOP, and the only approved re-consumer seam accepts no fault
selector. No independent post-READY listener-close trigger exists. Do not label
STOP/IPC disconnect or EADDRINUSE startup as independent listener-loss proof.
Adding a control message, public test endpoint, listener handle export, loader
hook or fault selector would exceed the approved seam. No such mechanism was
added. Review must resolve that evidence mechanism and the E4 closed-transport
observation before resuming this blocked checkpoint; do not weaken Design.

Exact hashes, command outcomes (including earlier failed attempts), retained
disposable targets and remaining evidence are recorded in
docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md.
Only execution metadata is updated here; all four phase contracts, 32 tasks,
20 requirements / 62 scenarios, Design, sealed UI and eleven protected U2
implementation paths remain unchanged.

Real attendance remains NOT_AUTHORIZED. Synthetic/disposable data only.
All seven blockers remain unresolved: retention duration, deletion/anonymization,
legal hold, backup-retention interaction, employee notice, detailed audit
visibility and trusted production client-address provenance.
UI_UX_PRO_MAX_USAGE: OPTIONAL / NOT_USED. No UI implementation, Browser QA,
formal VERIFY, Gate 3, sync/archive, deploy or production enablement.

## Historical Sensitive Design reopen — now approved above

Scope: current-user attachment d055cb8b-1584-42bc-8634-b5c93cd16cdb.
SENSITIVE DESIGN — MODULE REEVALUATION EVIDENCE REVIEW
Status: AWAITING_HUMAN_REVIEW
APPLY: PAUSED
Tasks: 18/32
Task 3.2: PARTIAL
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

Previous Apply grant is historical; resume requires explicit human approval of
the revised exact Design/Tasks hashes and the bounded seam signature/receipt.
No task checkbox, phase, Product/Spec/UI behavior or production gate changes.
Only Design/Tasks/02b/02c may change now. All 15 U2 files, sealed UI pack,
migration 0021 and unrelated Formalités hunks are protected byte-for-byte.
Eight retained disposable containers untouched; no DB, Next startup or Browser QA.

Design D1b selects evidence B with narrow D seam; prior B+A launch architecture
is unchanged. Actual Next HMR is optional evidence machinery, not the security
invariant. E1 actual route binding, E2 singleton admission, E3 independent
re-consumer instances, E4 byte-drift teardown and E5 fresh-process admission
are separate required future results. The failed mtime assertion below stays
FAILED history, not PASS or waived proof.

NO PATH CHANGE. Proposed future evidence-only modifications within the 15-path
allowlist are exactly:

- apps/backoffice/src/server/pointage/raw-clocking-bootstrap.ts
- apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts
- apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts
- apps/backoffice/test/pointage-raw-clocking-bootstrap.test.ts

Bridge adds only private independent-accessor constructor/pair factory, reused
by real consumer entry, and the exact second typed admit argument in D1b.
Child adds one-shot E2/E3 reference assertions; anchor still frozen sole admit,
same closure-owned initialization/runtime/client pair. No extra initialization,
public export, worker, VM/eval, cache hook, registry, selector or replace method.
Parent-to-child INIT/STOP unchanged. Only the fixed child-to-parent
POINTAGE_TEST_RECONSUMER_PROOF receipt defined in D1b is added and strictly
parsed by launcher; no secret/object payload or additional inbound command.
Tests must prove detector negatives plus actual-child E1-E5, not just mocks.
All other 11 U2 paths remain unchanged for this evidence correction.
If another implementation path/mechanism is necessary, STOP for review.

U2/U8/R3/R6/R7 evidence alignment: follow exact D1b seam and Verification Design
E1-E5. E2 records fresh A/B closures before admission settles; E3 fresh C/D
after READY, all pairwise distinct and executing actual resolver, same promise/
facade/runtime/two clients by reference, same PID/runId/main-thread/listener/
inventory. Cached getter twice, artificial READY increment, mtime or pool count
alone cannot pass. Missing proof receipt/failing assertion leaves 3.2 PARTIAL.
E4 controlled source-byte negative may only use the exact owned bridge path,
record all hashes and restore only expected changed bytes after child exit, as
D1b defines; no E3 claim from source mutation. No such write is authorized now.
E5 must repeat full D1/D1a/F8 and current continuation/Personnel checks.

POST-APPLY VERIFY must independently assess all five evidence categories and
unchanged 20/62 traceability against final source bytes, not accept Apply tests
without re-evaluation. QA follows formal VERIFY; Browser QA uses unchanged
D1/F6 synthetic-only guard and sealed page pack. No QA/VERIFY/Gate 3 now.
Keep UI_UX_PRO_MAX_USAGE OPTIONAL / NOT_USED; no-image direction unchanged.
All seven blockers remain: retention duration, deletion/anonymization, legal
hold, backup-retention interaction, employee notice, detailed audit visibility,
trusted production client-address provenance. Real attendance NOT_AUTHORIZED.

## Historical Apply checkpoint — task 3.2 bootstrap

Approval source: explicit current-user attachment
37279cfa-d09e-4fb5-a96f-ef8f64893295, recorded 2026-09-09T14:06:59Z.
Approved pre-Apply Design SHA-256:
`3e6337b2a475b11610754f05228a027a272ec2485a7350c74cc5a9218ce12d69`.
Approved pre-Apply Tasks SHA-256:
`a8d5b380a5a9d85f93a297beee89474f49e6a4c48481cfb10c918e2035a1ba98`.
Apply authorization: GRANTED — RESUME FROM TASK 3.2.
APPLY: BLOCKED. Tasks: 18/32. Task 3.2: PARTIAL; no additional task is complete.
The 15 approved U2 paths passed fresh existing/absent/hash preflight.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED. Synthetic/disposable attendance only.
Stop after Apply; formal VERIFY, Browser QA and Gate 3 require further authority.
All seven blockers, sealed UI pack and unrelated dirty work remain preserved.

Checkpoint: 2026-09-09T14:46:25Z. Đã tạo/sửa đúng 15 implementation paths của
U2, chưa làm 3.3+. Actual Next file routes và root-derived stateGuard đã được
chạy với synthetic disposable PostgreSQL; failed second client, foundation
over-grant và helper body/ACL drift bị actual child từ chối. Chưa đủ evidence
để hoàn tất U2.

Mandatory blocker: đổi mtime nhưng giữ nguyên source bytes chưa cung cấp bằng
chứng Next đánh giá lại runtime module. Bài thử yêu cầu quan sát factory identity mới
trong cùng process vẫn chỉ thấy một READY notification (`expected 1 to be
greater than 1`). Không được suy luận HMR/re-evaluation từ request thành công
hoặc pool count không đổi. Chưa có reviewed mechanism khác để chủ động
reevaluate module trong actual Next child; thay source bytes phải invalidate
generation, còn IPC hiện chỉ cho INIT/STOP. Không tự thêm cache-control IPC,
private Next cache hook, test endpoint, instrumentation hoặc fallback.

Resume cần bounded Sensitive Design/test-evidence clarification cho cơ chế
same-generation module reevaluation. Không đề nghị đổi Product/Specs hoặc
giảm yêu cầu proof. Source-inventory drift probe và các lifetime cases chưa
được hoàn tất/revalidated dưới final partial implementation. Exact evidence,
hashes, retained disposable identities và command results được ghi trong
`docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md`.

## Historical alignment checkpoint — task 3.2 bootstrap

Scope: bounded Sensitive Design / Tasks alignment authorized by current-user
attachment 67acbce8-52d7-47a4-a5fb-37c7eadf250a; proposal only, no Apply.
APPLY: PAUSED. Tasks: 18/32. Task 3.2: NOT_STARTED.
Completed 1.1-1.8, 2.1-2.9 and 3.1 remain complete; four phases / 32 tasks.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Real employee attendance: NOT_AUTHORIZED. Production enablement: NOT_AUTHORIZED.
UI_UX_PRO_MAX_USAGE: OPTIONAL. UI_UX_PRO_MAX_EXECUTION: NOT_USED.
Synthetic/disposable-only, sealed UI pack and all seven blockers remain unchanged.
Resume requires explicit human approval of exact revised Design/Tasks hashes
and the 15-path bootstrap/U2 allowlist. Prior Apply grant does not cross this gate.

## Historical Apply checkpoint — UI classification approved

Approval source: explicit current-user attachment
2cb7c3fd-84bf-4026-ad33-1a5942b6ad25.
Approval recorded by: Codex workflow.
Approved: 2026-09-08T21:58:19Z.

UI_UX_PRO_MAX_USAGE: OPTIONAL
UI_UX_PRO_MAX_EXECUTION: NOT_USED
Decision source: explicit human approval.
Reason: approved sealed YUTA page pack is sufficient for implementation.
Scope: employee Pointage implementation and later review evidence.
No external query, installation or external visual recommendation is authorized.

APPLY: BLOCKED. Tasks: 18/32. Tasks 1.1-1.8, 2.1-2.9 and 3.1 COMPLETE.
Task 3.2 NOT_STARTED; remaining tasks unchanged.
Apply authorization: GRANTED within the approved scope and stop conditions.

Task 3.1 adds strict serialization-only DTOs and one isolated root export.
Contracts: 14 focused tests and all 112 package tests passed. No runtime,
route, database, migration or visible UI change occurred in this resume.

Next blocker: D1a runtime accepts server-injected authenticated clients, but
the existing Next route process has no test bootstrap/injection entry point.
The approved path list does not identify a launcher/startup owner that can
prove the actual loopback listener and inject both clients, stateGuard material
and synthetic provider into the real route process. Do not silently create a
global runtime registry, new credential environment contract, startup hook,
custom launcher or unguarded/default connection. Request bounded Sensitive
Design / Tasks alignment of that test-only composition boundary and its exact
path allowlist before task 3.2; no Product or Spec change is proposed.

Evidence:
[UI DTO checkpoint](../../../docs/reviews/pointage-usable-raw-clocking/apply-ui-dto-checkpoint.json)
and [current review](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).
Approved Analysis, Specs, Design and sealed UI pack remain byte-identical.
All seven production/legal/privacy blockers and synthetic/disposable-only
authorization remain unchanged.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED.

## Previous checkpoint — superseded execution status only

## Current Apply checkpoint — 2026-09-08

Human approval: attachment 85c59e37-596d-41cc-9b73-26e54d88b63d;
approved Design SHA-256
9a50dd1e76ce950b137d107ad66cb8e56fcb541ec882ef002379f26207606197
and pre-Apply Tasks SHA-256
7488d05ebc11dce56f64de5c21f6f6866a01893f53c532d14be5efaf35996574.
Approval recorded: 2026-09-08T21:46:20Z. Apply authorization: GRANTED within
the approved scope and mandatory stop conditions.

APPLY: BLOCKED. Tasks: 17/32. Foundation/Data 1.1-1.8 and Service/Domain
2.1-2.9 COMPLETE; phases 3/4 NOT_STARTED. Task 2.8 D1a/S9 admission and task
2.9 regressions passed; no Product, Specs or Sensitive Design changes.

Next blocker: current External Design Intelligence policy requires an owning
reviewed UI_UX_PRO_MAX_USAGE classification. None exists in this change or its
sealed UI pack. Do not infer a value, invoke a tool or rewrite approved Analysis.
Pause before task 3.1 for this scoped UI-readiness decision. Proposed, NOT
approved: OPTIONAL / NOT USED, because this phase implements the locked page
pack without external design consultation. All existing UI/Browser QA duties
remain; no new Product or technical Design decision is proposed.

Evidence and exact path/hash attribution:
[D1a Apply checkpoint](../../../docs/reviews/pointage-usable-raw-clocking/apply-d1a-service-checkpoint.json)
and [current review record](../../../docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md).
These are Apply evidence only, not formal VERIFY or QA.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED. All seven production blockers remain.

## Historical alignment metadata and approved implementation plan

Earlier status prose below is preserved provenance; the checkpoint above and
current task checkboxes control execution status. Technical contracts, phase
scope, 20 requirements / 62 scenarios and all stop conditions remain binding.

Current alignment review (2026-09-08): SENSITIVE DESIGN / TASK 2.8 ALIGNMENT REVIEW.
Status: AWAITING_HUMAN_REVIEW. APPLY: PAUSED. Tasks: 15/32.
Foundation/Data 1.1-1.8 and Service/Domain 2.1-2.7 remain complete; 2.8 NOT_STARTED.
Dual-client/same-database architecture is authorized for planning only; explicit
human approval is required before Apply resumes. C17 PASS 8/8 remains historical
regression evidence. Earlier planning/approval and execution appendices below
are preserved provenance, not authority to execute the revised connection plan.
TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED. VERIFY: NOT_RUN. QA: NOT_RUN.
Production enablement: NOT_AUTHORIZED.

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

### Task 3.2 bootstrap allowlist — pending exact human approval

Design D1b selects B + narrowly typed A. BOOTSTRAP denotes ONLY the exact
additional/reused paths below; no directory-wide write grant. Path classification
describes future Apply, not files created by this alignment. No new task/phase.

| Exact repository path                                                         | Classification               | Owner / bounded reason                                                                                                   |
| ----------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts`              | `NEW; TEST_ONLY`             | `Parent disposable launcher, ephemeral IPC inputs, owned child shutdown; no route runtime/admin handoff.`                |
| `apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts`            | `NEW; TEST_ONLY`             | `Actual existing Next host, socket owner, strict IPC, one typed process cell, child-created clients/admission/lifetime.` |
| `apps/backoffice/src/server/pointage/raw-clocking-bootstrap.ts`               | `NEW`                        | `Server-only fixed factory bridge; exports bounded consumer only, no normal/default composition.`                        |
| `apps/backoffice/test/pointage-raw-clocking-bootstrap.test.ts`                | `NEW; TEST_ONLY`             | `IPC/environment/listener/concurrency/reload/cleanup negatives and future actual-process proof.`                         |
| `apps/backoffice/src/server/pointage/raw-clocking-runtime.ts`                 | `EXISTING_MODIFY`            | `Only neutral context/readiness facade for D8 and D1b composition typing; preserve completed S9 proofs/operations.`      |
| `apps/backoffice/test/pointage-raw-clocking-runtime.test.ts`                  | `EXISTING_MODIFY; TEST_ONLY` | `Add neutral-context/admission assertions; preserve all completed S9 test cases.`                                        |
| `apps/backoffice/src/server/pointage/raw-clocking-http.ts`                    | `NEW`                        | `Existing U2 plan: DTO/status/headers adapter consuming only bootstrap consumer.`                                        |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/context/route.ts`   | `NEW`                        | `Existing U2 exact context Node handler; no bootstrap/client/provisioning logic.`                                        |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/identify/route.ts`  | `NEW`                        | `Existing U2 exact identify Node handler; no bootstrap/client/provisioning logic.`                                       |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/state/route.ts`     | `NEW`                        | `Existing U2 exact state Node handler; no bootstrap/client/provisioning logic.`                                          |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-in/route.ts`  | `NEW`                        | `Existing U2 exact clock-in Node handler; no bootstrap/client/provisioning logic.`                                       |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/clock-out/route.ts` | `NEW`                        | `Existing U2 exact clock-out Node handler; no bootstrap/client/provisioning logic.`                                      |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/recover/route.ts`   | `NEW`                        | `Existing U2 exact recover Node handler; no bootstrap/client/provisioning logic.`                                        |
| `apps/backoffice/src/app/api/pointage/[establishmentSlug]/end/route.ts`       | `NEW`                        | `Existing U2 exact end Node handler; no bootstrap/client/provisioning logic.`                                            |
| `apps/backoffice/test/pointage-raw-clocking-http.test.ts`                     | `NEW; TEST_ONLY`             | `Existing UI_TEST path: exact HTTP/method/CSRF/operation tests and actual route consumer integration.`                   |

Planning-only writes in this alignment: existing design.md and tasks.md under
openspec/changes/pointage-usable-raw-clocking, and existing 02b-design-review.md /
02c-implementation-plan-review.md under docs/reviews/pointage-usable-raw-clocking.
Each is EXISTING_MODIFY; PLANNING_ONLY. No other planning file is authorized.
The sealed UI IMPLEMENTATION_PLAN stays byte-identical: bootstrap realization
is owned here, not a new UI behavior, layout or page-pack edit.

Shared/global implementation write paths: NONE. apps/backoffice/package.json,
next.config.ts, src/app/layout.tsx, pnpm-lock.yaml, generic startup, instrumentation,
shared cloud client factory and completed migration/roles remain unchanged.
The test child owns an application-wide listener only for its dedicated run;
that isolation and non-Pointage smoke proof require review, not production use.
Existing planned src/proxy.ts belongs to U3 only, not bootstrap, and is not
added to task 3.2. Existing guarded db-cloud test helper is READ_ONLY reuse.
If helpers need edits, a new path/config/dependency or another worker mechanism
is required: STOP for revised exact allowlist; no silent expansion.

U2 evidence MUST satisfy Design D1b: one INIT via private fork IPC, live D1
environment before/after sanitization, exact socket before client creation,
two child-created max:1 clients, SAME database + exact session_user/current_user,
foundation effective D1a and raw D4b/F8 admission, then fixed synthetic provider.
No parent SQL proof/open JS clients, owner/SET ROLE/default/.env fallback.

U2/D1b key evidence: strict INIT chỉ nhận encodedAuthSecret làm Pointage auth
root material; stateGuardKeyBase64 là unknown key và MUST reject nếu supplied.
Actual Next child dùng decodePointageAuthSecret rồi existing
derivePointageStateGuardKey(decodedAuthSecret), label
yuta/pointage/raw-state-guard/v1; runtime nhận derived key này, không independent
key. Planned negatives chứng minh không environment/CLI/request/browser key
input, parent không gửi derived key, và thay auth secret cho corresponding
domain-separated key. Reuse F1 vectors, không thuật toán/secret contract mới.
Child giữ decoded/derived buffers private; chỉ best-effort clear khi ownership
kết thúc, không zero live-runtime buffer hoặc claim erase immutable/copy data.

U8 actual-route evidence MUST bind PID/runId/main-thread/socket and both client
admissions to actual Next file handlers. One INITIALIZING promise, READY only
after complete proof, terminal FAILED, partial-client cleanup, independent
re-consumer proof E3, source-byte drift E4, fresh-process reproof E5 and teardown are
mandatory. Mock/unit adapter tests are supplemental only. Missing actual-process
evidence cannot mark 3.2 or 3.8 complete or be called Browser QA.

R3 adds all D1b hostile launch/listener/role/helper/re-consumer negatives to existing
security tests. R6 checks exact 15-path allowlist, fixed consumer dependency,
no browser/RSC/log secrets, no shared startup/default provider/config change.
R7 collects sanitized actual-process commands/results and cleanup facts only;
formal Technical Compliance, VERIFY and QA remain separate post-Apply steps.
F1-F8, S1-S9, U1/U3-U7, R1/R2/R4/R5 and 20/62 traceability remain unchanged.

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
- [x] 1.3 Add F5 continuation schema/credential tuple key and bounded repository methods; preserve existing partial continuation work and add exact D4a delegated-lock call before invoker continuation lock in the same outer transaction. Verify immutable-field, TTL/end and post-lock current scope/version/lifecycle contracts; keep PARTIAL / BLOCKED until real evidence, never complete during planning.
- [x] 1.4 Add F3/F4 database enforcement and exact D4a SECURITY DEFINER helper with static scoped locks; SECURITY INVOKER raw INSERT trigger calls the same helper inside the outer transaction. Verify no catch-and-continue/savepoint lock release, unchanged raw/receipt atomicity, raw-only/receipt-only COMMIT denial, invalid chain and mutation rejection on PostgreSQL.
- [x] 1.5 Enforce F5 continuation triggers and F8/D4b writer/lock-owner boundary; verify each immutable column, monotonic idle/cap, no revival, exact role attributes/source-column grants, no writer source UPDATE, exact EXECUTE/PUBLIC revoke, no default/inherited/SET ROLE paths, owner/runtime separation and function signature/properties/body fingerprint. Misconfiguration must refuse runtime without repair.
- [x] 1.6 Implement F6 reusable synthetic boundary and disposable harness; after every D1 guard, provision only approved test roles in an isolated disposable cluster. Verify parsed/actual database name equality and full unsafe-environment rejection before provider/write; unexpected existing role attributes/grants/membership -> STOP, not silent ALTER or production setup.
- [x] 1.7 Generate F7 next additive journaled migration after fresh journal review; include helper creation/properties/search_path, ownership transfer, PUBLIC revoke/writer EXECUTE and helper triggers plus raw/receipt/continuation constraints in one transaction. Prove tooling atomic publication before execution or STOP. Verify exact generated paths, unchanged 0019/0020/history, revoked temporary transfer privileges and empty/upgrade/no-op disposable proof.
- [x] 1.8 Complete F2-F8 real PostgreSQL regressions with separate connections and actual restricted writer; direct source FOR SHARE/FOR UPDATE -> 42501, helper succeeds without changing source bytes/values and holds locks until outer COMMIT/ROLLBACK. Prove actual issue/reset, Personnel lifecycle UPDATE (both orders), parent status/timezone UPDATE and Formalités dossier FOR UPDATE coordination; wrong/mixed/missing/inactive tuples roll back, PUBLIC/non-writer EXECUTE denied, poisoned search_path/temp cannot redirect, role/body/ACL misconfiguration refuses runtime, lock timeout/deadlock aborts whole operation. No mocks for SQL proof; collect evidence, no formal VERIFY claim.

## 2. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT — Service / Domain

Owner: Backoffice Pointage server; Personnel retains dossier/name/lifecycle;
DB repository owns storage/locks, auth owns portable primitives. Paths DOMAIN,
SERVICE_TEST, DATA and DBTEST bounded methods/tests, AUTH consumed not redesigned.
Sources: Backoffice/db-cloud AGENTS, AUTHENTICATION/TENANCY, Personnel authority,
Design D1a, D2-D10; all A1-A7 and raw R1-R10. No new shared package or Product
grant; only the test-only database role/column grants explicitly bounded by D1a.

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
| S9  | D1a dual-client SAME-DATABASE synthetic runtime: exact foundation validation-only and unchanged raw writer identities/column privileges, both-source/actual-target proof before provider or credential processing. No merged pool, SET ROLE, owner fallback or runtime repair; existing limiter and generic failures unchanged.                               | Ordered admission spies; seven-method footprint, forbidden writes/reads/EXECUTE, wrong/missing/swapped clients, C17/other target, admin/membership/ACL/provenance denials; independent clients after Apply approval.        |

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

Rollback/recovery: abort whole uncommitted operation; uncertain commit stays
unknown until exact authorized receipt recovery. Never delete accepted evidence,
auto-close, replace scope, relax eligibility or reuse superseded authority.
If minimal Personnel projection conflicts with actual authority, exact locks
cannot coordinate existing reset/lifecycle writers, or grant/owner beyond D1a needed:
STOP at Design/Control Tower; no silent Spec edits.

- [x] 2.1 Implement S1 pure reducer; verify all transitions, multiple sessions, max one open, corrupt-chain fail closed and no fabricated evidence.
- [x] 2.2 Implement S2 lossless time/calendar handling and S5 stateGuard integration; verify microseconds/equal-clock/DST/timezone/cross-midnight and stale head denial.
- [x] 2.3 Implement S3 dual-guard identify and S8 minimal Personnel projection; verify each partial-failure point denies both protected state and usable token.
- [x] 2.4 Implement S4 scoped continuation validation/touch/end and exact three-operation eligibility; verify expiry, end, reset and entry/departure boundaries without catalog changes.
- [x] 2.5 Implement S5 atomic transition transaction and final accepted-instant guards; verify lock ordering, rollback, stale OUT and multi-connection competing commands.
- [x] 2.6 Implement S6 committed replay/recover; verify same ID/intent receipt, different-intent conflict, unknown commit and current-authority recheck.
- [x] 2.7 Implement S7 minimal manager server read; verify OWNER/MANAGER versus STAFF/employee, active membership race, bounded day/open-session projection and no manager API.
- [x] 2.8 Compose D1a/S9 dual-client same-database test-only runtime and S8 minimized denial/audit handling; verify ordered D1 target, both exact role identities/same-DB/effective-privilege proofs before synthetic provider and credential processing, all S9 negative cases, existing distributed limits and no secret/identity leak. No 0021 edit or owner fallback.
- [x] 2.9 Complete SERVICE_TEST/DBTEST contract regressions for S1-S9; collect exact assertions/results and preserve all unchanged foundation security tests.

## 3. Employee Transport / UI

### TECHNICAL IMPLEMENTATION CONTRACT — Employee Transport / UI

Owner: @yuta/contracts serialization-safe strict Zod DTOs; Backoffice Node
handlers/server authority; route-local client presentation state only.
Paths DTO, HTTP, HEADERS, PAGE, UI_TEST, BOOTSTRAP. Sources: scoped contracts/Backoffice
AGENTS, Design D1-D4/D8-D11, approved UI_SPEC/DATA_AND_INTERACTION_SPEC,
shared/app UI rules, UI Implementation Plan. No application shell or shared UI edits.

| ID  | Binding technical requirement                                                                                                                                                                                                                                                                                           | Required evidence                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| U1  | Strict 4KiB JSON allowlists: identify credential, state/end empty body, IN/OUT requestId+observedStateGuard, recover same tuple+kind. Only neutral context GET; protected data POST. No trusted IDs/roles/context, browser accepted time or extra fields.                                                               | DTO strict/unknown-key, length, UUID, token/guard/kind and bounded serialization tests; no DB import/browser secret dependency.                                    |
| U2  | Exact D8 context/identify/state/clock-in/clock-out/recover/end handlers under approved prefix, Node runtime, delegated exact operation guards. Dedicated Authorization: Pointage, credentials omit, exact configured Origin and Sec-Fetch-Site rejection; no wildcard CORS/generic session.                             | Real handler tests for methods/body/origin/cross-scope/status, 204 own end, no extra operation or route.                                                           |
| U3  | Neutral dynamic HTML/RSC/revalidate0; page evidence per D10a distinguishes DEV diagnostic from mandatory local production-mode final cache/CSP proof. Data no-store, route-only nonce, no personal SSR/URLs/analytics/logs/service worker remain; no other route changes.                                               | Actual final HTML/RSC cache and fresh production-mode nonce/script proof per D10a; cookie/payload/isolation/no-owner negatives.                                    |
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

- [x] 3.1 Implement U1 strict DTOs and isolated contracts export; verify bounded bodies and exact response allowlists with DTO tests.
- [x] 3.2 Implement U2 approved Node handlers, transport adapter and exact D1b test bootstrap allowlist; verify actual child listener/two-client admission, concurrency/failure/E1-E5 re-consumer and lifetime evidence plus exact methods, current operation checks, origin/header validation and non-enumerating statuses. No completion from parent-only or mocked route proof.
- [x] 3.3 Implement U3 route-scoped nonce/cache security boundary; verify neutral HTML/RSC, no-store and no effect on non-Pointage routes. U3 final-page evidence follows D10a: DEV-only diagnostic acceptance is insufficient; actual local production-mode proof remains mandatory after exact-hash approval.
- [x] 3.4 Compose U4 approved employee page and meaningful route-local components; verify named exports, shared primitives/French labels and no application shell.
- [x] 3.5 Implement U5 approved visible states and receipt lifecycle; verify no optimistic success, no forbidden employee output and accessible state transitions.
- [x] 3.6 Implement U6 memory-only clearing/generation isolation; verify late response, timers, visibility/navigation/bfcache event logic and no durable personal state.
- [x] 3.7 Implement U7 exact-tuple mutation/recovery client; verify duplicate submit, unknown result, conflict refresh and clearing without new-ID retry.
- [x] 3.8 Complete U8 transport/interaction integration tests on approved consumer boundaries and actual D1b Next process/routes with guarded migrated synthetic data; collect PID/listener/client/lifetime evidence without declaring Browser QA/VERIFY PASS.

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
| C16 | `node packages/db-cloud/node_modules/tsx/dist/cli.mjs apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts --serve`                                                                                                                                                                                                                                                                             | Future D1b test entry only, not implemented/run. Requires approval and D1/F6; see bootstrap command supplement.                              |
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

### D1b bootstrap command and evidence supplement

C16 uses the existing installed tsx runner (db-cloud package dependency) and
a NEW explicitly reviewed launcher file, not a new package script. The --serve
argument selects the normal parent test mode; current D1b E5 alignment adds only
the fixed child launch argument --serve-listener-loss-proof, not an IPC field.
No browser/CLI role/URL/provider keys or post-launch fault controls.
Parent must obtain the separately authorized disposable setup through existing
F6 test helpers; never load general .env.local or automatically reuse a target.
No new package dependency, root command or shared Next configuration is approved.

Future focused check:
`pnpm --filter @yuta/backoffice test test/pointage-raw-clocking-bootstrap.test.ts test/pointage-raw-clocking-runtime.test.ts test/pointage-raw-clocking-http.test.ts`.
Actual process cases are explicitly gated: D1/F6 admission, approved fixture/
migration setup and synthetic mode must pass; skips are NOT proof.
C11/C12/C13 remain required regressions; append bootstrap test to focused
selection when it exists, do not run a different database guard for convenience.

Expected evidence: exact installed Next/Node versions; launch/source inventory
hash; sanitized parent/child PID/runId; actual listener address/port; two
authenticated same-DB identity/effective-privilege proofs; one initialization
count; real route/method/status and DB assertions; E3 re-consumer/E4 byte-drift/
E5 restart/IPC-loss/
partial failure/teardown results; preserved DB state and owned cleanup status.
Never include input URLs, passwords, PINs, continuation or secret-derived hashes.
The exact command above replaces C16 only for Pointage test composition.
A standard next dev/start invocation is a negative test, not real-route proof.

POST-APPLY VERIFY must independently re-evaluate D1b evidence for U2/U8/R3/R6/R7;
the separate QA plan must use this same actual Next route composition and D1
guard, not a mocked adapter or bypass. No new QA/data/readiness authority.
None of these launch/test/DB/Browser QA actions is executed in this alignment.

## POST-APPLY VERIFY PLAN

U3 must be independently re-evaluated against current Design D10a and current
implementation bytes: actual local production-mode final HTML/RSC cache and
fresh nonce/script proof, effective-environment isolation and deviations. DEV
results alone cannot establish D10 compliance. This remains a post-Apply plan,
not formal VERIFY or QA performed by the bounded U3 evidence collection.

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

## Resumed Apply checkpoint — 2026-09-08T12:45:57.5192919+02:00

Current execution status after approved Tasks/TIC alignment:

APPLY: BLOCKED

Tasks: 2/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

### Authority, preflight and exact partial outcome

Explicit current-user instruction approved Tasks
e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281
and Design a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361,
and granted bounded Apply resume. Alignment review pre-metadata hash:
4a43db85422353d37a0132a7b47362ae6fab63d15c532442016ff7a834a50f04.
Approval metadata is in 02c; its reviewed content is preserved.

Fresh Git/full tracked-untracked inventory:
2026-09-08T12:41:38.4777323+02:00,
HEAD defbc50eba3952fa2e7b1c016637daf083b18c65. All 33 current review hashes
matched, including both delta Specs, Design, Tasks/UI and all eight partial
implementation files. No intended implementation path drift/new arrival.
Unrelated Formalités archive/spec changes were excluded, not auto-rebased into
Pointage authority. Existing auth/Formalités export hunks remain unchanged.

1.1/1.2 remain COMPLETE, not reset/reimplemented. 1.3 remains PARTIAL:
repository now calls exact public.pointage_raw_lock_dossier with three
parameterized pg_catalog.uuid arguments before invoker current scope/Personnel
reads. Removed only the three direct source-table row locks; continuation
FOR UPDATE, current credential lookup, bounded idle/end methods, READ COMMITTED,
2s/5s timeouts remain. Helper errors propagate to the outer transaction; no
catch/savepoint fallback. Added one source-contract test. This is not a working
DB helper, ACL proof or completed continuation capability; no runtime consumer
or root export was added. Required D4b preflight/helper/migration/SQL proof
remain unimplemented. No attempt to execute this partial repository.

1.4–4.7 remain NOT_STARTED. No helper SQL/migration, triggers, role/harness,
provider, fixtures, service/transport/UI or attendance write was created.

### Mandatory stop — disposable target / bootstrap ordering

BLOCKER: no configured approved existing disposable target for the required
D1 identity probe; the current-user instruction explicitly requires all
D1/F6 guards before isolated test-cluster role/database setup.

Read-only evidence:

- Relevant process configuration was absent: no configured CLOUD_DATABASE_URL,
  NODE_ENV, synthetic-mode flag or Pointage test origin; VERCEL absent.
- Sanitized file inspection (credentials neither printed nor recorded):
  packages/db-cloud/.env.local and apps/backoffice/.env.local target
  localhost/yuta_cloud; apps/backoffice/.env targets localhost/yuta_resto.
  Neither matches the exact approved disposable name rule. No fallback used.
- Docker is available (server 29.0.1); only existing cloud/POS/Display dev
  containers were listed. No dedicated Pointage test cluster was observed.
  No native postgres/initdb/psql command was resolved. Inventory is not a
  database-catalog assertion and does not prove that no suitable external
  database could exist.
- No PostgreSQL connection/probe was made against an unsafe/unverified target.

D1 requires URL/environment validation, then SELECT current_database() on the
selected target, exact parsed/actual name equality and whole-string matching.
A not-yet-created database cannot supply this successful identity probe.
Creating a cluster/database first would bypass the current user's explicit
setup ordering. Setting test flags alone would not resolve that prerequisite.
Under Foundation rollback/stop condition (missing safe disposable resource)
and the Apply skill, execution stops before further implementation/DB setup.
No guard was weakened, no shared dev database reused, and no DB credentials
were fabricated or logged. This is not evidence that Option B or migration
atomic publication fails; those proofs have NOT_RUN.

Required next authority: either identify/provide a separately prepared isolated
disposable target that can pass the current D1 probe, or explicitly authorize
a bounded empty-cluster/database bootstrap before that probe, with static
URL/environment checks first and all roles/migrations/fixtures/providers/
attendance still forbidden until actual database identity passes. Such a
bootstrap ordering exception is not assumed or applied here. No Product/Spec
or locking-strategy change is proposed. Preserve all seven existing blockers.

### Exact implementation delta and preservation proof

| Path                                                        | Before SHA-256                                                   | Current SHA-256                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/db-cloud/src/pointage-raw-clocking-repository.ts   | 2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb | 761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3 |
| packages/db-cloud/test/pointage-raw-clocking-schema.test.ts | 4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158 | 9a674855aba632365412bd08fd270610f61c8c1c9ae21c1a470c49429350fd06 |

Both prior full files were reconstructed in memory and SHA-256 checked:
remove the helper call/comment block and restore only the three source
.for('share'/'update') calls -> exact repository preimage; remove the single
D4a test block -> exact test preimage. Thus no other existing implementation
bytes changed within these files. All six other partial implementation files,
shared exports/Personnel/foundation/crypto and migrations 0019/0020 remain
unchanged. This appended checkpoint and 02c approval/execution metadata are
the only non-code edits. No checkbox completion, authority-plan rewrite or
unrelated formatting cleanup.

### Apply checks — not formal VERIFY

| Exact command                                                                                                                                                                                                                | Result                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                                                                  | Exit 0; 1 file, 6 tests. Schema/source-contract only, not PostgreSQL proof. |
| pnpm -r --if-present typecheck                                                                                                                                                                                               | Exit 0; all applicable workspace packages/apps passed.                      |
| pnpm docs:check                                                                                                                                                                                                              | Exit 0; 36 current documents.                                               |
| pnpm architecture:check                                                                                                                                                                                                      | Exit 0.                                                                     |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                            | Exit 0; valid.                                                              |
| pnpm exec prettier --check packages/db-cloud/src/pointage-raw-clocking-repository.ts packages/db-cloud/test/pointage-raw-clocking-schema.test.ts docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md | Exit 0.                                                                     |
| pnpm format:check                                                                                                                                                                                                            | Exit 1; 67 pre-existing unrelated warnings; no global formatter write.      |

Checkpoint formatting/docs/architecture/strict checks are repeated after its
recording. No DB integration/migration generation or execution/role provisioning,
broader cloud/local integration/build, formal VERIFY, Browser QA or Gate 3.
Tasks 1.1/1.2 were not rerun except existing schema regression assertions in the
focused file; no claim that those unit checks satisfy F3-F8 actual SQL evidence.
No production provider, real attendance, deploy/enable, sync/archive or lifecycle
promotion. Retention/deletion/legal-hold/backup/notice/audit-visibility/trusted
production provenance remain unresolved.

## Empty disposable bootstrap / Apply checkpoint — 2026-09-08

Current execution status (supersedes only earlier execution checkpoints):

APPLY: BLOCKED

Tasks: 2/32

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

### Authority and fresh preflight

Explicit current-user instruction: EMPTY DISPOSABLE BOOTSTRAP: AUTHORIZED;
resume approved Apply after the exact target identity probe. This is an
infrastructure-order exception only, not Product/Spec/Design revision.
Approved Design SHA-256 remains
a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361.
Approved aligned Tasks SHA-256 remains the historical approval
e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281.
At resume, Tasks including the previous execution appendix had SHA-256
1227709e9f367535d76edab795de847f943c6b6b691a2db4da2593c06c13ef3f;
02c including prior approval/checkpoint metadata had SHA-256
bbd87a1c0418a00d15aa0ef036efd3cd6bc1609c64665dbffd6de3c960474792.

Fresh Git and complete tracked/untracked byte inventory:
2026-09-08T12:51:54.0241001+02:00; HEAD
defbc50eba3952fa2e7b1c016637daf083b18c65. Reviewed artifact path sets and
current eight partial implementation preimages matched the previous checkpoint.
No new overlapping implementation drift; no reset/stash/checkout or shared
formatter write. Formalites and other dirty work remain excluded.

### Sanitized bootstrap evidence — sequential gates, not inferred identity

Static gate PASS: 2026-09-08T12:52:47.3251803+02:00.
NODE_ENV=test; VERCEL absent; YUTA_POINTAGE_SYNTHETIC_TEST_MODE=true;
POINTAGE_TEST_ORIGIN=http://127.0.0.1:3001. Explicit connection selected for this
run only; no repository environment-file fallback or browser input.

- Container: yuta-pointage-raw-20260908-1252.
- Container ID: 001f3ee11e3f3b7b3c91b1bf41440931d7ad9313e1454451bb88f0e8da2b16c8.
- PostgreSQL 17 image ID:
  sha256:7958605b474b3d264a969cb3a123d6aa00ad1e1fe9da8a69984dabb704d93317.
- Sole published binding: 127.0.0.1:56541 -> container 5432/tcp.
- Fresh private tmpfs /var/lib/postgresql/data, rw,size=512m; no attached
  persisted volumes (Mounts=[]). No existing cloud/POS/Display volume reused.
- Dedicated bootstrap identity: pointage_bootstrap_20260908a.
  Infrastructure/migration only; never the raw runtime or helper owner.
- Selected target: yuta_pointage_raw_clocking_test_b20260908a.
- Stage 3 maintenance connection: postgres in this new container only.
  CREATE DATABASE created exactly the selected empty target. No Pointage
  roles/schema/fixtures/provider/attendance existed before Stage 4.

BOOTSTRAP*DATABASE_CREATED is distinct from DISPOSABLE_TARGET_IDENTITY_VERIFIED.
Stage 4 used a separate actual host TCP connection to 127.0.0.1:56541, ran
SELECT current_database(), and returned
yuta_pointage_raw_clocking_test_b20260908a. Parsed expected == actual exactly;
both independently matched the entire case-sensitive
`^yuta_pointage_raw_clocking_test(?:*[a-z0-9]+)?$` with full-match equality.
No trim/case-fold/Unicode/percent/newline normalization, query/fragment override
or inferred Docker identity. DISPOSABLE_TARGET_IDENTITY_VERIFIED at
2026-09-08T10:53:10.094Z.

Only then were the two previously absent roles provisioned:
yuta_pointage_raw_lock_owner NOLOGIN, and yuta_pointage_raw_writer LOGIN;
both NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOREPLICATION/NOBYPASSRLS/NOINHERIT,
zero role memberships at setup. No ALTER repair of an existing role.
Credentials were generated/used only in process/infrastructure configuration,
not printed or written to repository files. Initial attributes are not a
substitute for the still-unimplemented complete F8 runtime catalog admission.

### Generated migration and atomic-publication evidence

Fresh Drizzle review found 21 prior journal entries through 0020. Normal
pnpm db:cloud:generate generated exactly:

- packages/db-cloud/drizzle/0021_abandoned_black_queen.sql;
- packages/db-cloud/drizzle/meta/0021_snapshot.json;
- one additive entry in packages/db-cloud/drizzle/meta/\_journal.json.

Snapshot comparison adds only pointage_continuations,
pointage_raw_command_receipts and pointage_raw_events; changes only the
credential composite unique key. No removed/unrelated table changes.
Removing the single idx=21 journal entry in memory reproduced the entire
pre-write journal bytes exactly (Buffer.equals), hash
64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997.
Existing migrations 0019/0020 and all previous snapshots stayed byte-identical.

The new SQL includes reviewed scoped mutual deferred FKs, raw/receipt mutation
triggers, bounded continuation trigger, static delegated-lock helper,
ownership transfer and bounded grants/revokes. The generated credential unique
constraint was placed before the referencing continuation FK. These are
partial implementations pending full F3-F8 SQL proof, not completed contracts.

Before execution, inspected the actually installed tool chain:
drizzle-kit 0.31.10 postgres branch delegates to drizzle-orm/postgres-js/migrator;
drizzle-orm 0.43.1 pg-core/dialect.js migrate() executes every migration SQL
statement and its journal insert inside one session.transaction callback;
postgres-js/session.js delegates to client.begin with that transaction client;
postgres 3.4.9 cjs/src/index.js begin() pins the connection, awaits the callback,
then COMMIT, or ROLLBACK on error. Migration ledger schema/table initialization
is outside that transaction, but helper creation/properties/ownership/ACLs and
related triggers/constraints are inside it. No explicit COMMIT or alternate
SQL runner was inserted into the migration.

After repeat static and actual target identity checks, normal
pnpm db:cloud:migrate exited 0 on the empty target. PostgreSQL emitted only
existing long-identifier truncation notices during historical migrations.
This establishes successful DDL publication of the attempted SQL, not correct
helper execution or complete migration validation. No upgrade/no-op proof was
claimed.

### Restricted-writer failure and mandatory pause

Actual separate connection returned session_user=current_user=
yuta_pointage_raw_writer and the exact disposable database. In an outer
transaction with lock_timeout=2s, the first non-null missing-tuple helper probe
failed with SQLSTATE 42883:

operator does not exist: public.organization_status pg_catalog.= text

The helper incorrectly forced the active literal to pg_catalog.text, whereas
existing parent status columns use public.organization_status. No dossier/raw
mutation occurred. The transaction rolled back; no fallback or admin runtime
was attempted. F4/F8 helper execution proof FAILED, not PASS.

Corrected exactly the two active-literal casts in the newly generated SQL file,
leaving the literal inferred from the existing enum with pg_catalog-qualified
equality. A read-only constant enum/operator SELECT resolves successfully.
Added a source regression test (now 7 schema/source tests). Neither that SELECT
nor the source test proves the complete corrected helper, lock behavior or
migration.

The already-migrated disposable database was deliberately NOT patched:
no CREATE OR REPLACE, ALTER repair, ledger rewrite, unjournaled SQL workaround,
second migration, DROP/down migration, cluster removal or second bootstrap.

Applied SQL / database ledger hash:
1a001f1534a48765b5adfe37e6b3aceedb4dedf34f4022a81ec0bce730913531.
Current corrected SQL hash:
36cec0c4ee60a4bd60add00f77b3fcc552c0b42d0267803aaf212a54ad07b128.
The two are intentionally different pending clean validation. Reconstructing
the applied SQL by restoring only those two casts matches the database ledger
hash exactly. Do not run a no-op migration and call the corrected SQL applied.

The approved one-target bootstrap has been consumed. A clean rerun now requires
an explicitly authorized isolated disposable replacement/recreation lifecycle;
do not assume permission to drop/recreate this database or create another.
This is a bounded test-infrastructure recovery question, not a new Product or
Sensitive Design decision. Resume requires fresh hashes and all static/actual
identity gates again, migration from the corrected reviewed file, then the
outstanding actual restricted-writer tests. No repair of shared databases.

At 2026-09-08T11:01:01.933Z read-only counts were all zero: Personnel dossiers,
Pointage credentials, continuations, raw events and command receipts.
The isolated container remains present; no fixtures/provider/attendance were
created. Existing cloud/POS/Display containers were not altered.

Task outcomes: 1.1/1.2 remain COMPLETE. 1.3 remains PARTIAL; 1.4/1.5/1.7 have
partial migration implementation only; 1.6 has manual guarded bootstrap/role
evidence but no reusable harness; 1.8 first actual helper probe failed.
No additional checkbox is complete. Phases 2-4 remain NOT_STARTED.

### Exact partial implementation inventory

SHA-256 over current file bytes (PowerShell SHA256.HashData), sorted paths:

| Path                                                        | Current SHA-256                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/auth/src/index.ts                                  | 464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a |
| packages/auth/src/pointage-continuation.ts                  | f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172 |
| packages/auth/test/pointage-continuation.test.ts            | 6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a |
| packages/db-cloud/drizzle/0021_abandoned_black_queen.sql    | 36cec0c4ee60a4bd60add00f77b3fcc552c0b42d0267803aaf212a54ad07b128 |
| packages/db-cloud/drizzle/meta/0021_snapshot.json           | 71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf |
| packages/db-cloud/drizzle/meta/\_journal.json               | 897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0 |
| packages/db-cloud/src/pointage-raw-clocking-repository.ts   | 761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3 |
| packages/db-cloud/src/schema/index.ts                       | eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944 |
| packages/db-cloud/src/schema/pointage-raw-clocking.ts       | d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754 |
| packages/db-cloud/src/schema/pointage.ts                    | 8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29 |
| packages/db-cloud/test/pointage-raw-clocking-schema.test.ts | 5374d1365328b30c061bfb5d8618ea16f9c03f516faa39958d54866a4c42612d |

This turn changes only the new SQL, new snapshot, one journal entry and the
single source-regression test block, plus this execution appendix and 02c
execution metadata. The previous seven partial implementation files remain
unchanged, including auth/index.ts and its unrelated Formalites export.
Existing 0019 SQL:
143b6d1e47f92336b4359c4c85a17487ead97416afbbe2c0fd0b99880c0e7056.
Existing 0020 SQL:
690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b.
No root runtime export, app code/transport/UI, normative main Spec/archive,
Proposal/Analysis/delta Spec/Design/UI-pack byte change was made.

Concurrent unrelated changes were observed during the run in DATA_MODEL,
CURRENT_STATE, MODULE_REGISTRY, PRODUCT_KNOWLEDGE, Personnel README and the
Formalites legal-template review 03/04 files. They were not written, reverted,
formatted or adopted as Pointage approval. Therefore the whole checkout is
not claimed byte-identical outside this change; Pointage attribution is the
explicit path set above.

### Apply checks — not formal VERIFY

| Command / evidence                                                                                                                                                                     | Result                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| pnpm db:cloud:generate                                                                                                                                                                 | Exit 0; exact three generated paths / one journal entry; no unrelated schema drift.  |
| pnpm db:cloud:migrate                                                                                                                                                                  | Exit 0 for the applied pre-correction SQL only; helper execution later failed 42883. |
| Actual restricted-writer helper probe                                                                                                                                                  | FAILED 42883; outer rollback; complete corrected SQL NOT_EXECUTED.                   |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                            | Exit 0; 1 file, 7 schema/source tests, not full PostgreSQL proof.                    |
| pnpm -r --if-present typecheck                                                                                                                                                         | Exit 0; all applicable packages/apps.                                                |
| pnpm docs:check                                                                                                                                                                        | Exit 0; 36 current documents.                                                        |
| pnpm architecture:check                                                                                                                                                                | Exit 0.                                                                              |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                      | Exit 0.                                                                              |
| pnpm exec prettier --check packages/db-cloud/test/pointage-raw-clocking-schema.test.ts packages/db-cloud/drizzle/meta/\_journal.json packages/db-cloud/drizzle/meta/0021_snapshot.json | Exit 0.                                                                              |
| pnpm format:check                                                                                                                                                                      | Exit 1; 67 pre-existing unrelated warnings; no global formatter write.               |

The new test file alone was formatted; generated JSON passed check-only.
SQL has no configured Prettier parser and was reviewed as SQL, not passed off
as a formatting validation. Checkpoint docs/architecture/strict/scoped checks
are repeated after recording. Not run: full DB regression/harness, corrected
migration clean/upgrade/no-op proof, complete F8 privilege/lock/concurrency
proof, broad cloud/local suites/builds, UI implementation/pack execution,
formal VERIFY, Browser QA or Gate 3. No mock substitutes for missing evidence.

No production provider, real employee attendance, production enablement,
deploy, sync/archive or lifecycle promotion. All seven blockers remain:
retention duration; deletion/anonymization; legal hold; backup-retention
interaction; employee notice; detailed audit visibility; trusted production
client-address provenance.

## Clean cluster revalidation / Apply checkpoint — 2026-09-08

APPLY: BLOCKED

Tasks: 2/32

Task 1.3: PARTIAL

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

### Authority, preflight và giới hạn thực thi

Current-user authorization: DISPOSABLE CLUSTER RECREATION: AUTHORIZED.
Chỉ revalidation migration đã sửa và approved F3-F8 / D4a-D4b; không sửa
Product/Specs/Design/Tasks contracts để làm test pass. Checkpoint này ghi tiến độ,
không thay authority hoặc claim hoàn tất Apply.

Fresh Git và full tracked/untracked byte inventory lúc
2026-09-08T13:08:35.0407345+02:00; HEAD
defbc50eba3952fa2e7b1c016637daf083b18c65.
So với checkpoint trước: không changed/added/removed path nào. Approved path
sets và current partial hashes khớp; Formalites/unrelated hunks giữ nguyên.
Design SHA-256:
a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361.
Tasks trước append này:
3a9f15cfd02159075a92aab3d07ddf3f2e0c15b52b1fa480b8c5a3e4470f8c6d.
02c trước execution metadata mới:
9b1f472e5a31a705a329d951048f7bdf78ad8bb90a7256cc98a1ee1c1c344972.

Giữ nguyên migration candidate được phép revalidate; không SQL edit trong turn:

| Artifact                                                                | SHA-256                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/db-cloud/drizzle/0021_abandoned_black_queen.sql                | 36cec0c4ee60a4bd60add00f77b3fcc552c0b42d0267803aaf212a54ad07b128 |
| packages/db-cloud/drizzle/meta/0021_snapshot.json                       | 71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf |
| packages/db-cloud/drizzle/meta/\_journal.json                           | 897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0 |
| packages/db-cloud/src/schema/pointage-raw-clocking.ts                   | d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754 |
| packages/db-cloud/src/schema/pointage.ts                                | 8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29 |
| packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql        | 143b6d1e47f92336b4359c4c85a17487ead97416afbbe2c0fd0b99880c0e7056 |
| packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql | 690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b |

Exact enum correction so với lần migration lỗi trước: đúng hai occurrences
trong helper, không scope/grant/schema change:

```diff
-      AND status OPERATOR(pg_catalog.=) 'active'::pg_catalog.text FOR SHARE;
+      AND status OPERATOR(pg_catalog.=) 'active' FOR SHARE;
```

Chỉ áp dụng tại organizations và establishments PERFORM. Khôi phục hai casts
trong memory tái tạo applied SQL cũ hash
1a001f1534a48765b5adfe37e6b3aceedb4dedf34f4022a81ec0bce730913531.
Thay literal typing của function body không cần đổi Drizzle table snapshot/
schema/journal. Chỉ ba tables và credential composite key như snapshot 0021;
không unrelated schema addition hoặc falsified journal.

### Positive identification, disposal và bootstrap sạch

Trước removal, docker inspect xác nhận đúng old container ID
001f3ee11e3f3b7b3c91b1bf41440931d7ad9313e1454451bb88f0e8da2b16c8,
name yuta-pointage-raw-20260908-1252, labels Pointage/b20260908a,
Mounts=[], private tmpfs và sole 127.0.0.1:56541 binding.
Chỉ container đó bị docker rm -f bằng exact ID; old tmpfs mất, không recoverable.
Không xóa shared volume, yuta_cloud/yuta_resto, POS hoặc Display.

New container cùng tên, NEW isolated tmpfs:

- ID: 34ac92356894e59f66a74b4d7bc797011ef885bc07fac7b6b2eb08e0242223e2.
- Created: 2026-09-08T11:09:19.627719849Z.
- Run label: r20260908b; change label pointage-usable-raw-clocking.
- Image: sha256:7958605b474b3d264a969cb3a123d6aa00ad1e1fe9da8a69984dabb704d93317.
- Storage identity: tmpfs gắn riêng với NEW container ID ở
  /var/lib/postgresql/data, rw,size=512m; Mounts=[]; không reuse prior data.
- Sole published binding: 127.0.0.1:56541 -> 5432/tcp.
- Static gate PASS: 2026-09-08T13:09:20.1714142+02:00.
  NODE_ENV=test, VERCEL absent, synthetic flag true, loopback origin
  http://127.0.0.1:3001; explicit URL, không .env fallback/browser selection.

Fresh bootstrap administrator pointage*bootstrap_20260908a chỉ dùng hạ tầng/
migration/fixture administration; không raw runtime hay helper owner.
Tạo đúng một empty target qua maintenance postgres:
yuta_pointage_raw_clocking_test_b20260908a.
Separate target TCP probe lúc 2026-09-08T11:09:36.351Z trả chính xác tên đó.
Parsed expected == actual và cả hai independently full-match
`^yuta_pointage_raw_clocking_test(?:*[a-z0-9]+)?$`.
Không trim/case-fold/Unicode/newline/encoded alias normalization.
Probe ghi 0 Pointage roles, 0 application tables trước provisioning.
Đây là DISPOSABLE_TARGET_IDENTITY_VERIFIED, không chỉ CREATE DATABASE success.

Chỉ sau probe PASS mới tạo yuta_pointage_raw_lock_owner NOLOGIN và
yuta_pointage_raw_writer LOGIN, các attributes còn lại đều
NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOREPLICATION/NOBYPASSRLS/NOINHERIT.
Pre-migration role proof: 0 memberships, relation/schema ownership,
default ACL, owned functions, table grants và column grants; không unexpected
role repair. Không credential secret/connection secret được ghi trong packet.

### Clean migration, upgrade và helper regression

CWD cho root command: D:/working/yuta/yuta-resto.
pnpm db:cloud:migrate -> @yuta/db-cloud drizzle-kit migrate, exit 0.
Dùng explicit verified target URL; actual installed single-outer-transaction
migration path đã chứng minh ở checkpoint trước vẫn nguyên bytes/version.
Không compensating ALTER hoặc patch trước retry.

Ledger actual khớp từng SQL byte hash và timestamp cho đủ 22 entries, đúng thứ tự:

```text
0000_initial
0001_amused_wrecker
0002_bumpy_elektra
0003_small_raider
0004_previous_gravity
0005_lean_zzzax
0006_aromatic_boom_boom
0007_happy_master_chief
0008_omniscient_colonel_america
0009_heavy_sauron
0010_gifted_roland_deschain
0011_restaurant_knowledge_concept_history
0012_restaurant_knowledge_cuisine_know_how
0013_restaurant_knowledge_customer_experience
0014_restaurant_knowledge_team_culture
0015_restaurant_knowledge_communication_identity
0016_restaurant_knowledge_validated_items
0017_whole_warbound
0018_elite_hardball
0019_pointage_authority_foundation
0020_formalites_legal_template_foundation
0021_abandoned_black_queen
```

Theo riêng authorization mục 8, tạo thêm clean upgrade target
yuta_pointage_raw_clocking_test_upgrade20260908b trong isolated cluster này.
Independent name/actual probe PASS lúc 2026-09-08T11:12:23.336Z.
Test dùng official drizzle-orm/postgres-js/migrator, cùng engine với CLI:
ephemeral copies của exact SQL 0000-0020 + prefix journal trong OS temp folder,
rồi full authoritative migration folder để apply 0021. Không sửa repository
journal/snapshot/SQL hoặc ledger. Prefix 21 entries giữ nguyên qua upgrade
thành 22; current SQL hash khớp. Temp fixture directory được kiểm tra nằm dưới
OS temp trước cleanup. Clean target no-op rerun giữ nguyên ledger.
Cả hai targets có real PostgreSQL clock; không clock function replacement.

Clean target helper OID=18114,
public.pointage_raw_lock_dossier(uuid,uuid,uuid), RETURNS void,
owner yuta_pointage_raw_lock_owner; plpgsql, SECURITY DEFINER, VOLATILE,
PARALLEL UNSAFE, CALLED ON NULL INPUT, 0 defaults/variadic, exact 3 arg names.
search_path = pg_catalog, pg_temp. Body bytes khớp migration; body SHA-256:
293dee4dfc8787ea891fe370668425dc97918b4412f62da6eb0f692e7521fe24.
ACL exact:
{yuta_pointage_raw_lock_owner=X/yuta_pointage_raw_lock_owner,
yuta_pointage_raw_writer=X/yuta_pointage_raw_lock_owner}.
PUBLIC không EXECUTE; không extra grantee/grant option.

Actual writer session_user=current_user=yuta_pointage_raw_writer.
Exact prior non-null missing-tuple probe nay trả P0001 /
POINTAGE_LOCK_UNAVAILABLE, không enum/text 42883.
Valid full tuple đi qua cả ba locks, chỉ return void, không đổi source values.
Direct writer source FOR SHARE/FOR UPDATE và UPDATE đều 42501.
NOWAIT conflicting locks trên mỗi source row bị 55P03 sau helper return;
đều acquire lại được sau outer COMMIT và ROLLBACK.
Non-writer pg_read_all_data không EXECUTE; actual writer không SET ROLE owner,
SET SESSION AUTHORIZATION admin, ALTER/disable triggers hoặc claim ownership.

### Partial implementation và DB test evidence

Repository thêm D4b admission trên same pinned connection trước helper:
exact session/current user, function OID/signature/properties/body/ACL;
role attributes/memberships/ownership; effective table/column/function/schema/
sequence/default/PUBLIC/parameter grants và pg_has_role MEMBER/USAGE/SET.
Hash bind từ migration, không environment input. Không runtime auto-repair,
credential processing/provider composition hoặc migration-owner fallback.
Đây vẫn là partial foundation, chưa root-export/app-consumed hay complete F8.

Reversible deliberate negative fixtures chỉ trên upgrade target đã PASS:
extra source UPDATE, PUBLIC helper EXECUTE, unsafe search_path, body comment
drift -> admission từ chối hai lần liên tiếp, không auto-repair.
Test administration restore exact known baseline sau mỗi fixture; final
function definition/body hash/admission khớp. Đây không là ALTER chữa migration
lỗi: candidate migration không bị thay; không runtime chạy với altered helper.

Continuation tests actual PostgreSQL đạt: scoped repository insert/locks/
credential tuple, DB 120s absolute + 60s idle, cả chín immutable columns bị
writer privilege 42501 và trigger 23514; idle NULL/decrease/cap/overextension
deny; one-way DB end và idempotent end; actual 61-second elapsed idle expiry
không revive. Không giả clock. Task 1.3 vẫn PARTIAL vì các required post-lock
race/lifecycle outcomes và toàn bộ dependent DB contracts chưa đủ evidence.

Chỉ sau migration/role/helper proof mới chạy later F3 synthetic raw-pair test:
raw-only và receipt-only COMMIT đều 23503, valid scoped pair commit once,
alternate duplicate IN conflict; caller instant/calendar/ordinal bị DB overwrite.
Writer mutation denial và actual raw/receipt immutable triggers được kiểm tra;
unexpected test writes luôn outer rollback. Không usable employee runtime.

### Mandatory F4 failure — historical calendar chưa được validate đầy đủ

Design D6 / F4 require raw INSERT validate full existing chain; D7 định nghĩa
invalid calendar/offset phải fail closed. Current trigger chỉ kiểm tra prior
ordinal/kind/instant và receipt existence; không kiểm tra prior timezone_name,
utc_offset_seconds hoặc business_date consistency.

Failing test:
F4: rejects append when a privileged synthetic corruption fixture has invalid
historical calendar context.

Fixture mới, riêng dossier synthetic: prior CLOCK_IN có Not/AZone,
offset 0, business_date 1900-01-01 và valid scoped receipt. Không sửa existing
raw event. Fixture transaction tạm disable riêng append trigger, insert pair,
SET CONSTRAINTS ALL IMMEDIATE để flush deferred events, enable lại trigger
trước COMMIT. Writer không chạy khi trigger disabled. Post-fixture catalog
xác nhận tgenabled=O; complete role/body admission vẫn PASS.

Actual writer thử CLOCK_OUT: INSERT được cho qua thay vì throw 23514 /
POINTAGE_CHAIN_UNAVAILABLE. Test cố ý throw sentinel
"Invalid historical calendar accepted; synthetic append rolled back."
để rollback toàn bộ attempted OUT; không dùng missing-receipt COMMIT error
để che thiếu chain validation. Không new OUT commit.
F4 behavioral proof: FAILED. Candidate migration chưa được validated toàn bộ
dù clean DDL, enum regression và helper locking đã PASS.

Theo current-user mandatory stop cho failed clean PostgreSQL proof và
yuta-run-change, dừng trước tiếp tục Apply/sửa thêm SQL. Không đổi Product,
Specs, Design, Tasks contracts hoặc weaken expected assertion.
Cần bounded authorization cho implementation correction của F4 append-chain
validation và clean revalidation candidate tiếp theo; không đề nghị Product
hay Sensitive Design behavior mới. Giữ failing test và historical failures.

### Tất cả failures/retries và trạng thái dữ liệu thật

- Helper suite ban đầu 8/8; thêm continuation thành 12/12.
- Run 15 cases: 13 pass, 2 fail do test harness kỳ vọng Date trong khi Drizzle
  giữ timestamp string; dependent mutation test không có fixture vì pair đã
  rollback. Sửa test giữ lossless string và test TRUNCATE cả mutual-FK tables.
  Focused F3 rerun: 2 pass / 13 skipped. Không sửa SQL để che lỗi này.
- Actual 61-second expiry case PASS trong run 15 cases.
- Focused F8: 2 pass / 15 skipped, deliberate catalog fixtures restored.
- Corruption fixture lần đầu fail do pending deferred trigger events lúc
  re-enable; entire transaction rollback. Thêm SET CONSTRAINTS ALL IMMEDIATE
  bên trong fixture, không thay permanent deferred constraints.
- Corruption rerun: 1 fail / 17 skipped, đúng failure F4 nêu trên.
  Vitest/pnpm exit 1. Wrapper PowerShell ban đầu có thể trả 0 sau finally;
  đã thêm explicit child-exit propagation, final corruption command exit 1.
- Không có full final 18-case PASS. Không cộng các focused runs thành VERIFY.
- Scoped test typecheck ban đầu thiếu --ignoreConfig (TS5112), rồi thiếu
  explicit --types node trong ad-hoc TS6 command; final exact command dưới PASS.
  Không cài dependency hoặc sửa tsconfig để giải quyết command configuration.

Read-only final DB snapshot lúc 2026-09-08T11:26:02.212Z:

- Main target: 8 synthetic organizations, 9 dossiers, 2 binding-only credentials,
  3 continuations, 2 raw rows và 2 receipts.
- Trong đó một raw/receipt pair là valid synthetic F3 evidence; một pair là
  deliberate corrupt-calendar fixture, không accepted clocking operation.
- Upgrade target: 22 migration entries, 0 raw/receipt; restored helper body
  hash 293dee4dfc8787ea891fe370668425dc97918b4412f62da6eb0f692e7521fe24.
- Cả sáu application triggers trên ba Pointage tables đều enabled O.
- Main ledger current SQL hash 36cec0c4ee60a4bd60add00f77b3fcc552c0b42d0267803aaf212a54ad07b128.
- Container mới được giữ để inspect; không cleanup/delete committed fixture
  evidence sau failure, không provider/server/browser được instantiate.

Không còn claim "0 attendance" cho toàn turn: chỉ migration/helper stage chưa
có attendance; later explicit F3/F4 tests có synthetic data như trên.
Real employee attendance luôn NOT_AUTHORIZED.

### Exact current implementation diff và checks

Chỉ bốn code/test paths thay đổi trong turn, cộng Tasks append và 02c execution
metadata. Snapshot full checkout 2026-09-08T13:26:25.3039763+02:00 xác nhận
không unrelated changed/added/removed path. SHA-256 từ exact file bytes:

| Path                                                                       | Before SHA-256                                                   | Current SHA-256                                                  |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/db-cloud/src/pointage-raw-clocking-repository.ts                  | 761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3 | 22855a1eb28c99d07512dd0e3724eef43a14e8a6ef920dcdf1a88ca389f81024 |
| packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts      | NEW / absent                                                     | ff46783b29e37ee4c609b7bc521476198135d10b23c0f5bed42c22b7fe9cafe2 |
| packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts | NEW / absent                                                     | 47e684d9e997599fbbf1dbfe05619c83ae48aa8774325169da92b4bb4d0d52b7 |
| packages/db-cloud/test/pointage-raw-clocking.integration.test.ts           | NEW / absent                                                     | ead989372b019bc51b608ad5133b3214cb871f0ffa37c697610b2a888e1d7ca7 |

Loại khỏi repository file đúng added import/admission block và call trong
memory tái tạo preimage hash
761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3.
Existing bounded continuation methods/lock body giữ nguyên. Ba test paths mới
đã absent ở preflight. Shared exports/auth Formalites, previous partial files,
Proposal/Analysis/delta Specs/Design/UI pack, normative main Specs và archive,
0019/0020/history/current 0021 đều unchanged. Không sửa app/package manifests.

| Command                                                                                                                                                                                                                                                                                                                                                                                                | Result                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| pnpm db:cloud:migrate                                                                                                                                                                                                                                                                                                                                                                                  | Exit 0, corrected candidate clean install; not full F4 PASS.                                  |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-migration.integration.test.ts                                                                                                                                                                                                                                                                                                             | Exit 0; 4 tests: exact guard, unsafe config, exact ledger/no-op, separate foundation upgrade. |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts                                                                                                                                                                                                                                                                                                                       | Progressive 8/8, 12/12; later 15-case run 13 pass/2 harness failures, as explained.           |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts -t F3                                                                                                                                                                                                                                                                                                                 | Exit 0; 2 pass/13 skipped after harness fix.                                                  |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts -t F8                                                                                                                                                                                                                                                                                                                 | Exit 0; 2 pass/15 skipped.                                                                    |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts -t 'invalid historical calendar'                                                                                                                                                                                                                                                                                      | Exit 1; 1 failed/17 skipped; real F4 blocker retained.                                        |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                                                                                                                                                                                                                                            | Exit 0; 7 tests.                                                                              |
| pnpm --filter @yuta/db-cloud typecheck                                                                                                                                                                                                                                                                                                                                                                 | Exit 0.                                                                                       |
| pnpm -r --if-present typecheck                                                                                                                                                                                                                                                                                                                                                                         | Exit 0.                                                                                       |
| pnpm --filter @yuta/db-cloud exec tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module esnext --moduleResolution bundler --esModuleInterop --types node test/helpers/pointage-raw-clocking-test-database.ts test/pointage-raw-clocking-migration.integration.test.ts test/pointage-raw-clocking.integration.test.ts                                                            | Exit 0; explicit test-source typing, separate from normal package typecheck.                  |
| pnpm docs:check                                                                                                                                                                                                                                                                                                                                                                                        | Exit 0; 36 current documents.                                                                 |
| pnpm architecture:check                                                                                                                                                                                                                                                                                                                                                                                | Exit 0.                                                                                       |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                                                                                                                                                                                                      | Exit 0.                                                                                       |
| pnpm exec prettier --check packages/db-cloud/src/pointage-raw-clocking-repository.ts packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts packages/db-cloud/test/pointage-raw-clocking.integration.test.ts packages/db-cloud/drizzle/meta/\_journal.json packages/db-cloud/drizzle/meta/0021_snapshot.json | Exit 0.                                                                                       |
| pnpm format:check                                                                                                                                                                                                                                                                                                                                                                                      | Exit 1; 67 pre-existing unrelated warnings, untouched.                                        |

Scoped formatter chỉ dùng cho bốn attributable TS files. Không formatter-write
shared files/approved planning body hoặc migration JSON. Checkpoint formatting,
docs/architecture/strict checks được lặp lại sau append.

Không chạy tiếp remaining SQL proof sau F4 blocker: actual issue/reset,
Personnel lifecycle (both orders), parent status/timezone, Formalites writer
coordination, deadlock/timeout whole rollback, remaining corrupted-chain/time/
cross-scope cases và full F5/F8 matrix còn thiếu. Chưa tạo reusable role
provisioning or app synthetic composition; test helper hiện chỉ guarded
connection/config. Không broad cloud/local suites/builds, UI/app/runtime work,
formal VERIFY, Browser QA hoặc Gate 3. Tasks 1.1/1.2 vẫn là hai checkbox duy nhất;
không task mới COMPLETE chỉ vì migration install/partial tests PASS.

Giữ synthetic/disposable-only, no production provider/default, no deploy/enable,
sync/archive/lifecycle promotion. Bảy blockers: exact retention;
deletion/anonymization; legal hold; backup-retention interaction; employee
notice; detailed audit visibility; trusted production client-address provenance.

## Sửa F4 với offset inclusive / checkpoint disposable — 2026-09-08

APPLY: BLOCKED

Tasks: 2/32

Task 1.3: PARTIAL

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED

VERIFY: NOT_RUN

QA: NOT_RUN

Production enablement: NOT_AUTHORIZED

### Clarification hiện tại và implementation giới hạn

Human Sensitive Design clarification hiện tại chỉ chốt miền số nguyên giây: `-50400 <= utc_offset_seconds <= 50400`, bao gồm cả hai biên. Không yêu cầu chia hết, clamp, normalize, thay offset
hiện tại, tính lại bằng tzdb hiện tại hoặc sửa lịch sử. Clarification bổ sung
cách hiểu D7, không sửa hai Specs hay file Design đã duyệt. Bằng chứng F4 thất
bại trước đây ở trên vẫn được giữ nguyên.

Preflight mới lúc 2026-09-08T13:59:23.3383925+02:00: HEAD
defbc50eba3952fa2e7b1c016637daf083b18c65; hash và path set của mọi file tracked/untracked khớp inventory cuối trước đó.
Giữ riêng toàn bộ thay đổi Formalités/shared export, Personnel/foundation/UI.
Chỉ SQL 0021 đang phát triển và integration test hiện có thay đổi implementation.

Raw append từ chối instant/date lịch sử không finite, timezone không dùng được,
rỗng hoặc chứa whitespace không được normalize; offset ngoài miền inclusive;
và business date không khớp UTC instant cộng offset nguyên giây đã lưu.
Giữ kiểm tra full scoped ordinal/alternation/nondecreasing instant/receipt.
Chỉ kiểm tra tính sử dụng được của tên zone; không tính lại historical offset
bằng tzdb hay establishment zone hiện tại. Acceptance mới cũng từ chối offset
ngoài miền. Không thêm field/table/grant/lock, repair hay recovery path.

### Diff chính xác và hashes

[Bounded SQL/test diff](../../../docs/reviews/pointage-usable-raw-clocking/apply-f4-calendar-validation.diff)
là unified diff so với baseline, bao gồm các file trước đó untracked.
`git apply --reverse --check docs/reviews/pointage-usable-raw-clocking/apply-f4-calendar-validation.diff`
đạt, exit 0. SHA-256:
20247677e9606ec5ce0edda2e442f9fc10fab4960a04a3f88e3fe0def8b06c5a.

| Artifact                                  | Before SHA-256                                                   | After SHA-256                                                    |
| ----------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| 0021_abandoned_black_queen.sql            | 36cec0c4ee60a4bd60add00f77b3fcc552c0b42d0267803aaf212a54ad07b128 | 7794a5c02f2fa809a9985848bc455dbd3a5762415b5d96c216fb49ff4fd01ed9 |
| Raw append function body                  | a2ea4f46b9224697bb0615abd247e3050d5b4f129cd0cad6519c30fd27a8636f | 5b52387a758b30bcc188c2f383deee0024212d69a28d1ee9cbaa2d67bd85d327 |
| pointage-raw-clocking.integration.test.ts | ead989372b019bc51b608ad5133b3214cb871f0ffa37c697610b2a888e1d7ca7 | d367ab0c90514da00674747ee8018482eccdfb2015d093c07d53f8fbfc824e9a |

SHA-256 uses exact file bytes via Get-FileHash -Algorithm SHA256; function-body
hashes use Node crypto SHA-256 over the exact UTF-8 body between migration
delimiters, and are checked against pg_proc.prosrc on both databases.
Removing exactly the two inserted SQL blocks reproduces the complete prior
migration bytes/hash. Every byte outside those blocks is unchanged, including
D4a helper body, ownership, ACL, search_path, locks and atomic publication.
Helper body remains
293dee4dfc8787ea891fe370668425dc97918b4412f62da6eb0f692e7521fe24.
This is function-body-only SQL: schema, generated 0021 snapshot and journal
semantics/bytes remain unchanged. 0019/0020 SQL/snapshots and all earlier
journal entries remain unchanged. No manual database migration repair.

### Storage mới và bằng chứng các safety gate tuần tự

Old exact container
34ac92356894e59f66a74b4d7bc797011ef885bc07fac7b6b2eb08e0242223e2
was positively identified by ID/change/run labels, sole loopback port and
Mounts=[] before authorized removal. Its private tmpfs is irrecoverable;
previous failure evidence in this file is retained.

New container yuta-pointage-raw-20260908-1252:

- ID: 229f77e20063d830eba10d12272b7873a58dc1629d49db357a9d2de7ed9013b3.
- Created: 2026-09-08T12:02:07.700341296Z.
- Image: sha256:7958605b474b3d264a969cb3a123d6aa00ad1e1fe9da8a69984dabb704d93317.
- Run label: r20260908c; change label unchanged.
- NEW private tmpfs /var/lib/postgresql/data, rw,size=512m; Mounts=[].
- Only 127.0.0.1:56541 → 5432; no attached existing volume.
- Unrelated yuta-cloud-db-dev / yuta-pos-db-dev / yuta-display-db-dev untouched.

Static `NODE_ENV=test`, VERCEL absent, explicit synthetic flag, exact loopback
origin and whole-string raw-clocking name guards passed before creation.
Fresh bootstrap secret generated in memory, never printed/persisted in repo.
Bootstrap identity is infrastructure/migration/fixture administration only,
not raw runtime/helper owner. Actual target probe at
2026-09-08T12:02:19.689Z returned
yuta_pointage_raw_clocking_test_b20260908a exactly, with zero application tables.
Separate upgrade target was statically checked before creation and independently
probed as yuta_pointage_raw_clocking_test_upgrade20260908b.
Only afterwards were the two approved isolated roles provisioned with their
exact LOGIN/NOLOGIN, nonsuperuser/NOINHERIT/no-membership policy.

Normal `pnpm db:cloud:migrate` installed the complete 22-entry history, exit 0.
The unchanged official migrator then proved separate empty → 0020 → 0021 upgrade,
preserved the first 21 ledger rows and produced the same new hash.
No-op proof passed before fixtures and the normal CLI no-op passed again after
tests. On both targets, exact ledger hashes match all 22 repository SQL files;
four function bodies equal current migration bytes, six triggers are enabled O,
helper owner/ACL/body and actual restricted-writer admission pass. No clock
function was replaced; real clock_timestamp implementation remains.

### F4 matrix và bằng chứng denied append chính xác

Final full SQL run: 42/42 PASS, exit 0, start 2026-09-08 14:07:39 Europe/Paris,
duration 64.66 seconds. This is Apply evidence, not formal VERIFY.
Each negative case below checks the complete before/after database JSON rows
and counts for raw, receipts, continuations, security audit, credentials,
limiter, organizations, establishments and dossiers; then proves a fresh writer
transaction can reacquire the scoped helper locks. No caught failed statement,
committed receipt, normalized prior row or continuation side effect.

| Negative case                                               | Raw before → after | Receipts before → after | Exact rows / outer rollback |
| ----------------------------------------------------------- | ------------------ | ----------------------- | --------------------------- |
| invalid historical calendar (original failed F4 regression) | 106 → 106          | 106 → 106               | PASS                        |
| invalid zone alone                                          | 107 → 107          | 107 → 107               | PASS                        |
| blank zone                                                  | 108 → 108          | 108 → 108               | PASS                        |
| zone whitespace is not normalized                           | 109 → 109          | 109 → 109               | PASS                        |
| offset below inclusive minimum                              | 110 → 110          | 110 → 110               | PASS                        |
| offset above inclusive maximum                              | 111 → 111          | 111 → 111               | PASS                        |
| inconsistent retained offset/date tuple                     | 112 → 112          | 112 → 112               | PASS                        |
| invalid infinite business date                              | 113 → 113          | 113 → 113               | PASS                        |
| invalid infinite accepted instant                           | 114 → 114          | 114 → 114               | PASS                        |
| ordinal gap                                                 | 115 → 115          | 115 → 115               | PASS                        |
| OUT first                                                   | 116 → 116          | 116 → 116               | PASS                        |
| double IN                                                   | 118 → 118          | 118 → 118               | PASS                        |
| decreasing instant                                          | 120 → 120          | 120 → 120               | PASS                        |

For all these cases: continuations 6 → 6, audit 0 → 0, credentials 3 → 3,
limiter 0 → 0, organizations 4 → 4, establishments 4 → 4; each dossier count
also remains unchanged within its attempted append. Counts grow only between
cases through explicit test-owner fixture creation, never through denied append.
Controlled corruption creates new synthetic fixtures with only the append
trigger disabled inside the fixture transaction; it is restored before COMMIT.
Runtime writer never receives trigger-disable, UPDATE or other broader grants.

Additional negatives PASS: valid future retained head causes
POINTAGE_CLOCK_UNAVAILABLE without clamping; raw-without-prior-receipt in the
same transaction causes POINTAGE_CHAIN_UNAVAILABLE and whole rollback.
Malformed organization/establishment fixture is rejected by the existing
composite establishment FK (23503), with counts/rows unchanged and append
trigger restored by rollback. Constraints were not disabled to force a
persisted malformed scoped row. Missing dossier writer helper fails P0001.

Positive PASS: UTC; nonzero offset; exact -50400 and +50400; offsets +561 and -1
(no step restriction); DST repeated-hour retained snapshots; cross-midnight
open session; current establishment timezone changed from Europe/Paris to
America/New_York. Each correct next transition commits exactly one raw/receipt
pair and preserves every prior raw row, including microseconds and retained
zone/offset/date. Deliberate boundary/odd-second retained snapshots test
historical snapshot validation, not an assertion that today's tzdb generates
those offsets for that zone/date.

Original enum/text helper regression, direct source-lock/write denial,
source-row immutability and lock retention through outer COMMIT/ROLLBACK all
PASS. Existing continuation immutable-field, TTL/end, real 61-second expiry,
and F8 ACL/search_path/body/role negative tests PASS.

Initial run: 38 PASS / 2 fixture-serialization failures (exit 1), not SQL PASS
for those two cases. postgres-js inferred date serialization rejected infinity
and truncated fixture microseconds. Bounded harness fix binds text before SQL
date/timestamptz conversion and asserts exact persisted instant/date. Its fixture
transactions rolled back; no migration/trigger change followed this harness
correction. Then 40/40 PASS; after backward-clock/receipt additions, focused
26 PASS / 16 skipped; final complete 42/42 PASS as above. No failed result erased.

Final catalog probe at 2026-09-08T12:09:24.249Z: main raw/receipt counts 140/140,
continuations 6, audit 0; separate upgrade 0/0/0/0. These totals include retained
valid and deliberately malformed synthetic fixtures across test reruns, NOT
140 accepted employee operations. No real attendance, provider or app runtime.

### Lệnh và kết quả

Cwd for all commands: D:\\working\\yuta\\yuta-resto. Guarded DB commands inject
the exact verified target configuration only for the subprocess, check child
exit status, and remove CLOUD_DATABASE_URL afterwards; no .env.local fallback.

| Command                                                                                                                                                                                                                                                                                                                                     | Result                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| pnpm db:cloud:migrate                                                                                                                                                                                                                                                                                                                       | Clean install exit 0; final no-op exit 0                          |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-migration.integration.test.ts                                                                                                                                                                                                                                                  | Exit 0, 4/4 (static guards, exact ledger/no-op, separate upgrade) |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts --reporter=verbose                                                                                                                                                                                                                                         | Final exit 0, 42/42; earlier harness failure retained above       |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts -t F4 --reporter=verbose                                                                                                                                                                                                                                   | Exit 0, 26 PASS / 16 skipped                                      |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                                                                                                                                                                                 | Exit 0, 7/7                                                       |
| pnpm --filter @yuta/db-cloud exec tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module esnext --moduleResolution bundler --esModuleInterop --types node test/helpers/pointage-raw-clocking-test-database.ts test/pointage-raw-clocking-migration.integration.test.ts test/pointage-raw-clocking.integration.test.ts | Exit 0                                                            |
| pnpm -r --if-present typecheck                                                                                                                                                                                                                                                                                                              | Exit 0                                                            |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                                                                                                                                           | Exit 0                                                            |
| pnpm docs:check                                                                                                                                                                                                                                                                                                                             | Exit 0, 36 current documents                                      |
| pnpm architecture:check                                                                                                                                                                                                                                                                                                                     | Exit 0                                                            |
| pnpm exec prettier --check packages/db-cloud/test/pointage-raw-clocking.integration.test.ts packages/db-cloud/drizzle/meta/0021_snapshot.json packages/db-cloud/drizzle/meta/\_journal.json                                                                                                                                                 | Exit 0                                                            |
| pnpm format:check                                                                                                                                                                                                                                                                                                                           | Exit 1, exactly 67 existing unrelated warnings; none modified     |
| git apply --reverse --check docs/reviews/pointage-usable-raw-clocking/apply-f4-calendar-validation.diff                                                                                                                                                                                                                                     | Exit 0                                                            |

Only the attributable integration test received formatter-write. SQL and shared
JSON/planning bodies were not formatter-written. Post-checkpoint docs,
architecture and strict validation are re-run separately.

### Ranh giới môi trường bắt buộc tiếp theo — C17

Lỗi F4 numeric/calendar đã được sửa và matrix mới đạt. Kết quả này không hoàn
tất task 1.3 hoặc toàn bộ bằng chứng F2-F8/phase.

Tasks C17 yêu cầu suite foundation repository SQL không sửa đổi chạy trên
target disposable foundation riêng, KHÔNG chạy trên database raw-clocking.
Guard hiện tại yêu cầu
`^/yuta_pointage_foundation_test(?:_[a-z0-9]+)?$` và explicit
YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true. Quyền bootstrap hiện tại chỉ bao phủ
miền tên raw-clocking chính xác. Inventory cluster mới gồm postgres và hai
target raw-clocking ở trên; không có target foundation hoặc connection riêng
được cung cấp/duyệt. Cả hai raw target đều không pass C17.

STOP trước khi tự tạo foundation target, nới guard của hai suite, dùng lại
.env.local/shared dev data hoặc mở rộng quyền bootstrap. C17 NOT_RUN, không
tính skipped/PASS. Cần quyền giới hạn rõ cho foundation-only disposable
bootstrap/database/migration/test, hoặc một foundation test target riêng đã
được cấu hình và duyệt. Prerequisite môi trường này không cần đổi Product/Spec.

Giữ Tasks 2/32, task 1.3 PARTIAL; không đánh dấu 1.4 chỉ vì F4 matrix này đạt.
Bằng chứng phase còn thiếu: phối hợp lifecycle/credential reset hiện tại,
accepted-time boundary/concurrency và các ca harness/privilege/locking 1.6/1.8
còn lại. Không chạy phase service/UI, formal VERIFY, Browser QA, Gate 3,
sync/archive/deploy hoặc nâng lifecycle.

Giữ đủ bảy blocker chưa giải quyết: exact retention duration;
deletion/anonymization; legal hold; backup-retention interaction;
employee notice; detailed audit visibility; trusted production client-address
provenance. Chỉ dữ liệu synthetic/disposable. Production enablement NOT_AUTHORIZED.

## Execution checkpoint — C17 approved bootstrap and Apply continuation, 2026-09-08

APPLY: BLOCKED — task 2.8 synthetic runtime connection authority.
Tasks: 15/32. Tasks 1.1-1.8 and 2.1-2.7 COMPLETE; 2.8 BLOCKED /
NOT_STARTED; 2.9 NOT_COMPLETE; phase 3/4 NOT_STARTED.
The 2.9 regression work already present is partial, not an additional completed task.

TECHNICAL IMPLEMENTATION COMPLIANCE: NOT_EVALUATED
VERIFY: NOT_RUN
QA: NOT_RUN
Production enablement: NOT_AUTHORIZED

Authority: current-user C17 FOUNDATION DISPOSABLE BOOTSTRAP authorization in
attachment aa9fb196-90b6-4388-9c80-ef1c182d38bf, followed by the explicit
instruction to continue existing Apply when C17 passes. No new Product, Spec,
Sensitive Design, phase, operation or grant decision was made. No formal VERIFY,
Browser QA, final review, sync/archive, deployment or lifecycle promotion.

### Fresh baseline and isolation

Preflight: 2026-09-08T16:20:22.9676947+02:00; HEAD
defbc50eba3952fa2e7b1c016637daf083b18c65; 2,568 tracked/untracked files hashed.
Current pre-turn Tasks SHA-256:
f41282da6265bcd347bc2701ba9b552451babf1d857a076053305f416c816eb5.
Approved planning Tasks remains
e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281.
Existing execution appendices explain that difference. Proposal, Analysis, both
delta Specs, Design, earlier Gate 1/2/2b and UI pack were rechecked without
changing their approved bytes. Exact baseline/final implementation hashes and
protected-tree evidence are recorded in the adjacent checkpoint manifest.

The twelve implementation paths touched in this resume are all in DOMAIN,
SERVICE_TEST, DATA or DBTEST allowlists. Eleven are change-owned untracked
files; five of those already existed before this resume. Their full current
contents in the attached diff are cumulative checkpoint snapshots, NOT claims
that all lines were first written in this turn. The only shared tracked
implementation edit is the isolated raw-repository export in db-cloud index.
Removing that exact LF-terminated export reproduces its pre-turn SHA-256
7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0.
The unrelated Formalités hunk in auth index and all other shared dirty bytes
remain unchanged. No formatter-write on shared index, locked planning/UI,
normative Specs or unrelated files.

Concurrent work added files only under the unrelated ui-ux-pro-max-integration
change/review directories. It is not attributed here, reverted or absorbed.
Main Specs, archives, foundation implementation/test, generated 0021 SQL,
snapshot and journal remain byte-identical to this turn's baseline.

### C17 — independent foundation regression PASS

Cluster: yuta-pointage-raw-20260908-1252,
ID 229f77e20063d830eba10d12272b7873a58dc1629d49db357a9d2de7ed9013b3,
created 2026-09-08T12:02:07.700341296Z.
Labels yuta.change=pointage-usable-raw-clocking and
yuta.disposable-run=r20260908c; PostgreSQL 17 image
sha256:7958605b474b3d264a969cb3a123d6aa00ad1e1fe9da8a69984dabb704d93317.
Only 127.0.0.1:56541 -> 5432, no shared mounts, private
/var/lib/postgresql/data tmpfs rw,size=512m. Existing normal cloud/POS/Display
containers, ports and volumes were not changed.

C17 target: yuta_pointage_foundation_test_c17, NOT the raw-clocking database.
Before empty CREATE DATABASE: explicit subprocess URL, NODE_ENV=test, exact
loopback host, exact whole-string name/path regex and isolated cluster proof;
integration opt-in absent. No .env fallback, trim, normalization or aliases.
Only the empty named database was created using the disposable bootstrap admin.

At 2026-09-08T14:21:21.182Z the explicit TARGET identity probe returned
`yuta_pointage_foundation_test_c17`. Expected equals actual, and both independently
match `^yuta_pointage_foundation_test(?:_[a-z0-9]+)?$` completely.
Only then: normal pnpm db:cloud:migrate (delegates to @yuta/db-cloud db:migrate),
22 journaled migrations, exit 0. Then YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true
for the unchanged foundation suite only; explicit target retained.

Cwd D:/working/yuta/yuta-resto:
pnpm --filter @yuta/db-cloud test test/pointage-repository.integration.test.ts
started 16:21:36 Europe/Paris; exit 0, 8 PASS / 0 FAIL / 0 SKIP, duration 2.59s.
Suite SHA-256 unchanged:
4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1.
Foundation repository SHA-256 unchanged:
4cfcfc4f5287590fde3ff44062a97efe1bd256771774495ae0ce91ab488034d8.
Final target probe: expected==actual and exact regex PASS; ledger 22, raw 0,
receipts 0, continuations 0. No raw fixtures/provider/attendance operations in
this target. Only synthetic foundation fixtures; no real employee data.
Secrets were never recorded. Per-process URL/opt-in removed after execution.

C17 proves existing foundation regression only, not F3-F8, production role
hardening or readiness. The following evidence uses separate raw-domain targets.

### Foundation/Data completion evidence

The guarded F6 helper now validates exact parsed and actual database names
independently, rejects missing probes/aliases/unsafe environments, and can
provision only the reviewed two roles after positively identifying local Docker
context, exact container, labels, loopback binding, private storage and empty
disposable target. Existing roles are refused without ALTER. No ordinary client
opener implicitly provisions roles or creates databases.

Positive harness proof used a fresh retained cluster:
yuta-pointage-raw-f6-20260908,
ID e76897d841358dcfb6f834c9d11fe6616331247e8a3a8a4d6dc95ab2c5f3c6ff,
same PostgreSQL 17 image, only 127.0.0.1:56542 -> 5432,
private 512m tmpfs /var/lib/postgresql/data, no mounts,
labels yuta.change=pointage-usable-raw-clocking and yuta.disposable-run=f620260908.
Primary yuta_pointage_raw_clocking_test_upgrade20260908c was explicitly created
empty, then independently probed. Guarded provisioning created only
yuta_pointage_raw_lock_owner and yuta_pointage_raw_writer; repeated invocation
refused existing roles without mutation. No provider instantiated.

Normal full migration on that clean target: 22 entries.
Separate yuta_pointage_raw_clocking_test_upgrade20260908b on this same new
cluster was also created empty and probed. The migration suite applied the exact
first 21 journal entries, created synthetic foundation rows through existing
repositories, applied 0021 and proved all Personnel/credential/audit source rows
unchanged, then proved no-op. Full suite: 5/5 PASS at 16:34:41, exit 0.
Original retained cluster's same-suffix upgrade target is a DIFFERENT database;
no database or cluster was dropped or recycled.

On retained raw target yuta_pointage_raw_clocking_test_b20260908a at port 56541,
complete actual PostgreSQL matrix now passes 62/62. It proves:

- three delegated locks retained through outer commit/rollback, alternate raw
  INSERT takes the same locks, no source mutation/owner fallback;
- Personnel lifecycle and actual foundation issue/reset coordination, parent
  status/timezone writers in both orders, real Formalités dossier locking;
- immutable continuation binding, exact expiry/end/touch, concurrent touch/end
  both orders, no revival/cross-dossier credential binding;
- deferred paired evidence/receipt COMMIT, whole-operation rollback, four
  transition outcomes, competing commands, final employment day and no auto-close;
- inclusive integer offset [-50400,50400], odd seconds, retained timezone/DST/
  midnight/microseconds, invalid historical chain and backward-clock fail closed;
- actual timeout 55P03 and deadlock 40P01 before callback, followed by healthy
  same-boundary retry; poisoned caller search_path/temporary names do not redirect;
- exact helper/role/ACL/catalog admission including inherited/default/column/
  grant-option drift; negative catalog fixtures restored without runtime repair.

The 61-second real idle-expiry test was retained, not replaced by a mocked clock.
Latest complete run started 17:13:10, exit 0, duration 72.14s, no skips.
Test-only owner clock overrides are restored exactly by finally/rollback; the
service clock-boundary case compares the restored complete function definition.
Final ledger/no-op after these tests passed: 4 PASS / 1 intentionally excluded
upgrade case (already proved separately on an empty target). Do not rerun the
empty-upgrade test against its now-populated evidence database or clear it.

### Service/Domain completion and remaining work

S1/S2: pure full-chain reducer, contiguous ordinals, receipt linkage, full scope,
known zones, historical UTC+stored-offset date validation, exact microsecond
ordering, multiple sessions/max one open. No persisted session/projection,
history repair, current-tzdb offset replacement or arbitrary quota. 34 unit cases.

S3/S4: identify and state.read are distinct current-authority checks before
continuation and minimal Personnel name/state exposure. Post-insert checks
discard partial identify on boundary failure; plaintext token only after commit.
Continuation locator is not authority; lock/read full binding, current credential
and inclusive Personnel dates for each exact employee operation. Idle touch only
successful foreground interaction; own-end remains idempotent and exposes no
protected state even after expiry/reset/departure.

S5/S6: stable UUIDv4 and ordered version-1 fingerprint, receipt checked before
current transition, current authority/lifecycle on replay/recover, original
canonical event fields only. New append and receipt share outer transaction;
stateGuard prevents stale OUT closing a later session. Returned DB acceptance
instant is rechecked against continuation and lifecycle before commit. Recovery
without committed receipt yields UNCONFIRMED, never creates an event. No unsafe
automatic new request identity after timeout/unknown COMMIT.

S7: server-only manager function with dedicated existing grant, fresh validated
cloud access supplied on each guard call, REPEATABLE READ read-only snapshot,
then fresh guard outside that snapshot. OWNER/MANAGER allowed; STAFF/employee,
scope/user/membership changes and unavailable authority discard the full result.
Stored current-day events and current open session only, including prior-day
opening; no employee self-eligibility filter on manager historical visibility,
no manager API/UI. The fresh access-loader contract is explicit, not an
implementation claim that cached getCurrentSession is fresh. Concrete local
runtime wiring is still the blocked task 2.8 responsibility.

Latest service suite: 52/52 PASS (45 unit + 7 actual SQL), started 17:13:03,
exit 0, duration 4.85s. Actual SQL uses distinct restricted-writer connections,
observer-proved blocking, actual foundation reset, returned acceptance at exact
idle deadline, and injected acknowledgement loss AFTER real PostgreSQL COMMIT;
recovery returns the same committed receipt without another event. The manager
case reads an actual scoped snapshot and proves the second authority callback
runs after it ends. Manager-specific 16 unit cases cover role/scope and final
authority race denials, malformed-chain no partial result, minimal projection.

Integration-only foundation clients use the already-authorized disposable
test setup administrator; no such client is installed as usable app runtime.
The deterministic synthetic address provider exists only in these guarded tests.
S8 full minimized denial-audit handling and S9 concrete runtime composition are
NOT complete. Final SQL-to-public error normalization remains part of 2.8;
no claim that the current lower-level service is a finished transport boundary.
S1-S9 complete regression task 2.9 remains unchecked.

### New mandatory stop — local synthetic runtime connection authority

Repository reality:

1. Design D1 and db-cloud env expose CLOUD_DATABASE_URL; Backoffice cloudDatabase
   constructs its singleton from that one setting.
2. D4b/F8 requires raw work through exact yuta_pointage_raw_writer, with no
   verifier-material, credential-lifecycle, limiter or audit mutation grants.
   Existing foundation repository needs those reads/writes independently.
3. D4b explicitly preserves a separate existing privileged foundation boundary;
   it does NOT merge raw writer into it or approve an owner fallback.
4. Sanitized current isolated-cluster role probe found only the bootstrap admin
   (LOGIN/SUPERUSER/CREATEDB/CREATEROLE), exact restricted raw writer (LOGIN,
   none of those administrative flags), and lock owner (NOLOGIN, no flags).
   There is no separately configured non-owner foundation runtime identity.

A single current client cannot satisfy both roles. The normal .env/shared DB is
forbidden; raw-writer grants must not widen; bootstrap test authority is not
silently promoted into usable Next synthetic runtime authority. Existing
getCurrentSession is React-cached and is not substituted for fresh manager
authorization either. Tests with separate injected clients establish behavior,
not authorization for a new app connection source, credential/role provisioning
or migration-owner runtime fallback.

STOP at 2.8 before creating raw-clocking-runtime.ts/test-boundary.ts, a new
connection environment contract, role/grant/schema changes, route/API or UI.
Required human Sensitive Design clarification: exact approved server-owned
composition/source and database identity/privilege boundary for the separate
foundation client in local synthetic runtime, alongside the unchanged restricted
raw writer, and how both must pass D1 target identity proof. No proposed Product
or Spec change; production provider/readiness remains explicitly out of scope.
Do not manually choose a new variable/role/owner arrangement to pass this step.

### Commands, results and limits

Cwd: D:/working/yuta/yuta-resto for all commands. DB commands use explicit guarded
subprocess configuration only, never .env fallback; credentials omitted here.

| Command                                                                                                                                                                                                                                                                                                                                     | Latest result                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| pnpm db:cloud:migrate                                                                                                                                                                                                                                                                                                                       | C17 clean and separate F6 clean: exit 0, 22 journal entries                          |
| pnpm --filter @yuta/db-cloud test test/pointage-repository.integration.test.ts                                                                                                                                                                                                                                                              | C17 only: exit 0, 8/8                                                                |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-migration.integration.test.ts                                                                                                                                                                                                                                                  | Fresh F6 clean/upgrade: exit 0, 5/5                                                  |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-migration.integration.test.ts -t "F6\|preserves every exact ledger"                                                                                                                                                                                                            | Final raw target guard/ledger/no-op: exit 0, 4 pass, 1 deliberately excluded upgrade |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking.integration.test.ts --reporter=verbose                                                                                                                                                                                                                                         | Final exit 0, 62/62                                                                  |
| pnpm --filter @yuta/backoffice test test/pointage-raw-clocking-service.test.ts --reporter=verbose                                                                                                                                                                                                                                           | Final guarded SQL+unit: exit 0, 52/52                                                |
| pnpm --filter @yuta/backoffice test test/pointage-raw-chain.test.ts test/pointage-raw-clocking-manager.test.ts test/pointage-foundation.test.ts                                                                                                                                                                                             | Exit 0, 71/71 = 34 + 16 + 21                                                         |
| pnpm --filter @yuta/auth test test/pointage-continuation.test.ts                                                                                                                                                                                                                                                                            | Exit 0, 19/19                                                                        |
| pnpm --filter @yuta/db-cloud test test/pointage-raw-clocking-schema.test.ts                                                                                                                                                                                                                                                                 | Exit 0, 7/7                                                                          |
| pnpm --filter @yuta/db-cloud exec tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module esnext --moduleResolution bundler --esModuleInterop --types node test/helpers/pointage-raw-clocking-test-database.ts test/pointage-raw-clocking-migration.integration.test.ts test/pointage-raw-clocking.integration.test.ts | Exit 0                                                                               |
| pnpm -r --if-present typecheck                                                                                                                                                                                                                                                                                                              | Exit 0; final Backoffice-specific rerun also exit 0                                  |
| pnpm docs:check                                                                                                                                                                                                                                                                                                                             | Exit 0, 36 current documents                                                         |
| pnpm architecture:check                                                                                                                                                                                                                                                                                                                     | Exit 0                                                                               |
| pnpm exec openspec validate pointage-usable-raw-clocking --strict                                                                                                                                                                                                                                                                           | Exit 0                                                                               |
| pnpm ui:pack:check backoffice-pointage-employee                                                                                                                                                                                                                                                                                             | Exit 0, zero warnings; no UI implementation or QA                                    |
| pnpm format:check                                                                                                                                                                                                                                                                                                                           | Exit 1, exactly 67 existing unrelated warnings, no formatter-write                   |
| Scoped prettier --check on eleven changed code/test files                                                                                                                                                                                                                                                                                   | Exit 0; exact paths in checkpoint manifest                                           |
| git apply --reverse --check docs/reviews/pointage-usable-raw-clocking/apply-c17-service-checkpoint.diff                                                                                                                                                                                                                                     | Exit 0, current twelve-path cumulative checkpoint                                    |

Development failures were fixed within scope and are not counted as PASS:
a test used an incompatible raw TransactionSql as a Drizzle client; explicit
nullable repository return types were needed across compiler configurations;
two schema static assertions initially failed only because formatter line-wrap
changed function signatures, replaced by equivalent one-parameter whitespace
checks. A standalone Backoffice tsc invocation without Next ambient types
reported server-only; normal project typecheck includes those types and passed.
The initial diff check lacked sufficient shared-index context; corrected
context-only diff then passed reverse-check. Initial LF/CRLF preimage diagnostic
was corrected to the file's actual LF bytes and reproduced the exact baseline;
no target normalization occurred.

No full test:cloud/test:local, Backoffice build or build:cloud executed at this
partial blocked checkpoint. Integration/regression completion, formal Technical
Compliance Matrix/VERIFY and Browser QA remain later distinct work, not inferred
from these Apply checks. No Gate 3 packet created.

Attached cumulative diff SHA-256:
6363a602f65dbc85df9a3da0f4e72ea1ed33540a14e9256ac142e19a7476dec4.
Reproduction: sorted eleven untracked implementation paths from manifest,
git diff --no-index -- /dev/null <path>; shared index is only the approved export
with original lines 17-23 as unchanged context. Concatenate sorted path patches,
UTF-8/LF; Git diff text is normalized review representation, file byte hashes
remain authoritative. This does not replace the separate historical F4 diff
or claim the prior raw files were absent at this turn's baseline.

All disposable clusters/databases and synthetic evidence are retained; none
deleted. Their rows include deliberate invalid test fixtures and repeated test
runs, not real attendance or a production event count. Seven blockers remain:
exact retention duration; deletion/anonymization; legal hold;
backup-retention interaction; employee notice; detailed audit visibility;
trusted production client-address provenance. Real employee attendance and
production enablement remain NOT_AUTHORIZED.
