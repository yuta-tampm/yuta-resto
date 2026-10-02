## Context

Change này điều chỉnh cách YUTA điều hành một OpenSpec change sau Apply. Gate 1 đã duyệt `NO_SPEC_BEHAVIOR_CHANGE` và nhánh `skip_specs: true`; CLI hiện báo Specs `skipped`, Design `ready`. Không có Product capability delta hoặc normative main-spec owner cần đồng bộ. Design áp dụng vì các quyết định về evidence persistence, resume, counters và authority routing trải qua nhiều tài liệu và skill. Design này chỉ mô tả implementation sau khi Control Tower cho phép; nó không cấp quyền sửa các nguồn đó.

Các gate hiện tại, Technical Implementation Compliance (TIC), VERIFY, QA, Browser QA khi bắt buộc, Gate 3 và finalization vẫn giữ nguyên. Post-Apply checkpoint là một phần của đường Apply hiện có trước formal TIC/VERIFY/QA, không phải stage hoặc gate mới. `DEV_USABLE` chỉ nói về local/dev; Production Readiness và Release/Deploy là lane độc lập.

## Goals / Non-Goals

**Goals:** một record bền trong repository cho hai assertion, human Product feedback và blocker lineage; applicability có thể quyết định từ thực tế của change; vòng correction nhỏ có ranh giới; stop sớm khi retry vô ích; adoption theo sự kiện finalization; các owner và bản sao carry-through không mâu thuẫn; bằng chứng có thể được Gate 3 hash và finish kiểm lại.

**Non-goals:** thêm Product requirement/spec, runtime/database/API, stage/Gate 4, QA status, lifecycle dimension, risk `LEVEL_A/B/C`, global blocker service, auto-approval, production authorization, hoặc thay đổi Product Version. Không khôi phục evidence lịch sử bằng suy đoán.

## Decisions

### 1. Ownership and direction of authority

| Trách nhiệm | Owner | Surface phụ thuộc và chiều authority |
| --- | --- | --- |
| Human-readable sequence, boundaries giữa Apply, VERIFY, QA, Gate 3, local/dev và production | `docs/YUTA_WORKFLOW_V3.md` | Automated Workflow giải thích mechanics; prompts và skills thực thi/nhắc lại, không định nghĩa Product hoặc gate mới. |
| Record shape, applicability, resume/adoption và placement chi tiết | `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` | `yuta-run-change` triển khai; Workflow v3 chỉ giữ contract tổng quan; prompts/handoff chuyển exact state. |
| Anti-loop/evidence-stop authority, lineage, budget, stop decisions | `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | Automated Workflow trỏ tới rule và nêu nơi ghi; Page Chat/handoff báo facts; run skill tính/stop theo rule, không tạo budget khác. |
| Product feedback carry-through | `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md` và `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | Nhận/đưa record và evidence về Control Tower; không tự phê chuẩn `LOCAL_CORRECTION`, `ACCEPT_LIMITATION`, retry exception hoặc Gate 3. |
| Executable orchestration đến Gate 3 | `.agents/skills/yuta-run-change/SKILL.md` | Áp dụng policy trên, giữ earliest-missing-gate; không sở hữu canonical rule. |
| Final integrity và archive | `.agents/skills/yuta-finish-change/SKILL.md` hiện có | Kiểm exact Tasks hash và Gate 3 evidence theo cơ chế hiện tại; không định nghĩa lại checkpoint. Decision: `NO_CHANGE`. |

Không copy nguyên một policy vào mọi surface. Workflow v3 nêu invariant; Automated Workflow nêu thuật toán/record; Control Tower nêu stop authority; Page Chat/handoff chỉ có field và lời nhắc chuyển giao; skill gọi đúng nguồn và hành động. Nếu câu chữ mâu thuẫn khi Apply, dừng ở owning authority thay vì chọn bản sao thuận tiện.

### 2. Durable post-Apply record

Ghi một section có nhãn ổn định `POST_APPLY_DEVELOPMENT_FEEDBACK` trong `openspec/changes/<change>/tasks.md` của từng change áp dụng. Đây là evidence trong Tasks đang được cập nhật khi Apply; không tạo OpenSpec artifact, review gate, DB hay runtime persistence mới. Gate 3 ghi exact Tasks path/hash và trích trạng thái hiện hành; finish hiện recompute mọi planning artifact hash, kể cả Tasks. Đổi record sau Gate 3 sẽ làm packet mất hiệu lực. Review packet và handoff dẫn tới Tasks, không làm nguồn dữ liệu thứ hai. Nếu change có Tasks thiếu section do grandfathering, ghi migration disposition rõ ở Gate 3 thay vì dựng section giả.

