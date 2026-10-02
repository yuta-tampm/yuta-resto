# Change Analysis

## Scope and Change Type

- **Phân loại:** `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + CONTROL_TOWER_FEDERATION`. Đây là capability transport riêng, chưa phải phần sửa đổi Bridge v1.
- Bridge v1 hiện dùng một cuộc trò chuyện `YUTA — Control Tower` làm browser endpoint. Browser QA không truy xuất chắc chắn được Page Chat đã chọn theo conversation ID; `PAGE_CONTEXT_INTAKE` trở thành `UNKNOWN` và kiểm tra routing phụ thuộc đã dừng. Đây là lý do cần shaping, chưa phải bằng chứng topology liên bang an toàn hoặc đã triển khai.
- Mô hình ứng viên có `GLOBAL_CONTROL_TOWER` điều phối `CROSS_MODULE`/`UNCERTAIN` và `PAGE_CONTROL_TOWER` giới hạn trong một page/module/capability `PAGE_LOCAL`. Role, scope, instance và active-tower identity hiện chỉ là khái niệm ứng viên, chưa phải field protocol hay activation record được duyệt.
- Gate này chỉ tạo Proposal, Analysis và hồ sơ Gate 1. Không cho phép Spec, Design, Tasks/TIC, implementation, sửa prompt/skill, cập nhật live context, test hoặc nâng lifecycle.

## Sources Consulted

