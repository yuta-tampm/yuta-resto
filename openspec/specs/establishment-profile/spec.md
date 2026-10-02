# Establishment Profile Specification

## Purpose

Capability này xác định hành vi Establishment Profile cho phép editor sao chép có điều kiện thông tin liên hệ chính sang public contact mà vẫn giữ quyền kiểm soát lưu và các boundary hiện có.

## Requirements

### Requirement: Sao chép có điều kiện primary contact sang public contact

Khi editor được phép chỉnh sửa profile kích hoạt copy action rõ ràng, hệ thống SHALL xử lý độc lập từng cặp contact trong current form draft. Source `phone` không rỗng SHALL thay thế `publicPhone`, và source `email` không rỗng SHALL thay thế `publicEmail`. Nếu một source field rỗng hoặc `null`, hệ thống SHALL giữ nguyên public counterpart hiện có trong draft.

#### Scenario: Sao chép cả phone và email không rỗng

- **WHEN** current primary `phone` và `email` đều không rỗng và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL bằng current primary `phone`
- **AND** draft `publicEmail` SHALL bằng current primary `email`

#### Scenario: Phone rỗng và email không rỗng

- **WHEN** current primary `phone` rỗng hoặc `null`, current primary `email` không rỗng và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL giữ nguyên giá trị có trước action
- **AND** draft `publicEmail` SHALL bằng current primary `email`

#### Scenario: Phone không rỗng và email rỗng

- **WHEN** current primary `phone` không rỗng, current primary `email` rỗng hoặc `null` và editor kích hoạt copy action
- **THEN** draft `publicPhone` SHALL bằng current primary `phone`
- **AND** draft `publicEmail` SHALL giữ nguyên giá trị có trước action

#### Scenario: Cả hai source field đều rỗng

- **WHEN** current primary `phone` và `email` đều rỗng hoặc `null` và editor kích hoạt copy action
- **THEN** draft `publicPhone` và `publicEmail` SHALL cùng giữ nguyên giá trị có trước action

#### Scenario: Chỉ source không rỗng được phép ghi đè public value hiện có

- **WHEN** draft có `publicPhone` và `publicEmail` không rỗng, current primary `phone` không rỗng, current primary `email` rỗng hoặc `null`, và editor kích hoạt copy action
- **THEN** current primary `phone` SHALL ghi đè draft `publicPhone`
- **AND** draft `publicEmail` SHALL giữ nguyên giá trị có trước action

### Requirement: Copy action chỉ thay đổi draft và giữ explicit save

Copy action SHALL chỉ cập nhật current form draft và SHALL NOT tự động persist thay đổi. Existing explicit save flow SHALL vẫn là thao tác bắt buộc để persist draft, và existing profile validation SHALL tiếp tục áp dụng khi save.

#### Scenario: Copy tạo unsaved draft nhưng không tự persist

- **WHEN** ít nhất một source contact không rỗng làm thay đổi public counterpart sau copy action
- **THEN** form SHALL chứa thay đổi chưa lưu tương ứng
- **AND** persisted Establishment Profile SHALL giữ nguyên cho đến khi editor kích hoạt explicit save thành công

#### Scenario: Validation hiện có vẫn áp dụng khi save

- **WHEN** editor kích hoạt explicit save sau copy action
- **THEN** hệ thống SHALL áp dụng existing Establishment Profile validation trước khi persist draft
- **AND** copy action SHALL NOT bypass validation đó

### Requirement: Public contact không đồng bộ tiếp diễn với primary contact

Copy action SHALL là một one-time draft operation và SHALL NOT tạo ongoing synchronization giữa primary contact và public contact. Sau action, public fields SHALL tiếp tục chỉnh sửa độc lập theo quyền profile hiện có.

#### Scenario: Thay đổi primary contact sau copy không tự cập nhật public contact

- **WHEN** editor đã kích hoạt copy action rồi thay đổi primary `phone` hoặc `email`
- **THEN** public counterpart tương ứng SHALL giữ nguyên giá trị draft được thiết lập trước thay đổi primary đó

#### Scenario: Editor chỉnh sửa public contact độc lập sau copy

- **WHEN** editor thay đổi `publicPhone` hoặc `publicEmail` sau copy action
- **THEN** hệ thống SHALL giữ thay đổi public contact độc lập đó trong current form draft
- **AND** primary counterpart SHALL không bị thay đổi bởi thao tác này

### Requirement: Copy action giữ nguyên permission và capability boundaries

Hệ thống SHALL chỉ cung cấp copy action có khả năng mutate draft cho user có quyền edit/manage Establishment Profile hiện có. Hệ thống SHALL NOT tạo permission mới, bypass tenant hoặc server authorization khi save, thay đổi visibility flags, tạo field mới, chuyển canonical ownership, hoặc ảnh hưởng Restaurant Knowledge, Booking, POS, Display hay company/legal data.

#### Scenario: Read-only user không thể kích hoạt mutating copy behavior

- **WHEN** user chỉ có quyền read Establishment Profile
- **THEN** hệ thống SHALL NOT cung cấp cho user đó copy action có khả năng mutate form draft

#### Scenario: Copy giữ nguyên visibility và dữ liệu ngoài bounded contact draft

- **WHEN** authorized editor kích hoạt copy action
- **THEN** hệ thống SHALL chỉ áp dụng các thay đổi contact draft được quy định cho `publicPhone` và `publicEmail`
- **AND** visibility flags cùng dữ liệu thuộc Restaurant Knowledge, Booking, POS, Display và company/legal scope SHALL giữ nguyên

#### Scenario: Save sau copy vẫn tuân thủ authorization hiện có

- **WHEN** một draft đã qua copy action được gửi qua explicit save flow
- **THEN** hệ thống SHALL áp dụng existing trusted tenant scope và server authorization của Establishment Profile
- **AND** copy action SHALL NOT cấp thêm quyền persist cho user
