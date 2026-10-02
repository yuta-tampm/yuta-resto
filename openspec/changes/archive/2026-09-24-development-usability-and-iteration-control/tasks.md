# Development Usability and Iteration Control — Tasks / Implementation Plan

Change: `development-usability-and-iteration-control`  
Schema: `yuta-spec-driven`; `skip_specs: true`; Gate 1 `APPROVED`; Design human-approved SHA-256 `91dea8fdf6df5faa451a484b9163f61bde3dc53a55e06549b03825c4d8740b3f`.  
Planning authorization: chỉ tạo Tasks và phased TIC. `APPLY: NOT AUTHORIZED`; mọi checkbox còn mở.  
`CROSS_MODULE: YES`; `UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`; `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED`. QA final disposition chưa có. Không có Gate 2 hoặc normative spec sync trên nhánh này.

## Planning boundary and bootstrap

Nguồn: Proposal/Analysis và [Gate 1 packet](../../../docs/reviews/development-usability-and-iteration-control/01-analysis-review.md) đã duyệt → [Design](design.md) đã duyệt → Tasks/TIC dưới đây → future implementation/evidence. Không tạo Spec giả. Các phase dưới đây là nhóm công việc thuộc planning vocabulary `Integration / Regression`, **không** tạo workflow stage mới. TIC chỉ ràng buộc Apply sau authorization, không chứng minh implementation đã tồn tại.

Quy tắc mới **chưa normative trong Apply của chính governance change này**. Adoption chỉ bắt đầu sau `successful human-authorized finalization and archive of development-usability-and-iteration-control` với canonical edits đã Apply/VERIFY thành công. Vì vậy Tasks hiện tại không tự tạo `POST_APPLY_DEVELOPMENT_FEEDBACK` cho chính change này, không ép `DEV_USABLE`, `MANUAL_TEST_READY` hoặc `HUMAN_PRODUCT_VALIDATION` theo chính policy đang được viết. Existing pre-adoption Gate 1/3, TIC, VERIFY và QA vẫn áp dụng. Không dùng calendar date, file modification time hoặc partial edit làm adoption event.

Working tree tại planning time đang dirty, kể cả 5/6 future targets. Bảng này chỉ là fingerprint hiện tại, **không** là quyền ghi đè hoặc provenance của unrelated diff. Trước Apply phải chụp lại `HEAD`, `git status --short`, exact hash/preimage và scoped diff từng target; nếu không tách/bảo toàn được work hiện hữu thì STOP trước edit.

| Future target | Planning-time SHA-256 | Planning-time state |
| --- | --- | --- |
| `docs/YUTA_WORKFLOW_V3.md` | `d6822a2b35fbe4f265b99acc94e5acf7b665f4e246a1f4f40577865d56a20b8e` | modified |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` | `373b1bd77b60c7ff4605ae2d81f609cdd1696e8be7f4b2bc1f7fc07180862d93` | modified |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | `2b2c2c22e3b2a4ca7ecfd06ec2ec05242d1e6d0675b76e7177d707b81ba1db88` | modified |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md` | `fdbb2bcee502e5ee81906529db9ec2d3ff7bdf6060ec76b058c339422c3ab8d5` | modified |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | `ee6af141eddde233dc300e0e8fcce3ea2acb3cc40372e909179a0293164dcb52` | modified |
| `.agents/skills/yuta-run-change/SKILL.md` | `17c3ac53292f81d4e45b8b3e56c7d4efcfa07a0612564194f808eed2f81311b9` | clean |

## Global protection and authority

