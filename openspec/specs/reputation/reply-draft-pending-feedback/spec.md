# Reputation Reply Draft Pending Feedback Specification

## Purpose

Xác định phản hồi nhìn thấy được và ngữ nghĩa truy cập cho nút lưu bản nháp phản hồi Google trên trang Avis của Backoffice, trong khi giữ nguyên thao tác lưu và các ranh giới nghiệp vụ hiện hữu.

## Requirements

### Requirement: Phản hồi chờ chỉ thuộc thao tác lưu bản nháp trên trang Avis

Trên `/visibilite-reputation/avis`, khi một review Google được chọn và form lưu bản nháp phản hồi được hiển thị, hệ thống SHALL giới hạn phản hồi chờ mới vào nút submit lưu bản nháp đó. Hệ thống SHALL NOT áp dụng phản hồi chờ này cho các form, route hoặc thao tác khác.

#### Scenario: Form của review Google được chọn

- **WHEN** người dùng xem form phản hồi của một review Google được chọn trên trang Avis
- **THEN** nút lưu bản nháp SHALL dùng phản hồi chờ được định nghĩa trong capability này khi chính thao tác lưu đang pending

#### Scenario: Luồng feedback trực tiếp giữ nguyên

- **WHEN** người dùng xem feedback trực tiếp trên trang Satisfaction
- **THEN** capability này SHALL NOT thêm nút lưu bản nháp phản hồi Google hoặc phản hồi chờ của nút đó

### Requirement: Nhãn nút phân biệt trạng thái rảnh và đang lưu

Khi thao tác lưu bản nháp không pending, nút submit SHALL giữ nhãn nhìn thấy `Enregistrer`. Khi chính thao tác lưu đang pending, cùng nút SHALL hiển thị một indication nhìn thấy, dễ hiểu và riêng cho hành động lưu bản nháp đang diễn ra. Indication SHALL NOT tuyên bố bản nháp đã được lưu thành công trước khi kết quả lưu được xác nhận.

#### Scenario: Nút ở trạng thái rảnh

- **WHEN** form lưu bản nháp được hiển thị và thao tác lưu không pending
- **THEN** nút submit SHALL hiển thị `Enregistrer`

#### Scenario: Đang lưu bản nháp

- **WHEN** thao tác lưu bản nháp của form đang pending
- **THEN** cùng nút submit SHALL hiển thị indication cho biết bản nháp đang được lưu, tương đương về nghĩa với `Enregistrement du brouillon…`

#### Scenario: Không báo thành công sớm

- **WHEN** thao tác lưu vẫn pending và chưa có kết quả từ luồng lưu hiện hữu
- **THEN** indication trên nút SHALL NOT thể hiện rằng bản nháp đã được lưu thành công

### Requirement: Nút giữ trạng thái vô hiệu hóa và bận đúng với thao tác lưu

Trong lúc thao tác lưu pending, nút submit SHALL tiếp tục bị vô hiệu hóa để ngăn kích hoạt lặp và SHALL phản ánh trạng thái bận trung thực qua ngữ nghĩa truy cập `aria-busy`. Khi không pending, các điều kiện vô hiệu hóa hiện hữu SHALL giữ nguyên. Hệ thống SHALL NOT tạo trạng thái chờ độc lập thứ hai hoặc ngữ nghĩa bận mâu thuẫn cho cùng thao tác.

#### Scenario: Nút đang chờ không thể kích hoạt lặp

- **WHEN** thao tác lưu bản nháp đang pending
- **THEN** nút submit SHALL bị vô hiệu hóa và `aria-busy` của nút SHALL phản ánh trạng thái đang bận

#### Scenario: Điều kiện vô hiệu hóa khi rảnh được giữ nguyên

- **WHEN** thao tác lưu không pending nhưng quyền lưu hoặc nội dung hiện tại không cho phép submit theo quy tắc hiện hữu
- **THEN** nút submit SHALL tiếp tục bị vô hiệu hóa theo các quy tắc đó

### Requirement: Các phần còn lại của form và kết quả lưu được bảo toàn

Việc hiển thị phản hồi chờ trên nút SHALL giữ nguyên trạng thái sử dụng của textarea và phần còn lại của form theo hành vi hiện hữu. Hệ thống SHALL NOT yêu cầu trạng thái bận cho toàn form chỉ vì nút lưu đang pending. Validation, quyền, phạm vi dữ liệu, lưu bền vững, thông báo kết quả và hành vi xuất bản Google SHALL tiếp tục do các luồng hiện hữu quyết định.

#### Scenario: Textarea không bị khóa thêm bởi phản hồi chờ

- **WHEN** nút lưu bản nháp đang pending và textarea vốn được phép sử dụng
- **THEN** phản hồi chờ mới SHALL NOT tự vô hiệu hóa textarea hoặc đánh dấu toàn form là bận

#### Scenario: Kết quả lưu đi theo luồng hiện hữu

- **WHEN** thao tác lưu kết thúc với kết quả thành công hoặc lỗi
- **THEN** form SHALL tiếp tục trình bày kết quả theo hành vi lưu và thông báo hiện hữu, không thay đổi validation, quyền, dữ liệu hay xuất bản Google
