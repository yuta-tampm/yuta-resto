## Why

Restaurant Knowledge đã có năm slice mô tả cố định nhưng chưa có khả năng lưu
những phát biểu ngữ nghĩa khác đã được một người có thẩm quyền của nhà hàng chủ
động xác nhận. Change này bổ sung một phạm vi linh hoạt nhưng có ranh giới rõ,
để lưu kiến thức mô tả cấp establishment mà không biến trang thành một ô
`Autres informations` không kiểm soát hoặc tạo nguồn sự thật cạnh tranh.

## What Changes

- Bổ sung slice `Connaissances validées` trên trang
  `/etablissement/informations-generales` cho Restaurant Knowledge.
- Cho phép trạng thái không có item, liệt kê item hiện hành, tạo thủ công, xem,
  sửa và remove item khỏi current active validated knowledge.
- Mỗi item biểu diễn một phát biểu ngữ nghĩa có thể hiểu và tái sử dụng độc lập,
  được một người có Restaurant Knowledge MANAGE chủ động chấp nhận là
  Restaurant Knowledge.
- Mọi thay đổi chỉ có hiệu lực sau một hành động save rõ ràng; không autosave.
  Proposal không quyết định whole-list, per-item hay batch save, và không quyết
  định hard delete, tombstone, archive hay restore.
- Giữ Restaurant Knowledge là canonical owner chỉ khi nội dung là descriptive
  establishment knowledge, chưa thuộc canonical ownership của capability khác,
  không tạo competing source of truth và được tạo/xác nhận thủ công.
- Giữ anti-duplication là Product/manual boundary trong V1; không đọc, ghi,
  đồng bộ hay tự động phân loại dữ liệu của capability khác.
- Reuse `restaurant-knowledge.read` để xem và
  `restaurant-knowledge.manage` để tạo, sửa, remove và save; giữ nguyên grant
  hiện tại cho OWNER/MANAGER và default denial cho STAFF.
- Giữ implementation ban đầu manual-only, Cloud/Backoffice-only và không có
  downstream consumer.
- Không bổ sung candidate/suggestion flow, AI/inference, automatic promotion,
  semantic duplicate detection, taxonomy, scoring, detailed provenance/history,
  provider, publishing hay cross-module/cross-runtime integration.

## Capabilities

### New Capabilities

- `restaurant-knowledge/validated-knowledge`: Hành vi quan sát được cho danh
  sách các phát biểu Restaurant Knowledge đã được người có thẩm quyền xác nhận
  thủ công ở scope establishment, gồm empty/list/create/view/edit/remove,
  explicit save, authorization và các ranh giới non-relationship.

### Modified Capabilities

Không có. Change reuse nguyên trạng normative authorization contract hiện có
cho Restaurant Knowledge READ/MANAGE.

## Impact

- Trang Backoffice hiện có:
  `/etablissement/informations-generales`.
- Restaurant Knowledge domain/persistence trong cloud có thể cần một biểu diễn
  item linh hoạt mới; lựa chọn schema, repository, save granularity và delete
  mechanics thuộc Design sau khi Specs được duyệt.
- Authorization, trusted organization/establishment tenancy và route shell hiện
  có được giữ nguyên.
- Không thêm API, shared contract, permission, role, principal, provider,
  cross-module read/write, POS, Site Agent hoặc Display dependency.
- UI-affecting: `YES`; real Browser QA sẽ bắt buộc trước Gate 3.
