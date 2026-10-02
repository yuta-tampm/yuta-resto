# Change Analysis

## Scope and Change Type

- **Classification:** `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + AGENT_SKILL + CONTROL_TOWER_PROTOCOL`.
- Bridge v1 tạo một contract hành vi tooling cho transport Codex ↔ ChatGPT qua trình duyệt tích hợp. Đây không phải thay đổi Product UI, API, business logic, auth, dữ liệu hay runtime ownership.
- Ranh giới được người dùng quyết định tường minh: **bridge transport authority không phải Product/page workflow authority**. Control Tower là điểm kết nối browser duy nhất của Codex và điều phối bridge; owning Page Chat vẫn định hình `PAGE_LOCAL`; `CROSS_MODULE`/`UNCERTAIN` chuyển Control Tower theo Workflow v3. Nếu một yêu cầu implementation không giữ được tách biệt này, dừng `HUMAN_REQUIRED`.
- Gate hiện tại chỉ gồm Proposal, Analysis và review Gate 1. Specs, Design, Tasks/TIC, skill, prompt patch, Apply, sync và archive chưa được phép.

## Sources Consulted

- Repository instructions và định tuyến: [`AGENTS.md`](../../../AGENTS.md), [`docs/README.md`](../../../docs/README.md), [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md), [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md), [`docs/YUTA_WORKFLOW_V3.md`](../../../docs/YUTA_WORKFLOW_V3.md), [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md).
- Prompt vận hành và review: [`docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [`docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`](../../../docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md), [skill `yuta-run-change`](../../../.agents/skills/yuta-run-change/SKILL.md), [skill `yuta-finish-change`](../../../.agents/skills/yuta-finish-change/SKILL.md), [`docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- OpenSpec: [`openspec/config.yaml`](../../config.yaml), [`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), schema `yuta-spec-driven`, active/archive change inventory và các main capability paths.
- [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md) và [`docs/LIFECYCLE_STATUS_MODEL.md`](../../../docs/LIFECYCLE_STATUS_MODEL.md) được kiểm tra để không gán lifecycle Product cho tooling bridge.
- Các lần Bridge Test trước trong cuộc trò chuyện Control Tower được quan sát như bằng chứng thực nghiệm; không được coi là normative repository authority hoặc QA của change này.

## Authority and Product Decision

- Quyết định hiện tại của người dùng là `PRESERVE PAGE CHAT AUTHORITY`. [`YUTA_WORKFLOW_V3.md`](../../../docs/YUTA_WORKFLOW_V3.md) mục 4 và Page Chat prompt hiện hành giữ `PAGE_LOCAL` tại owning Page Chat; `CROSS_MODULE`/`UNCERTAIN` được escalation theo quy trình đó. Bridge v1 giữ nguyên cách định tuyến này, không sửa Workflow v3 hay Page Chat prompt.
- [`YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md) là prompt vận hành, không thay các nguồn workflow/QA/authority. Phần Bridge Mode dự kiến phải tham chiếu các nguồn đó, không tạo authority Product hoặc gate mới.
- Repository Specs/docs/code và bằng chứng hiện tại kiểm soát câu hỏi về specification/implementation hiện hành theo loại câu hỏi trong Authority Model. Page/domain conversation là nguồn bối cảnh, yêu cầu và quyết định lịch sử; nếu không lấy đủ thì ghi `PARTIAL`/`UNKNOWN`, không suy ra không tồn tại hoặc cho phép tự quyết.
- Human vẫn duyệt các gate và Product decisions bắt buộc. Control Tower command không tự cấp quyền vượt quá repository authority hay quyền người dùng. Commit, push, PR, merge, deploy và release cần quyền riêng phù hợp.

## Current Implemented State

- Repository hiện không có `.agents/skills/yuta-control-tower-bridge/SKILL.md`, không có contract ba block `YUTA_BRIDGE_HANDSHAKE`, `YUTA_CODEX_COMMAND`, `YUTA_CODEX_RESULT` trong prompt Control Tower được theo dõi. Prompt hiện có Existing-State Intake, gate/evidence separation và anti-loop/evidence stop.
- Các lần thử trong hội thoại cho thấy bridge có thể trao đổi nhiều vòng và thực hiện các bước có kiểm soát. Chúng không chứng minh rằng protocol v1 đã được triển khai, rằng mọi trường hợp lỗi browser đã được QA, hoặc rằng cấu hình live ChatGPT Project trùng byte với prompt repository.
- Không có VERIFY hoặc QA repository cho Bridge v1. Không được chuyển PASS của một page change trước đây sang protocol change này.
- Working tree có các thay đổi khác từ trước; chúng không thuộc Bridge v1 và phải được giữ nguyên.

## Affected Boundaries

| Boundary             | Phạm vi Bridge v1                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser transport    | Kiểm tra đúng cuộc trò chuyện người dùng chọn bằng tiêu đề và URL/conversation ID khi có; không hardcode URL lịch sử vào skill. Target không chắc chắn thì không gửi.                                           |
| Protocol execution   | Chỉ lệnh trong block hợp lệ, khớp `PROTOCOL_VERSION` và `RUN_ID`, có stage/action/instructions/evidence/stop; prose ngoài block không thể thực thi.                                                             |
| Result/evidence      | Mỗi lệnh tạo một kết quả có trạng thái và bằng chứng thực tế; `VERIFY_EVIDENCE`, `QA_EVIDENCE`, `KNOWN_EVIDENCE_LIMITATIONS`, `BLOCKERS` tách biệt, dùng `NOT_APPLICABLE`/`NOT_RUN` khi đúng và không bịa PASS. |
| Context routing      | `PAGE_CONTEXT_INTAKE` là đối chiếu bổ sung. Control Tower có thể lấy/routing context nhưng không thay owning Page Chat cho `PAGE_LOCAL`.                                                                        |
| Workflow/lifecycle   | Giữ nguyên Gate 1/2/Design/3, `yuta-run-change`, `yuta-finish-change`, QA/VERIFY và các lifecycle dimensions; terminal bridge state không phải lifecycle status.                                                |
| Product/runtime/data | Không đổi Product UI, shared UI, API, auth, schema, tenant, business logic, provider, database hay runtime topology.                                                                                            |

## Lifecycle Baseline

- Không có capability Product hoặc dòng Module Registry dành riêng cho Bridge v1. Proposal/Analysis chưa gán hoặc nâng `Product Decision`, `Implementation`, `Environment`, `Production Readiness` hay `External Dependency` của bất kỳ module nào.
- Change mới dùng schema `yuta-spec-driven`; trước Gate 1 chưa có Specs, Design, Tasks, implementation, VERIFY hay QA. Trạng thái thử nghiệm trong hội thoại không phải trạng thái lifecycle repository.

## Requirement Readiness

- **Handshake:** `YUTA_BRIDGE_HANDSHAKE` mang version, run ID, nhiệm vụ, vai trò, mode transport, bối cảnh cần đối chiếu, kết quả mong muốn và ranh giới an toàn. Handshake là intake, không cho phép Apply.
- **Command:** `YUTA_CODEX_COMMAND` có `PROTOCOL_VERSION`, `RUN_ID`, `ACTION`, `STAGE`, `INSTRUCTIONS`, `RETURN_EVIDENCE`, `STOP_CONDITION`. Codex chỉ thực thi block tường minh, hợp lệ, khớp phiên; lệnh không rõ hoặc sai lineage phải dừng. Văn bản giải thích không phải lệnh.
- **Result:** `YUTA_CODEX_RESULT` có version, run ID, stage, `STATUS`, kết quả/bằng chứng, và phân biệt VERIFY, QA, limitations, blockers khi áp dụng. Trường không phù hợp được ghi rõ là không áp dụng/chưa chạy thay vì tạo kết quả giả.
- **Terminal:** `DONE`, `HUMAN_REQUIRED`, `BLOCKED`, `STOP` kết thúc hoặc tạm dừng bridge theo nghĩa transport; chúng không thay QA status hoặc lifecycle. Gate chỉ được tiến khi có current-user decision và repository preconditions.
- **Browser safety:** Xác minh target trước khi gửi; nếu target không chắc chắn thì yêu cầu người dùng. Nếu send/delivery không chắc chắn, chỉ xác minh có giới hạn, không gửi trùng âm thầm hoặc đổi hội thoại. Lỗi UI được báo với bằng chứng và dừng đúng mức.
- **Bounded rounds:** Một command → một result → Control Tower đánh giá; vòng mới chỉ bắt đầu từ command tường minh khớp phiên. Tái sử dụng anti-loop/evidence-stop/iteration controls khi áp dụng. Hai giới hạn recovery/evaluator hiện có không phải giới hạn số message của bridge; không tự đặt cap số vòng phổ quát. Nếu sau này cần cap riêng, đó là quyết định cần review.
- **Page context:** Với việc theo trang, Control Tower đối chiếu page/domain, Page Chat decisions, context status `AVAILABLE`/`PARTIAL`/`UNKNOWN` và repository state trước khi điều phối. `PAGE_LOCAL` Product/shaping vẫn ở Page Chat. Với tooling change này, `PAGE_CONTEXT_INTAKE = NOT_APPLICABLE`.
- **Language:** Protocol blocks và field tiếng Anh; cập nhật, blocker, câu hỏi duyệt và báo cáo cho người dùng tiếng Việt. Đây là cách trình bày, không thay authority.
- **Side effects:** Skill dự kiến chỉ quản lý transport/validation/handoff, không định nghĩa lại workflow, không tự duyệt gate, không chạy `yuta-run-change`/`yuta-finish-change` ngoài lệnh và quyền hợp lệ, không tự commit/push/deploy/release.
- Contract có thể viết thành delta Spec mới `tooling/control-tower-browser-bridge`; đây là hành vi tooling quan sát được, không phải thay đổi tài liệu thuần túy. `skip_specs: true` không phù hợp. `READY_FOR_SPECS` không cho phép tạo Spec trước Gate 1 approval.

## UI / UX Applicability

- `UI_AFFECTING: NO`; `PRODUCT_UI_QA: NOT_APPLICABLE`. Bridge dùng browser làm transport nhưng không đổi giao diện YUTA. `UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE` vì không có câu hỏi Product UI/design để công cụ tư vấn thiết kế xác nhận.
- `BRIDGE_TRANSPORT_BROWSER_QA: REQUIRED` ở giai đoạn implementation sau các gate để chứng minh chọn đúng hội thoại, matching version/run, command-only execution, một vòng command/result, human/blocked/stop handoff và xử lý tình huống browser không chắc chắn. QA này không được ghi thành Product UI Browser QA hay coi là đã hoàn tất từ các lần thử trước.
- `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` trong scope hiện tại vì không thay authorization/security, dữ liệu/runtime owner, provider boundary, payment/legal hoặc durable Product boundary. Nếu Design sau này đòi sửa một boundary đó, phải đánh giá lại và dừng trước Tasks/Apply.

## Conflicts and Unknowns

- Xung đột ban đầu giữa “Control Tower-first” và Page Chat-first đã được người dùng giải quyết bằng `PRESERVE PAGE CHAT AUTHORITY`. Không còn requirement-level conflict nếu Bridge Mode chỉ giữ vai trò transport gateway/context router. Nếu draft Spec hoặc implementation chuyển Product authority sang Control Tower, ghi `CONFLICT / NEEDS REVIEW` và dừng.
- **Evidence limitation:** byte identity và trạng thái đồng bộ của prompt live trong ChatGPT Project chưa xác minh được từ repository. Cập nhật file prompt không tự cập nhật Project configuration. Không đưa thao tác đồng bộ live vào allowlist repository nếu chưa có authority riêng.
- **Transport limitation:** khả năng Control Tower lấy mọi Project/Page Chat context tại runtime chưa được chứng minh; protocol phải cho phép `PARTIAL`/`UNKNOWN`, không bịa retrieval. Cách truy cập cụ thể là câu hỏi Design/QA, không cản việc viết contract.
- **Deferred Design questions:** cấu trúc skill, chi tiết parser/validation và cách quan sát trạng thái gửi trong browser sẽ cần thiết kế sau Gate 2; không có quyền tạo chúng ở Gate 1.

## Analysis Conclusion

`READY_FOR_SPECS`

Phạm vi đã được giới hạn bằng quyết định tường minh của người dùng, không cần đổi Workflow v3 hoặc Page Chat prompt. Gate 1 có thể xem xét một capability mới `tooling/control-tower-browser-bridge` theo quy trình Specs bình thường. Allowlist implementation dự kiến sau các gate chỉ gồm skill mới và phần Bridge Mode tối thiểu trong Control Tower prompt, cộng artifact/review của change; mọi nhu cầu sửa core workflow file phải trở về review. Gate 1 approval, nếu có, chỉ cho phép tạo delta Spec; không tự cho phép Design, Tasks, implementation, sync, archive hoặc cập nhật cấu hình ChatGPT Project live.
