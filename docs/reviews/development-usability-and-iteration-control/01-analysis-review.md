Change: development-usability-and-iteration-control
Gate: Gate 1 — Product / Authority Review
Review status: APPROVED
Created: 2026-09-23T23:33:43.4246553+02:00
Schema: yuta-spec-driven
Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE
Sensitive change: NO — current scope does not trigger a qualifying Sensitive Design Gate; reassess if scope changes
Approval source: explicit current-user Gate 1 instruction for this named change and exact reviewed Proposal/Analysis
Approval recorded by: Codex workflow
Approved: 2026-09-23T23:42:37.0267857+02:00

# Gate 1 Review — Development Usability and Iteration Control

## Request and bounded recommendation

Người dùng cho phép tạo change, Proposal, Analysis và chuẩn bị Gate 1 rồi STOP. Change governance CROSS_MODULE này đề xuất post-Apply assertions, manual Product feedback, ranh giới local correction, và mở rộng anti-loop rule hiện có bằng lineage/budgets/human stop decisions. Không đổi application UI, Product runtime/data, QA vocabulary, lifecycle, Gate 3 hoặc production authority. Gate 1 được đề nghị chấp nhận scope và nhánh no-spec; chưa cho phép sửa canonical authority hoặc skill.

## Authority and existing-state findings

- Nguồn canonical: docs/YUTA_WORKFLOW_V3.md; chi tiết: docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/YUTA_QA_PROTOCOL.md; anti-loop owner: docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md; executable owner: .agents/skills/yuta-run-change/SKILL.md. Analysis liên kết đầy đủ các nguồn đã đọc.
- Existing materially equivalent change: NO trong active/archive inventory khi intake. Normative workflow-governance main-spec owner: NOT FOUND.
- Existing anti-loop/evidence-stop rule: YES; chưa có numeric recovery/generation budget. Existing earliest-missing-gate rule: YES; adoption ngoại lệ hẹp cần Gate 1 quyết định.
- Product Version Phase 2 chronology: NEEDS_RECONCILIATION ở change khác; không sửa hoặc dùng làm approval evidence cho change này.
- Historical Pointage QA/evaluator blockers và residual limitations chỉ là ví dụ; không bị relabel và không chuyển thành PASS/approval cho change này.
- Current implementation/VERIFY/QA của control đề xuất: NONE. Gate 1 packet là planning evidence, không phải Product capability hoặc production evidence.

## Repository provenance and isolation

Baseline HEAD: `14dd0f35645586abc5877da28df0fcd16eba971d`. `git status --short --branch` được ghi nhận trước khi tạo change: checkout có nhiều dirty/untracked path không liên quan, gồm workflow sources, Pointage và Product Version. Turn này chỉ tạo shell, Proposal, Analysis và Gate 1 packet dưới path của change mới; không chạm các path cũ. Gate sau phải lập lại scoped preimage/diff vì working tree có thể tiếp tục thay đổi.

## CONFLICT and NEEDS REVIEW

CONFLICT trong current authorities cho bounded Proposal: NONE. Rule earliest-missing hiện tại vẫn có hiệu lực; ngoại lệ prospective chỉ là đề xuất chưa áp dụng.

NEEDS REVIEW tại Gate 1: exact semantics, budgets, stop decisions, adoption, owner inventory, no-spec strategy và classification. Finish-skill chỉ là MAY_CHANGE cho tới khi có concrete enforcement finding. Product Version NEEDS_RECONCILIATION là issue riêng, không chặn review này.

## Exact Gate 1 decisions requested