Root: `D:\working\yuta\yuta-resto`; scoped instruction for all six targets: root `AGENTS.md` (không thấy nested `AGENTS.md` dưới `docs/`, `openspec/` hoặc `.agents/skills/`). Authority consulted: `docs/README.md`, `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md`, `docs/YUTA_WORKFLOW_V3.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/YUTA_QA_PROTOCOL.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, `docs/operations/PRODUCTION_READINESS.md`, `docs/operations/DEPLOYMENT.md`, ba Control Tower/Page/handoff sources, `yuta-run-change`, `yuta-finish-change`, approved Analysis/Design và Gate 1. Code/tests chỉ là implementation evidence; docs/skills không được tự cấp Product/lifecycle/production authority.

| Forbidden without new human review | Constraint |
| --- | --- |
| `docs/YUTA_QA_PROTOCOL.md`, QA vocabulary/mandatory acceptance | Không đổi QA statuses, không waive Browser QA hoặc mandatory security/legal/payment/fiscal evidence. |
| `docs/LIFECYCLE_STATUS_MODEL.md` | Không thêm/promote dimension hoặc Product/Production readiness stage. |
| `docs/operations/DEPLOYMENT.md`, `docs/operations/PRODUCTION_READINESS.md` | Không đổi Release/Deploy/production authority. |
| `docs/CURRENT_STATE.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md` | Không cập nhật Product state/owner từ governance work. |
| `openspec/config.yaml`, `openspec/schemas/yuta-spec-driven/schema.yaml`, `openspec/specs/**` | Không đổi schema/config, không manufacture normative spec. |
| `.agents/skills/yuta-finish-change/SKILL.md` | Approved decision `NO_CHANGE`; nếu integrity thật sự không đủ thì STOP `NEEDS_REVIEW`. |
| `openspec/changes/product-version-management-foundation/**`, `docs/reviews/product-version-management-foundation/**` | Change riêng; không sửa hoặc suy approval. |
| Runtime/app/package/DB files, external service, deployment | Governance docs/skill scope này không cho runtime/schema/API/tenant/provider mutation. |

Giữ lịch sử PASS/FAIL/BLOCKED, DONE/archived/no-spec completed; không dựng retroactive checkpoint, không auto rewind active Apply/VERIFY/QA. Các file không nằm trong exact phase allowlist chỉ được đọc để kiểm; không edit. Bất kỳ owner/durable boundary hoặc no-change path bắt buộc sửa là `NEEDS_REVIEW`, không silent expansion.

## 1. Integration / Regression — Canonical workflow semantics

- [x] 1.1 Sửa `docs/YUTA_WORKFLOW_V3.md` để đặt conditional post-Apply assertions và applicable human Product loop trước formal Technical Implementation Compliance/VERIFY/QA, giữ nguyên Gate 1/2/3, Sensitive Design Gate, QA và finish; xác nhận bằng scoped diff và sequence/table inspection không có canonical stage mới.
- [x] 1.2 Trong `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, định nghĩa Tasks record `POST_APPLY_DEVELOPMENT_FEEDBACK` với candidate, applicability, scope, environment/runtime, evidence/reason, blocker; phân biệt operational pending với assessed `YES | NO | NOT_APPLICABLE` cho từng assertion; xác nhận bằng schema/field inspection đối chiếu Design mục 2.
- [x] 1.3 Ghi deterministic applicability cho interactive UI, interactive non-UI service, pure library, docs/governance và infrastructure có/không manual flow; `NO` vì thiếu setup không biến thành `NOT_APPLICABLE`; xác nhận bằng scenario A–D và review field rules.
- [x] 1.4 Định nghĩa `HUMAN_PRODUCT_VALIDATION` record và `LOCAL_CORRECTION` → targeted check → human relook; route `SCOPE_CHANGE_REQUIRES_REVIEW` về owning gate khi đổi semantics/authority/contract/acceptance; xác nhận bằng scenario K–L và việc record không thành QA/TIC/VERIFY/Gate 3 verdict.
- [x] 1.5 Liên kết workflow procedure tới Control Tower anti-loop owner; nêu lineage, occurrence context, recovery/generation accounting, stop record và bốn human dispositions theo Design mà không tạo policy cạnh tranh trong hai workflow docs; xác nhận bằng cross-source review và scenario G–J.
- [x] 1.6 Ghi Development Usability độc lập với Production Readiness/Release/Deploy, strict `ACCEPT_LIMITATION` không sửa QA/history/mandatory evidence; xác nhận bằng scenario J/M và review gate-readiness text.
- [x] 1.7 Ghi adoption event, grandfathering, opt-in và ngoại lệ **chỉ** cho checkpoint mới đối với earliest-missing-gate rule; bảo vệ chính governance change khỏi bootstrap loop; xác nhận bằng scenario D–F và không thay earlier-gate invalidation rule.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 1

- **Boundary/owner:** repository workflow governance; Workflow v3 sở hữu canonical human sequence, Automated Workflow sở hữu detailed procedure/record. Không chạm runtime/data/security/QA owner.
- **Authority:** root `AGENTS.md`, `docs/AUTHORITY_MODEL.md`, current Workflow v3, Automated Workflow, QA Protocol, lifecycle/operations authorities, approved Proposal/Analysis/Gate 1/Design.
- **Allowed files:** `docs/YUTA_WORKFLOW_V3.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`; checkbox/evidence updates trong chính `openspec/changes/development-usability-and-iteration-control/tasks.md` sau Apply authorization.
- **Forbidden files:** global protection table; đặc biệt QA Protocol, lifecycle, operations, OpenSpec schema/config/specs. Không sửa Prompt/skill trong phase này.
- **Scope/obligations:** implement approved concepts 1–14 của Phase 1 request; policy direction đúng owner; không thêm stage, gate, status, risk taxonomy hoặc production entitlement. Không nới Gate 1/2/3, TIC, VERIFY, QA, Browser QA, Sensitive Design Gate, finish, sync/archive hoặc deployment authority.
- **Targeted checks:** exact scoped diff/preimage attribution; field/sequence inspection; scenario A–F/J/M; `pnpm docs:check` sau khi file thay đổi và side-effect preflight; broader checks ở Phase 4.
- **Stop/escalation:** cần đổi QA vocabulary, lifecycle dimensions, schema/config, Production/Deployment authority, canonical owner hoặc approved Design → `NEEDS_REVIEW` tại owning gate trước edit ngoài allowlist.
- **Completion evidence:** file diff với bản gốc/dirty attribution, mapping tasks 1.1–1.7 tới headings và Design, scenario observations, exact command/result khi chạy; checkbox chỉ hoàn tất khi nghĩa vụ và evidence có thật.

### Phase 1 execution evidence — 2026-09-24

Chỉ Phase 1 đã được Apply. Pre-Apply Design và Tasks/TIC lần lượt khớp approved SHA-256 `91dea8fdf6df5faa451a484b9163f61bde3dc53a55e06549b03825c4d8740b3f` và `7a35a39bd9c877250ba485fc385fc32a62b6680aeceb088769743bb173982c41`. Hai target đã có unrelated working-tree edits đúng planning-time SHA-256 của bảng trên; pre-existing hunks về no-spec finalization/$yuta-finish-change vẫn hiện nguyên trong final scoped diff. Không reset, stage hoặc nhận chúng là work của Phase 1. Current Phase 1 content SHA-256: Workflow v3 `f9d56d874751e4ab4fa93c649f6118566107bed7e6a9b4b0cb1b0a7ff549ea55`; Automated Workflow `ac7f75d0521dfe5dd8c80ff4acaa181b02a8c354015db5e7dd8e0e99645572ca`.

| Scenario | Bounded Phase 1 document-contract observation (không phải future behavioral VERIFY) |
| --- | --- |
| A | Interactive UI row đòi real local/dev route, handoff/human feedback trước formal checks; workflow diagram không thêm stage. |
| B | Interactive non-UI service/CLI/endpoint có manual dev flow vẫn applicable dù không browser. |
| C | Pure deterministic library cho hai reasoned N/A riêng; technical tests/VERIFY giữ nguyên. |
| D | Docs/governance không có flow có thể N/A; chính governance change này ở pre-adoption, không bootstrap. |
| E | Active pre-Apply tại successful authorized finalization/archive dùng checkpoint khi applicable. |
| F | Active Apply/VERIFY/QA không auto rewind; opt-in cần explicit human instruction; old gates vẫn earliest-missing. |
| G | Wording/wrapper/restart không reset lineage hoặc generation bucket. |
| H | Hai failed recovery action/observation pairs hết default recovery budget và dừng trước retry tiếp theo. |
| I | Ba actual equivalent generations gồm initial run; read-only diagnosis/rejected preflight không đếm sai. |
| J | `ACCEPT_LIMITATION` chỉ với approved criterion; mandatory missing evidence vẫn blocked, không biến FAIL/BLOCKED thành PASS. |
| K | Copy/layout/focus chỉ `LOCAL_CORRECTION` khi giữ approved semantics; targeted checks rồi human retest. |
| L | Auth/schema/API/business-semantic delta ghi `SCOPE_CHANGE_REQUIRES_REVIEW` ở owning gate. |
| M | `DEV_USABLE = YES` cùng production blocked hợp lệ; Release/Deploy vẫn owner riêng. |

Checks thực tế: `pnpm docs:check` PASS (36 current documents); strict `pnpm exec openspec validate development-usability-and-iteration-control --type change --strict --json --no-interactive` PASS (1/1, no-spec INFO); `git diff --check -- docs/YUTA_WORKFLOW_V3.md docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` PASS; targeted `pnpm exec prettier --check` trên hai allowed files PASS. `pnpm format:check` repository-wide FAIL vì 83 files; warning của allowed Automated Workflow chỉ là hai bảng mới và đã sửa bằng targeted Prettier sau khi so sánh exact formatting diff, không normalize pre-existing hunk. Các warning còn lại thuộc ngoài Phase 1; không sửa. `pnpm architecture:check` và recursive typecheck không chạy trong scope Phase 1 docs-only theo current Phase 1 TIC và user instruction; Phase 4 vẫn có plan. Đây là targeted Apply evidence, **không** là formal Technical Implementation Compliance, VERIFY, QA hoặc Gate 3.

## 2. Integration / Regression — Control Tower, Page and handoff propagation

- [x] 2.1 Trong Control Tower Operating Prompt, mở rộng **existing** anti-loop/evidence-stop rule bằng affected claim + blocker class + evidenced causal cause, provisional reconciliation, recovery max 2, execution max 3 gồm initial actual run, stage/purpose bucket, stop triggers và bốn human decisions; xác nhận scenario G–I và không có rule thứ hai/Gate 4.
- [x] 2.2 Trong cùng Control Tower owner, ràng buộc `ACCEPT_LIMITATION` với approved `KNOWN_EVIDENCE_LIMITATION`, giữ mandatory missing evidence và Gate 3 status thật; route checkpoint/Product feedback và production lane riêng; xác nhận scenario J/M và preserved Gate 3/evidence-limitations prose.
- [x] 2.3 Trong Page Chat prompt, thêm carry-through của checkpoint/candidate/human feedback, lineage/counters và escalation tới Control Tower mà không tự đặt budget hoặc quyết định limitation; xác nhận bằng field-by-field comparison với owner docs.
- [x] 2.4 Trong handoff template, thêm các field tham chiếu Tasks record, candidate, applicable status, human relook, lineage/count và pending stop decision; không chép policy; xác nhận bằng filled examples A/F/H/J và không có self-approval field.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 2

- **Boundary/owner:** Control Tower prompt là anti-loop/stop authority; Page Chat và handoff chỉ chuyển trạng thái/evidence qua workflow. Không đổi Product runtime hoặc persistence.
- **Authority:** root `AGENTS.md`, current Control Tower v3.1/Page Chat v3.1/handoff, Workflow v3 và Automated Workflow sau Phase 1, approved Gate 1/Design; QA/production authority chỉ để bảo vệ boundary.
- **Allowed files:** `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`, `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`, `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md`; checkbox/evidence updates trong chính `tasks.md`.
- **Forbidden files:** Phase 1 workflow docs (đã là owner, chỉ đọc/đối chiếu ở phase này), skill và global protection table. Nếu Phase 1 cần correction thật, re-evaluate approved scope và attribution trước một edit mới; không âm thầm vượt allowlist phase.
- **Scope/obligations:** counter transitions đúng Design; wording/restart không reset; no self-exception; `FIX`, `ACCEPT_LIMITATION`, `SPLIT_CHANGE`, `DEFER_OR_CLOSE` là human decisions duy nhất; preserve current Gate 3 và evidence-limitation semantics. Page/handoff không tạo authority cạnh tranh.
- **Targeted checks:** scoped diff, consistency search cho values/budgets/owners, scenario G–J/M, handoff sample review; `pnpm docs:check` sau side-effect preflight.
- **Stop/escalation:** conflict với existing Control Tower Gate 3/limitation authority, cần thêm decision/status/gate hoặc thay mandatory criteria → `NEEDS_REVIEW` trước rộng scope.
- **Completion evidence:** three-file attributed diff, exact source/derived mapping, scenario traces và command results; không gán fabricated approval.

### Phase 2 execution evidence — 2026-09-24

Pre-Apply Design SHA-256 `91dea8fdf6df5faa451a484b9163f61bde3dc53a55e06549b03825c4d8740b3f` và accepted Phase 1 Tasks execution hash `c05b6a34ec1864d76d3a9664a18842b242fd84caa29941627ce3316f3a77ccc4` khớp. Phase 1 canonical file hashes không đổi: Workflow v3 `f9d56d874751e4ab4fa93c649f6118566107bed7e6a9b4b0cb1b0a7ff549ea55`, Automated Workflow `ac7f75d0521dfe5dd8c80ff4acaa181b02a8c354015db5e7dd8e0e99645572ca`. Ba allowed Phase 2 files đều đã dirty trước Apply, đúng planning-time SHA-256 trong bảng trên. Các hunks v3.1 hiện hữu về Gate 3 limitations, historical truth và finish closure vẫn nguyên; Phase 2 chỉ thêm facts/anti-loop extension và owner references, không nhận unrelated edits là work mới.

| Phase 2 target | Post-Apply SHA-256 | Ownership/evidence |
| --- | --- | --- |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | `cbc8209074d3ba7a5fc511ccdb78eecfca2d8f2357338fe941cff53ad293b4bb` | Bổ sung checkpoint intake và mở rộng **cùng** Anti-loop / evidence stop rule với lineage, 2/3 counters, conditional stop packet/four human decisions; existing Gate 3 section giữ nguyên. |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md` | `d6651a7c3a7b7db7bd43812e66d759444780e49edc4b8e72e61f1103ca2afb38` | Carry current candidate/checkpoint/feedback/lineage facts; refer Control Tower owner, no independent budget/limitation/QA decision. |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | `cbe09ca5e8476d944fc59336b0ef26b2e53c486d9e76ea8072fc3415d50c0c35` | Thêm structured transport fields và owner notice; không tạo status/rule mới. |

Bounded document/handoff walkthrough (not actual Product observations or formal VERIFY): A — candidate + two assertions + human response location is carried without a new stage; F — active Apply/VERIFY/QA target carries opt-in reference or remains grandfathered, no backfill; G — changed wording uses same lineage and counters; H — recovery `2/2` yields pending human stop packet before another default attempt; I — initial actual run is `1/3`, rejected preflight/ordinary diagnosis leaves count unchanged; J — missing mandatory Browser QA remains blocking despite requested `ACCEPT_LIMITATION`; M — `DEV_USABLE = YES` and production blocked remain separate facts. Example handoff fields also retain historical FAIL/BLOCKED and identify the owner for any requested human decision; no self-approval is inferred.

Checks executed: targeted `pnpm exec prettier --check` on the three Phase 2 files PASS; `pnpm docs:check` PASS (36 current documents); `pnpm exec openspec validate development-usability-and-iteration-control --type change --strict --json --no-interactive` PASS (1/1, no-spec INFO); scoped `git diff --check` PASS; consistency search verified one Control Tower anti-loop owner, exact defaults 2/3 there, initial actual generation 1, four decisions, limitation guard, adoption and production separation. Phase 1 repository-wide `pnpm format:check` failure with 83 warnings remains historical; not rerun, not relabeled PASS. `pnpm architecture:check` is not Phase 2 TIC-required and was not run. Phase 3 skill, Phase 4 VERIFY and QA remain untouched/unperformed.

## 3. Integration / Regression — `yuta-run-change` orchestration

- [x] 3.1 Thêm post-Apply applicability/record flow trong `.agents/skills/yuta-run-change/SKILL.md`: dùng existing Tasks section, candidate/evidence reference, pending versus assessed values và no fake N/A; xác nhận scenario A–D và static skill inspection.
- [x] 3.2 Thêm human Product validation stop/resume, candidate-change stale detection, feedback disposition, bounded `LOCAL_CORRECTION`/targeted checks/human relook và `SCOPE_CHANGE_REQUIRES_REVIEW`; xác nhận scenario A/K/L và không infer verdict từ tests/silence.
- [x] 3.3 Thêm ledger đọc/ghi qua Tasks, provisional lineage reconciliation và exact recovery/execution transitions; giữ history qua restart, wording và stage/purpose changes; xác nhận scenario G–I và counter table của Design.
- [x] 3.4 Thêm `ITERATION_STOP_CONTROL` preflight trước equivalent retry, stop record/handoff tại existing gate, human decision routing và mandatory `ACCEPT_LIMITATION` guard; xác nhận scenario H–J và no self-issued extra budget.
- [x] 3.5 Thêm deterministic adoption/grandfathering/explicit opt-in sử dụng successful finalized/archive event, giữ earliest-missing-gate cho gate cũ và historical evidence; xác nhận scenario D–F bằng hồ sơ mẫu có/thiếu phase-at-event evidence.
- [x] 3.6 Chặn recursive bootstrap: change này dùng pre-adoption workflow cho tới chính finalization/archive của nó; không đòi checkpoint mới để hoàn tất nó; xác nhận scenario governance self-change và không bypass existing TIC/VERIFY/QA/Gate 3.
- [x] 3.7 Trước formal Technical Implementation Compliance/VERIFY/QA, enforce required post-Apply state cho adopted changes; future Gate 3 hash current Tasks như planning artifact theo integrity hiện có nhưng không dùng human Product verdict làm Gate 3 evidence/readiness; xác nhận static path trace và việc `yuta-finish-change` hiện kiểm planning artifact hash mà không sửa skill đó.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 3

- **Boundary/owner:** executable agent orchestration của active OpenSpec change. Skill triển khai Workflow v3/Automated Workflow và Control Tower rule; nó không là Product, anti-loop hoặc finalization authority.
- **Authority:** root `AGENTS.md`, `.agents/skills/yuta-run-change/SKILL.md`, `.agents/skills/yuta-finish-change/SKILL.md` (read-only integrity), Workflow/Automated Workflow và prompts sau Phase 1–2, approved Gate 1/Design, current OpenSpec artifact graph/instructions.
- **Allowed files:** `.agents/skills/yuta-run-change/SKILL.md`; checkbox/evidence updates trong chính `tasks.md`. Không thêm script, fixture, DB hoặc file persistence mới theo plan hiện tại.
- **Forbidden files:** `.agents/skills/yuta-finish-change/SKILL.md`, generated `.agents/skills/openspec-*/**`, schema/config, runtime/app files và global protection table.
- **Scope/obligations:** preserve earlier packet hash integrity, earliest missing gate, conditional Design, existing Gate 3 readiness, no-spec branch, sync/archive boundary. Record trong Tasks, không global blocker database/hidden automation. `yuta-finish-change: NO_CHANGE` vì current finish rechecks exact Tasks planning hash; nếu thực tế sai thì STOP `NEEDS_REVIEW`.
- **Targeted checks:** static review của state transitions và existing finish hash path; bounded dry-run scenarios A–M; `pnpm docs:check` chỉ nếu docs dependency checker cover skill links; Phase 4 repository checks.
- **Stop/escalation:** không thể enforce checkpoint với existing Tasks/integrity, cần đổi finish skill/permission/API/durable boundary, hoặc new policy tự khóa change này → STOP `NEEDS_REVIEW`; không sửa finish.
- **Completion evidence:** one-file scoped skill diff, transition/scenario record, exact Tasks-hash integrity inspection, no forbidden diff và truthful targeted command results.

Phase 3 Apply evidence (bounded static transition walkthrough, **not** runtime Product observation, behavioral skill test, formal VERIFY or QA): `yuta-run-change/SKILL.md` pre-Apply clean SHA-256 `17c3ac53292f81d4e45b8b3e56c7d4efcfa07a0612564194f808eed2f81311b9`; post-Apply SHA-256 `52b2e9a8dcc234f1d99e82f853615d9a576ee009a006e91b8a8ac07a7748128d`. The scoped diff adds only its prospective adoption (§ Inputs), conditional Apply procedure, iteration ledger, VERIFY precondition and stop condition. Existing earliest-gate, packet-hash, conditional Design, no-spec, QA and Gate 3 paths remain. `yuta-finish-change/SKILL.md` stayed unchanged at `90522895c23e6d4e7943344e915be94cdfe15a40bc7b3951387e349e3225ce8f`; its existing active integrity step recomputes **every planning artifact hash** (lines 79–88), so current Tasks can use existing Gate 3 hashing without a finish-skill edit.

| Phase 3 scenario | Static input and traced outcome in the edited skill |
| --- | --- |
| A — interactive UI | `REQUIRED`, real route and candidate → both assertions applicable; actual use/handoff then `AWAITING_RESPONSE` stops before VERIFY until human verdict (lines 373–410, 483–486). |
| B — pure library | No operable flow → independent reasoned `NOT_APPLICABLE` values; technical VERIFY still applies (lines 388–397, 478–486). |
| C — interactive non-UI service | Real CLI/endpoint manual flow → no browser does not imply N/A; assess each assertion (lines 387–400). |
| D — human response pending | Current candidate `AWAITING_RESPONSE` → preserve pending request and stop; no test/silence-derived acceptance (lines 375–379, 405–411, 483–486). |
| E — local correction | Human `CHANGES_REQUESTED`, implementation-only fix within approved semantics → scoped candidate/diff, targeted check, affected retest, wait for new human verdict; ledger persists (lines 412–423, 431–455). |
| F — scope change | Requested auth/schema/API/business/acceptance change → `SCOPE_CHANGE_REQUIRES_REVIEW`, owning earlier authority, no stale Apply approval (lines 414–423). |
| G — two failed recoveries | Initial equivalent actual run = generation 1/recovery 0; corrective action with same blocker on run 2 = generation 2/recovery 1; another on run 3 = generation 3/recovery 2; preflight stops before third recovery (lines 446–467). |
| H — three generations | Same stage and evaluator purpose with three actual runs → bucket 3/3; no fourth default run (lines 446–467). |
| I — read-only diagnosis | No equivalent evaluator execution → recovery and generation counters unchanged (lines 446–455). |
| J — rejected preflight | Preflight rejects before execution → neither counter advances (lines 446–455). |
| K — resume | Read existing Tasks first; preserve candidate history, actual human decision, lineage and counts; no duplicate pending request or reset (lines 375–385, 438–455). |
| L — mandatory evidence limitation | `ACCEPT_LIMITATION` request while Browser QA/other mandatory evidence missing → no PASS conversion; affected gate remains blocked (lines 469–476). |
| M — already-in-Apply at event | Existing phase proof → `GRANDFATHERED`; no checkpoint backfill or rewind absent named/scope human opt-in; older gate rules still run (lines 87–103). |
| N — active pre-Apply at event | Existing phase proof → `REQUIRED`; post-Apply controls run for its candidate; missing phase proof → `NEEDS_REVIEW` (lines 87–103, 371–379). |
| O — governance self-change | Even with edited skill present, this change remains pre-adoption through its own authorized finish/archive; no recursive record; existing TIC/VERIFY/QA/Gate 3 retained (lines 77–85, 102–103, 478–610). |

Phase 3 checks actually run: targeted `pnpm exec prettier --check .agents/skills/yuta-run-change/SKILL.md` initially reported formatting issues, then `pnpm exec prettier --write .agents/skills/yuta-run-change/SKILL.md` corrected only this allowed file; repeat targeted check PASS. `pnpm exec openspec validate development-usability-and-iteration-control --type change --strict --json --no-interactive` PASS (1/1; expected no-spec INFO). Scoped `git diff --check -- .agents/skills/yuta-run-change/SKILL.md` PASS. Read-only `pnpm exec prettier --check openspec/changes/development-usability-and-iteration-control/tasks.md` FAIL: Prettier differs both before and after the Phase 3 section as well as its added table; whole-file normalization would exceed the authorized Phase 3 evidence edit, so it was not written. Static tool inventory found no `yuta-run-change` behavioral validation command; `scripts/engineering-skills/acceptance.test.mjs` covers other primitives. `pnpm docs:check` was not run because current documentation checker does not include skill links. Phase 3 TIC does not require `pnpm architecture:check`; not run. Whole-repository `pnpm format:check` historical Phase 1 failure with 83 warnings was not rerun or relabeled. No behavioral harness, real Product observation, formal Technical VERIFY or QA was performed; Phase 4 remains unauthorized.

## 4. Integration / Regression — Consistency and future Technical VERIFY

- [x] 4.1 Sau Apply được phép, kiểm six-surface consistency cho checkpoint names/values/pending, applicability, lineage, budgets, four decisions, limitation, adoption và production separation; xác nhận inventory dẫn tới owner, không duplicate normative rule.
- [x] 4.2 Thực hiện bounded scenario A–F với current candidate và ghi input, expected theo approved Design, actual skill/doc behavior, evidence, deviation; không mô tả dry-run reasoning là real runtime QA.
- [x] 4.3 Thực hiện bounded scenario G–M, gồm actual first execution, diagnosis/preflight, two failed recoveries, three generations, wording change, mandatory evidence blocker, correction/scope change và `DEV_USABLE = YES` cùng production blocked; ghi mỗi transition và counter.
- [x] 4.4 Sau side-effect preflight, chạy `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, `pnpm format:check` và `pnpm exec openspec validate development-usability-and-iteration-control --type change --strict --json --no-interactive`; ghi exact command/result, baseline-caused failures, skipped checks và không claim PASS khi required evidence thiếu.
- [x] 4.5 Lập future TIC Compliance Matrix cho phase 1–4 và Proposal/Analysis/Gate 1 → Design → task/owner → changed path → verification evidence; review `git diff --check`, scoped diff/hash và forbidden-path status, giữ unrelated dirty work tách biệt.
- [x] 4.6 Sau Technical VERIFY mới quyết QA theo actual implementation: nếu vẫn governance docs/skill-only và không có distinct user/runtime QA dimension, ghi có lý do `QA: NOT_APPLICABLE`; nếu surface thay đổi, reclassify và làm applicable QA. Chỉ chuẩn bị Gate 3 theo workflow hiện có khi TIC, VERIFY và QA disposition trung thực; không tự approve/sync/archive/deploy.

