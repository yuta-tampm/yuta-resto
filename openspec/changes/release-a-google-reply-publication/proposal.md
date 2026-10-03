## Why

Google đã kết nối và lần thử local đã lấy 50 đánh giá thật, nhưng lần thử dùng profile `internal`; nút đăng trả lời vẫn bị khóa và chưa có thao tác provider hay đối chiếu kết quả. Người dùng yêu cầu hoàn thiện toàn bộ Google Release A trên local trước, theo chuỗi A-only đã chốt tại RR-02/RR-03.

## What Changes

- Bổ sung xác nhận văn bản cuối cùng và đăng từng bản nháp Google bằng OWNER/MANAGER; Save vẫn chỉ lưu bản nháp. STAFF chỉ chuẩn bị bản nháp cho đánh giá được giao.
- Ràng buộc xác nhận với đúng phiên bản bản nháp, người thao tác, phiên đăng nhập, tổ chức, nhà hàng và binding Google còn hiệu lực.
- Ghi nhận lần thử đăng và kết quả; đối chiếu bằng đọc Google trước khi xác nhận thành công hoặc cho phép thử lại sau kết quả không rõ. Không tự đăng lại.
- Giao diện hiển thị đúng trạng thái đang đăng, đã được Google xác nhận, thất bại, chưa xác định và bản nháp đã thay đổi; dùng đúng profile `release-a` trong bàn giao local.
- Kiểm chứng chuỗi lấy trang gần đây/lịch sử, làm mới không trùng trong thời hạn mapping, chi tiết, Save, xác nhận và phục hồi trong phạm vi local. Đăng thật chỉ thực hiện sau khi Human duyệt đúng đánh giá và nội dung cụ thể.

### REQUIREMENT_BASELINE

- Authoritative user requirement: "ok, tiếp theo làm gì, tôi muốn hoàn thành hết phần GG này"; lựa chọn phạm vi "Hoàn thiện Release A trên local trước".
- Hard constraints: local Backoffice 3101 và cloud DB local; kế thừa RR-02/RR-03, tenant/session/role guards, temporary provider cache, local work độc lập; không đụng thay đổi đang dở ngoài task.
- Out of scope: staging/production, customer activation, AI, scheduled provider sync, bulk publication, xóa trả lời Google, thay đổi tài khoản Google, rộng hơn Google A hoặc tự nâng readiness/version/lifecycle.
- Observable success outcomes: menu và direct access đúng A; dữ liệu Google có receipt và cache hợp lệ; bản nháp không tự đăng; người có quyền xác nhận đúng nội dung; không báo thành công khi outcome chưa rõ; replay/stale/cross-tenant/STAFF bị từ chối; thao tác tiếp theo rõ ràng.

COLLABORATION_MODE: CODEX_ONLY.
MODE_SELECTION_SOURCE: current user reply "CODEX_ONLY, YES" for this completion task.
COMMIT_AFTER_TASK: YES.
COMMIT_SELECTION_SOURCE: same explicit current-user reply. Commit chỉ sau nghĩa vụ hoàn thành, chỉ phần task được cô lập.

## Capabilities

### New Capabilities

- `reputation/google-reply-publication`: xác nhận và đăng một phiên bản bản nháp Google, ràng buộc quyền và binding, ghi lần thử, đối chiếu kết quả, retry thủ công an toàn.

### Modified Capabilities

Không thay đổi yêu cầu retrieval/exposure hoặc Save pending hiện có. Mọi khóa bổ sung khi đang đăng hoặc outcome chưa rõ thuộc capability publication mới; cơ chế lưu bản nháp thông thường phải giữ hợp đồng hiện tại.

## Impact

Backoffice sở hữu server actions/provider client và giao diện Avis hiện có; `@yuta/contracts` sở hữu payload an toàn; `@yuta/db-cloud` sở hữu persistence và migration của publication. Không thêm runtime/package/framework. Đây là sensitive external-effect/data/security change, cần independent Analysis, Specs, Sensitive Design và final reviews trước các bước phụ thuộc.

Authority: `docs/PRODUCT_RELEASE_ROADMAP.md#bounded-foundation-and-release-a-decisions`, `docs/features/reputation/README.md`, ADR-009, main retrieval/exposure/draft specs và scoped AGENTS. Google `reviews.updateReply` tạo hoặc thay thế một trả lời; thiết kế phải tránh ghi đè thay đổi remote chưa được Human xác nhận. Real publication phải có đúng target/text cụ thể được người dùng duyệt.
