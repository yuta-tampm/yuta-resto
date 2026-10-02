## Why

Các lần thử trước đã chứng minh Codex có thể trao đổi nhiều vòng với cuộc trò chuyện YUTA Control Tower qua trình duyệt tích hợp, nhưng contract transport và ranh giới thực thi hiện chỉ nằm trong hội thoại, chưa có authority bền vững trong repository. Bridge v1 cần chuẩn hóa cách kết nối, nhận lệnh, trả bằng chứng và dừng an toàn mà không thay đổi YUTA Workflow v3.

## What Changes

- Định nghĩa contract Bridge v1 cho ba machine block `YUTA_BRIDGE_HANDSHAKE`, `YUTA_CODEX_COMMAND` và `YUTA_CODEX_RESULT`, gồm version, `RUN_ID`, stage, action, evidence và stop condition.
- Giới hạn Codex vào đúng cuộc trò chuyện Control Tower do người dùng chọn và đã xác minh; chỉ block lệnh hợp lệ, khớp phiên mới có thể dẫn đến thực thi. Prose không phải lệnh. Target hoặc trạng thái gửi không chắc chắn phải dừng hay xác minh có giới hạn, không tự chọn cuộc trò chuyện khác hoặc gửi trùng âm thầm.
- Dùng chu trình một lệnh → một kết quả → Control Tower đánh giá; chỉ bắt đầu vòng tiếp theo từ lệnh tường minh mới. Tái sử dụng anti-loop và evidence-stop hiện hành, chưa tự đặt giới hạn số vòng phổ quát mới.
- Control Tower là đầu mối browser bridge duy nhất của Codex và điều phối transport. `PAGE_CONTEXT_INTAKE` chỉ đối chiếu ngữ cảnh; Page Chat vẫn sở hữu Product/shaping cho `PAGE_LOCAL`, còn `CROSS_MODULE` hoặc `UNCERTAIN` chuyển Control Tower theo Workflow v3. Repository quyết định trạng thái implementation hiện tại; ngữ cảnh chưa lấy được là `PARTIAL` hoặc `UNKNOWN`.
- Sau các gate tương ứng, dự kiến thêm skill tái sử dụng tại `.agents/skills/yuta-control-tower-bridge/SKILL.md` và một phần Bridge Mode tối thiểu vào `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`. Protocol block dùng tiếng Anh; giải thích cho người dùng dùng tiếng Việt.

### Non-goals

Không thay đổi thẩm quyền Page Chat, YUTA Workflow v3, gate, Product Decision, VERIFY/QA status hay lifecycle. Không tạo app/API orchestration riêng, tự động duyệt gate, hoặc tự động commit, push, PR, merge, deploy hay release. Không sửa Product UI, auth, API, business logic, database/schema, runtime ownership hoặc các cuộc trò chuyện Page Chat. Không tuyên bố file prompt trong repository đã đồng bộ byte-for-byte với cấu hình ChatGPT Project đang chạy.

## Capabilities

### New Capabilities

- `tooling/control-tower-browser-bridge`: Contract hành vi của transport browser giữa Codex và YUTA Control Tower, gồm handoff, xác minh phiên/lệnh, báo bằng chứng, dừng an toàn và bảo toàn thẩm quyền Page Chat.

### Modified Capabilities

Không có. Bridge v1 không sửa requirement của capability Product hiện hữu.

## Impact

- Phân loại: `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + AGENT_SKILL + CONTROL_TOWER_PROTOCOL`.
- File implementation dự kiến sau các gate: skill mới và phần Bridge Mode nhỏ trong prompt Control Tower; không sửa Page Chat prompt hoặc tài liệu Workflow v3.
- Runtime/data boundary: browser UI là transport; không có Product runtime, API, database, auth, provider hoặc shared UI change.
- Đây là contract hành vi tooling quan sát được nên dự kiến dùng Specs thông thường sau Gate 1; không dùng `skip_specs: true` chỉ vì không đổi Product UI.
- Gate hiện tại chỉ tạo Proposal, Analysis và hồ sơ Gate 1. Specs, Design, Tasks, implementation, sync và archive chưa được phép.
