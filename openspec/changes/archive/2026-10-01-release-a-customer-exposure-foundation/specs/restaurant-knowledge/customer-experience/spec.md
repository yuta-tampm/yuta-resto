## ADDED Requirements

### Requirement: Backoffice availability là tiền điều kiện riêng cho Expérience client

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi entry, subsection, UI, read, serialization hoặc mutation của slice `Expérience client` do `apps/backoffice` host, kể cả khi slice nằm chung page với basic Establishment Profile. Điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, bao gồm view/list/detail hoặc empty state, manual input/edit, explicit save và mọi create/remove tương ứng của slice; permission hợp lệ SHALL NOT làm một entry không khả dụng trở thành khả dụng.

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

## MODIFIED Requirements

### Requirement: Expérience client thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Expérience
souhaitée`, `Accueil & service` và `Attention particulière au client`, cùng
persistence/domain boundary của ba value. Các value SHALL có semantic scope
theo establishment trong trusted tenant context hiện tại; Organization SHALL
chỉ là tenancy/access envelope. Establishment Profile SHALL NOT trở thành
canonical owner hoặc source của các value này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Xem Expérience client của establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép xem slice `Expérience client` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Expérience client cho establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép lưu slice `Expérience client` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của ba value dưới ownership
  của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành
  semantic owner

### Requirement: Slice chứa đúng ba descriptive knowledge values

Initial slice SHALL chỉ chứa `Expérience souhaitée`, `Accueil & service` và
`Attention particulière au client`. `Expérience souhaitée` SHALL mô tả trải
nghiệm tổng thể establishment muốn tạo; `Accueil & service` SHALL mô tả phong
cách tiếp đón và phục vụ ở mức Restaurant Knowledge; `Attention particulière
au client` SHALL mô tả các nguyên tắc hoặc điểm chú ý chung trong trải nghiệm
khách. Ba value SHALL remain descriptive establishment knowledge, không phải
operational customer/service data.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Hiển thị đúng ba value

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng mở slice `Expérience client`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm structured service category, checklist, score hoặc
  analytics value vào slice

#### Scenario: Accueil & service không trở thành quy trình vận hành

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng nhập nội dung mô tả phong cách tiếp đón hoặc phục vụ
- **THEN** hệ thống SHALL giữ nội dung ở mức descriptive Restaurant Knowledge
- **AND** SHALL NOT biến nội dung thành checklist, procédure opérationnelle,
  staff task, workflow hoặc service SLA

#### Scenario: Attention particulière vẫn là nguyên tắc chung

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng nhập nội dung về điểm establishment muốn chú ý trong trải
  nghiệm khách
- **THEN** hệ thống SHALL giữ nội dung như nguyên tắc chung của establishment
- **AND** SHALL NOT mô hình hóa nội dung thành preference hoặc event record của
  một khách cụ thể

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem ba value của
`Expérience client`. Hệ thống SHALL NOT reuse hoặc inherit
`establishment.profile.read` hay `establishment.profile.manage` để cấp quyền
xem slice này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Principal có READ xem được Expérience client

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge READ trong valid trusted tenant
  context mở slice `Expérience client`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: Principal không có READ bị từ chối xem

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal không có Restaurant Knowledge READ cố xem slice
  `Expérience client`
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ value nào
trong slice `Expérience client` và để thực hiện explicit save. Restaurant
Knowledge READ và MANAGE SHALL remain separate logical operations; quyền READ
riêng SHALL NOT cấp quyền edit hoặc save.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Principal có MANAGE sửa và lưu được

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge MANAGE trong valid trusted tenant
  context sửa một hoặc nhiều value và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: READ không thay thế MANAGE

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Expérience client là optional và độc lập

Hệ thống SHALL cho phép `Expérience souhaitée`, `Accueil & service` và
`Attention particulière au client` tồn tại độc lập. Mỗi value SHALL là optional
và trạng thái cả ba cùng empty SHALL hợp lệ.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: All-empty state hợp lệ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và establishment chưa có value nào trong slice `Expérience client`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Expérience souhaitée có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Expérience souhaitée` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Accueil & service có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Accueil & service` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Attention particulière au client có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Attention particulière au client` có giá trị và hai value còn lại
  empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

### Requirement: Người dùng nhập và sửa ba value thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa
thủ công từng value trong slice mà không bắt buộc hai value còn lại phải được
nhập hoặc thay đổi.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Sửa một value độc lập

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng sửa thủ công một value mà không thay đổi hai value còn lại
- **THEN** hệ thống SHALL giữ nguyên hai value còn lại trong trạng thái slice
  chờ lưu

#### Scenario: Để trống một hoặc nhiều value

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng để một hoặc nhiều value empty trong trạng thái slice chờ
  lưu
- **THEN** hệ thống SHALL coi các value đó là optional
- **AND** SHALL NOT bắt buộc value khác phải empty hoặc có nội dung

### Requirement: Một explicit save lưu toàn bộ slice Expérience client

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Expérience
client`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của cả ba
value cho establishment hiện tại như một slice Restaurant Knowledge.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Expérience client` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Lưu cả ba value bằng một explicit save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba value
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba value cho
  establishment hiện tại

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba value đã được lưu
