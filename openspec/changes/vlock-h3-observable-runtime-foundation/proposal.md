## Why

Task 3.3 của `repository-format-policy-and-baseline-remediation` đang `BLOCKED / UNCHECKED`: runtime hiện được ghi nhận chưa có hợp đồng H3/native caller và quan sát process, network, filesystem đủ để chứng minh V-LOCK đáng tin cậy. Tách một năng lực tooling nội bộ có thể kiểm chứng và tái sử dụng để giải quyết đúng blocker này, trong khi parent giữ quyền quyết định và kiểm chứng lockfile/graph thật.

## What Changes

- Tạo foundation giới hạn cho việc trích xuất deterministic các tài sản pnpm-native từ nguồn đã ràng buộc, cùng inventory, khoảng byte nguồn và identity H3 có thể tái lập; mọi closure thiếu hoặc mơ hồ phải fail closed.
- Cung cấp caller pnpm-native không khởi chạy CLI/install, với hợp đồng input, settings, loader và output tường minh.
- Cung cấp runtime Linux cô lập, có identity ràng buộc, nguồn chỉ đọc, scratch thuộc quyền ghi, và bằng chứng trung thực về các attempt process, network, registry/store, source/unexpected write và native scratch write/fsync/rename/cleanup.
- Cung cấp synthetic proof cho các cơ chế trên và handoff contract ổn định để parent đánh giá độc lập. Không chạy hoặc phê duyệt V-LOCK trên repository thật trong change này.

## Capabilities

### New Capabilities

- `repository/vlock-native-tooling`: hành vi tooling nội bộ quan sát được cho H3 extraction, native caller, runtime isolation/observation, synthetic proof và handoff identity. Đây là requirement của repository tooling, không phải capability restaurant/product runtime.

### Modified Capabilities

Không có. `repository/artifact-format-validation` thuộc parent active change; change này không sửa delta Spec hoặc acceptance của parent.

## Impact

Classification: `CROSS_MODULE = YES`; `UI_AFFECTING = NO`; `BROWSER_QA_REQUIRED = NO`. Không có UI hay browser flow; runtime/tooling QA tập trung có thể cần sau Technical VERIFY và sẽ được quyết định trong kế hoạch QA, không được predeclare `PASS` hoặc `NOT_APPLICABLE`.

Owner dự kiến: YUTA repository/tooling engineering. Phạm vi có thể cần thay đổi sau các gate gồm tooling scripts, dependency/parser khai báo tường minh, native caller/loader, runtime/container definition, observer và synthetic tests; đường dẫn chính xác và supply sẽ được Design/TIC xét duyệt. Change này cần delta Spec thông thường vì tạo hành vi tooling có input, output, fail-closed và evidence contract cho consumer. Sensitive Design Gate dự kiến bắt buộc vì cô lập thực thi, ranh giới network/filesystem/process và integrity bằng chứng.

Parent tiếp tục sở hữu Task 3.3, exact YUTA input closure, resolved graph thật, independent graph/input approval, real `pnpm-lock.yaml` scratch V-LOCK, raw/semantic comparison và formatting remediation. Child hoàn thành không tự đánh dấu Task 3.3 hoàn tất. Product Version không đổi semantics hoặc trạng thái (`VERIFY: FAIL`; Phase 6 `BLOCKED`). Không cấp quyền production, deployment hoặc lifecycle promotion.

## Non-goals

Không tạo generic sandbox SDK, dependency resolver, CI runner, production isolation system hay security-monitoring platform. Không tính graph repository thật, không chạy V-LOCK thật, không resolve từ registry, không sửa parent, Product Version, `pnpm-lock.yaml`, app/business logic, database hoặc UI. Lượt này chỉ tạo Proposal, Analysis và Gate 1 review; không implement, cài tracer, build image, tạo Specs/Design/Tasks hoặc chạy synthetic harness.
