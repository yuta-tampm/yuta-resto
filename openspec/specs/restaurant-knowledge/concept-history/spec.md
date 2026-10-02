# Restaurant Knowledge Concept & histoire Specification

## Purpose

Capability này cho phép người dùng được ủy quyền xem và quản lý thủ công Concept và Histoire như knowledge chính thức của một establishment trong page `Informations générales`.

## Requirements

### Requirement: Concept và Histoire thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của Concept và Histoire cùng persistence/domain boundary của chúng. Hai giá trị SHALL được scope theo establishment trong trusted tenant context hiện tại; Organization SHALL chỉ giữ vai trò tenancy/access envelope. Establishment Profile SHALL NOT trở thành owner hoặc canonical source của hai giá trị này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Xem knowledge của establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép xem slice `Concept & histoire` trong trusted tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị Concept và Histoire thuộc Restaurant Knowledge của establishment đó
- **AND** SHALL NOT lấy hai giá trị này từ Establishment Profile như canonical source

#### Scenario: Lưu knowledge cho establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép lưu slice `Concept & histoire` trong trusted tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của Concept và Histoire dưới ownership của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành semantic owner của hai giá trị

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem Concept và Histoire. Hệ thống SHALL NOT reuse hoặc inherit `establishment.profile.read` hay `establishment.profile.manage` để cấp quyền xem slice này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Principal có READ xem được Concept và Histoire

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge READ trong valid trusted tenant context mở slice `Concept & histoire`
- **THEN** hệ thống SHALL cho phép xem Concept và Histoire của establishment hiện tại

#### Scenario: Principal không có READ bị từ chối xem

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal không có Restaurant Knowledge READ cố xem slice `Concept & histoire`
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa Concept hoặc Histoire và để thực hiện explicit save. Restaurant Knowledge READ và MANAGE SHALL remain separate logical operations; quyền READ riêng SHALL NOT cấp quyền edit hoặc save.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Principal có MANAGE sửa và lưu được

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge MANAGE trong valid trusted tenant context sửa Concept hoặc Histoire và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: READ không thay thế MANAGE

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge READ nhưng không có Restaurant Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có `establishment.profile.manage` nhưng không có Restaurant Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Concept và Histoire là hai giá trị optional độc lập

Hệ thống SHALL cho phép Concept và Histoire tồn tại độc lập; mỗi giá trị SHALL là optional và trạng thái cả hai cùng empty SHALL hợp lệ.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Empty initial state hợp lệ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và establishment chưa có Concept và chưa có Histoire
- **THEN** hệ thống SHALL hiển thị slice với cả hai giá trị empty như một trạng thái hợp lệ

#### Scenario: Chỉ Concept có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và Concept có giá trị và Histoire empty
- **THEN** hệ thống SHALL hiển thị Concept đã có và Histoire empty

#### Scenario: Chỉ Histoire có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và Histoire có giá trị và Concept empty
- **THEN** hệ thống SHALL hiển thị Histoire đã có và Concept empty

### Requirement: Người dùng nhập và sửa Concept và Histoire thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa thủ công từng giá trị Concept và Histoire mà không bắt buộc giá trị còn lại phải được nhập hoặc thay đổi.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Sửa Concept độc lập

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng sửa thủ công Concept mà không thay đổi Histoire
- **THEN** hệ thống SHALL giữ nguyên giá trị Histoire trong trạng thái slice chờ lưu

#### Scenario: Sửa Histoire độc lập

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng sửa thủ công Histoire mà không thay đổi Concept
- **THEN** hệ thống SHALL giữ nguyên giá trị Concept trong trạng thái slice chờ lưu

#### Scenario: Để trống một giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng để Concept hoặc Histoire empty trong trạng thái slice chờ lưu
- **THEN** hệ thống SHALL coi giá trị đó là optional và không bắt buộc giá trị còn lại phải empty

### Requirement: Một explicit save lưu toàn bộ slice Concept và Histoire

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Concept & histoire`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của cả Concept và Histoire cho establishment hiện tại như một slice Restaurant Knowledge.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Concept & histoire` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Lưu cả hai giá trị bằng một explicit save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau khi chỉnh sửa Concept, Histoire hoặc cả hai
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả Concept và Histoire cho establishment hiện tại

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và explicit save đã thành công và người dùng có Restaurant Knowledge READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị các giá trị Concept và Histoire đã được lưu

### Requirement: Slice không autosave

Hệ thống SHALL NOT persist thay đổi Concept hoặc Histoire trước khi người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save của slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa Concept hoặc Histoire nhưng chưa kích hoạt explicit save
- **THEN** hệ thống SHALL NOT persist thay đổi đó như trạng thái canonical của Restaurant Knowledge

### Requirement: Backoffice availability là tiền điều kiện riêng cho Concept & histoire

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi entry, subsection, UI, read, serialization hoặc mutation của slice `Concept & histoire` do `apps/backoffice` host, kể cả khi slice nằm chung page với basic Establishment Profile. Điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, bao gồm view/list/detail hoặc empty state, manual input/edit, explicit save và mọi create/remove tương ứng của slice; permission hợp lệ SHALL NOT làm một entry không khả dụng trở thành khả dụng.

Trong profile `release-a`, slice SHALL không khả dụng: navigation, subsection và thao tác SHALL không được expose; page composition SHALL không đọc hoặc serialize giá trị slice; direct entry, API hoặc Server Action SHALL bị từ chối trước capability read/mutation và SHALL không tiết lộ payload của slice. Basic profile permission hoặc việc basic profile vẫn khả dụng SHALL NOT mở slice này.

Trong `internal`, availability SHALL cho phép entry được đánh giá theo các prerequisites hiện hành, SHALL NOT cấp thêm quyền, và các requirements hiện hành SHALL tiếp tục áp dụng đầy đủ. Restaurant Knowledge canonical ownership, establishment semantic scope, trusted organization/access envelope, READ/MANAGE và current grant mapping, content semantics, validation, explicit-save/no-autosave cùng mọi non-scope domain/runtime boundary SHALL giữ nguyên. Các invariant pure/domain/persistence SHALL không phụ thuộc exposure và SHALL không bị bãi bỏ khi entry không khả dụng.

#### Scenario: Release A không tải slice dù actor có READ

- **WHEN** instance dùng profile `release-a` và principal có Restaurant Knowledge READ mở composed basic profile hoặc thử gọi trực tiếp entry đọc slice
- **THEN** hệ thống SHALL không expose subsection, không đọc hoặc serialize giá trị slice và SHALL từ chối direct read trước capability operation
- **AND** denial SHALL không tiết lộ content, item hoặc empty/populated state của slice

#### Scenario: Release A không cho MANAGE mở mutation trực tiếp

- **WHEN** instance dùng profile `release-a` và principal có Restaurant Knowledge MANAGE gọi trực tiếp API hoặc Server Action để nhập, sửa, save hoặc thực hiện create/remove mà slice hỗ trợ
- **THEN** hệ thống SHALL từ chối hosted operation trước capability mutation, không đọc payload được bảo vệ và không thay đổi canonical state
- **AND** knowledge đang có hoặc quyền basic profile SHALL không bypass availability

#### Scenario: Internal giữ authorization và behavior hiện hành

- **WHEN** instance dùng `internal` và entry slice khả dụng
- **THEN** hệ thống SHALL đánh giá mọi hosted view/list hoặc mutation bằng trusted scope và đúng READ/MANAGE hiện hành
- **AND** current grant mapping, manual content/save behavior và các domain/persistence boundaries SHALL tiếp tục áp dụng; availability SHALL không tự làm một principal thiếu quyền được truy cập
