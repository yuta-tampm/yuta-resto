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
