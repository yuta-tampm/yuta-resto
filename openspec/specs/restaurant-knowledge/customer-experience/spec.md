## Purpose

Capability này cho phép người dùng được ủy quyền mô tả thủ công trải nghiệm mà
establishment muốn tạo cho khách như một slice Restaurant Knowledge, không biến
nội dung đó thành dữ liệu vận hành hoặc hồ sơ riêng của từng khách.

## Requirements

### Requirement: Expérience client thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Expérience
souhaitée`, `Accueil & service` và `Attention particulière au client`, cùng
persistence/domain boundary của ba value. Các value SHALL có semantic scope
theo establishment trong trusted tenant context hiện tại; Organization SHALL
chỉ là tenancy/access envelope. Establishment Profile SHALL NOT trở thành
canonical owner hoặc source của các value này.

#### Scenario: Xem Expérience client của establishment hiện tại

- **WHEN** người dùng được phép xem slice `Expérience client` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Expérience client cho establishment hiện tại

- **WHEN** người dùng được phép lưu slice `Expérience client` trong trusted
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

#### Scenario: Hiển thị đúng ba value

- **WHEN** người dùng mở slice `Expérience client`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm structured service category, checklist, score hoặc
  analytics value vào slice

#### Scenario: Accueil & service không trở thành quy trình vận hành

- **WHEN** người dùng nhập nội dung mô tả phong cách tiếp đón hoặc phục vụ
- **THEN** hệ thống SHALL giữ nội dung ở mức descriptive Restaurant Knowledge
- **AND** SHALL NOT biến nội dung thành checklist, procédure opérationnelle,
  staff task, workflow hoặc service SLA

#### Scenario: Attention particulière vẫn là nguyên tắc chung

- **WHEN** người dùng nhập nội dung về điểm establishment muốn chú ý trong trải
  nghiệm khách
- **THEN** hệ thống SHALL giữ nội dung như nguyên tắc chung của establishment
- **AND** SHALL NOT mô hình hóa nội dung thành preference hoặc event record của
  một khách cụ thể

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem ba value của
`Expérience client`. Hệ thống SHALL NOT reuse hoặc inherit
`establishment.profile.read` hay `establishment.profile.manage` để cấp quyền
xem slice này.

#### Scenario: Principal có READ xem được Expérience client

- **WHEN** principal có Restaurant Knowledge READ trong valid trusted tenant
  context mở slice `Expérience client`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: Principal không có READ bị từ chối xem

- **WHEN** principal không có Restaurant Knowledge READ cố xem slice
  `Expérience client`
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ value nào
trong slice `Expérience client` và để thực hiện explicit save. Restaurant
Knowledge READ và MANAGE SHALL remain separate logical operations; quyền READ
riêng SHALL NOT cấp quyền edit hoặc save.

#### Scenario: Principal có MANAGE sửa và lưu được

- **WHEN** principal có Restaurant Knowledge MANAGE trong valid trusted tenant
  context sửa một hoặc nhiều value và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: READ không thay thế MANAGE

- **WHEN** principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Expérience client là optional và độc lập

Hệ thống SHALL cho phép `Expérience souhaitée`, `Accueil & service` và
`Attention particulière au client` tồn tại độc lập. Mỗi value SHALL là optional
và trạng thái cả ba cùng empty SHALL hợp lệ.

#### Scenario: All-empty state hợp lệ

- **WHEN** establishment chưa có value nào trong slice `Expérience client`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Expérience souhaitée có giá trị

- **WHEN** `Expérience souhaitée` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Accueil & service có giá trị

- **WHEN** `Accueil & service` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Attention particulière au client có giá trị

- **WHEN** `Attention particulière au client` có giá trị và hai value còn lại
  empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

### Requirement: Người dùng nhập và sửa ba value thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa
thủ công từng value trong slice mà không bắt buộc hai value còn lại phải được
nhập hoặc thay đổi.

#### Scenario: Sửa một value độc lập

- **WHEN** người dùng sửa thủ công một value mà không thay đổi hai value còn lại
- **THEN** hệ thống SHALL giữ nguyên hai value còn lại trong trạng thái slice
  chờ lưu

#### Scenario: Để trống một hoặc nhiều value

- **WHEN** người dùng để một hoặc nhiều value empty trong trạng thái slice chờ
  lưu
- **THEN** hệ thống SHALL coi các value đó là optional
- **AND** SHALL NOT bắt buộc value khác phải empty hoặc có nội dung

### Requirement: Một explicit save lưu toàn bộ slice Expérience client

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Expérience
client`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của cả ba
value cho establishment hiện tại như một slice Restaurant Knowledge.

