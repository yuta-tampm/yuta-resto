## ADDED Requirements

### Requirement: Backoffice availability là tiền điều kiện riêng cho Identité de communication

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi entry, subsection, UI, read, serialization hoặc mutation của slice `Identité de communication` do `apps/backoffice` host, kể cả khi slice nằm chung page với basic Establishment Profile. Điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, bao gồm view/list/detail hoặc empty state, manual input/edit, explicit save và mọi create/remove tương ứng của slice; permission hợp lệ SHALL NOT làm một entry không khả dụng trở thành khả dụng.

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

### Requirement: Identité de communication thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Ton & style de
communication`, `Façon de s’adresser aux clients` và `Éléments de langage &
choses à éviter`. Các value SHALL có semantic scope theo establishment trong
trusted tenant context hiện tại; Organization SHALL chỉ là tenancy/access
envelope. Establishment Profile SHALL NOT trở thành canonical owner hoặc source
của các value này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Xem Identité de communication của establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép xem slice `Identité de communication` trong
  trusted tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Identité de communication cho establishment hiện tại

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng được phép lưu slice `Identité de communication` trong
  trusted tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của ba value dưới ownership
  của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành
  semantic owner

### Requirement: Slice chứa đúng ba descriptive knowledge values

Initial slice SHALL chỉ chứa `Ton & style de communication`, `Façon de
s’adresser aux clients` và `Éléments de langage & choses à éviter`. `Ton &
style de communication` SHALL mô tả tone và communication style chung mà
establishment muốn sử dụng. `Façon de s’adresser aux clients` SHALL mô tả cách
establishment muốn giao tiếp với khách ở mức nguyên tắc chung. `Éléments de
langage & choses à éviter` SHALL mô tả từ ngữ, cách diễn đạt, chủ đề hoặc thói
quen giao tiếp mà establishment muốn ưu tiên hoặc tránh. Cả ba SHALL remain
descriptive establishment knowledge.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Hiển thị đúng ba value

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng mở slice `Identité de communication`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm value hoặc structured communication category khác vào
  initial slice

#### Scenario: Ton & style de communication vẫn là mô tả chung

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng nhập nội dung về tone hoặc communication style
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge của
  establishment
- **AND** SHALL NOT biến nội dung thành tone preset, enum, taxonomy, brand score,
  sentiment score hoặc AI model setting

#### Scenario: Façon de s’adresser aux clients không trở thành customer rule

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng nhập nội dung mô tả cách establishment muốn giao tiếp với
  khách
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge
  chung của establishment
- **AND** SHALL NOT biến nội dung thành customer-specific preference, CRM rule,
  support rule, message template hoặc automated reply policy

#### Scenario: Éléments de langage & choses à éviter vẫn là descriptive free text

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng nhập từ ngữ, cách diễn đạt, chủ đề hoặc thói quen giao
  tiếp muốn ưu tiên hoặc tránh
- **THEN** hệ thống SHALL giữ nội dung như descriptive free text
- **AND** SHALL NOT biến nội dung thành keyword database, moderation rule,
  prohibited-word enforcement, legal validation, SEO taxonomy hoặc campaign tag

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem ba value của `Identité
de communication`. OWNER và MANAGER SHALL có Restaurant Knowledge READ. STAFF
SHALL không có Restaurant Knowledge READ theo default policy. Hệ thống SHALL
NOT reuse hoặc inherit Establishment Profile permission hay Marketing
permission để cấp quyền xem slice này.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: OWNER có READ xem được Identité de communication

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và OWNER trong valid trusted tenant context mở slice `Identité de
communication`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: MANAGER có READ xem được Identité de communication

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và MANAGER trong valid trusted tenant context mở slice `Identité de
communication`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: STAFF bị từ chối xem theo default policy

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và STAFF cố xem slice `Identité de communication` theo default
  Restaurant Knowledge policy
- **THEN** hệ thống SHALL từ chối quyền xem

#### Scenario: Profile permission không thay thế READ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Establishment Profile permission nhưng không có
  Restaurant Knowledge READ cố xem slice
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

#### Scenario: Marketing permission không thay thế READ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Marketing permission nhưng không có Restaurant
  Knowledge READ cố xem slice
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Marketing permission SHALL NOT thay thế Restaurant Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ value nào
trong slice `Identité de communication` và để thực hiện explicit save. OWNER và
MANAGER SHALL có Restaurant Knowledge MANAGE. STAFF SHALL không có Restaurant
Knowledge MANAGE theo default policy. Restaurant Knowledge READ và MANAGE SHALL
remain separate logical operations; READ riêng SHALL NOT cấp quyền edit hoặc
save. Establishment Profile permission và Marketing permission SHALL NOT thay
thế Restaurant Knowledge MANAGE.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: OWNER có MANAGE sửa và lưu được

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và OWNER trong valid trusted tenant context sửa một hoặc nhiều value và
  kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: MANAGER có MANAGE sửa và lưu được

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và MANAGER trong valid trusted tenant context sửa một hoặc nhiều value
  và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: STAFF bị từ chối edit và save theo default policy

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và STAFF cố sửa hoặc lưu slice `Identité de communication` theo default
  Restaurant Knowledge policy
- **THEN** hệ thống SHALL từ chối edit và save

#### Scenario: READ không thay thế MANAGE

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Marketing permission không cấp quyền quản lý knowledge

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và principal có Marketing permission nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Identité de communication là optional và độc lập

Hệ thống SHALL cho phép `Ton & style de communication`, `Façon de s’adresser
aux clients` và `Éléments de langage & choses à éviter` tồn tại độc lập. Mỗi
value SHALL là optional và trạng thái cả ba cùng empty SHALL hợp lệ.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: All-empty state hợp lệ

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và establishment chưa có value nào trong slice `Identité de
communication`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Ton & style de communication có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Ton & style de communication` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Façon de s’adresser aux clients có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Façon de s’adresser aux clients` có giá trị và hai value còn lại
  empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Éléments de langage & choses à éviter có giá trị

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và `Éléments de langage & choses à éviter` có giá trị và hai value còn
  lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

### Requirement: Người dùng nhập và sửa ba value thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa
thủ công từng value trong slice mà không bắt buộc hai value còn lại phải được
nhập hoặc thay đổi.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Sửa một value độc lập

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng sửa thủ công một value mà không thay đổi hai value còn lại
- **THEN** hệ thống SHALL giữ nguyên hai value còn lại trong trạng thái slice
  chờ lưu

#### Scenario: Để trống một hoặc nhiều value

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng để một hoặc nhiều value empty trong trạng thái slice chờ
  lưu
- **THEN** hệ thống SHALL coi các value đó là optional
- **AND** SHALL NOT bắt buộc value khác phải empty hoặc có nội dung

### Requirement: Một explicit save lưu toàn bộ slice Identité de communication

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Identité de
communication`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của
cả ba value cho establishment hiện tại như một slice Restaurant Knowledge.

Đối với entry do Backoffice host, các thao tác UI, read hoặc mutation trong requirement này SHALL có tiền điều kiện slice `Identité de communication` khả dụng trong profile do server chọn. Tiền điều kiện exposure này SHALL NOT thay đổi các invariant ownership, domain, validation hoặc persistence của requirement; khi entry khả dụng, mọi authorization và trusted scope check hiện hành SHALL tiếp tục bắt buộc.

#### Scenario: Lưu cả ba value bằng một explicit save

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba value
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba value cho
  establishment hiện tại

#### Scenario: Lưu all-empty state

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save khi
  cả ba value empty
- **THEN** hệ thống SHALL lưu all-empty state như một trạng thái hợp lệ của slice

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** entry của slice do Backoffice host khả dụng trong profile do server chọn và explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba value đã được lưu
