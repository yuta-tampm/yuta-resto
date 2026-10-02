## Why

Trên trang `/visibilite-reputation/avis`, nút lưu bản nháp phản hồi Google đã có trạng thái chờ, tự vô hiệu hóa và báo bận ở chính nút, nhưng nhãn nhìn thấy vẫn là “Enregistrer”. Người dùng cần nhận biết rõ thao tác lưu đang diễn ra mà không thay đổi luồng lưu bản nháp hiện có.

## What Changes

- Chỉ trong `ReviewReplyForm` của trang Avis, hiển thị chỉ báo chờ có nghĩa cụ thể cho thao tác lưu bản nháp khi submit đang pending; giữ nguyên nhãn hành động khi rảnh.
- Giữ nguyên nguồn trạng thái chờ hiện có, việc vô hiệu hóa nút và ngữ nghĩa bận của nút. Không thay đổi cách hoạt động của textarea hoặc toàn form.
- Bổ sung assertion tập trung cho nhãn rảnh/chờ, trạng thái disabled và busy. Browser QA của route thật với một review `GOOGLE` được chọn là bắt buộc ở giai đoạn sau.
- Phân loại `PAGE_LOCAL`, `UI_AFFECTING: YES`, `BROWSER_QA_REQUIRED: YES`. Sau Apply, đánh giá `DEV_USABLE`, `MANUAL_TEST_READY` và `HUMAN_PRODUCT_VALIDATION` theo workflow đã áp dụng; Proposal này chưa tạo kết quả cho các kiểm soát đó.

Change này độc lập với `async-interaction-feedback-foundation`: allowlist pilot cố định của change nền tảng không chứa form Reputation này; trạng thái QA `BLOCKED_BY_ENVIRONMENT` của change đó được giữ riêng.

### Explicit non-goals

- Không đổi Server Action, API, schema/database, `@yuta/ui`, xác thực, phân quyền, role, tenant, assigned feedback, validation hoặc business logic.
- Không đổi điều hướng, trạng thái xuất bản lên Google, provider, cơ chế submit/revalidation, hoặc áp dụng busy cho toàn form.
- Không mở rộng sang form Reputation khác, route `/visibilite-reputation/satisfaction`, hay một nền tảng loading chung.

## Capabilities

### New Capabilities

- `reputation/reply-draft-pending-feedback`: hành vi hiển thị chờ cho nút lưu bản nháp trong `ReviewReplyForm` trên trang Avis.

### Modified Capabilities

- Không có. `reputation/review-social-links-configuration` không sở hữu form lưu bản nháp; change frontend nền tảng đang hoạt động vẫn giữ scope riêng.

## Impact

- Presentation owner dự kiến: `apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form.tsx`; có thể thêm một test component tập trung tại `apps/backoffice/test/` sau các gate cần thiết.
- Luồng `useActionState(saveReplyDraftAction)`, validation, authorization, tenant-scoped persistence, audit, Google publication và shared Button contract không đổi.
- Không có dependency, API, migration, runtime topology hoặc dữ liệu mới. Production readiness và lifecycle hiện có không được promote bởi hồ sơ planning này.