Record tối thiểu:

```text
POST_APPLY_DEVELOPMENT_FEEDBACK
Adoption: REQUIRED | GRANDFATHERED | OPTED_IN
Adoption basis: <finalization event reference or explicit human opt-in reference>
Candidate: <change + exact implementation revision/scoped diff reference>
DEV_USABLE:
  applicability: YES | NO
  result: PENDING | YES | NO | NOT_APPLICABLE
  scope: <real flow/entry point or bounded absence>
  environment/runtime: <local/dev target or reason none exists>
  evidence_or_reason: <observed steps/outcome or N/A rationale>
  blocker: <reference when NO; otherwise none>
MANUAL_TEST_READY:
  applicability: YES | NO
  result: PENDING | YES | NO | NOT_APPLICABLE
  scope: <human-operable flow or bounded absence>
  environment/runtime: <local/dev target or reason none exists>
  evidence_or_reason: <handoff details or N/A rationale>
  blocker: <reference when NO; otherwise none>
HUMAN_PRODUCT_VALIDATION: <record below when applicable; applicability NO with reason otherwise>
ITERATION_STOP_CONTROL: <lineage ledger and decision references when relevant; NONE with reason otherwise>
```

`PENDING` là trạng thái vận hành trước đánh giá, **không** là giá trị assessed thứ tư. Applicability `NO` phải đi cùng `NOT_APPLICABLE` và lý do từ scope thực, không từ thiếu môi trường. Applicability `YES` yêu cầu kết quả `YES` hoặc `NO` sau assessment; thiếu credentials/route/data cho flow thật là `NO` kèm blocker, không phải `NOT_APPLICABLE`. Mỗi update giữ candidate/evidence reference và observation time nếu có; không gán người phê duyệt hoặc thời điểm giả. Với human decision, ghi nguồn instruction/feedback thực tế và thời điểm ghi record theo review convention. Manual handoff `YES` chứa command/runtime, route/entry, safe dev/test data, test identity/credential khi cần (chỉ reference an toàn, không ghi secret), expected basic flow, reset/retry và dev-only limitations. `DEV_USABLE = YES` đòi chạy qua intended local/dev boundaries với data/identity thích hợp; build/typecheck đơn lẻ không đủ. `NO` chặn claim sẵn sàng, không tự đổi formal QA.

### 3. Human Product validation record

Khi có interactive Product flow, Tasks lưu `applicability: YES`, `candidate/scope`, `handoff reference`, `decision: AWAITING_RESPONSE | ACCEPTED | CHANGES_REQUESTED | BLOCKED`, `human feedback/source/time`, `disposition`, `relook_required: YES | NO`, và `relook_candidate/reference`. `AWAITING_RESPONSE` là trạng thái trước human decision, không là verdict thứ tư. `ACCEPTED`, `CHANGES_REQUESTED`, `BLOCKED` chỉ được ghi theo human response cho candidate đã thử; `BLOCKED` nêu giới hạn thật. Khi `LOCAL_CORRECTION` sửa candidate, decision cũ được giữ như lịch sử, candidate mới quay về `AWAITING_RESPONSE` và `relook_required: YES`; chỉ human feedback mới hoàn tất relook. Human Product validation không phải QA report, Browser QA, Gate 3 approval hoặc quyền chạy Apply ngoài scope.

### 4. Deterministic applicability

Đọc approved scope và actual post-Apply candidate; tìm real local/dev user- hoặc operator-interactable flow, kể cả CLI/service endpoint có thể thao tác thủ công. Không dựa duy nhất vào `UI_AFFECTING`.

| Change thực tế | DEV_USABLE | MANUAL_TEST_READY | HUMAN_PRODUCT_VALIDATION |
| --- | --- | --- | --- |
| Interactive UI | Áp dụng: chạy real local/dev route và boundaries. | Áp dụng: handoff cho human. | Áp dụng; chờ human verdict. |
| Interactive non-UI runtime/service | Áp dụng nếu service/CLI/endpoint có dev flow thật. | Áp dụng khi human có thể thao tác flow đó. | Áp dụng nếu flow là Product/operator behavior cần human judgement. |
| Pure deterministic library, không có flow operable | `NOT_APPLICABLE` với lý do. | `NOT_APPLICABLE` với lý do. | Applicability `NO`; technical tests/VERIFY vẫn bắt buộc. |
| Docs/governance only, không đổi runtime/user flow | `NOT_APPLICABLE` với lý do. | `NOT_APPLICABLE` với lý do. | Applicability `NO`; semantic review/VERIFY vẫn bắt buộc. |
| Infrastructure only | Đánh giá flow local/dev thật: có thì áp dụng, không thì N/A có lý do. | Có human-operable setup/probe thì áp dụng; không thì N/A. | Áp dụng chỉ nếu có interactive Product/operator behavior cần human feedback. |