1. Chấp nhận DEV_USABLE và MANUAL_TEST_READY là conditional post-Apply assertions với YES/NO/NOT_APPLICABLE, pending trước assessment và evidence/applicability có lý do?
2. Chấp nhận manual-test handoff gồm command/runtime, route/entry, safe data, test identity khi cần, basic flow, reset/retry và dev-only limitations?
3. Chấp nhận HUMAN_PRODUCT_VALIDATION = ACCEPTED/CHANGES_REQUESTED/BLOCKED cho interactive change, awaiting response trước human action, tách khỏi QA/Gate 3?
4. Chấp nhận LOCAL_CORRECTION chỉ trong approved Product/authority/contract/data/business/acceptance boundaries; ngoài ra SCOPE_CHANGE_REQUIRES_REVIEW?
5. Chấp nhận BLOCKER_LINEAGE = affected claim + blocker class + evidenced causal root cause, stage là occurrence context và đổi wording không reset history?
6. Chấp nhận MAX_RECOVERY_ATTEMPTS = 2, chỉ tính sau corrective action thực hiện mà cùng blocker vẫn còn?
7. Chấp nhận MAX_EXECUTION_GENERATIONS = 3 gồm initial run, theo cùng lineage và stage/evaluator purpose; rejected preflight không tính?
8. Chấp nhận ITERATION_STOP_CONTROL là extension của anti-loop hiện có, với human decisions FIX/ACCEPT_LIMITATION/SPLIT_CHANGE/DEFER_OR_CLOSE và không có Gate 4?
9. Chấp nhận ACCEPT_LIMITATION chỉ khi approved criteria cho KNOWN_EVIDENCE_LIMITATION; mandatory FAIL/BLOCKED/Browser QA/security/legal/payment/fiscal evidence vẫn không được waive?
10. Chấp nhận placement trong Apply → conditional post-Apply records/manual Product loop → Technical Compliance/VERIFY → QA → Gate 3, không thêm top-level stage?
11. Chấp nhận DEV_USABLE độc lập với Production Readiness, giữ Release/Deploy authority riêng và production fail-closed?
12. Chấp nhận không thêm LEVEL_A/B/C risk taxonomy trong scope này?
13. Chấp nhận adoption sau successful authorized finalization vào canonical workflow authority, không theo ngày hardcoded, không retroactive/rewrite; active pre-Apply áp dụng, active Apply/VERIFY/QA chỉ human opt-in, và ngoại lệ hẹp cho earliest-missing rule?
14. Chấp nhận ownership matrix trong Analysis: sáu MUST_CHANGE governance/run surfaces, finish MAY_CHANGE có điều kiện, QA/lifecycle/operations/Product Knowledge/schema NO_CHANGE?
15. Chấp nhận NO_SPEC_BEHAVIOR_CHANGE và nhánh skip_specs: true sau Gate 1, cùng CROSS_MODULE YES/UI_AFFECTING NO/BROWSER_QA_REQUIRED NO, QA NOT_APPLICABLE chỉ nếu sau này xác nhận không có runtime QA dimension, Sensitive Design Gate chưa triggered, và technical verification vẫn cần?

Một approval tổng quát không trả lời câu nào mà reviewer muốn sửa. Nếu một quyết định thay đổi scope/semantics, revise Proposal/Analysis và tạo review packet mới trước khi tiến tiếp.

## Analysis conclusion and next action

NO_SPEC_BEHAVIOR_CHANGE. Đề nghị Gate 1 chấp nhận no-spec governance path có giới hạn. Sau approval rõ ràng, mới có thể đặt skip_specs: true và kiểm CLI state theo workflow; không tạo spec mang tính hình thức. Turn này dừng tại AWAITING_HUMAN_REVIEW. Không có quyền Specs, Design, Tasks, Apply, VERIFY, QA, Sync/Archive hoặc deployment.

## Reviewed artifact hashes

Tool/command: Get-FileHash -Algorithm SHA256 -LiteralPath <exact path>; lowercase hexadecimal của exact file bytes. Path set được sắp xếp theo repository-relative path.

| Repository-relative path | SHA-256 |
| --- | --- |
| openspec/changes/development-usability-and-iteration-control/analysis.md | 2bc75fe68b51986341b32088ba387ac07cfa23684b95a28d216b73dad15e9508 |
| openspec/changes/development-usability-and-iteration-control/proposal.md | e5ee5c6e47c86de9b5a8dba53a0129732f3d041dad7fb6cba05f8ff44333e955 |

## Exact Proposal content

~~~markdown
## Why

Một số change YUTA hoàn tất implementation và automated checks nhưng developer vẫn chưa thể chạy và dùng feature an toàn trong local/dev; phản hồi Product thủ công đến muộn, sau VERIFY/QA nặng. Các blocker environment/evidence/harness cũng có thể kéo dài vòng diagnosis → recovery → rerun dù chưa xác lập Product defect. Cần một vòng phản hồi sớm, có giới hạn, mà vẫn giữ nguyên các gate và bằng chứng bắt buộc.

## What Changes

