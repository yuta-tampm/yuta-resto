## Why

`Informations générales` đã được phê duyệt là page tổng hợp có Restaurant Knowledge là capability riêng, nhưng slice đầu tiên `Concept & histoire` chưa có behavior được đặc tả để triển khai. Change này khoanh vùng slice đầu tiên theo classification `PAGE_LOCAL`, đồng thời giữ đúng canonical ownership và persistence/domain boundary của Restaurant Knowledge mà không mở rộng sang các section hay consumer khác.

## What Changes

- Bổ sung khả năng xem và nhập thủ công hai nội dung độc lập `Concept` và `Histoire` trong page `Informations générales`.
- Cả hai nội dung đều optional; empty initial state là hợp lệ.
- Một explicit save lưu toàn bộ slice `Concept & histoire`; không autosave.
- Restaurant Knowledge là canonical owner của dữ liệu và persistence/domain boundary; dữ liệu được scope theo establishment, với Organization chỉ là tenancy/access envelope.
- Establishment Profile không sở hữu, không persist và không cấp quyền mặc định cho hai dữ liệu này.
- Technical schema, repository/table, API, field validation và storage representation chưa được quyết định trong change này.
- Loại trừ AI suggestions, automatic learning, detailed provenance/history, Marketing/social integration, external providers, embeddings/vector DB và mọi section Restaurant Knowledge khác.
- View phải dùng Restaurant Knowledge READ (`restaurant-knowledge.read`); edit và explicit save phải dùng Restaurant Knowledge MANAGE (`restaurant-knowledge.manage`). OWNER và MANAGER có cả hai operation; STAFF mặc định không có access. Hai operation không kế thừa `establishment.profile.read` hoặc `establishment.profile.manage`, và tenant/access validation hiện có không thay đổi.

## Capabilities

### New Capabilities

- `restaurant-knowledge/concept-history`: Behavior page-local cho việc xem, sửa và explicit-save hai nội dung optional, độc lập `Concept` và `Histoire` dưới canonical Restaurant Knowledge ownership và establishment scope.

### Modified Capabilities

Không có.

## Impact

- Product surface dự kiến: `apps/backoffice`, route `/etablissement/informations-generales`.
- Data boundary: Restaurant Knowledge sở hữu Concept/Histoire persistence/domain boundary; dữ liệu có semantic scope theo establishment và Organization vẫn là tenancy/access envelope. Concrete schema, repository/table và storage representation chưa được quyết định; Establishment Profile không phải canonical storage.
- Security boundary: change dùng Restaurant Knowledge READ/MANAGE contract đã được chấp nhận, không tạo permission mới và không thay đổi tenancy semantics. `establishment.profile.read` và `establishment.profile.manage` không được tái sử dụng hoặc kế thừa.
- Không thay đổi Booking, Reputation, Personnel, Marketing, POS, Display, public apps, provider hoặc cross-runtime behavior.