Nếu hai assertion có applicability khác nhau, ghi độc lập và nêu flow/reason riêng. Không dùng thiếu provider, môi trường hoặc quyền test để đổi flow có thật thành N/A. Nếu scope thay đổi, re-evaluate applicability tại gate sở hữu; không retroactively sửa historical assessment.

### 5. Local correction loop

Sau `CHANGES_REQUESTED`, phân loại từng feedback so với approved Proposal/Analysis, Specs nếu có, Design, Tasks/TIC và Product/authority source. `LOCAL_CORRECTION` chỉ khi giữ nguyên approved Product requirement/scope, role/permission/authorization, schema, API/contract, data ownership, business semantics, acceptance criteria và mọi durable/sensitive boundary. Cải thiện copy/layout/focus cũng phải escalate nếu đổi một semantic requirement đã duyệt. Ghi finding, classification, rationale, exact candidate/diff và affected checks trong Tasks. Chỉ sau đó sửa bounded implementation, chạy targeted checks liên quan, cập nhật checkpoint bị ảnh hưởng, giao lại changed flow cho human, giữ verdict cũ và chờ verdict mới. Chuyển feedback thành `SCOPE_CHANGE_REQUIRES_REVIEW` và dừng tại owning Product/authority/Design gate ngay khi cần đổi approved boundary, không có đủ authority để phân loại, hoặc corrective action thực tế vượt scope.

Nếu cùng blocker/evaluator tiếp tục thất bại sau correction, dùng ledger và budgets bên dưới; mỗi vòng Product feedback không cấp retry vô hạn. Một Product defect mới có evidence riêng được xử lý trong approved scope nếu có thể; không xoá blocker evidence cũ. Formal TIC/VERIFY/QA chỉ dùng candidate hiện hành, và affected checks phải làm lại sau correction; không lấy human `ACCEPTED` làm QA PASS.

### 6. Blocker lineage and counter state

Giữ `ITERATION_STOP_CONTROL` ledger trong cùng Tasks section, một entry mỗi causal lineage. Identity ổn định là `(affected claim, blocker class, evidenced causal root cause)`; gán local lineage ID chỉ để tham chiếu, không dùng tên/wording làm identity. Với chưa rõ root cause, ghi `PROVISIONAL` kèm evidence và liên kết các occurrences có thể cùng cause; không tự tạo budget mới bằng nhãn mới. Khi evidence xác lập cause, reconcile/merge histories và counts; nếu không đủ chứng minh, dừng để human review. New proven cause có lineage mới nhưng ledger cũ bất biến. Mỗi occurrence ghi stage, evaluator purpose, executable/process identity hoặc equivalence rationale, preflight result, actual execution, corrective action/reference, observed outcome, last material outcome và thời điểm/evidence. Stage/purpose là context của occurrence, không phải cách reset causal history.

Recovery count là **theo lineage xuyên stages** (`0..2`). Execution generations là **theo lineage + stage + materially same evaluator purpose** (`0..3`, lần actual đầu tiên = 1). Cùng purpose dù đổi command wording/tool wrapper vẫn là cùng bucket nếu kiểm cùng claim theo quá trình tương đương. Materially different purpose/stage có bucket mới với lý do và toàn bộ lineage/recovery history vẫn hiện. Không tự cấp thêm budget; human exception chỉ hợp lệ khi recorded instruction nêu extra bounded count, purpose và stop condition, không sửa counters/history đã dùng.

