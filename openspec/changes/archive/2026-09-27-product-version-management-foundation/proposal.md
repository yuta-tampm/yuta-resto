## Why

Các `package.json` hiện ghi phiên bản workspace `0.1.0`, trong khi Backoffice hiển thị literal `YUTA v1.0.0` và Web chỉ ghi “Projet pilote”. Chúng không xác lập một danh tính Product Release nhất quán cho người dùng hoặc các ứng dụng; YUTA cần một nguồn thẩm quyền rõ ràng trước khi hiển thị phiên bản sản phẩm.

## What Changes

- Xác lập một danh tính Product Release YUTA dùng chung, phân biệt phiên bản package/workspace, Product Version, Product Maturity Stage và release name. Release ban đầu đã được Gate 1 duyệt: `YUTA`, `ALPHA` / `Alpha`, `0.1.0-alpha.1`, `Foundation`; biểu diễn ngắn `YUTA Alpha · v0.1.0-alpha.1`. Không tạo stable release ID riêng.
- Dùng đúng sáu maturity stages và public labels canonical: `PROTOTYPE` → `Prototype`, `ALPHA` → `Alpha`, `PRIVATE_BETA` → `Private Beta`, `PUBLIC_BETA` → `Public Beta`, `RELEASE_CANDIDATE` → `RC`, `GENERAL_AVAILABILITY` → `Stable`. Không thêm stage hoặc nhãn canonical khác trong change này.
- Web và Backoffice đọc cùng Product Release authority và hiển thị dấu hiệu phiên bản kín đáo tại footer/shell hiện hữu; không redesign shell. Web thay wording Product Maturity `Projet pilote` bằng biểu diễn đầy đủ; Backoffice thay `YUTA v1.0.0` bằng biểu diễn compact bắt nguồn từ cùng metadata. Hosting metadata không thuộc quyết định này. Maturity Stage của toàn sản phẩm không xác định lifecycle hay availability của bất kỳ capability nào.
- Giữ phiên bản `package.json` là metadata của package/workspace, độc lập với Product Version; không đồng bộ hai loại phiên bản chỉ vì cùng bắt đầu từ `0.1.0`.
- Ngoài scope: capability SHOW/HIDE/LOCK, feature flags, Beta capability matrix, phiên bản theo tenant, database/schema, API chỉ để cung cấp metadata tĩnh, authorization, routing, deployment automation, GitHub Actions, maturity promotion tự động và production authorization.

## Capabilities

### New Capabilities

- `product-release/identity`: Product Release identity, maturity-stage labels và biểu diễn thống nhất cho các consumer trực tiếp, tách khỏi phiên bản package và capability lifecycle.

### Modified Capabilities

- Không có.

## Impact

- Shared authority: `packages/core` cho metadata, stage type/mapping, validation thuần và formatting dẫn xuất nếu cần. Ứng dụng sở hữu vị trí hiển thị; `packages/ui` chỉ được dùng nếu Design chứng minh cần primitive presentation trung lập, không tạo dependency mới chỉ để render Product Version.
- Direct consumers: `apps/web` và `apps/backoffice`, tại marketing footer và authenticated shell/footer hiện hữu. UI thay đổi nên Browser QA desktop/mobile, khả năng đọc, khả năng truy cập và overflow là bắt buộc ở giai đoạn sau.
- `apps/booking-web`, `apps/feedback-web`, `apps/yuta-pos`, `apps/yuta-display` là follow-up compatibility consumers, không phải implementation targets. `apps/site-agent` và reserved `apps/platform-admin` ở ngoài scope. Không thêm database, API, tenant scope, provider hoặc dependency mới cho metadata tĩnh.
- Rủi ro: literal cũ `v1.0.0` và “Projet pilote” có thể gây sai nghĩa hoặc lệch nhãn Alpha; shared metadata có thể bị hiểu nhầm thành bằng chứng deployment hay readiness. Release/deployment và production authorization tiếp tục là lane riêng theo tài liệu operations, không được cấp bởi Product Version.
