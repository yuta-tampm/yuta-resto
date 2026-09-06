## Why

Formalités hiện chỉ giữ thao tác chuẩn bị trong bộ nhớ trình duyệt: OWNER rời
trang hoặc tải lại sẽ mất công việc. Sau khi prerequisite phân quyền riêng đã
hoàn tất, cần một draft CDI có thể lưu và mở lại mà không biến bản chụp của
Formalités thành nguồn sự thật mới của Personnel.

## What Changes

- First slice: persistent CDI preparation draft cho một employee đã tồn tại
  trong trusted organization + active establishment. Eligibility chỉ xét
  current Personnel CDI (`employmentTermType = indefinite` trong repository),
  không thêm điều kiện full-time, upcoming, departure hoặc kết luận pháp lý.
- OWNER sử dụng hai quyền độc lập `formalites.read` / `formalites.manage` đã
  được triển khai; MANAGER, STAFF và system-role bypass không được mở. Giữ
  Personnel source-read permission độc lập khi đọc dữ liệu Personnel.
- Formalités sở hữu draft, reconciliation và abandonment; Personnel giữ
  current facts, authoritative mutations, history và revision. Shared
  Authorization giữ representation, grants và server enforcement.
- Draft hybrid gồm employee reference, existing Personnel revision anchor và
  snapshot đúng bảy field đang tạo sáu nhóm hiển thị: `givenNames`, `familyName`,
  `position`, `qualification`, `employmentTermType`, `entryDate`,
  `contractWeeklyMinutes`. Không invent combined identity hoặc field Personnel.
- Chỉ `probationChoice` được phê duyệt làm input nghiệp vụ durable mới của
  Formalités, với ba semantic states được Product duyệt: `UNDECIDED` (À décider),
  `INCLUDE` (Prévoir une période d’essai), `EXCLUDE` (Ne pas prévoir de période
  d’essai). Initial state là UNDECIDED và explicit SAVE vẫn được phép khi chưa
  quyết định. INCLUDE chỉ ghi hướng chuẩn bị mà OWNER muốn, không xác nhận legal
  eligibility/validity, duration, renewal, collective-agreement compliance hoặc
  đưa ra legal recommendation. Không thêm NOT_APPLICABLE hay default INCLUDE/EXCLUDE.
- CREATE → DRAFT; explicit SAVE, REOPEN và EDIT; explicit ABANDONED được giữ
  lại. Không autosave/hard delete. Tối đa một active DRAFT cho organization +
  establishment + employee + formality type; có thể tạo mới sau abandonment,
  không overwrite draft đang active. ABANDON bắt buộc reason theo F5-07;
  `abandonmentReason` là workflow metadata, không phải input nội dung hợp đồng
  thứ hai. Chưa định nghĩa reason enum hoặc transport/storage validation shape.
- Khi mở lại, so source anchor/snapshot với current Personnel; thay đổi liên
  quan phải hiển thị cả hai giá trị, OWNER chọn KEEP DRAFT VALUE hoặc REFRESH
  FROM PERSONNEL. Không silent refresh, Personnel write-back hoặc history merge.
- Current Personnel CDI mới là eligibility authority. Nếu employee của draft
  đã tồn tại trở thành non-CDI, cho READ/REOPEN ở bounded ineligible/recovery
  state, xem snapshot/current values và ABANDON; chặn normal EDIT/SAVE, REFRESH
  để tiếp tục eligible CDI workflow và tạo draft active khác. Không auto-abandon,
  auto-delete, đổi formality type hoặc dùng snapshot CDI cũ để vượt eligibility.
  Khi current Personnel trở lại CDI, re-evaluate và hoàn tất reconciliation
  bắt buộc trước khi normal EDIT/SAVE có thể tiếp tục. KEEP DRAFT VALUE không
  bảo lưu current Personnel eligibility.
- N4 retention/privacy: ACKNOWLEDGED / UNRESOLVED. ABANDONED được giữ lại và
  workflow không hard-delete, nhưng không thiết lập infinite retention.
  N4 không chặn behavioral Specs; bắt buộc giải quyết tại Sensitive Design/privacy
  review trước khi cho phép Apply durable sensitive persistence. Không tự đặt
  thời hạn, tái dùng Personnel retention, legal-hold policy hoặc cleanup job.
- Mở rộng existing employee-connected capability sau các gate; giữ nguồn dữ
  liệu thật, scoped reads và test protection; không thay bằng fixture/greenfield
  mockup. Không đổi prototype trong lượt này.

## Capabilities

### New Capabilities

- `formalites/persistent-draft-foundation`: lưu/mở lại CDI preparation draft,
  lifecycle DRAFT/ABANDONED, cardinality và explicit bounded reconciliation.

### Modified Capabilities

Không có tại Gate 1. `authorization/formalites` được consume, không sửa grants
hoặc nghĩa của prerequisite; `personnel/reconstructable-value-history` giữ
nguyên. Prototype-preservation requirement của authorization chỉ giới hạn
prerequisite đó, không tự cấm một consumer change được duyệt riêng.

## Impact

- Classification: CROSS_MODULE; Discovery/Shaping: COMPLETED theo handoff
  Control Tower hiện tại. Không downgrade PAGE_LOCAL.
- Runtime dự kiến: cloud Backoffice; database boundary theo ADR-003 là
  `packages/db-cloud`; shared transport theo `packages/contracts`. Chưa chọn
  table, columns, constraints, API hoặc component design. Bounded data owner
  cần được ghi rõ trong Gate 1; không promote registry lifecycle.
- Existing prerequisites `formalites-authorization` và
  `next-generated-types-bootstrap` đã archived/DONE; không mở lại.
- Sensitive change: YES — dữ liệu nhân sự, durable cross-module snapshot,
  authorization consumption và migration/privacy. Sensitive Design Gate bắt
  buộc sau Specs; chưa tạo Design.

### Non-goals

Address, remuneration/salary, legal templates, PDF/preview/generation, signature,
DPAE/DSN, payroll, providers, Documents handoff, final contract creation, AI/OCR,
extraction, legal advice/probation calculation, MANAGER/STAFF grants, Personnel
write-back/history changes, generic workflow/sync engine, broad redesign,
production deployment/enablement, migration/cutover execution. Không áp dụng
Personnel retention policy cho Formalités bằng suy đoán hoặc tạo cleanup job.

### Gate boundary

Chỉ Proposal → Analysis → Gate 1, `AWAITING_HUMAN_REVIEW`. Requirement-level
unknowns/conflicts phải được trả lời trước Specs; không implementation, schema,
migration, canonical knowledge update, sync, archive hoặc production claim.