| Sự kiện | Recovery count | Generation count | Record/outcome |
| --- | --- | --- | --- |
| Initial actual evaluator/browser/runtime/evidence execution | Không đổi | `+1` trong bucket, thành 1 | Ghi executed process và evidence dù thành công hay thất bại. |
| Actual successful execution | Không đổi | `+1` nếu là một run mới; không đếm hai lần cùng run | Ghi successful observation; closure không xóa lịch sử. |
| Actual failed execution | Không đổi nếu không có preceding correction; nếu sau correction và cùng causal blocker còn thì `+1` | `+1` | Ghi blocker và result; một run có thể tăng cả hai counters. |
| Read-only diagnosis/inspection | Không đổi | Không đổi, trừ khi chính nó là actual equivalent evaluator process cho claim đang đếm | Ghi finding; không gọi inspection thông thường là recovery. |
| Rejected preflight trước evaluator chạy | Không đổi | Không đổi | Ghi rejection; vẫn xử lý unsafe/missing authority. |
| Corrective action rồi observed blocker được giải quyết | Không đổi | Observation run tính `+1` nếu evaluator thực chạy | Ghi action và closure; không tính recovery thất bại. |
| Corrective action rồi observed cùng causal blocker còn | `+1` đúng một lần cho action + observation pair | Observation run tính `+1` nếu evaluator thực chạy | Giữ cả action và failed observation; không double-count restart. |
| New proven Product/implementation defect | Không đổi lineage cũ | Không đổi lineage cũ | Ghi finding/lineage mới có evidence; route correction hoặc owning gate; lịch sử cũ giữ nguyên. |
| Stage transition | Không reset lineage/recovery | Bucket stage mới chỉ khi evaluator thực chạy | Carry lineage và prior counts; ghi lý do transition. |
| Material evaluator-purpose transition | Không reset lineage/recovery | Bucket purpose mới nếu thực sự khác purpose | Ghi purpose/equivalence rationale; tên khác không đủ. |
| Wording-only change, orchestration restart/resume | Không đổi | Không đổi | Tái dùng ID/bucket và full ledger. |

Preflight có thể làm stop vì unsafe dù chưa tiêu counter. Khi count đạt maximum, không lên lịch thêm run cùng budget mặc định. Stop có thể xảy ra sớm hơn khi unsafe hoặc evidence cho thấy không có tiến triển hữu ích.

### 7. ITERATION_STOP_CONTROL and limitation

Mở stop record ngay khi: recovery count đã đạt 2 mà cùng blocker cần recovery tiếp; execution bucket đã đạt 3 mà muốn equivalent generation nữa; retry thiếu authority/an toàn; hoặc outcomes chứng minh không có useful progress. Record gồm lineage ID/claim/class/cause và confidence, stage/purpose/bucket, chronological action-execution ledger/counters, affected acceptance/evidence obligation, last material outcome, remaining safe options, mandatory evidence status, recommended bounded decision và `human decision: PENDING` với instruction reference khi có. Dừng tại **existing affected gate**; không mở Gate 4 và không biến stop thành QA status.

Human decision chỉ một trong `FIX`, `ACCEPT_LIMITATION`, `SPLIT_CHANGE`, `DEFER_OR_CLOSE`. `FIX` cần defect Product/implementation đã xác lập và path sửa trong approved scope hoặc return gate; không tự cấp thêm attempt. `SPLIT_CHANGE` chuyển một workstream có boundary rõ, không bỏ obligation còn bắt buộc của change gốc. `DEFER_OR_CLOSE` giữ incomplete/blocked state, không giả archive thành công. Decision record nêu authority/source, bounded disposition và effect trên gate hiện tại.

`ACCEPT_LIMITATION` chỉ ghi `KNOWN_EVIDENCE_LIMITATION` khi approved acceptance criteria của affected claim **đã** cho phép bounded limitation; record chỉ ra criterion, precise missing/partial evidence, residual risk, human decision và phần claim vẫn chưa chứng minh. Nó không đổi QA state, không tạo PASS, không thay historical FAIL/BLOCKED, không waive mandatory Browser QA/security/legal/payment/fiscal evidence. Nếu current gate vẫn yêu cầu evidence đó, gate giữ blocked; decision có thể ghi nhận limitation nhưng không cho Gate 3 ready/finalization. Production Readiness/Release/Deploy vẫn do nguồn riêng quyết định.

### 8. `yuta-run-change` resume and adoption

Sau Apply của change thuộc policy mới, run skill đánh giá applicability, tạo/cập nhật Tasks record và kiểm hai assertions. Với interactive Product flow, chuẩn bị handoff rồi dừng cho human validation; không infer `ACCEPTED` từ tests hoặc silence. Khi resume, đọc exact Tasks record, human instruction và prior ledger; đối chiếu candidate hiện tại. Mismatch hoặc changed candidate làm assessment liên quan stale/pending; không reset counts. Correction trong scope tiếp tục targeted work và human relook; outside scope quay lại owning gate. Trước mỗi equivalent retry, kiểm stop triggers; nếu stop, ghi handoff và dừng. Chỉ sau required post-Apply outcomes hợp lệ mới đi formal TIC/VERIFY/QA, giữ mọi earlier gate/hash rule hiện có.

