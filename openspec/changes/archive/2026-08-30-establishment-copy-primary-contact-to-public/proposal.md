## Why

Khi số điện thoại và email công khai giống thông tin liên hệ chính, người quản lý hiện phải nhập lại cùng dữ liệu vào hai trường riêng. Một hành động sao chép rõ ràng sẽ giảm thao tác lặp lại mà vẫn giữ nguyên quyền kiểm soát và quy trình lưu hiện tại.

## What Changes

- Thêm một hành động UI rõ ràng trong form Establishment Profile để sao chép có điều kiện các giá trị contact chính hiện tại sang public contact tương ứng:
  - `phone` hiện tại không rỗng sẽ thay thế `publicPhone`;
  - `email` hiện tại không rỗng sẽ thay thế `publicEmail`;
  - nếu một source field rỗng hoặc `null`, public field tương ứng hiện có được giữ nguyên.
- Hành động chỉ cập nhật các trường công khai trong trạng thái form; người dùng vẫn phải lưu rõ ràng qua quy trình hiện tại để persist thay đổi.
- Việc sao chép là thao tác một lần theo yêu cầu, không tạo liên kết hoặc đồng bộ tiếp diễn giữa hai bộ trường.

## Capabilities

### New Capabilities

- `establishment-profile`: Các yêu cầu hành vi chuẩn hóa cho Establishment Profile hiện có, bắt đầu với thao tác sao chép thông tin liên hệ chính sang thông tin liên hệ công khai.

### Modified Capabilities

- Không có; hiện chưa có main spec nào dưới `openspec/specs/**` để sửa đổi.

## Impact

- Ảnh hưởng ở mức cao tới phần contact của trang/form `/etablissement/informations-generales`, trạng thái form và validation hiện có.
- Cần bổ sung kiểm thử hành vi sao chép và bảo toàn trạng thái chỉnh sửa/lưu hiện tại.
- Không cần field, persistence shape, API, provider hoặc external dependency mới.

## Non-goals

- Không tạo field cơ sở dữ liệu mới hoặc thay canonical data owner.
- Không thay đổi permissions hoặc trusted tenant/authorization boundary.
- Không tự động đồng bộ public contact khi primary contact thay đổi sau thao tác sao chép.
- Không thay đổi visibility rules.
- Không thay đổi company/legal data.
- Không thuộc hoặc thay đổi Restaurant Knowledge.
- Không thêm provider hoặc external dependency.
