## Why

YUTA chưa có authorization contract cho việc quản trị nội bộ các legal template toàn cục thuộc Formalités. Platform Admin hiện chỉ là runtime boundary dự trữ, còn `YUTA_ADMIN`, `YUTA_SUPPORT` và `requireSystemRole` chưa xác lập operation, resource scope hoặc system-only context đủ để cho phép quản trị template mà không tạo tenant bypass.

## What Changes

- Thiết lập một capability Platform Admin bị giới hạn duy nhất cho authorization của GLOBAL YUTA Formalités template resources; Formalités vẫn là semantic owner.
- Định nghĩa năm logical operations độc lập cho đọc template, quản lý draft, gửi review, publish và retire; concrete identifiers sẽ theo convention hiện hữu trong Specs/Design.
- Grant cả năm operations cho `YUTA_ADMIN` bằng mapping tường minh; grant không operation nào cho `YUTA_SUPPORT`; không tạo role mới, inheritance hoặc blanket platform permission.
- Thiết lập trusted system-only authorization context từ authenticated YUTA user, accepted system role và requested operation, không yêu cầu organization/establishment membership và không cấp quyền đối với tenant resource.
- Yêu cầu fail-closed và security-audit behavior ở mức authorization contract.
- Giữ legal opinion và legal-review evidence ở external/manual governance boundary; change này không lưu evidence và không triển khai qualification workflow.
- Không tạo Platform Admin tổng quát, template data model, persistence, UI/API, generation, PDF/DOCX/HTML, signature, Documents handoff, provider integration, tenant permission hoặc production deployment.

## Capabilities

### New Capabilities

- `authorization/platform-admin-formalites-template-administration`: Authorization behavior cho system-only Platform Admin administration của GLOBAL YUTA Formalités templates, gồm explicit operation grants, denial, scope isolation và audit requirements.

### Modified Capabilities

- Không có. Existing tenant-scoped `authorization/formalites` requirements giữ nguyên.

## Impact

- Affected boundaries: portable cloud authentication/system authorization, future `apps/platform-admin` access boundary và Formalités global-resource ownership contract.
- Expected later implementation scope: authorization contracts/guards, focused tests và current authority documentation cần thiết; không có template repository hoặc runtime product surface.
- Existing restaurant Backoffice sessions, tenant resolution, Formalités OWNER-only authorization, Personnel behavior và production readiness không thay đổi.
