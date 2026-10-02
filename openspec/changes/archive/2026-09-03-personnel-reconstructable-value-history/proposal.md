## Why

Lịch sử hồ sơ nhân viên hiện chỉ cho biết loại sự kiện và các trường đã thay đổi, nên không thể tái dựng các giá trị có thẩm quyền trước và sau một lần sửa thông thường. F07 mở rộng đúng capability Personnel hiện hữu để các thay đổi được phê duyệt trong tương lai có bằng chứng giá trị có thể tái dựng, đồng thời giữ nguyên ranh giới quyền, tenant, xung đột phiên bản, chống gửi trùng và ý nghĩa nghỉ việc hiện có. F07 chỉ ghi lịch sử có thể tái dựng cho các mutation có thẩm quyền trở thành current khi commit thành công; future effective date bị loại vì sẽ cần một scheduled/pending Personnel state model riêng với activation, cancellation/change và conflict semantics chưa thuộc scope này.

## What Changes

- Ghi nhận giá trị có thẩm quyền trước và sau cho các nhóm dữ liệu Personnel được duyệt: danh tính, vai trò, điều khoản hợp đồng, thời gian làm việc, ngày vào làm và nghỉ việc.
- Phân biệt `CORRECTION` (giá trị đã lưu trước đó là sai) với `CHANGE` (giá trị cũ từng đúng và giá trị mới có hiệu lực từ một thời điểm nghiệp vụ khác). Với danh tính, `OWNER` chọn ý nghĩa cho mutation; ngày vào làm chỉ được sửa dưới dạng `CORRECTION` và không có ngoại lệ trong F07. Khi một mutation thay đổi nhiều semantic group, classification và conditional metadata được đánh giá riêng cho từng changed group; đây là clarification của multi-group requirement hiện hữu và không đổi ownership hoặc scope.
- Bắt buộc ngày có hiệu lực nghiệp vụ cho `CHANGE` thuộc vai trò, điều khoản hợp đồng và thời gian làm việc. Ngày này chỉ có thể ở quá khứ hoặc hôm nay, không được trước authoritative entry date áp dụng cho mutation và không được sau departure date nếu đã có ngày nghỉ. Future effective dates và scheduled/pending Personnel changes nằm ngoài F07. `CORRECTION` không dùng ngày có hiệu lực riêng.
- Bắt buộc lý do cho correction ngày vào làm, điều khoản hợp đồng, giá trị thời gian làm việc theo hợp đồng và sửa/hủy ngày nghỉ việc. Lý do là tùy chọn cho correction danh tính và vai trò; `CHANGE` không yêu cầu lý do.
- Tạo eager cutover baseline cho mọi dossier Personnel hiện hữu khi F07 được kích hoạt, chính xác một baseline cho mỗi dossier áp dụng. Baseline chỉ thể hiện các giá trị có thẩm quyền hiện hành tại cutover và không bao giờ được trình bày như sự thật lịch sử trước cutover.
- Bảo đảm một mutation Personnel thành công và bằng chứng lịch sử bắt buộc của mutation đó được ghi nhận cùng nhau, không thể âm thầm lệch nhau.
- Giữ lịch sử tái dựng trong khi nhân viên còn gắn với establishment và 5 năm sau ngày nghỉ; sau đó dữ liệu phải đủ điều kiện xóa hoặc ẩn danh không thể đảo ngược theo quy trình privacy Personnel được duyệt, trừ nghĩa vụ pháp lý hoặc legal hold được phê duyệt riêng.
- Mở rộng Historique hiện hữu; không xây dựng lại timeline và không trộn Documents, Registre du personnel, Formalités, gợi ý AI, lịch sử truy cập hoặc audit xác thực.
- Cho phép `OWNER` xem nhóm ngữ nghĩa, `CORRECTION`/`CHANGE`, giá trị trước/sau, ngày có hiệu lực và lý do khi áp dụng, actor và thời điểm ghi nhận trong `Historique`. Giữ giới hạn 50 mục mới nhất; không thêm tìm kiếm, bộ lọc, phân trang hoặc xuất dữ liệu.
- Không mở quyền cho `MANAGER`, không thay đổi ranh giới organization/establishment, không phát hành production và không tái dựng các giá trị quá khứ còn thiếu.

## Capabilities

### New Capabilities

- `personnel/reconstructable-value-history`: Lịch sử giá trị có thể tái dựng cho các dữ liệu nhân viên và quan hệ lao động hiện tại do Personnel sở hữu.

### Modified Capabilities

Không có. Repository hiện chưa có main spec Personnel để sửa đổi.

## Impact

- Hành vi bị ảnh hưởng: luồng sửa hồ sơ F03, luồng nghỉ việc hiện hữu và tab `Historique` tại `/equipe/salaries`.
- Ranh giới kỹ thuật dự kiến cần thay đổi sau khi planning được duyệt: contract Personnel, schema/migration và repository trong `packages/db-cloud`, server action và UI/test liên quan trong `apps/backoffice`.
- Dữ liệu vẫn do Personnel sở hữu trong cloud, luôn được giới hạn bằng organization và establishment đáng tin cậy; quyền `personnel.employee.read/manage` hiện hữu tiếp tục chỉ dành cho `OWNER`.
- Không thêm dịch vụ ngoài, không ghi vào Documents/Register/Formalités, không thay đổi runtime khác và không tạo tuyên bố tuân thủ pháp lý hoặc production readiness.