#### Scenario: Lưu cả ba value bằng một explicit save

- **WHEN** người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba value
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba value cho
  establishment hiện tại

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba value đã được lưu

### Requirement: Slice không autosave

Hệ thống SHALL NOT persist thay đổi trong bất kỳ value `Expérience client` nào
trước khi người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save của
slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa một hoặc nhiều value nhưng chưa kích hoạt explicit
  save
- **THEN** hệ thống SHALL NOT persist các thay đổi đó như trạng thái canonical
  của Restaurant Knowledge

### Requirement: Expérience client không tạo dependency hoặc consumer relationship với module vận hành

Initial slice SHALL hoạt động mà không đọc, ghi, link, copy, infer hoặc
synchronize dữ liệu thuộc Reservations, Reputation/reviews, Today,
Personnel/Gestion équipe, POS/orders hoặc Marketing. Các module đó SHALL NOT là
required data source hoặc required consumer của ba value trong change này.

#### Scenario: Reservations không phải source hoặc consumer

- **WHEN** người dùng xem, sửa hoặc lưu slice `Expérience client`
- **THEN** hệ thống SHALL NOT đọc hoặc ghi reservation, guest preference, table
  preference, special request hoặc reservation rule
- **AND** SHALL NOT yêu cầu Reservations consume hoặc phản ứng với các value

#### Scenario: Reputation không phải source hoặc consumer

- **WHEN** review, comment hoặc feedback tồn tại
- **THEN** hệ thống SHALL NOT đọc, derive hoặc thay đổi `Expérience client` từ
  dữ liệu đó
- **AND** SHALL NOT sửa review/reply hoặc yêu cầu Reputation consume các value

#### Scenario: Today và Personnel không phải consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT tạo Today card, alert, anomaly, staff checklist,
  task, employee procedure hoặc training workflow
- **AND** SHALL NOT yêu cầu Today hoặc Personnel consume hay phản ứng với các
  value

#### Scenario: POS và Marketing không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc order history, table/order data hoặc infer
  customer behavior từ POS
- **AND** SHALL NOT synchronize với POS hoặc yêu cầu Marketing/social consume
  các value

### Requirement: Slice không lưu CRM hoặc customer-specific preference

Ba value SHALL remain establishment-level descriptive knowledge. Initial slice
SHALL NOT model, link, import hoặc synchronize customer profile, CRM record,
customer-specific preference hoặc event-specific information.

#### Scenario: Thông tin của một khách cụ thể không trở thành knowledge value

- **WHEN** customer-specific preference, identity hoặc future event information
  tồn tại trong một module khác
- **THEN** hệ thống SHALL NOT dùng dữ liệu đó làm source cho ba canonical value
- **AND** SHALL NOT tạo customer/CRM relationship từ slice

### Requirement: Slice không tự động enrich hoặc áp đặt Product classification

Initial slice SHALL giới hạn behavior ở manual input, view, edit và explicit
save. Hệ thống SHALL NOT tự động tạo hoặc thay đổi ba value từ AI, automatic
learning hoặc inferred content. Hệ thống SHALL NOT áp đặt required content,
length, formatting, enum, taxonomy, checklist, scoring, structured service
category hoặc analytics model cho các value trong change này.

#### Scenario: AI hoặc inferred content không tự thay đổi canonical values

- **WHEN** AI output, automatic-learning signal hoặc inferred content tồn tại
- **THEN** hệ thống SHALL NOT tự động dùng nguồn đó để tạo hoặc thay đổi
  canonical `Expérience client` values

#### Scenario: Manual descriptive content không bị phân loại ngoài scope

- **WHEN** người dùng nhập thủ công một hoặc nhiều descriptive value
- **THEN** hệ thống SHALL NOT yêu cầu taxonomy, score, analytics category hoặc
  structured service classification để cho phép slice tồn tại hoặc được lưu
