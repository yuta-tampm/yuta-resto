## Why

Prerequisite `restaurant-knowledge-concept-history` không thể tiến tới Specs vì Restaurant Knowledge chưa có operation-level authorization riêng trong repository. Change CROSS_MODULE này bổ sung policy READ/MANAGE đã được Control Tower phê duyệt vào shared Authorization mechanism hiện có mà không kế thừa Establishment Profile permissions hoặc thay đổi tenancy boundary.

## What Changes

- Định nghĩa hai logical operations riêng biệt cho Restaurant Knowledge: READ và MANAGE.
- Gán READ cho `OWNER` và `MANAGER`; `STAFF` không có READ mặc định.
- Gán MANAGE cho `OWNER` và `MANAGER`; `STAFF` không có MANAGE mặc định.
- Giữ READ và MANAGE là hai logical operations độc lập dù initial grant sets giống nhau.
- Tích hợp representation, grant mapping và fail-closed enforcement vào shared Authorization mechanism hiện có sau trusted tenant resolution.
- Tiếp tục yêu cầu active user, active organization, active establishment, active establishment membership, server-derived tenant context và Restaurant Knowledge operation permission.
- Không cho `YUTA_ADMIN` hoặc `YUTA_SUPPORT` bypass restaurant membership hay Restaurant Knowledge permission.
- Không reuse hoặc inherit `establishment.profile.read` và `establishment.profile.manage`.
- Không thay đổi role/principal set, organization/establishment tenancy boundary, unrelated authorization contracts hoặc cross-runtime behavior.
- Không triển khai persistence, schema, API, UI hoặc behavior của `Concept`, `Histoire` hay section Restaurant Knowledge nào.

## Capabilities

### New Capabilities

- `authorization/restaurant-knowledge`: Shared Authorization behavior cho hai Restaurant Knowledge operations READ và MANAGE, approved role grants, trusted tenant enforcement và no-bypass boundaries.

### Modified Capabilities

Không có.

## Impact

- Shared Backoffice authorization mapping/guards và authorization-focused tests.
- Existing `@yuta/tenant` trusted context resolution, active membership validation và organization/establishment boundary được reuse, không thay đổi.
- Current Identity / Access và Restaurant Knowledge authority documentation cần phản ánh permission policy sau khi change được phê duyệt và triển khai; lifecycle values không tự động được promote.
- Không ảnh hưởng Establishment Profile permissions, persistence packages, contracts, UI routes, public apps, POS, Display hoặc external providers.