- Authority và workflow: [`AGENTS.md`](../../../AGENTS.md), [`docs/README.md`](../../../docs/README.md), [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md), [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md), [`docs/YUTA_WORKFLOW_V3.md`](../../../docs/YUTA_WORKFLOW_V3.md), [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [`docs/LIFECYCLE_STATUS_MODEL.md`](../../../docs/LIFECYCLE_STATUS_MODEL.md), [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md) và [`docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`](../../../docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md).
- Nguồn vận hành/transport: [Control Tower prompt](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [Page Chat prompt](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md), Bridge v1 [Spec](../control-tower-bridge-protocol-v1/specs/tooling/control-tower-browser-bridge/spec.md), [Design](../control-tower-bridge-protocol-v1/design.md), [Tasks/TIC](../control-tower-bridge-protocol-v1/tasks.md), [skill](../../../.agents/skills/yuta-control-tower-bridge/SKILL.md) và [Browser QA report](../../../docs/reviews/control-tower-bridge-protocol-v1/qa/QA_REPORT.md).
- Đã kiểm tra OpenSpec config/schema và active/archive inventory theo scope tương đương. Không thấy change federation tương đương; change này được pin vào `yuta-spec-driven`.
- Quyết định hiện tại của người dùng `CREATE_SEPARATE_FEDERATED_CONTROL_TOWERS_CHANGE` cho phép shaping riêng đến Gate 1; chưa duyệt kiến trúc ứng viên hoặc gate tiếp theo.

## Authority and Product Decision

- Workflow v3 giữ Product/shaping của `PAGE_LOCAL` tại owning Page Chat. `CROSS_MODULE`/`UNCERTAIN` được chuyển lên Control Tower toàn cục; Human quyết định các Human Gate. Nếu một Page Chat kiêm `PAGE_CONTROL_TOWER`, vai trò transport tương lai chỉ cùng tồn tại với thẩm quyền page đã có, không sinh quyền Product rộng hơn.
- `PAGE_CONTROL_TOWER` chỉ có thể gửi chỉ dẫn thực thi cho Codex sau khi một protocol federation được duyệt riêng xác định identity, provenance, scope và authorization. Điều này sẽ khác rule Bridge v1 “Codex chỉ liên lạc với một Control Tower và không trực tiếp truy cập Page Chats”. Vì vậy Spec/gate mới phải nêu rõ ngoại lệ tương lai; skill Bridge v1 hiện tại không được tự nhận quyền này.
- `GLOBAL_CONTROL_TOWER` vẫn là coordinator/escalation authority cho việc cross-module/uncertain. Page Control Tower phải dừng và handoff khi impact check hoặc bằng chứng sau đó đòi escalation. Không vai trò nào tự duyệt Human Gate, bịa Product decision còn thiếu hoặc coi handoff là quyền Apply.
- `PAGE_LOCAL` có thể kết nối trực tiếp đến đúng Page Control Tower theo mô hình transport ứng viên, không cần đi vòng qua Global cho mọi lượt. Global vẫn nhận handoff khi scope thành `CROSS_MODULE`/`UNCERTAIN` hoặc phát sinh shared architecture/foundation. Chọn target mới cần Human xác nhận hoặc workflow đã được review cho phép, rồi kiểm đúng title và conversation identity.
- Nếu federation đòi sửa authority semantics của Workflow v3, Product authority của Page Chat hoặc chủ thể gate, phải dừng để review governance có thẩm quyền. Gate này không cho phép các sửa đổi đó.

## Current Implemented State

- Bridge v1 Spec R1–R19, skill và tracked prompt mô tả một Control Tower conversation được chọn cho một run. Hội thoại live `YUTA — Control Tower` từng chứng minh một vòng protocol hợp lệ; file prompt trong repository không tự đồng bộ hoặc chứng minh live conversation context.
- Bridge v1 QA hiện `BLOCKED_BY_ENVIRONMENT`: **16 PASS, 6 PARTIAL_EVIDENCE, 2 NOT_RUN**; Gate 3 `NOT_READY`, QA đang tạm dừng. Đây là baseline của Bridge v1, không phải QA federation. Chưa có federation prompt, skill, activation record, implementation hoặc Browser QA.
- Human đã cung cấp định danh Page Chat chính xác. Codex không tự truy cập Page Chat; Control Tower không lấy được nguồn đó một cách chắc chắn và đã loại các cuộc trò chuyện tương tự. `PAGE_CONTEXT_INTAKE = UNKNOWN` và kiểm tra `PAGE_LOCAL` phụ thuộc dừng. Quan sát này chứng minh fail-closed trong tình huống đó, không chứng minh retrieval `AVAILABLE`/`PARTIAL` hoặc handoff authority.
- Working tree có thay đổi dirty/untracked không liên quan. Gate 1 này chỉ sở hữu thư mục OpenSpec mới và review packet của chính nó.

## Affected Boundaries

| Boundary                 | Kết luận Gate 1 và nghĩa vụ chứng minh sau này                                                                                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Active tower             | Bất biến ứng viên: một bridge run chỉ có một `ACTIVE_CONTROL_TOWER` tại mỗi thời điểm. Tuyên bố trong browser/Markdown không bảo đảm loại trừ đồng thời; Design phải định nghĩa activation quan sát được, revocation/fencing và dừng khi không chắc chắn.                                                          |
| Target và identity       | Command/result vẫn phải ràng buộc đúng conversation, `RUN_ID`, round, command và causal lineage. Chuyển tower cần xác minh target mới và nhiều khả năng một `RUN_ID` mới; contract handoff chính xác để giai đoạn sau quyết định. Command/result của tower cũ không được chấp nhận sau handoff.                    |
| Delivery và replay       | Giữ an toàn at-most-once và không resend khi delivery uncertain. Federation phải ngăn split-brain, stale-command replay và double execution xuyên tower, kể cả khi activation/delivery không chắc chắn. Không tự recovery theo phỏng đoán.                                                                         |
| Page context             | Product/shaping context có provenance từ owning Page Chat có thể đến trực tiếp qua transport page-scoped tương lai hoặc explicit read-only handoff được Human cho phép. Cross-chat retrieval ngầm chỉ là nguồn tùy chọn, không phải điều kiện duy nhất. `PARTIAL`/`UNKNOWN` không có nghĩa là không có yêu cầu cũ. |
| Durable state ngoài chat | OpenSpec/review và hash, bằng chứng implementation repository, knowledge sau archive giữ authority cho từng loại câu hỏi. Handoff/activation record có nguồn nằm ngoài lịch sử chat là yêu cầu ứng viên; owner, durability và format chưa chốt. Không dùng toàn bộ lịch sử chat làm kho trạng thái duy nhất.       |
| Instance rotation        | Instance hội thoại mới cần identity rõ, chỉ nạp state có provenance, vô hiệu hóa/fence instance cũ, bảo toàn quyết định Human và causal lineage. Cơ chế thuộc Design sau khi requirements được duyệt.                                                                                                              |
| Authority và lifecycle   | Routing transport không cấp Product authority, gate approval hay lifecycle advancement. Repository evidence kiểm soát implemented state; quyết định Human phải tường minh.                                                                                                                                         |
| Product/runtime          | Gate 1 không đổi Product UI, API, auth, database/schema, business logic, shared UI, provider hoặc deployment topology.                                                                                                                                                                                             |

## Lifecycle Baseline

- Change mới chỉ có Proposal/Analysis. Không nâng `Product Decision`, `Implementation`, `Environment`, `Production Readiness` hoặc `External Dependency` cho module Product nào; không tạo Module Registry row từ bước planning này.
- Bridge v1 vẫn là baseline một gateway độc lập với QA/Gate 3 hiện hữu. Federation không giải quyết blocker QA của v1 và không thừa hưởng bằng chứng PASS của v1. Shaping có thể tiến riêng; mọi quan hệ tích hợp, thay thế hoặc phụ thuộc Bridge v1 readiness sau này cần quyết định tường minh tại Spec/Design/Tasks.

## Requirement Readiness

- Requirements ứng viên có thể bao gồm role/scope/instance identity, chọn một active tower, routing `PAGE_LOCAL` và escalation, handoff/activation có giới hạn, identity phiên mới khi đổi target, chống replay/double execution, durable evidence/state, provenance của page context, instance rotation và backward compatibility. Chúng chưa là normativity.
- Bridge v1 R1/R3/R7/R16 chứa các giả định single gateway và cấm Codex trực tiếp truy cập Page Chat; federated mode tương lai phải **sửa/extend tường minh** đúng phần áp dụng cho mode mới. R2 là context/evidence intake, không hứa cross-chat retrieval tất định. R6/R8/R9 về lineage, delivery fail-closed và một command/một result phải được giữ và mở rộng xuyên tower. R4/R5/R10–R15 về command/result, gate, evidence, scope và language vẫn là baseline. R17–R19 về tracked/live prompt và Browser QA cần acceptance theo từng tower. Mapping này không sửa Bridge v1.
- Khi đổi tower, một `RUN_ID` mới cho conversation mới là yêu cầu ứng viên phù hợp ràng buộc run/target của v1; causal lineage phải liên kết handoff. Gate 1 chưa đặt wire grammar mới. Payload, acknowledgment, thứ tự activation, fencing record và identity fields thuộc Spec/Design sau duyệt.
- Handoff durable tối thiểu cần được đánh giá theo nguồn và đích: role, scope, instance và exact conversation identity; trạng thái terminal/delivery của run cũ; `RUN_ID`/`ROUND_ID`/`COMMAND_ID` và causal lineage; blocker, recovery/evaluator/evidence-stop budgets; Human approvals; artifact hashes; provenance Product/context và gaps; action kế tiếp được phép. Không tạo grammar hay record thật tại Gate 1.
- Với Page Control Tower giữ chính context page của mình, `AVAILABLE` chỉ khi đúng nguồn/đủ provenance và phạm vi context cần thiết quan sát được; `PARTIAL` khi thiếu một phần; `UNKNOWN` khi nguồn/identity hoặc nội dung cần thiết chưa xác minh; `NOT_APPLICABLE` cho việc không theo page. Không trạng thái nào tự trao quyền implementation. Nếu Page Chat Product intent mâu thuẫn current repository implementation, phải báo discrepancy theo hai authority tương ứng, không tự hợp nhất.
- Rotation cần xem riêng Page Control Tower và Global Control Tower: mỗi bên có scope, context và escalation role khác nhau, nhưng cùng đòi target identity mới, handoff provenance, old-instance freeze và stale-command rejection. Restart khi source cũ mất phải dừng nếu không khôi phục được state có thẩm quyền.
- Điều kiện dừng ứng viên: target mơ hồ, delivery uncertain, hai tower cùng nhận active, lineage sai/thiếu, provenance authority/handoff thiếu, context không truy xuất được, activation không chắc chắn. Chọn Human intervention hoặc `BLOCKED`, không suy đoán.
- Behavior federation cần delta Spec riêng; `skip_specs: true` không phù hợp. Gate 1 approval nếu có chỉ cho phép bước Spec tiếp theo và review Gate 2 riêng.

## UI / UX Applicability

- `UI_AFFECTING: NO`; `PRODUCT_UI_QA: NOT_APPLICABLE`. Việc chọn conversation/transport trong browser là bề mặt QA vận hành, không đổi YUTA Product UI. Không cần tư vấn UI/UX ở Gate 1.
- `FEDERATED_BROWSER_QA: REQUIRED` sau implementation: quan sát role routing, đúng target/instance, single-active, switch và fresh run identity, handoff provenance, stale-command rejection, chống replay/double execution, uncertainty stop, Page Chat authority, global escalation, Human Gates và instance rotation. Case chưa hoàn tất của Bridge v1 không được tính là federation QA.
- `SENSITIVE_DESIGN_GATE: TRIGGERED` tạm phân loại vì boundary durable cross-module về authority/activation. Theo Automated Workflow, nếu scope này tiếp tục thì cần Human duyệt `02b-design-review.md` trước Tasks/Apply. Gate 1 cần xác nhận phân loại; chưa tạo Design packet.

## Conflicts and Unknowns

- **Căng thẳng tương thích rõ ràng với v1:** Bridge v1 yêu cầu một Control Tower được chọn và cấm Codex trực tiếp vào Page Chats. Page Control Tower tương lai cần mode mới được duyệt và quy tắc migration/compatibility an toàn. Bridge v1 đang chạy phải giữ nguyên đến khi mode đó được duyệt và triển khai.
- **Chưa có cơ chế exclusivity:** hai chat live có thể cùng tin mình active. Browser-only observation không tự chứng minh atomic ownership. Design tương lai phải có fencing/deduplication hoặc fail closed; nếu không thì không được Apply federation.
- **Cross-chat retrieval không tất định:** QA không truy cập được Page Chat đã chọn bằng conversation ID. Nguồn handoff fallback, Human authorization, provenance và tiêu chí `AVAILABLE`/`PARTIAL` cần requirements; không được thay bằng cuộc trò chuyện tương tự.
- **Durable-state ownership chưa rõ:** nơi lưu, writer/reader, xử lý conflict và staleness cho handoff/activation/current-state chưa được duyệt. Knowledge Consolidation chỉ áp dụng sau archive, không tự làm live activation ledger.
- **Rotation và backward compatibility chưa chốt:** fencing instance cũ/mới, command đang bay, recovery khi chat cũ mất, quan hệ với Bridge v1 QA/Gate 3 cần gate quyết định rõ. Rename không làm đổi causal lineage.
- **Giới hạn live config:** tracked prompt không auto-sync sang conversation operating context. Acceptance tương lai phải kiểm bằng hành vi live tại đúng từng tower được phép, không bằng repo hash hoặc global Project Instructions đơn lẻ.
- **Scope nhạy cảm chưa được duyệt:** nếu Design tương lai đòi xử lý credential, export hội thoại riêng tư, lưu trữ bền mới, thay auth, quyền destructive hoặc điều khiển external provider, ghi `NEEDS_REVIEW` và quay lại gate có thẩm quyền.

## Analysis Conclusion

`READY_FOR_SPECS`

Capability riêng có thể đưa đến Gate 1 vì boundary authority, evidence gap và nghĩa vụ an toàn đã được nêu rõ. Kết luận này phụ thuộc Human review các câu hỏi Gate 1; chưa chốt grammar, implementation architecture hay activation. Nếu federation không thể bảo toàn Workflow v3/Page Chat authority hoặc single-active safety, bước sau phải trả `BLOCKED_NEEDS_REVIEW` thay vì tự suy đoán. Analysis này không cho phép Spec, Design, Tasks/TIC, sửa skill/prompt, implementation, VERIFY, QA hoặc live activation.
