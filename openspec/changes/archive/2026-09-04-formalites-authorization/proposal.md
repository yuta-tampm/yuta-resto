## Why

Formalités cần quyền riêng cho dữ liệu draft/workflow mà module này sở hữu;
quyền đọc Personnel của prototype hiện tại không cấp quyền ghi Formalités.
Control Tower đã hoàn tất Discovery/Shaping và yêu cầu prerequisite
`CROSS_MODULE` này trước khi xem xét persistent draft.

## What Changes

- Giới thiệu hai logical operation độc lập: Formalités READ và MANAGE.
  READ cho đọc trạng thái durable thuộc Formalités; MANAGE cho quản lý trạng
  thái đó khi một workflow riêng được phê duyệt và triển khai. Hai quyền không
  tạo ra endpoint, thao tác lưu hay vòng đời draft trong change này.
- Formalités sở hữu ý nghĩa nghiệp vụ của READ/MANAGE. Shared Authorization
  (Identity / Access) sở hữu representation, grant mapping và enforcement theo
  convention Backoffice hiện có.
- OWNER được cấp cả READ và MANAGE; MANAGER và STAFF không được cấp quyền nào.
  READ/MANAGE vẫn là hai operation khác nhau dù grant ban đầu giống nhau.
- Giữ trusted organization, active establishment, verified membership/role và
  fail-closed behavior. Không lấy authority từ browser hoặc global system role.
- Không kế thừa hay thay đổi `personnel.employee.manage` hoặc bất kỳ quyền
  Personnel nào. Prototype chỉ đọc Personnel hiện tại giữ nguyên behavior.
- Bổ sung bằng chứng kiểm tra grant/denial, tính độc lập với Personnel và việc
  sử dụng trusted context, cùng tài liệu đúng phạm vi khi đến Apply.

Không có breaking change dự kiến đối với consumer hiện tại.

## Capabilities

### New Capabilities

- `authorization/formalites`: quyền READ/MANAGE độc lập cho Formalités-owned
  durable state, OWNER-only, enforced qua trusted cloud establishment context.

### Modified Capabilities

Không có. Không sửa requirement của Personnel hoặc
`authorization/restaurant-knowledge`; capability sau chỉ là convention tham khảo.

## Impact

- Runtime: cloud Backoffice; không thay đổi POS, Site Agent hoặc Display.
- Khu vực dự kiến: `apps/backoffice/src/server/auth/permissions.ts`, helper
  server auth phù hợp và focused tests trong `apps/backoffice/test/`; tài liệu
  Identity / Access và Personnel/Formalités chỉ phản ánh prerequisite được duyệt.
- Không cần package, framework, database permission table, schema, migration,
  API công khai, provider hoặc thay đổi membership/session model.
- Sensitive change: YES — authorization và cross-module semantic boundary;
  cần Sensitive Design Gate sau Specs, không tạo Design ở Gate 1.

### Out of scope

Draft persistence/schema/migration/repository/UI; thay đổi Personnel projection;
lưu address, remuneration hoặc probationChoice; PDF/preview; legal templates;
DPAE/DSN workflow; signature/provider; Documents integration; external delivery;
AI/OCR; payroll; MANAGER/STAFF access; Personnel write-back; production enablement;
legal-compliance claims. Không sửa navigation hoặc gate của prototype hiện tại.

### Stop conditions

Trả về Control Tower nếu cần tenancy/security boundary mới, canonical owner
khác, grant ngoài OWNER, cross-runtime behavior, tái sử dụng/thay đổi semantics
quyền Personnel hoặc Product decision ngoài scope authorization đã duyệt.

### Workflow boundary

Lượt này chỉ tạo Proposal, Analysis và Gate 1; dừng chờ human review trước Specs.
Không sync, archive, implement hoặc tự promote lifecycle/readiness.
