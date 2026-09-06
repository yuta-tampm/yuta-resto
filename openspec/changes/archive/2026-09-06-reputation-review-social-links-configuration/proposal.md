## Why

YUTA đã lưu và công khai có điều kiện ba liên kết Google, Facebook và Instagram
theo từng établissement, nhưng Backoffice chưa có luồng đáng tin cậy để OWNER
xem và quản lý các giá trị này. Change này khép kín khoảng trống đó trong
Reputation mà không mở rộng OAuth hoặc biến Integrations thành chủ sở hữu dữ
liệu.

## What Changes

- Bổ sung cấu hình Backoffice trong seam hiện có « Visibilité & réputation / Satisfaction client » để OWNER xem, thêm, thay thế hoặc xóa ba liên kết công khai bằng explicit Save.
- Chuẩn hóa ba giá trị nullable ở server: trim khoảng trắng ngoài, blank thành `null`, chỉ nhận HTTPS, giới hạn 2048 ký tự, cấm username/password nhúng trong URL và kiểm tra destination đúng provider/purpose mà không gọi mạng hoặc theo redirect. Google chỉ nhận `g.page`, `maps.app.goo.gl`, đường dẫn `/maps/` trên `google.com`/`google.fr` cùng dot-bound subdomains đủ điều kiện, hoặc đường dẫn `/local/writereview` trên `search.google.com`; `mail.google.com`, `accounts.google.com` và Google property không phục vụ Maps/review bị loại trừ. Facebook và Instagram giữ provider-host boundary riêng.
- Giữ `google_review_url` là nhập thủ công trong slice đầu tiên; không suy ra URL từ Google Business Profile OAuth hoặc location selection.
- Lưu một hoặc nhiều thay đổi trong một mutation nguyên tử, không tạo audit cho no-op, phát hiện stale/concurrent edit thay vì silent last-write-wins, và cho phép reload/retry sau lỗi.
- Ghi audit Reputation cho mutation thực sự, chỉ chứa actor, organization/establishment, provider đã đổi, giá trị trước/sau và timestamp; không ghi token, credential hoặc request dump.
- Giữ feedback-web là consumer công khai hiện hữu: URL hợp lệ đã cấu hình thì CTA hiển thị, `null` hoặc stored value không an toàn thì CTA ẩn; liên kết mở tab mới với quan hệ an toàn.
- Dùng authority hiện có `reputation.settings.manage` cho slice OWNER-only; không cấp quyền mới cho MANAGER hoặc STAFF.

## Capabilities

### New Capabilities

- `reputation/review-social-links-configuration`: Hành vi xem và quản lý ba liên kết review/social thuộc Reputation theo trusted organization + establishment scope, cùng public projection an toàn sang feedback-web.

### Modified Capabilities

Không có.

## Impact

- **Owner dữ liệu/nghiệp vụ:** Reputation; bản ghi `reputation_settings` tiếp tục thuộc organization + establishment.
- **Writer mới:** Backoffice tại route hiện có `/visibilite-reputation/satisfaction`, sử dụng server-side trusted tenant context và `reputation.settings.manage`.
- **Consumer hiện có:** `apps/feedback-web`, chỉ đọc public configuration đã được server resolve theo trusted hostname/tenant mapping.
- **Shared boundaries:** `@yuta/contracts` nếu cần transport schema, `@yuta/db-cloud` cho repository mutation/audit, và Shared Authorization chỉ được tái sử dụng chứ không đổi grant map.
- **Google integration:** OAuth/location selection ở `/parametres/integrations` giữ nguyên và không ghi `google_review_url`.
- **Không có schema/migration theo evidence hiện tại:** ba nullable PostgreSQL `text` columns, composite location uniqueness, timestamps và `reputation_audit_events` với entity `SETTINGS` đã tồn tại.
- **Không thuộc scope:** OAuth expansion, social publishing/import, AI, analytics, QR, generic social-link engine, unrelated refactor, production enablement, migration, data mutation hoặc deployment.
