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