Adoption là event duy nhất: **successful human-authorized finalization/archive of `development-usability-and-iteration-control` after its canonical workflow authority edits have been applied and successfully verified**. Evidence là archived change và Gate 3/finish outcome chỉ rõ completion, không dùng calendar date, edit timestamp hoặc draft document. Khi resume, so sánh lịch sử của target change với event này:

1. Target đã DONE/archived hoặc completed no-spec trước event: `GRANDFATHERED`; không tạo Tasks/evidence mới.
2. Target còn active và chưa bắt đầu Apply tại event: `REQUIRED` sau event cho applicable checkpoints; record event reference trong Tasks khi tới post-Apply.
3. Target active đã vào Apply/VERIFY/QA tại event: `GRANDFATHERED` đối với checkpoints mới, không rewind; chỉ `OPTED_IN` nếu có explicit human instruction cho target change và scope, rồi ghi reference. Existing earliest-missing/unapproved/invalidated gate vẫn áp dụng bình thường cho mọi gate cũ.
4. Change mới khởi tạo sau event: `REQUIRED` khi tới post-Apply.

Nếu phase-at-event không chứng minh được từ existing packets/Tasks/record, ghi `NEEDS_REVIEW` và hỏi human, không backfill giả hoặc suy từ ngày file. Adoption exception chỉ cho checkpoints mới; nó không chữa một gate cũ thiếu/invalid. Historical outcomes và evidence giữ nguyên. Governance change này tự được xử lý theo workflow hiện tại cho tới event của chính nó; không đòi checkpoint retroactive để archive nó.

### 9. Finalization decision and file-by-file implementation plan

`yuta-finish-change: NO_CHANGE`. Post-Apply record nằm trong Tasks, là planning artifact Gate 3 phải hash cùng exact current content; finish hiện recompute mọi planning artifact hash, earlier packet hashes, scoped implementation diff và VERIFY evidence. Run skill chặn Gate 3 khi applicable record chưa đủ; Gate 3 human review xét exact record. Nếu record bị sửa sau Gate 3, Tasks hash mismatch đã chặn archive. Không có checkpoint/grandfathering record nằm ngoài existing integrity path cần finish kiểm riêng. Nếu Apply sau này thay đổi storage model khỏi Tasks hoặc phát hiện finish không kiểm Tasks hash thật, đó là `NEEDS_REVIEW` và phải reconsider decision trước implementation, không silent expansion.

| Surface | Vai trò và sửa nhỏ nhất sau authorization | Verification tương ứng |
| --- | --- | --- |
| `docs/YUTA_WORKFLOW_V3.md` | Canonical human workflow: chèn conditional post-Apply assertions/manual Product loop trong mô tả Apply trước formal VERIFY/QA, phân biệt production, nêu adoption event và giữ gate/status. Không chép ledger chi tiết. | Review sequence/gate table và searches cho không có stage/QA/lifecycle mới. |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` | Canonical procedure: định nghĩa Tasks section/field, applicability, assessment, relook, adoption exception, Gate 3 inclusion; link anti-loop owner. | Scenario table/manual dry run, exact field/transition inspection, docs check. |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | Canonical anti-loop: lineage/2 recovery/3 generations/stop triggers/four decisions/limitation guard, nối rule hiện có. | Counter transition cases và consistency search; không tồn tại anti-loop rule cạnh tranh. |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md` | Derived carry-through: báo applicability, actual candidate, feedback, blocker occurrence và stop need về Control Tower; không tự quyết authority. | Check handoff fields và không có tự approval/budget. |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | Derived carry-through: placeholders cho Tasks record reference, human feedback, lineage/counters, stop decision pending; không lặp policy đầy đủ. | Filled scenario review, field consistency, no invented statuses. |
| `.agents/skills/yuta-run-change/SKILL.md` | Executable implementation: nhận diện adoption, tạo/đọc Tasks record sau Apply, wait/resume human validation, correction guard, counter accounting/stop, Gate 3 capture; giữ earliest-missing rule ngoài ngoại lệ. | Static inspection và bounded scenario dry runs/targeted tests nếu tooling hỗ trợ. |

### 10. No-change protection

