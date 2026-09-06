## Why

Cloud Access Management chưa bảo vệ nhất quán invariant giữ active OWNER cuối
cùng của mỗi establishment: existing-user attachment có thể bỏ qua guard, còn
hai membership edits đồng thời có thể cùng vượt qua guard rồi để lại zero
active OWNER. Hai lỗi đã được diagnostic trên PostgreSQL dùng một lần xác
nhận; cần một bounded repair trước khi coi invariant này được bảo vệ đầy đủ.

## What Changes

- Bảo vệ active OWNER cuối cùng trong cùng `organizationId + establishmentId`
  trên cả membership edit và existing-user attachment; OWNER ở establishment
  khác không được tính thay.
- Áp dụng cùng quy tắc bảo vệ cho các transition hiện có, giữ nguyên attachment
  upsert/reactivation semantics đối với transition hợp lệ, không đổi actor
  permissions, management allowlist hoặc self-protection.
- Bảo đảm các membership mutations đồng thời trong cùng establishment không
  cùng thành công nếu kết quả tổng hợp loại bỏ mọi active OWNER. Với hai OWNER
  ban đầu và hai yêu cầu loại bỏ họ, kỳ vọng một `SUCCESS`, một
  `LAST_OWNER_REQUIRED`, và còn một active OWNER.
- Giữ transaction atomicity: batch nhiều establishments có một target vi phạm
  phải rollback toàn bộ; không để lại success audit hoặc side effects từ
  transaction bị rollback. Membership ngoài requested scope không đổi.
- Bổ sung deterministic regression coverage qua production repository cho
  edit, attach, edit–edit, edit–attach và attach–attach, cùng allowed/denied
  scope, batch rollback và existing-user identity/password preservation.
- Đề xuất cập nhật documentation trong implementation change để mô tả chính
  xác invariant và transaction semantics đã được review; không tạo Product
  policy mới. Wording conflict phải được review trước khi chỉnh authority.

## Capabilities

### New Capabilities

- `authorization/establishment-owner-preservation`: behavioral contract hẹp
  cho việc giữ active OWNER cuối cùng qua Cloud Access Management mutations,
  bao gồm concurrency và atomic failure. Đây là spec coverage mới cho một
  invariant hiện hữu, không phải một Product workflow mới. Main-spec inventory
  hiện chưa có capability tương ứng; chỉ có các authorization specs riêng của
  Restaurant Knowledge và Formalités.

### Modified Capabilities

Không có main-spec capability hiện hữu cần sửa trong phạm vi đề xuất này.
Không dùng `skip_specs: true`: repair thay đổi kết quả quan sát được của các
thao tác hiện đang thành công sai, và cần contract bảo vệ có thể kiểm chứng.

## Impact

### Ownership and boundaries

- Classification đề xuất: `PAGE_LOCAL`, thuộc Cloud Identity & Access / Access
  Management tại `/parametres/utilisateurs-acces`. Đây không phải change của
  module Establishment Profile dù invariant được partition theo establishment.
- Production boundary dự kiến:
  [tenant-user-repository.ts](../../../packages/db-cloud/src/tenant-user-repository.ts).
  Backoffice action hiện có là consumer; không dự kiến đổi action signature,
  transport schema, UI hoặc role/permission mapping.
- Test boundary dự kiến: thêm focused integration coverage trong
  `packages/db-cloud/test/tenant-user-repository.integration.test.ts`, dùng
  disposable PostgreSQL và integration-test guard hiện có.
- Không đổi database schema, migrations, global identity model, authentication
  contract, tenancy, dependencies hoặc runtime ownership. Không thay đổi
  Personnel, các domain modules khác, POS, Site Agent hoặc Display.
- Cơ chế serialization cụ thể, lock ordering và rollback/deployment risks
  thuộc Design sau các prerequisite/gate; proposal này chưa chốt implementation.
  Nếu thiết kế đòi mở rộng shared permission/security semantics, schema hoặc
  owner khác, phải dừng và phân loại lại scope.

### Authority and evidence

- [DATA_MODEL](../../../docs/architecture/DATA_MODEL.md) và
  [IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
  yêu cầu giữ active OWNER theo establishment.
- `WORDING CONFLICT`: [AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md)
  dùng organization trong câu last-owner; action error cũng dùng organization.
  Diagnostic đề xuất establishment là scope chuẩn, phù hợp hai architecture
  sources trên và query hiện tại. Analysis/Gate 1 phải ghi nhận và review rõ
  kết luận này; proposal không tự sửa hoặc thay thế authority.
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
  giữ broader Access workflow Product Decision ở `NEEDS REVIEW`. Bounded
  invariant repair không phê duyệt toàn bộ workflow hoặc nâng lifecycle status.
- Diagnostic trong task ngày 2026-09-06 xác nhận attachment làm OWNER count
  `1 -> 0`. Diagnostic concurrency dùng PostgreSQL 17.10, `read committed`,
  actual repository và actor/context hợp lệ: sequential control trả
  `SUCCESS / LAST_OWNER_REQUIRED`, còn hai UPDATE được quan sát cùng chờ tại
  row-lock barrier trả `SUCCESS / SUCCESS`, OWNER count `2 -> 0`, hai audit
  commits sau khi thả khóa.
- Runtime evidence trên là disposable diagnostic được ghi trong task, không
  phải production observation, browser QA hoặc committed regression tests.
  Containers đã bị hủy; các tests bảo vệ fix vẫn phải được bổ sung và chạy sau
  khi có implementation authorization.

### Non-goals and approval boundary

- Không quyết định attach có nên trở thành create-only/no-op/reject, không
  redesign reactivation hoặc ownership transfer.
- Không nâng invariant từ active OWNER membership thành usable OWNER principal.
  Việc count membership của DISABLED global user vẫn là câu hỏi Security /
  Product riêng, chưa được giải quyết bởi repair này.
- Không quyết định account lifecycle, invitation, recovery delivery,
  multiple-active-reset-token policy, custom roles hoặc audit requirements mới.
- Không repair/backfill dữ liệu đã có zero OWNER; không chạy trên persistent
  development data, deploy, sync/archive hoặc sửa unrelated working-tree work.
- Artifact này là proposal chưa được duyệt, không phải authority hoặc quyền
  triển khai. Theo [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), cần Analysis
  và Gate 1, Specs và Gate 2 trước Design; security/concurrency design cần
  sensitive-design review trước Tasks/Apply.