- Bổ sung `DEV_USABLE` và `MANUAL_TEST_READY` như hai assertion có điều kiện sau Apply, không phải stage mới. Khi áp dụng, chúng xác nhận runtime/dev data/identity và hướng dẫn để developer và human Product reviewer thực sự dùng feature; thay đổi không có flow tương tác được ghi `NOT_APPLICABLE` với lý do.
- Ghi `HUMAN_PRODUCT_VALIDATION` riêng cho manual Product feedback trước formal VERIFY/QA khi có flow tương tác; phản hồi `CHANGES_REQUESTED` chỉ cho phép `LOCAL_CORRECTION` trong approved scope. Thay đổi requirement, authority hoặc durable boundary quay lại gate sở hữu.
- Mở rộng anti-loop/evidence-stop hiện có bằng `ITERATION_STOP_CONTROL`, blocker lineage, hai recovery attempts và ba execution generations (gồm lần đầu), cùng bốn quyết định human `FIX`, `ACCEPT_LIMITATION`, `SPLIT_CHANGE`, `DEFER_OR_CLOSE`. Không tạo anti-loop rule cạnh tranh hoặc quyền tự tăng budget.
- Làm rõ rằng local/dev usability độc lập với Production Readiness. Giữ Release/Deploy/production authorization ở lane hiện có, và xác định adoption có điều kiện cho change đang hoạt động mà không dựng lại evidence lịch sử.
- Giữ nguyên Gate 1/2, Sensitive Design Gate, Technical Implementation Compliance, VERIFY, QA vocabulary, Browser QA, Gate 3, `$yuta-finish-change`, Sync/Archive/Knowledge Consolidation và deployment authority. Không thêm risk taxonomy `LEVEL_A/B/C`.

## Capabilities

### New Capabilities

- Không đề xuất Product capability hoặc normative main-spec capability mới. Đây là thay đổi quy trình phát triển nội bộ; Analysis phải xác nhận nhánh `skip_specs: true` hay chỉ ra một owner spec-governance hợp lệ trước Gate 1.

### Modified Capabilities

- Không đề xuất thay đổi requirement của Product capability hiện có.

## Impact