`docs/YUTA_QA_PROTOCOL.md` giữ vocabulary và applicability hiện tại: manual Product feedback không phải QA. `docs/LIFECYCLE_STATUS_MODEL.md` không có dimension mới. `docs/operations/DEPLOYMENT.md` và `docs/operations/PRODUCTION_READINESS.md` tiếp tục sở hữu release/prod readiness; DEV_USABLE không sửa chúng. `docs/CURRENT_STATE.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md` không đổi Product capability, ownership hoặc completed state trong Design/Apply này. `openspec/config.yaml` và `openspec/schemas/yuta-spec-driven/schema.yaml` đã hỗ trợ `skip_specs` và conditional Design qua adapter hiện có; không thay schema. Bất kỳ required normative conflict thật trong các file này sẽ là `NEEDS_REVIEW` tại owning gate, không là silent Design expansion.

## Risks / Trade-offs

- Tasks section là evidence được cập nhật sau Apply; cần exact candidate reference và Gate 3 hash để tránh stale human feedback. Nếu một review packet đã hash Tasks ở change đặc biệt, run skill phải recheck/invalidate theo policy hiện tại trước update.
- Root cause có thể chưa xác định. `PROVISIONAL` + reconciliation giữ history; human review có thể cần trước một retry nếu không thể chứng minh bucket identity.
- Adoption phase-at-event có thể thiếu evidence. Fail closed với `NEEDS_REVIEW`; không bắt các change cũ tái tạo lịch sử.
- Static scenario tests chứng minh contract/instructions, không chứng minh agent luôn tuân thủ trong mọi host. Gate 3 phải nói rõ giới hạn observed verification.

## Verification Plan

Sau authorization Tasks/Apply, kiểm exact scoped preimages/diff vì working tree đang dirty. Chạy repository-required `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`; thêm `pnpm format:check` nếu formatting nhạy cảm. Trước khi chạy wrapper, inspect side effects/cache/subprocess/network theo repo policy. Validate change bằng OpenSpec CLI theo current syntax sau implementation (không invent spec); kiểm schema/status, Tasks complete và no-spec branch. Kiểm static skill text và nếu phù hợp dùng tooling `scripts/engineering-skills/` chỉ sau khi xác nhận test inventory/side effects, không nhầm nó với behavioral proof cho `yuta-run-change`. Tạo targeted assertion/dry-run evidence cho ít nhất: interactive UI, interactive non-UI service, pure library/docs, infra có/không manual flow, active pre-Apply sau adoption, already-in-Apply grandfathered và opt-in, initial/success/failure/preflight/diagnosis/correction transitions, exhausted budget, mandatory evidence + `ACCEPT_LIMITATION`, `LOCAL_CORRECTION` so với scope change. Search terminology và status qua sáu surfaces; kiểm các no-change paths không bị sửa và no parallel authority. Formal VERIFY sau Apply mới đánh giá kết quả; Design hiện tại không chạy VERIFY hay QA.

**QA applicability assessment:** `UI_AFFECTING = NO`, `BROWSER_QA_REQUIRED = NO`. Nếu implementation giữ đúng docs/prompts/skill orchestration và không tạo user-facing/runtime behavior, không có separate runtime/user QA dimension; scenario execution/static or host behavior evaluation (nếu được phép và có tooling) thuộc technical VERIFY, nên `QA: NOT_APPLICABLE` là candidate có lý do cho later QA classification, **chưa phải final QA status**. Nếu Apply tạo runtime/user-facing surface hoặc một distinct operational QA dimension, reclassify và làm applicable non-browser/Browser QA theo authority hiện tại. Human Product validation của các future Product changes không phải QA của governance change này.

**Sensitive Design Gate reassessment:** `SENSITIVE_DESIGN_GATE = NOT_TRIGGERED`. Scope này không sửa authorization/security, runtime/data owner, migration, payment/fiscal, Personnel/legal/privacy, provider contract, POS transaction, irreversible action hoặc cross-module durable boundary; `CROSS_MODULE = YES` cho governance không tự đủ trigger. Nếu Design/Apply phát hiện cần sửa mandatory acceptance hoặc một boundary nhạy cảm, dừng `NEEDS_REVIEW` tại owning gate và reassess trước Tasks/Apply.

## Open Questions

Không còn quyết định Product/authority chưa giải quyết trong scope Gate 1 đã duyệt. `NEEDS_RECONCILIATION` của Product Version là change riêng và không nằm trong Design này. Việc implementation sau này có giữ được record trong Tasks và kiểm hash như thiết kế là điều kiện phải xác minh tại technical VERIFY, không là quyền đổi storage/finish skill âm thầm.