### TECHNICAL IMPLEMENTATION CONTRACT — Phase 4

- **Boundary/owner:** integration/regression and technical evidence; no additional product/runtime owner. QA Protocol owns QA classification; run skill owns Gate 3 assembly, finish owns finalization.
- **Authority:** root `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, Workflow v3, Automated Workflow, QA Protocol, approved Gate 1/Design và Phase 1–3 TIC; repository `package.json` scripts và verified `openspec validate --help` syntax.
- **Allowed files:** chỉ checkbox/evidence updates trong `openspec/changes/development-usability-and-iteration-control/tasks.md` cho phase này. Future `docs/reviews/development-usability-and-iteration-control/03-final-review.md` chỉ tại Gate 3 theo separate workflow authority, không tạo trong phase Tasks/TIC này.
- **Forbidden files:** toàn bộ six implementation targets chỉ đọc trong phase này (correction phải quay lại phase owner và attribution), global protection table, QA evidence giả và release/deploy output.
- **Scope/obligations:** check tất cả 13 scenarios; technical assertions không thay QA; exact current source/hash mapping, scoped dirty-checkout attribution, no failure relabel; preserved no-spec branch. `scripts/engineering-skills/acceptance.test.mjs` test năm primitive khác, không là proof cho `yuta-run-change`, nên không liệt kê như required check. Nếu targeted host behavioral tooling không tồn tại/không được authorize, ghi limitation và static/dry-run evidence đúng cấp độ.
- **Required later checks:** commands trong task 4.4 thực sự có trong root manifest hoặc verified CLI help; `git diff --check`/status/hash và targeted `rg` inspection. Trước execute wrapper phải inspect side effects/cache/subprocess/network. Không chạy các lệnh đó trong turn Tasks/TIC.
- **Stop/escalation:** command failure, unisolatable pre-existing diff, absent required evidence, semantic contradiction, newly sensitive boundary hoặc QA dimension → truthful `NEEDS_REVIEW`/current gate; không tự sửa Plan, QA Protocol hoặc Product authority.
- **Completion evidence:** 13-row scenario record, full exact command/exit inventory, Technical Compliance Matrix, scoped diff/path/hash manifest, QA applicability rationale và future VERIFY result riêng; Gate 3 cần human review sau đó.

## Design decision → task and verification trace

| Approved decision (Analysis/Gate 1/Design) | Implementation owner/tasks | Verification owner/scenarios |
| --- | --- | --- |
| Canonical owner map, no parallel authority | Workflow docs 1.1/1.5; prompts 2.1–2.4; skill 3.7 | 4.1/4.5, six-surface owner inspection |
| `DEV_USABLE`/`MANUAL_TEST_READY`, pending, Tasks record | Automated Workflow 1.2/1.3; skill 3.1 | 4.1/4.2, A–D |
| Human Product validation, bounded correction and relook | Automated Workflow 1.4; Page/handoff 2.3/2.4; skill 3.2 | 4.2/4.3, A/K/L |
| Lineage and recovery/generation transitions | Workflow routing 1.5; Control Tower 2.1; skill 3.3 | 4.3, G/H/I |
| Stop triggers/four human decisions | Workflow 1.5; Control Tower 2.1; skill 3.4 | 4.3, H/I/J |
| `ACCEPT_LIMITATION` cannot waive mandatory evidence | Workflow 1.6; Control Tower 2.2; skill 3.4 | 4.3, J |
| Development usability independent of production | Workflow 1.1/1.6; Control Tower 2.2 | 4.1/4.3, M |
| Adoption, grandfathering and earliest-gate exception | Workflow 1.7; skill 3.5/3.6 | 4.2, D/E/F plus bootstrap case |
| `yuta-finish-change: NO_CHANGE`, Tasks-hash integrity | skill 3.7 (read-only finish check) | 4.5, current finish planning-hash path |
| No new stage/status/schema/QA/risk taxonomy | all phases' TIC/global guard | 4.1/4.5/4.6, forbidden-path diff |

## Bounded scenario verification matrix

| ID | Scenario | Required expected observation |
| --- | --- | --- |
| A | Interactive UI | Real post-Apply assertions and human response precede formal TIC/VERIFY/QA; no stage created. |
| B | Interactive non-UI service | Real manual dev flow is applicable despite no browser UI. |
| C | Pure library | Both assertions may be reasoned `NOT_APPLICABLE`; technical checks remain. |
| D | Governance/docs only | Adopted future governance can use reasoned N/A; this change itself stays pre-adoption. |
| E | Active pre-Apply at adoption | New applicable checkpoints required after event. |
| F | Already Apply/VERIFY/QA at adoption | No auto rewind; only explicit human opt-in. |
| G | Same blocker, changed wording | Same lineage/history and counter bucket. |
| H | Two failed recovery attempts | Stop before third default recovery; human decision required. |
| I | Three actual equivalent generations | Initial run is 1; read-only diagnosis/rejected preflight do not consume count. |
| J | `ACCEPT_LIMITATION` with mandatory missing evidence | Affected gate stays blocked; no PASS/QA rewrite. |
| K | Bounded copy/layout/focus correction | Within approved semantics, targeted checks then human relook. |
| L | Auth/schema/API/business-semantic change | `SCOPE_CHANGE_REQUIRES_REVIEW` to owning gate. |
| M | `DEV_USABLE = YES`, production blocked | Both facts coexist; no deployment/readiness promotion. |

`SENSITIVE_DESIGN_GATE = NOT_TRIGGERED` vẫn đúng cho docs/skill governance với không đổi durable/security/data/runtime boundary. Nếu implementation đòi thay mandatory acceptance rule hoặc boundary nhạy cảm, dừng và reassess. QA ở đây chỉ là plan; không ghi final `QA: PASS` hay `NOT_APPLICABLE` trước actual classification. Khi Apply/VERIFY đến sau này, mọi failure và historical evidence phải giữ nguyên truth.

## Phase 4 — Technical Compliance và formal VERIFY (2026-09-24)

### Integrity, attribution và evidence level

Phase 4 được human authorize riêng; đây là technical verification của candidate Phase 1–3, không phải Gate 3. Trước VERIFY, Design SHA-256 `91dea8fdf6df5faa451a484b9163f61bde3dc53a55e06549b03825c4d8740b3f` và Tasks execution-state SHA-256 `b140d5ca461677137566eb6be5f05d14df3bfe6851a08196ab353a6adf048026` khớp instruction. `HEAD = 14dd0f35645586abc5877da28df0fcd16eba971d`. Working tree dirty có Pointage, Product Version, PDF và các work khác; chỉ Tasks của change này được sửa trong Phase 4. Exact post-phase hashes hiện tại:

| Phase / surface                                              | Current SHA-256                                                    | Accepted match  |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | --------------- |
| 1 — `docs/YUTA_WORKFLOW_V3.md`                               | `f9d56d874751e4ab4fa93c649f6118566107bed7e6a9b4b0cb1b0a7ff549ea55` | YES             |
| 1 — `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`                 | `ac7f75d0521dfe5dd8c80ff4acaa181b02a8c354015db5e7dd8e0e99645572ca` | YES             |
| 2 — `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | `cbc8209074d3ba7a5fc511ccdb78eecfca2d8f2357338fe941cff53ad293b4bb` | YES             |
| 2 — `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`     | `d6651a7c3a7b7db7bd43812e66d759444780e49edc4b8e72e61f1103ca2afb38` | YES             |
| 2 — `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | `cbe09ca5e8476d944fc59336b0ef26b2e53c486d9e76ea8072fc3415d50c0c35` | YES             |
| 3 — `.agents/skills/yuta-run-change/SKILL.md`                | `52b2e9a8dcc234f1d99e82f853615d9a576ee009a006e91b8a8ac07a7748128d` | YES             |
| Read-only — `.agents/skills/yuta-finish-change/SKILL.md`     | `90522895c23e6d4e7943344e915be94cdfe15a40bc7b3951387e349e3225ce8f` | YES / NO_CHANGE |

Sáu implementation targets là exact accepted bytes, nhưng năm governance docs đã dirty trước change: toàn bộ diff của chúng so với HEAD **không** được nhận là diff mới của change này. Attribution của additions dùng planning-time preimages, Phase 1–3 post-hashes và phase execution records ở trên; không gán các hunks cũ thành implementation mới. `yuta-finish-change` giữ nguyên và active integrity step của nó recompute mọi planning artifact hash, gồm Tasks. OpenSpec CLI báo `yuta-spec-driven`, Specs `skipped`, 18/24 trước Phase 4. Formal evidence ở đây là deterministic/static text, hash, diff và command results; không phải behavioral execution của agent trong một future change, Product observation, Browser QA, deployment hoặc production proof.

### Six-surface consistency và Technical Compliance Matrix

Evidence abbreviations: W = `docs/YUTA_WORKFLOW_V3.md:260-340`; A = `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md:238-385`; C = Control Tower prompt `:72-153`; P = Page Chat prompt `:58-89`; H = handoff template `:81-100`; R = `yuta-run-change/SKILL.md:77-103,371-520`. Proposal/Analysis, approved Gate 1 packet, approved Design và Tasks 1.1–3.7 là input contract. `PASS` dưới đây nghĩa là contract được phản ánh đúng ở exact static candidate; evidence disposition `CURRENT_DETERMINISTIC_SUFFICIENT`, không phải observed host behavior.

| #   | Approved Design/TIC claim → owner/tasks                                                                       | Implementation/evidence                                                                    | Technical status / limit                        |
| --- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1   | Không thêm canonical stage/gate → W 1.1, C 2.1, R 3.7                                                         | W giữ Apply→VERIFY→QA→Gate 3; A đặt checkpoint trong Apply; C/R nói stop tại existing gate | PASS static                                     |
| 2   | `DEV_USABLE` YES/NO/N/A; pending unassessed → A 1.2–1.3, R 3.1                                                | A:251-277; C/P/H carry facts; R:394-400 cần actual dev observation cho YES                 | PASS static; no Product runtime tested          |
| 3   | `MANUAL_TEST_READY` riêng, handoff đầy đủ → A 1.2–1.3, R 3.1                                                  | A:266-277; H:81-88; R:401-405                                                              | PASS static                                     |
| 4   | Human validation candidate-bound, awaiting không là verdict → A 1.4, P/H 2.3–2.4, R 3.2                       | A:290-299; R:405-423; C/P/H transport; không có automatic acceptance                       | PASS static                                     |
| 5   | `LOCAL_CORRECTION` trong approved boundaries, khác scope review → A 1.4, R 3.2                                | A:302-314; C:75-85; P:68-75; R:412-423                                                     | PASS static                                     |
| 6   | Causal blocker lineage = claim/class/root cause; stage/purpose occurrence → C 2.1, R 3.3                      | C:87-96; A:329-344; R:437-455; provisional reconciliation                                  | PASS static                                     |
| 7   | Failed recovery max 2; action + same blocker observation → C 2.1, R 3.3                                       | C:97-113; A:345-360; R:446-455; diagnosis không consume                                    | PASS static                                     |
| 8   | Actual generation max 3; initial run = 1 → C 2.1, R 3.3                                                       | C:97-113; A:345-360; R:446-455; rejected preflight = 0                                     | PASS static                                     |
| 9   | `ITERATION_STOP_CONTROL` conditional record, no Gate 4/QA state → W 1.5, C 2.1, R 3.4                         | W:306-325; A:325-375; C:87-130; R:459-476                                                  | PASS static                                     |
| 10  | Human decisions exactly FIX/ACCEPT_LIMITATION/SPLIT_CHANGE/DEFER_OR_CLOSE → C 2.1, R 3.4                      | C:129-143; A:366-375; R:465-476; P/H only carry                                            | PASS static                                     |
| 11  | `ACCEPT_LIMITATION` cannot waive mandatory evidence/rewrite history → W 1.6, C 2.2, R 3.4                     | A:375-384; C:137-144; R:469-476; QA authority unchanged                                    | PASS static                                     |
| 12  | Resume preserves candidate, verdict, lineage, counts, outcomes → A 1.2/1.5, R 3.2–3.3                         | A:251-260,329-360; R:375-385,437-455                                                       | PASS static; future agent compliance unobserved |
| 13  | Event adoption/grandfathering/explicit opt-in → W 1.7, R 3.5                                                  | W:327-341; A:105-131; C:146-151; R:77-103                                                  | PASS static                                     |
| 14  | Earliest-missing-gate exception only new controls → W 1.7, R 3.5                                              | W:337-341; A:125-131; R:99-103                                                             | PASS static                                     |
| 15  | Governance self-change pre-adoption through archive → W 1.7, R 3.6                                            | W:330-335; A:111-119; C:147-149; R:77-85                                                   | PASS static                                     |
| 16  | Dev usability independent of production → W 1.6, C 2.2, R 3.7                                                 | W:298-302; A:316-320; C:152-153; P:89; H:89; R:429-431                                     | PASS static                                     |
| 17  | Authority direction: W human, A procedure, C decision, P/H transport, R orchestration → 1.1/1.5, 2.1–2.4, 3.7 | Cross-source links and no contradictory owner; P:80-89 expressly defers to C               | PASS static                                     |
| 18  | `yuta-finish-change = NO_CHANGE`; current Tasks hash integrity → Design §9, R 3.7                             | Exact unchanged hash above; finish skill:79-88 hashes every planning artifact              | PASS static                                     |
| 19  | QA vocabulary/mandatory Browser QA unchanged → global protection, R 3.7                                       | `docs/YUTA_QA_PROTOCOL.md` unmodified by this change; C/A/R explicitly keep QA separate    | PASS static                                     |
| 20  | Product Version and runtime/data/schema paths outside scope → global protection                               | No Phase 4 edit outside Tasks; six accepted surface hashes preserved                       | PASS scoped isolation                           |

Coverage of Phase 1–4: Phase 1 W/A supply the human workflow and record/count procedure (rows 1–3,5–9,11–16); Phase 2 C/P/H supply anti-loop authority and transport (rows 4–11,16–17); Phase 3 R executes adoption, checkpoint, retry and VERIFY preconditions (rows 2–18); Phase 4 hashes, static mapping, scenario traces and checks supply verification (all rows). Proposal/Analysis and Gate 1 approved no-spec governance scope; Design SHA above is the technical contract; Tasks 1.1–4.6 connect owners to these paths and evidence. No Product capability spec or normative spec sync was manufactured.

### Bounded scenario trace A–O

Each input is a hypothetical future-change state. “Observed” means the current authority/orchestrator text deterministically routes that state; no agent host or Product runtime was executed. Evidence disposition for every row: **`CURRENT_DETERMINISTIC_SUFFICIENT` for this governance-text contract; behavioral operation of a future agent remains unobserved**.

| ID  | Input; expected transition                                                                                                | Observed static route and evidence                                                                                   | Deviation |
| --- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------- |
| A   | Adopted interactive UI candidate; actual local/dev use + handoff, then human response before VERIFY                       | A:263-299; R:394-411,483-486 requires two assessed assertions and `AWAITING_RESPONSE` stop, no new stage             | NONE      |
| B   | Pure library, no operable flow; separate reasoned N/A, technical VERIFY still required                                    | A:278-289; R:388-405,479-520                                                                                         | NONE      |
| C   | Interactive non-UI CLI/endpoint; browser absence does not imply N/A                                                       | A:278-289; R:387-405 evaluates real manual flow and human Product judgement when relevant                            | NONE      |
| D   | Exact candidate with `AWAITING_RESPONSE`; no silence/test-derived acceptance                                              | A:290-299; R:375-385,405-411,483-486 retains pending request and stops                                               | NONE      |
| E   | `CHANGES_REQUESTED` for in-scope copy/focus fix; targeted checks and affected human relook                                | A:302-314; R:412-423 requires boundary classification, new candidate, retained old verdict, relook                   | NONE      |
| F   | Feedback changes auth/schema/API/business semantics; return owning gate                                                   | A:302-314; C:75-85; R:412-423 routes `SCOPE_CHANGE_REQUIRES_REVIEW`                                                  | NONE      |
| G   | Same blocker; actual initial failed run then two corrections with same blocker still observed; stop before third recovery | C:97-130; A:345-375; R:446-467 yields `(recovery,generation) = (0,1) → (1,2) → (2,3)`, then pending human stop       | NONE      |
| H   | Three actual equivalent generations; fourth default run forbidden                                                         | C:97-130; A:345-375; R:446-467 yields `1/3 → 2/3 → 3/3`, then stop before run 4                                      | NONE      |
| I   | Read-only inspection after generation 1; no evaluator execution                                                           | A:349-357; C:103-113; R:446-455 retains `(0,1)`                                                                      | NONE      |
| J   | Preflight rejected before evaluator; no actual process                                                                    | A:349-357; C:103-113; R:446-455 retains `(0,1)` and may stop for unsafe/missing authority                            | NONE      |
| K   | Resume with wording change, same candidate/cause/purpose                                                                  | A:251-260,329-360; C:87-113; R:375-385,437-455 preserves verdict/request, lineage, `(2,3)` counts and prior outcomes | NONE      |
| L   | Human requests `ACCEPT_LIMITATION` with mandatory Browser QA/security evidence missing                                    | A:375-384; C:137-144; R:469-476 keeps affected gate blocked, historical FAIL/BLOCKED unchanged, no PASS conversion   | NONE      |
| M   | At adoption, target already in Apply/VERIFY/QA, no opt-in                                                                 | W:327-341; A:105-131; R:87-103 says `GRANDFATHERED`, no rewind; existing old gates remain                            | NONE      |
| N   | At adoption, target active pre-Apply with evidenced phase                                                                 | W:327-341; A:105-131; R:87-103 says `REQUIRED` after event; missing phase proof says `NEEDS_REVIEW`                  | NONE      |
| O   | This governance change before its own archive                                                                             | W:330-335; A:111-119; C:147-149; R:77-85 retains pre-adoption workflow, no recursive checkpoint                      | NONE      |

G–J are transition arithmetic over the approved record mechanics, not claim of actual retries. A–F and K–O likewise prove text contract routing only. No distinct executable behavioral harness for `yuta-run-change` exists in this scope; `scripts/engineering-skills/acceptance.test.mjs` tests other primitives and was not substituted as proof.

### Command inventory, relevance and historical results

Root scripts and wrapper side effects were inspected first. `docs:check` and `architecture:check` read files only. `typegen:next` invokes six Next generators and writes ignored generated route types under application outputs; no generator/Next lock or concurrent typegen process was found, and no tracked source write resulted. Prettier checks and OpenSpec validate are read-only. Root `format:check` is `prettier --check .` and would repeat the known 83-warning full-repo failure; current user instruction explicitly requires preserving that historical FAIL and using targeted checks instead.

| Exact command                                                                                                                                                                                                                                                                                         | Exit/result                                     | Relevance / limit                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm docs:check`                                                                                                                                                                                                                                                                                     | 0, PASS (36 current documents)                  | Document index/links/instruction consistency; not semantic workflow proof.                                                                                                                                                                         |
| `pnpm architecture:check`                                                                                                                                                                                                                                                                             | 0, PASS                                         | Runtime imports, DB URL, client and migration boundaries; does not inspect governance Markdown semantics.                                                                                                                                          |
| `pnpm typegen:next`                                                                                                                                                                                                                                                                                   | 0, PASS; six apps each 4/4 fresh outputs        | Required prerequisite for recursive TypeScript; ignored generated outputs, not governance behavior.                                                                                                                                                |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                                                                                      | 0, PASS; 15/16 workspace projects               | Repository TS regression evidence in shared dirty checkout; not Markdown/skill behavioral proof.                                                                                                                                                   |
| `pnpm exec prettier --check docs/YUTA_WORKFLOW_V3.md docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md .agents/skills/yuta-run-change/SKILL.md` | 0, PASS                                         | All six approved implementation targets only.                                                                                                                                                                                                      |
| `pnpm exec prettier --check openspec/changes/development-usability-and-iteration-control/tasks.md`                                                                                                                                                                                                    | 1, FAIL                                         | Whole Tasks file has pre-existing differences across earlier phases; no wholesale normalization. Phase 4's new table alignment also differed initially; only this Phase 4 section was subsequently formatted, with zero trailing-whitespace lines. |
| `pnpm exec prettier openspec/changes/development-usability-and-iteration-control/tasks.md`                                                                                                                                                                                                            | 0, read-only output                             | Compared formatted Phase 4 substring to its original bytes, then applied only that substring; earlier Tasks history stayed byte-identical.                                                                                                         |
| `pnpm exec openspec validate development-usability-and-iteration-control --type change --strict --json --no-interactive`                                                                                                                                                                              | 0, PASS 1/1; `skip_specs` INFO                  | Structural no-spec OpenSpec validation, not semantic VERIFY by itself.                                                                                                                                                                             |
| `git diff --check --` + exact six implementation paths                                                                                                                                                                                                                                                | 0, PASS                                         | Scoped tracked whitespace; unrelated dirty paths excluded.                                                                                                                                                                                         |
| `pnpm format:check`                                                                                                                                                                                                                                                                                   | NOT RERUN; historical Phase 1 FAIL, 83 warnings | Known repository-wide failure remains unresolved/failed; rerun would reproduce unrelated baseline and consume anti-loop budget without new evidence.                                                                                               |

