## Why

Bridge v1 dùng một cuộc trò chuyện YUTA — Control Tower làm browser gateway cho mọi yêu cầu. Browser QA đã cho thấy gateway này không thể truy xuất chắc chắn bối cảnh của một Page Chat theo conversation ID; các case `PAGE_CONTEXT_INTAKE` thực với nguồn Page Chat vì vậy còn bị chặn. Cần xem xét một topology transport theo page mà vẫn giữ nguyên thẩm quyền Product và các gate hiện hành, thay vì diễn giải lại Bridge v1 đã được duyệt.

## What Changes

- Đề xuất một capability **Federated Control Towers** riêng để đánh giá hai vai trò transport/điều phối: `GLOBAL_CONTROL_TOWER` cho `CROSS_MODULE`, `UNCERTAIN`, shared architecture và foundation; `PAGE_CONTROL_TOWER` cho một page/module/capability `PAGE_LOCAL`. `CONTROL_TOWER_ROLE`, `CONTROL_TOWER_SCOPE` và `CONTROL_TOWER_INSTANCE` hiện là khái niệm ứng viên, chưa phải field hoặc cú pháp protocol được duyệt.
- Đánh giá khả năng Page Chat phụ trách vận hành vai trò `PAGE_CONTROL_TOWER` trong chính bối cảnh page đó. Vai trò này không cấp thêm thẩm quyền Product/shaping, gate, escalation, recovery hoặc side effect cho Page Chat. Human vẫn quyết định Human Gates; Codex vẫn chỉ thực thi và thu thập bằng chứng.
- Đề xuất bất biến an toàn: **một bridge run chỉ có một `ACTIVE_CONTROL_TOWER` tại một thời điểm**. Cần chứng minh cơ chế chọn target, dừng tower cũ, handoff có nguồn, kích hoạt tower mới, bảo toàn lineage và chống replay trước khi chấp nhận bất biến này.
- Tách context retrieval khỏi authority routing. Truy xuất xuyên chat trực tiếp là nguồn bổ sung khi thật sự khả dụng, không được mặc định là điều kiện duy nhất cho `PAGE_LOCAL`; `PARTIAL`/`UNKNOWN` giữ nguyên ý nghĩa thiếu bằng chứng, và `UNKNOWN` không chứng minh rằng chưa từng có yêu cầu hoặc quyết định.
- Xem xét luân chuyển instance khi hội thoại dài hoặc không còn dùng được. OpenSpec, review/hashes, repository evidence, Knowledge Consolidation và handoff/current-state có nguồn phải mang tính liên tục cần thiết; không dùng toàn bộ lịch sử chat làm kho trạng thái duy nhất.
- Giữ `control-tower-bridge-protocol-v1` làm baseline một gateway độc lập. Change này sẽ xác định quan hệ phụ thuộc/tương thích và mọi extension cần duyệt sau; không tự sửa Spec, Design, Tasks/TIC, skill, prompt, QA hay live behavior của Bridge v1.

### Non-goals

Không fork YUTA Workflow v3, chuyển `PAGE_LOCAL` Product/shaping authority khỏi owning Page Chat, chuyển `CROSS_MODULE`/`UNCERTAIN` khỏi Global Control Tower, tự duyệt Human Gate, hoặc tạo Product authority mới cho Codex. Không tạo protocol handoff grammar, activation ledger, Page Chat prompt, implementation, Product UI/code, API, auth, schema, business logic, provider behavior, deployment hay release ở Gate 1. Không coi các Browser QA case còn thiếu của Bridge v1 là PASS.

## Capabilities

### New Capabilities

- `tooling/federated-control-tower-transport`: Hành vi quan sát được của việc chọn một tower đang hoạt động, routing theo scope, handoff/escalation, luân chuyển instance và bảo toàn identity, evidence, authority khi nhiều Control Tower conversation có thể tham gia.

### Modified Capabilities

Không có trong Gate 1 này. Bridge v1 là active change chưa được sync thành main spec; nếu federation sau này cần sửa hoặc thay thế requirement của baseline, phải được review rõ trong Spec/Gate tương ứng, không âm thầm sửa delta hiện tại.

## Impact

- Phân loại: `CROSS_MODULE / TOOLING + WORKFLOW_GOVERNANCE + CONTROL_TOWER_FEDERATION`; `PAGE_CONTEXT_INTAKE: NOT_APPLICABLE` cho change kiến trúc này.
- Nguồn liên quan: YUTA Workflow v3, Page Chat/Control Tower operating prompts, Bridge v1 protocol và bằng chứng QA hiện có. Các owner implementation và artifact activation/handoff tương lai chưa được chốt; Design và Tasks/TIC sau các gate mới được quyết định.
- Không đổi Product runtime, data, auth, API, shared UI, provider, cấu hình deployment hoặc live ChatGPT context trong bước Proposal/Analysis. Browser transport QA riêng sẽ bắt buộc nếu capability này được triển khai; Product UI QA dự kiến `NOT_APPLICABLE`.
