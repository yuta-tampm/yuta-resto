## Why

Personnel hiện có adapter trích xuất hợp đồng synthetic nhưng feature vẫn gắn với cấu hình runtime/provider cụ thể. Slice 1 đưa một capability typed và kiểm tra eligibility vào luồng hiện có để thay deployment sau này mà giữ hợp đồng nghiệp vụ, authorization và review/apply.

## What Changes

- Lập kế hoạch capability `personnel.contract.extract_fields@1` trong `apps/backoffice/src/server/ai/`, dùng request/result Personnel hiện có.
- Purpose và classification do domain xác định sau khi server kiểm tra các điều kiện nguồn synthetic được phép. Với upload, attestation và PDF guards không chứng minh nội dung là fictional; dữ liệu thật vẫn bị cấm theo policy, không thêm content classifier. Eligibility từ chối real/unknown classification và mọi môi trường ngoài development.
- Deployment config, policy và capability có version riêng; lựa chọn deployment bằng mapping tĩnh, chỉ trong tập eligible.
- Giữ deterministic synthetic mặc định và adapter OpenAI synthetic hiện có, model `gpt-5.6-luna`, prompt `v4`, timeout, schema validation, audit và Human review/apply. Không thực hiện provider call trong tác vụ này.
- Lập kế hoạch observation tối thiểu đã loại nội dung nhạy cảm, các test offline và cập nhật tài liệu hiện hành khi implementation được cho phép.

## Capabilities

### New Capabilities

- `ai/synthetic-personnel-contract-extraction`: hợp đồng typed, eligibility, lựa chọn deployment và observation cho một consumer Personnel synthetic.

### Modified Capabilities

Không có. Không sửa requirements của các main spec hiện có, gồm `personnel/reconstructable-value-history`.

## Impact

- Owner: Backoffice server. Domain Personnel tiếp tục sở hữu authorization, nguồn dữ liệu, validation nghiệp vụ và apply; AI foundation không cấp quyền hay ghi Personnel state.
- Implementation dự kiến chạm `apps/backoffice/src/server/ai/`, `src/server/personnel-contract-extraction/{service,runtime}.ts`, extraction actions và test tương ứng. Adapter, prompt, contracts công khai, persistence và UI giữ semantics hiện tại.
- Không package/dependency/schema/migration/API/UI mới; không ảnh hưởng POS, Site Agent hoặc Display.
- Change artifacts là kế hoạch chưa normative; không sync/archive hoặc nâng lifecycle/readiness.

## REQUIREMENT_BASELINE

### AUTHORITATIVE_USER_REQUIREMENT

Nguồn: cuộc trao đổi hiện tại ngày 2026-10-03. Sau khi thống nhất Slice 1 và xác nhận bước kế tiếp chưa sửa runtime code, người dùng nói `ok, triển khai`. Phạm vi thực thi được ghi nhận là **implementation planning cho Slice 1 only**; tạo Proposal, Analysis, Specs, Design, Tasks và review evidence, chưa Apply.

Tài liệu phản biện được người dùng đưa vào cuộc trao đổi là đề xuất tham khảo. Phạm vi dưới đây được đối chiếu với repository; tài liệu đó không phải provider/legal approval hay một quyết định triển khai production.

### HARD_CONSTRAINTS

- Synthetic only; real personnel data và production SHALL bị từ chối.
- Authorization và exact employee/document version checks trước đọc/chuẩn bị bytes và provider effect; giữ review expiry, audit và Human apply.
- Capability literal SHALL suy ra input/result ở compile time; runtime schema validation vẫn bắt buộc tại trust boundaries.
- Không provider mới, model/prompt mới, tài khoản/key mới, spend hoặc live API call.
- Tác vụ hiện tại chỉ ghi planning/review artifacts của change này; giữ nguyên thay đổi không liên quan trong checkout.

### OUT_OF_SCOPE

Runtime implementation; Storage port/lifecycle/provider; dữ liệu thật; production qualification/enablement; fallback/shadow; benchmark service; tools/jobs; shared `packages/ai`; registry DB; admin selector; framework/dependency mới; main-spec sync/archive; push/PR/merge/deploy.

### SUCCESS_OUTCOMES

1. Bộ kế hoạch có đầy đủ behavioral scenarios, design và tasks có thể triển khai theo đúng giới hạn Slice 1.
2. Test plan chứng minh authorization denial chặn bytes/provider; eligibility denial chặn provider; selection không ra ngoài eligible set; typed mock thay deployment mà consumer giữ nguyên.
3. Test plan bảo vệ schema/version/timeout, review/apply/audit và observation không chứa bytes, prompt, response, secrets hay tenant/personnel identifiers.
4. Gate 1, Gate 2 và sensitive Design Gate có review độc lập trên exact bytes; planning validation và checks được ghi trung thực; local commit chỉ chứa phần kế hoạch được duyệt.

## Task Context

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `Codex một mình (CODEX_ONLY)`.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03: `YES` cho local commit sau khi hoàn tất tác vụ được duyệt; không bao gồm remote Git hoặc deployment.

Delegation: review độc lập cho các gate thường lệ trong planning-only scope theo `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`; không mở rộng quyền sang Apply hoặc quyết định pháp lý/provider.
