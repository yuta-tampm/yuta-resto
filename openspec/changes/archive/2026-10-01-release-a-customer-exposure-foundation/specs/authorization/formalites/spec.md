## ADDED Requirements

### Requirement: Hosted Formalités access có availability prerequisite độc lập với authorization

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi Formalités entry, navigation, prototype UI hoặc hosted read/mutation, kể cả generic fictional prototype và employee-connected flow. Trong `release-a`, các entry này SHALL không khả dụng; valid Formalités READ/MANAGE, Personnel permission, OWNER membership hoặc development opt-in SHALL NOT mở hosted entry. Direct page, API hoặc Server Action SHALL bị từ chối trước protected read/serialization hoặc workflow effects.

Availability SHALL chỉ giới hạn hosted exposure/admission, không thay representation, operation independence, OWNER-only grants hoặc trusted-context evaluation của Formalités READ/MANAGE. Pure authorization evaluation SHALL vẫn có thể trả đúng grant result theo requirements hiện hành; kết quả allow SHALL NOT tự chứng minh hosted entry khả dụng. Independent Personnel source-read authorization, development gates, session/membership/tenant checks và mọi denial/security protection SHALL tiếp tục bắt buộc, không phụ thuộc availability.

Trong `internal`, hosted entry khả dụng SHALL giữ existing prototype route/navigation/UI behavior dưới current guards. Việc đóng entry trong A SHALL NOT yêu cầu xóa prototype, thay fictional state thành durable authority, thay domain ownership hoặc cấp quyền workflow/production.

#### Scenario: Release A đóng generic prototype dù có quyền hiện hành

- **WHEN** instance dùng `release-a` và user có current trusted context cùng existing route permission mở generic Formalités prototype trực tiếp hoặc qua navigation
- **THEN** hệ thống SHALL không expose prototype/navigation và SHALL từ chối hosted entry trước render hoặc capability read
- **AND** quyền hiện hành SHALL không tạo availability exception

#### Scenario: Release A đóng employee-connected entry dù các grant hợp lệ

- **WHEN** instance dùng `release-a` và OWNER có Formalités grant, independent Personnel source-read authority cùng development opt-in yêu cầu employee-connected Formalités entry hoặc operation
- **THEN** hệ thống SHALL từ chối trước protected employee/draft read, serialization hoặc mutation
- **AND** SHALL không tiết lộ employee/draft existence hoặc thay prior durable state

#### Scenario: Authorization result không mở hosted entry

- **WHEN** pure Formalités READ hoặc MANAGE evaluation trả allow theo trusted context và exact operation grant trong instance `release-a`
- **THEN** grant result SHALL giữ đúng authorization semantics nhưng SHALL NOT cho phép hosted prototype hoặc workflow entry vượt availability denial

#### Scenario: Internal giữ các prerequisite hiện hành

- **WHEN** instance dùng `internal` và Formalités entry khả dụng
- **THEN** prototype và employee-connected flow SHALL vẫn áp dụng existing route access, independent Personnel authorization, development gates và trusted scope checks
- **AND** availability SHALL không cấp grant hoặc bật durable workflow/production

## MODIFIED Requirements

### Requirement: Existing Formalités prototype không đổi

Khi Formalités entry do Backoffice host khả dụng trong profile do server chọn,
prerequisite authorization này SHALL NOT thay đổi current Formalités prototype
routes, development gates, Personnel source-read authorization, navigation hoặc
UI. Việc giữ prototype SHALL bảo toàn source và current internal behavior,
không phải một exception cho hosted availability: generic prototype và
employee-connected entry SHALL không khả dụng trong `release-a`.
Logical operations mới SHALL NOT tự chuyển prototype thành durable workflow
hoặc tự mở quyền cho một route hiện có. Existing development gates, independent
Personnel source-read authorization và scoped employee protections SHALL không
bị bỏ qua hoặc thay thế bởi profile selection hoặc Formalités grant.

#### Scenario: Generic prototype được sử dụng như trước

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và người dùng mở current generic Formalités prototype
- **THEN** existing route access, navigation và UI behavior SHALL giữ nguyên

#### Scenario: Connected prototype giữ source-read và development gates

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và người dùng mở employee-connected Formalités prototype
- **THEN** existing development opt-in, Personnel source-read authorization và scoped employee checks SHALL giữ nguyên
- **AND** Formalités grant SHALL NOT bỏ qua hoặc thay thế các kiểm tra đó
