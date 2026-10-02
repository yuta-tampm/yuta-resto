## Purpose

Capability này cho phép người dùng được ủy quyền xem và quản lý thủ công ba giá
trị mô tả « Cuisine & savoir-faire » như Restaurant Knowledge chính thức của một
establishment, độc lập với Establishment Profile và dữ liệu vận hành của
« Carte & menus ».

## ADDED Requirements

### Requirement: Cuisine & savoir-faire thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của « Description de
la cuisine », « Savoir-faire & particularités » và « Fait maison », cùng
persistence/domain boundary của ba giá trị. Các giá trị SHALL có semantic scope
theo establishment trong trusted tenant context hiện tại; Organization SHALL
chỉ là tenancy/access envelope. Establishment Profile và « Carte & menus » SHALL
NOT trở thành canonical owner hoặc source của ba giá trị này.

#### Scenario: Xem Cuisine & savoir-faire của establishment hiện tại

- **WHEN** người dùng được phép xem slice « Cuisine & savoir-faire » trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba giá trị Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các giá trị từ Establishment Profile hoặc « Carte &
  menus » như canonical source

#### Scenario: Lưu Cuisine & savoir-faire cho establishment hiện tại

- **WHEN** người dùng được phép lưu slice « Cuisine & savoir-faire » trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của ba giá trị dưới ownership
  của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành
  semantic owner

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem « Description de la
cuisine », « Savoir-faire & particularités » và « Fait maison ». Hệ thống SHALL NOT
reuse hoặc inherit `establishment.profile.read` hay
`establishment.profile.manage` để cấp quyền xem slice này.

#### Scenario: Principal có READ xem được Cuisine & savoir-faire

- **WHEN** principal có Restaurant Knowledge READ trong valid trusted tenant
  context mở slice « Cuisine & savoir-faire »
- **THEN** hệ thống SHALL cho phép xem ba giá trị của establishment hiện tại

#### Scenario: Principal không có READ bị từ chối xem

- **WHEN** principal không có Restaurant Knowledge READ cố xem slice « Cuisine &
  savoir-faire »
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ giá trị nào
trong slice « Cuisine & savoir-faire » và để thực hiện explicit save. Restaurant
Knowledge READ và MANAGE SHALL remain separate logical operations; quyền READ
riêng SHALL NOT cấp quyền edit hoặc save.

#### Scenario: Principal có MANAGE sửa và lưu được

- **WHEN** principal có Restaurant Knowledge MANAGE trong valid trusted tenant
  context sửa một hoặc nhiều giá trị và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: READ không thay thế MANAGE

- **WHEN** principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba giá trị Cuisine & savoir-faire là optional và độc lập

Hệ thống SHALL cho phép « Description de la cuisine », « Savoir-faire &
particularités » và « Fait maison » tồn tại độc lập. Mỗi giá trị SHALL là optional
và trạng thái cả ba cùng empty SHALL hợp lệ.

#### Scenario: Empty initial state hợp lệ

- **WHEN** establishment chưa có giá trị nào trong slice « Cuisine &
  savoir-faire »
- **THEN** hệ thống SHALL hiển thị cả ba giá trị empty như một trạng thái hợp lệ

#### Scenario: Chỉ Description de la cuisine có giá trị

- **WHEN** « Description de la cuisine » có giá trị và hai giá trị còn lại empty
- **THEN** hệ thống SHALL hiển thị giá trị đã có và giữ hai giá trị còn lại
  empty

#### Scenario: Chỉ Savoir-faire & particularités có giá trị

- **WHEN** « Savoir-faire & particularités » có giá trị và hai giá trị còn lại
  empty
- **THEN** hệ thống SHALL hiển thị giá trị đã có và giữ hai giá trị còn lại
  empty

#### Scenario: Chỉ Fait maison có giá trị

- **WHEN** « Fait maison » có giá trị và hai giá trị còn lại empty
- **THEN** hệ thống SHALL hiển thị giá trị đã có và giữ hai giá trị còn lại
  empty

### Requirement: Người dùng nhập và sửa ba giá trị thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa
thủ công từng giá trị trong slice mà không bắt buộc hai giá trị còn lại phải
được nhập hoặc thay đổi.

#### Scenario: Sửa một giá trị độc lập

- **WHEN** người dùng sửa thủ công một giá trị mà không thay đổi hai giá trị còn
  lại
- **THEN** hệ thống SHALL giữ nguyên hai giá trị còn lại trong trạng thái slice
  chờ lưu

#### Scenario: Để trống một hoặc nhiều giá trị

- **WHEN** người dùng để một hoặc nhiều giá trị empty trong trạng thái slice chờ
  lưu
- **THEN** hệ thống SHALL coi các giá trị đó là optional và SHALL NOT bắt buộc
  giá trị khác phải empty hoặc có nội dung

### Requirement: Một explicit save lưu toàn bộ slice Cuisine & savoir-faire

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice « Cuisine &
savoir-faire ». Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của
cả ba giá trị cho establishment hiện tại như một slice Restaurant Knowledge.

#### Scenario: Lưu cả ba giá trị bằng một explicit save

- **WHEN** người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba giá trị
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba giá trị cho
  establishment hiện tại

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba giá trị đã được lưu

### Requirement: Slice không autosave

Hệ thống SHALL NOT persist thay đổi trong bất kỳ giá trị « Cuisine & savoir-faire »
nào trước khi người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save
của slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa một hoặc nhiều giá trị nhưng chưa kích hoạt explicit
  save
- **THEN** hệ thống SHALL NOT persist các thay đổi đó như trạng thái canonical
  của Restaurant Knowledge

### Requirement: Cuisine & savoir-faire không duplicate dữ liệu vận hành của Carte & menus

Hệ thống SHALL giữ ba giá trị của slice như nội dung Restaurant Knowledge mô tả
và SHALL NOT tạo relationship, link, sync hoặc canonical copy của dishes,
products, prices, ingredients, recipes, availability, menu configuration,
suppliers hoặc dữ liệu vận hành khác thuộc « Carte & menus » hay POS.

#### Scenario: Slice không cần dữ liệu vận hành menu

- **WHEN** người dùng xem, sửa hoặc lưu slice « Cuisine & savoir-faire »
- **THEN** hệ thống SHALL thực hiện behavior đó mà không yêu cầu dữ liệu vận hành
  từ « Carte & menus » hoặc POS

#### Scenario: Nội dung mô tả không trở thành menu record

- **WHEN** explicit save lưu thành công các giá trị « Cuisine & savoir-faire »
- **THEN** hệ thống SHALL NOT tạo hoặc sửa dish, product, price, ingredient,
  recipe, availability, menu configuration hoặc supplier record

### Requirement: Initial slice không tự động enrich hoặc tích hợp ngoài scope

Hệ thống SHALL giới hạn initial « Cuisine & savoir-faire » behavior ở manual
input, view, edit và explicit save. Hệ thống SHALL NOT tự động tạo hoặc thay đổi
ba giá trị từ AI, reviews, comments, corrections, Marketing/social integration,
external provider, embedding/vector processing hoặc Restaurant Knowledge
section khác.

#### Scenario: External hoặc inferred content không tự thay đổi canonical values

- **WHEN** AI output, review, comment, correction, Marketing/social content,
  external-provider data hoặc nội dung từ section khác tồn tại
- **THEN** hệ thống SHALL NOT tự động dùng nguồn đó để tạo hoặc thay đổi canonical
  « Cuisine & savoir-faire » values