- Governance dự kiến: `docs/YUTA_WORKFLOW_V3.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, Control Tower/Page Chat prompts, handoff template và `.agents/skills/yuta-run-change/SKILL.md`; Analysis phân loại chính xác từng owner và xác định có cần thay đổi `$yuta-finish-change` hay không. Không sửa các nguồn này trong Proposal/Analysis.
- Không thay đổi YUTA application UI, Product runtime, schema, API, tenant/authorization, dữ liệu, QA status, lifecycle dimension hoặc production deployment. `CROSS_MODULE: YES`; `UI_AFFECTING: NO`; Browser QA cho chính governance change này không áp dụng.
- Adoption đề xuất bắt đầu sau finalization được human cho phép và thành công đối với governance change này trong canonical workflow authority, không theo ngày hardcoded: DONE/archived và no-spec đã hoàn tất không bị áp lại; active pre-Apply áp dụng khi thích hợp; active đã ở Apply/VERIFY/QA chỉ opt-in theo quyết định human; historical PASS/FAIL/BLOCKED giữ nguyên.
- Rủi ro cần Gate 1 xem xét: checkpoint bị hiểu thành gate mới, manual Product feedback bị nhầm là QA, bộ đếm bị reset bằng đổi tên blocker, limitation bị dùng để che required evidence, hoặc adoption tự rewind in-flight work. Mỗi trường hợp phải có boundary rõ trong Analysis và review.
~~~

## Exact Analysis content

~~~markdown
# Change Analysis

## Scope and Change Type

`development-usability-and-iteration-control` là change governance `CROSS_MODULE: YES` cho quy trình phát triển YUTA. Scope nhỏ nhất gồm hai assertion có điều kiện sau Apply (`DEV_USABLE`, `MANUAL_TEST_READY`), `HUMAN_PRODUCT_VALIDATION`, ranh giới `LOCAL_CORRECTION`, phần mở rộng anti-loop `ITERATION_STOP_CONTROL`, và phân biệt local/dev usability với Production Readiness. Change này không tạo Product capability hoặc sửa requirement của capability trong `openspec/specs/**`.

`UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO` đối với chính change governance này. Không đổi application UI, Product runtime, schema/migration, API, data owner, tenant/authorization, provider/device, QA status, lifecycle dimension hoặc deployment. Giữ Gate 1/2/3, Sensitive Design Gate khi áp dụng, TIC, VERIFY, QA, Browser QA, finish, Sync/Archive và Release/Deploy.

## Sources Consulted

- Repository và quy trình: [root AGENTS.md](../../../AGENTS.md), [documentation index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Workflow v3 guide](../../../docs/YUTA_WORKFLOW_V3.md), [Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md), [Development Workflow](../../../docs/DEVELOPMENT_WORKFLOW.md).
- Nguồn vận hành: [Control Tower v3.1](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [Page Chat v3.1](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md), [Control Tower handoff](../../../docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md), [yuta-run-change](../../../.agents/skills/yuta-run-change/SKILL.md), [yuta-finish-change](../../../.agents/skills/yuta-finish-change/SKILL.md).
- Phân tách authority: [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md), [Deployment](../../../docs/operations/DEPLOYMENT.md), [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), `openspec/config.yaml`, `openspec/schemas/yuta-spec-driven/schema.yaml`, inventory hiện tại của `openspec/specs/**` và active/archive changes.
- Ví dụ lịch sử, không phải approval cho change này: [Pointage Gate 3](../../../docs/reviews/pointage-usable-raw-clocking/03-final-review.md). Request hiện tại của người dùng cho phép Proposal, Analysis và chuẩn bị Gate 1; các shaping decisions chưa tự sửa canonical authority.

## Authority and Product Decision

[Workflow v3 guide](../../../docs/YUTA_WORKFLOW_V3.md) là nguồn canonical dễ đọc; [Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md) và project-owned skills giữ trách nhiệm chi tiết/thực thi. [Control Tower v3.1](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) sở hữu anti-loop/evidence-stop rule hiện có. [Authority Model](../../../docs/AUTHORITY_MODEL.md) tách Product Intent, Implemented State, Operational Behavior và Production Readiness. OpenSpec change artifacts chưa là normative authority trước các gate/finalization cần thiết.

Người dùng chỉ cho phép tạo change shell, Proposal, Analysis và Gate 1 packet, đồng thời chấp nhận hướng shaping có giới hạn. Gate 1 chưa duyệt adoption vào canonical authority hoặc edit nguồn/skill nào. Không suy ra quyền tạo Specs, Design, Tasks, Apply, VERIFY, QA, sync, archive hoặc deploy. Product Version là change khác, ngoài scope.

## Current Implemented State

- [Control Tower anti-loop rule](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) đã giới hạn attribution → correction → revalidation, yêu cầu ghi affected claim/attempts/acceptance authority và dừng khi còn thiếu mandatory evidence. [Page Chat](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md) và [handoff template](../../../docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md) nhắc lại ranh giới đó theo vai trò của mình. Chưa có numeric budget hoặc causal-lineage accounting.
- [Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md) và [yuta-run-change](../../../.agents/skills/yuta-run-change/SKILL.md) hiện đi từ Apply sang formal VERIFY, rồi QA và Gate 3. Apply đã cho sửa technical defect trong approved behavior và đưa thay đổi Product/durable boundary về gate sở hữu. Chưa ghi hai post-Apply assertion hoặc manual Product verdict được đề xuất.
- [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md) chỉ có `PASS | FAIL | BLOCKED_BY_ENVIRONMENT | NOT_APPLICABLE`, bắt buộc Browser QA cho UI-affecting change và chỉ cho safe bounded environment recovery. Không QA status nào là manual Product verdict.
- [yuta-finish-change](../../../.agents/skills/yuta-finish-change/SKILL.md) đã kiểm lại Gate 3 được duyệt và artifact integrity trước finalization. Chưa chứng minh thiếu một enforcement bắt buộc riêng ở finish cho các checkpoint mới.
- Không tìm thấy active/archived change tương đương hoặc normative workflow-governance spec owner. Shell này chỉ có metadata, Proposal và Analysis; chưa có implementation/runtime evidence cho control đề xuất.

## Affected Boundaries

| Boundary | Kết luận |
| --- | --- |
| Development workflow cross-module | Có ảnh hưởng: checkpoint, manual feedback và anti-loop instruction; không thêm canonical stage/gate. |
| Product runtime, data, tenancy, authorization, API | Không ảnh hưởng; đề xuất sau này vượt boundary phải quay về owner/gate phù hợp. |
| QA và Browser QA | Giữ status, mandatory evidence và Gate 3 readiness hiện có; manual Product validation là record khác trước formal VERIFY/QA. |
| Production/operations | Giữ readiness/deploy authority riêng; `DEV_USABLE: YES` không cho phép production. |
| Evidence lịch sử | Không dựng lại, relabel hoặc tự rewind. |

### Governance ownership inventory

`MUST_CHANGE` chỉ nhận diện edit tối thiểu **sau approval tiếp theo**, không cấp quyền edit ở turn này. `MAY_CHANGE` cần phát hiện cụ thể về sau. `NO_CHANGE` giữ owner hiện tại.

| Candidate | Phân loại | Lý do owner |
| --- | --- | --- |
| `docs/YUTA_WORKFLOW_V3.md` | `MUST_CHANGE` | Canonical guide phải đặt assertions và adoption exception mà không thêm stage. |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md` | `MUST_CHANGE` | Quy trình chi tiết sở hữu checkpoint records, counter/stop semantics và ngoại lệ earliest-missing-gate. |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | `MUST_CHANGE` | Sở hữu anti-loop rule hiện có; `ITERATION_STOP_CONTROL` mở rộng rule tại đây. |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md` | `MUST_CHANGE` | Evidence-stop/routing của Page Chat phải tham chiếu cùng control và truyền quyết định checkpoint áp dụng. |
| `docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md` | `MUST_CHANGE` | Handoff đang nhắc lại anti-loop wording; cần mang lineage/counter/decision context mà không thành authority thứ hai. |
| `.agents/skills/yuta-run-change/SKILL.md` | `MUST_CHANGE` | Orchestration thực thi phải đánh giá post-Apply assertions và dừng cho human Product feedback trước formal VERIFY/QA. |
| `.agents/skills/yuta-finish-change/SKILL.md` | `MAY_CHANGE` | Finish đã kiểm Gate 3 integrity. Chỉ sửa hẹp nếu sau này chứng minh Gate 3 packet không đủ enforcement cho checkpoint/grandfathering; hiện chưa có lý do `MUST_CHANGE`. |
| `docs/YUTA_QA_PROTOCOL.md` | `NO_CHANGE` | Giữ QA vocabulary, Browser QA và Gate 3 criteria; manual Product review ở ngoài QA. |
| `docs/LIFECYCLE_STATUS_MODEL.md` | `NO_CHANGE` | Assertions là workflow records, không phải Product/Environment/Readiness dimensions mới. |
| `docs/operations/PRODUCTION_READINESS.md`; `docs/operations/DEPLOYMENT.md` | `NO_CHANGE` | Đã sở hữu production gates và deployment mechanics riêng. |
| `docs/CURRENT_STATE.md`; `docs/PRODUCT_KNOWLEDGE.md`; `docs/MODULE_REGISTRY.md` | `NO_CHANGE` | Không đổi Product capability, runtime state hoặc lifecycle row. |
| `openspec/config.yaml`; custom schema; generated `openspec-*` skills | `NO_CHANGE` | Artifact graph hiện có đủ dùng; không đề xuất stage/artifact/schema mới. |

## Lifecycle Baseline

Đây là change governance nội bộ, không phải restaurant Product capability có row trong Module Registry. Không tạo hoặc promote Product Decision, Implementation, Environment Availability, Production Readiness hay External Dependency value mới. Với workflow record, Proposal/Analysis đã được chuẩn bị, Gate 1 còn pending và control đề xuất chưa được implement. Evidence/lifecycle của feature hiện có vẫn độc lập. Một feature dev an toàn có thể về sau ghi `DEV_USABLE: YES` khi Production Readiness được đánh giá riêng vẫn là `NOT_READY` hoặc `BLOCKED`; `DEV_USABLE` không phải lifecycle value thay thế.

## Requirement Readiness

**Đề nghị Gate 1 chọn A — `NO_SPEC_BEHAVIOR_CHANGE` với nhánh `skip_specs: true` hợp lệ sau approval.** Main specs hiện có mô tả requirement của Product capability có giới hạn; inventory không có workflow-governance spec owner. Request này đổi repository workflow authority và agent skill, nhưng không đổi input/output/state contract của Product capability trong `openspec/specs/**`. Tạo Product spec mới chỉ để zero-delta validation PASS sẽ trùng authority Workflow v3. Shell hiện chưa có `skip_specs` marker; chỉ đặt marker và kiểm CLI state sau khi Gate 1 chấp nhận chiến lược này. Không tạo Spec, Design hoặc Tasks ở đây.

Shaping decisions đủ để Gate 1 xem xét governance requirement có giới hạn. Không có Product requirement conflict chưa giải quyết bắt buộc phải viết spec trước review. Kết luận là `NO_SPEC_BEHAVIOR_CHANGE`, với điều kiện Gate 1 xác nhận no-spec classification và scope chính xác. Nếu Gate 1 tìm được normative workflow-governance spec owner thật hoặc Product contract thay đổi, quay lại Analysis để chọn delta có giới hạn; không tự thêm spec mang tính hình thức.

### Placement and applicability assessment

- Vị trí trong flow hiện tại: outcome và TIC evidence của `Apply` → các assertion `DEV_USABLE`/`MANUAL_TEST_READY` khi áp dụng → `HUMAN_PRODUCT_VALIDATION`/bounded local correction khi áp dụng → Technical Compliance Matrix và formal `VERIFY` → `QA` → Gate 3. Targeted checks trong Apply vẫn chạy. Đây là conditions/records, không phải top-level stages hoặc QA statuses riêng.
- `DEV_USABLE = YES | NO | NOT_APPLICABLE`: `YES` cần local/dev runtime chạy an toàn, dev/test data và identity thích hợp khi cần, cùng basic flow đã được thực hiện qua real intended boundaries. `NO` nêu trở ngại thật; `NOT_APPLICABLE` nêu lý do không có runtime/user flow tương tác. Trước khi đánh giá, record ở trạng thái pending, không là kết quả thứ tư.
- `MANUAL_TEST_READY = YES | NO | NOT_APPLICABLE`: khi áp dụng, `YES` ghi command/runtime, route/entry point, safe dev/test data, test identity/credential khi cần, basic flow kỳ vọng, reset/retry procedure và dev-only limitations. Đây là chuẩn bị cho human test, không phải formal Browser QA. `NO` nêu thiếu sót; `NOT_APPLICABLE` nêu lý do không có human-operable flow.
- `HUMAN_PRODUCT_VALIDATION = ACCEPTED | CHANGES_REQUESTED | BLOCKED` chỉ áp dụng cho interactive flow phù hợp. Trước human decision, record chờ phản hồi, không mặc định `ACCEPTED`. Verdict Product/manual này không thay technical VERIFY, QA hoặc Gate 3.
- Interactive runtime/user-flow change: hai assertions áp dụng; human reviewer cho verdict. `CHANGES_REQUESTED` chỉ cho `LOCAL_CORRECTION` nếu nằm trong toàn bộ approved boundaries; ngoài ra là `SCOPE_CHANGE_REQUIRES_REVIEW` về gate sở hữu.
- `LOCAL_CORRECTION` đòi hỏi giữ nguyên approved Product requirement/scope, authorization/role/permission semantics, schema, API/contract, data ownership, business semantics, sensitive durable boundaries và acceptance criteria. Copy/layout/focus cũng escalate nếu đổi semantic requirement đã duyệt. Correction được kiểm targeted checks liên quan và human review lại khi kết quả đã đổi.
- Non-interactive code/library change: pure deterministic library không có interactable runtime/user flow ghi `NOT_APPLICABLE` có lý do cho cả hai, human validation applicability `NO`; targeted technical checks và VERIFY vẫn áp dụng. Non-UI service có dev runtime/manual flow thật phải đánh giá assertion liên quan, không được miễn chỉ vì `UI_AFFECTING: NO`.
- Docs/governance-only change: không có feature runtime/manual Product flow, hai assertions `NOT_APPLICABLE` có lý do, human validation applicability `NO`. Technical review/VERIFY và QA classification trung thực vẫn riêng. `NO` chỉ dùng khi đã xác lập không thể dùng/chuẩn bị; pending không được gán `NO` giả.

### Existing anti-loop integration and counter assessment

[Control Tower rule](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) vẫn là anti-loop authority duy nhất. `ITERATION_STOP_CONTROL` đặt tên cho conditional stop decision và thêm accounting; workflow/skill tham chiếu rule đó, Page Chat/handoff truyền facts đến nó. Không cần rule cạnh tranh, Gate 4 hoặc retry infrastructure.

`BLOCKER_LINEAGE = affected claim + blocker class + evidenced causal root cause`. Ghi stage và evaluator purpose cho mỗi occurrence, nhưng đổi wording hoặc qua stage mới không tự reset lineage/history. Nếu root cause ban đầu chưa biết, dùng provisional identity và reconcile occurrences khi evidence chứng minh cùng/khác cause; không bỏ các count cũ vì đổi nhãn. Product/implementation defect mới được chứng minh có finding và bounded remediation riêng, trong khi lineage cũ vẫn hiển thị.

`MAX_RECOVERY_ATTEMPTS = 2`: chỉ tiêu thụ một attempt sau khi corrective/recovery action thực sự diễn ra **và** observation cho thấy cùng causal blocker vẫn còn. Read-only diagnosis không tiêu thụ. `MAX_EXECUTION_GENERATIONS = 3`, gồm initial run: trong cùng lineage và cùng stage/evaluator purpose, mỗi lần evaluator/browser/runtime/evidence process tương đương thực sự chạy tính một generation. Rejected preflight không tính. Stage/evaluator purpose khác về bản chất có generation bucket riêng nhưng vẫn thấy shared lineage và recovery history; không được đổi tên retry để có budget mới. Hai counters độc lập; stop sớm hơn là quyết định có hiệu lực. Một run có thể tính một generation và, sau failed corrective action, một recovery attempt. Human exception phải ghi additional bounded count/purpose/stop condition; Codex/Control Tower không tự cấp thêm.

Current orchestration chưa có numeric ledger, nhưng có thể ghi claim, class, cause/provisional cause, stage/purpose, action, executed generation và result trong change evidence hiện có; không thấy accounting bất khả thi. Tính tương đương dựa trên purpose, không chỉ tool name. Startup bị chặn trước evaluator execution là preflight; một run đã thực thi và trả blocker diagnostics là generation. Nếu chưa chứng minh được causal root, giữ provisional record và có thể stop để review thay vì khẳng định lineage mới.

Khi hết budget, retry tiếp theo không an toàn hoặc evidence cho thấy không có tiến triển hữu ích, control dừng tại existing affected gate cho human decision: `FIX` chỉ với Product/implementation defect đã xác lập; `ACCEPT_LIMITATION` chỉ khi approved criteria cho affected claim ở `KNOWN_EVIDENCE_LIMITATION`; `SPLIT_CHANGE` cho workstream riêng mà không mở blocker vẫn bắt buộc; `DEFER_OR_CLOSE` giữ incomplete/historical state, không giả mạo successful Archive. `ACCEPT_LIMITATION` không đổi FAIL/BLOCKED thành PASS, miễn mandatory Browser QA/security/legal/payment/fiscal evidence, sửa history hoặc làm yếu criteria. Mandatory missing evidence vẫn blocking.

### Adoption and compatibility assessment

[Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md) và [run skill](../../../.agents/skills/yuta-run-change/SKILL.md) hiện resume in-flight change tại earliest missing/unapproved gate. Ngoại lệ nhỏ nhất chỉ dành cho **post-Apply usability/manual Product checkpoints mới**: sau khi governance change này được human cho phép và finalization thành công vào canonical workflow authority, active change còn pre-Apply phải dùng checkpoint mới khi áp dụng; active change đã ở Apply/VERIFY/QA không tự rewind chỉ vì trước đây chưa có checkpoint, và chỉ opt-in theo human decision rõ ràng. Các gate/invalidations cũ vẫn theo earliest-missing rule. DONE/archived và completed no-spec work không bị dựng lại. Historical PASS/FAIL/BLOCKED giữ nguyên.

Adoption boundary là finalization thành công, được human authorize, của governance change này với canonical authority changes đã duyệt hiện diện và finish outcome được ghi; không là ngày hardcoded hoặc lần edit workflow file chưa được duyệt. Với no-spec path đề xuất, **không có normative spec sync**; `skip_specs` finalization/Archive là nhánh finish liên quan. Nếu Knowledge Review bắt buộc còn pending, vẫn ghi pending, không giả `DONE`. Đây là ngoại lệ có scope cho adoption text hiện tại, không phải quyền bỏ gate đã áp dụng từ trước.

Không sửa `product-version-management-foundation`. Claim hội thoại trước về Phase 2 authorized nhưng chưa bắt đầu khác với checkboxes đang thấy trong `tasks.md`. Phase state chính xác là `NEEDS_RECONCILIATION` thuộc owner riêng; không chặn Proposal governance và không cho dựng retroactive checkpoint evidence.

## UI / UX Applicability

Change này sửa governance content và agent workflow, không sửa YUTA application UI/interaction. `CROSS_MODULE: YES`; `UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`. Không suy `QA: PASS`; nếu không có user-facing/runtime QA dimension riêng, later approved plan có thể ghi trung thực `QA: NOT_APPLICABLE` theo QA Protocol. Technical review vẫn phải đánh giá document consistency, orchestration behavior và các gate được giữ. Scope hiện tại không trigger Sensitive Design Gate chỉ vì cross-module. Đánh giá lại nếu planning sau này đổi security/authorization, runtime/data owner, provider, irreversible hoặc durable boundary nhạy cảm khác, hay sửa mandatory acceptance rule.

## Conflicts and Unknowns

- `CONFLICT: NONE` giữa current authorities cho bounded proposal. Earliest-missing-gate text hiện có cần ngoại lệ hẹp và prospective nêu trên **nếu** Gate 1 duyệt; chưa được coi là đã sửa.
- `NEEDS REVIEW`: Gate 1 phải xác nhận shaping semantics, budgets, no-spec strategy, authority owners và adoption boundary trước canonical edit. Finish-skill change còn `MAY_CHANGE` cho tới khi có enforcement finding cụ thể; không suy `MUST_CHANGE` chỉ vì file đó được inventory.
- `NEEDS_RECONCILIATION` riêng: Product Version Phase 2 chronology. Ngoài scope và không là governance approval evidence.
- Checkout đang dirty/untracked ở nhiều path khác, kể cả workflow sources. Apply sau này cần exact preimages và scoped attribution; Gate 1 preparation này chỉ sửa artifacts/review packet của change mới.

## Analysis Conclusion

`NO_SPEC_BEHAVIOR_CHANGE`. Scope governance cross-module có giới hạn đã sẵn sàng cho Gate 1 review, với đề nghị `skip_specs: true` sau Gate 1 approval rõ ràng. Không đề xuất Product capability delta, workflow stage mới, QA status, lifecycle value, production authorization hoặc risk taxonomy. Gate 1 packet phải xem xét checkpoint, feedback, correction, blocker/budget, stop decisions, adoption, owner và verification classification nêu trên. Không đi tiếp sang Specs, Design, Tasks hoặc Apply chỉ dựa vào Analysis này.
~~~

## Historical and scope preservation

Không có canonical workflow document, skill, QA rule, lifecycle document, Product Version change, Product runtime hoặc production authority nào được edit trong turn này. Packet này chỉ chuẩn bị quyết định Gate 1; không tự approve.

## Gate 1 approval resolution — 2026-09-23

The historical preparation text and exact embedded Proposal/Analysis above remain unchanged. The current user explicitly approved Gate 1 for `development-usability-and-iteration-control`, its `NO_SPEC_BEHAVIOR_CHANGE` conclusion and `skip_specs: true` strategy, and authorized only Gate 1 approval recording, no-spec setup and applicable Design in this turn. The 15 review questions above are accepted within their recorded bounds; the following clarifications from the current instruction are controlling for Design:

- `DEV_USABLE` and `MANUAL_TEST_READY` are conditional post-Apply assertions with `YES | NO | NOT_APPLICABLE` and pending before assessment. `HUMAN_PRODUCT_VALIDATION` uses `ACCEPTED | CHANGES_REQUESTED | BLOCKED` only for applicable interactive work and is not QA.
- `LOCAL_CORRECTION` cannot change approved Product, semantic, authority, contract or acceptance boundaries. `ITERATION_STOP_CONTROL` extends the existing anti-loop rule, with `MAX_RECOVERY_ATTEMPTS = 2`, `MAX_EXECUTION_GENERATIONS = 3` including initial actual execution, and blocker lineage by affected claim, blocker class and evidenced causal root cause. Stage/evaluator purpose is occurrence context. Human stop decisions remain exactly `FIX | ACCEPT_LIMITATION | SPLIT_CHANGE | DEFER_OR_CLOSE`; required FAIL/BLOCKED evidence cannot be converted to PASS.
- Adoption occurs only after successful human-authorized finalization/archive of this governance change **after** its canonical workflow authority edits have been applied and successfully verified. No calendar date is the primary boundary. DONE/archived and completed no-spec work are grandfathered; active pre-Apply changes adopt applicable checkpoints; active Apply/VERIFY/QA changes require explicit human opt-in without automatic rewind; historical evidence remains immutable.
- `CROSS_MODULE: YES`, `UI_AFFECTING: NO`, `BROWSER_QA_REQUIRED: NO`; final QA status is not inferred. Production Readiness and Release/Deploy remain separate. No `LEVEL_A/B/C` taxonomy or new canonical stage is authorized.

Gate 2 is omitted on this approved no-spec branch. Next authorized action in this turn: set the no-spec marker according to current OpenSpec conventions, confirm CLI status, create applicable `design.md`, then stop for Control Tower review. This approval does not authorize Tasks/TIC, Apply, VERIFY, QA, canonical workflow/skill edits, sync/archive or Product Version reconciliation.