Historical Phase 3 Tasks Prettier FAIL and Phase 1 full-repo 83-warning FAIL remain unchanged, not relabeled. No new source correction was necessary. Task 4.4 is completed with the explicitly authorized targeted-format exception to its planned full-repo command, not a false repo-wide PASS.

### Formal result and next boundary

`TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`. All 20 applicable rows have exact approved source→implementation→evidence trace, including the no-spec branch, and no unresolved critical semantic conflict was found. `VERIFY: PASS` for the **static governance/document/orchestration contract**: the six accepted hashes match, scenarios A–O route consistently, and applicable repository checks pass. This does not assert runtime enforcement by every future agent. `KNOWN_EVIDENCE_LIMITATION`: no dedicated `yuta-run-change` behavioral harness exists; under this approved governance-text scope its absence does not defeat the static acceptance criteria. The shared checkout's dirty pre-existing documentation hunks also limit whole-HEAD diff attribution; accepted preimage/post-phase hashes preserve bounded attribution. Repository-wide formatting remains historical FAIL and Tasks whole-file formatting remains FAIL; neither is converted to PASS.

`QA: NOT_APPLICABLE` under `docs/YUTA_QA_PROTOCOL.md`: actual implementation is docs/prompts/skill only, `UI_AFFECTING = NO`, `BROWSER_QA_REQUIRED = NO`, and there is no distinct user-facing/runtime QA behavior beyond the semantic technical VERIFY above. No QA PASS or Browser QA is claimed. `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED`: no changed mandatory acceptance, security/legal/payment/fiscal, durable data or runtime boundary was found. Production Readiness, Release and Deploy remain separate.

Phase 4: 6/6 complete; total: 24/24. Gate 3 packet, approval, finish, sync/archive, Knowledge Consolidation and deployment were not performed or authorized by Phase 4. Next Control Tower action: decide whether to authorize **Gate 3 final independent review packet preparation** for this exact current Tasks hash, six implementation hashes, Technical Compliance/VERIFY result and truthful QA disposition; no Gate 3 approval is inferred.
