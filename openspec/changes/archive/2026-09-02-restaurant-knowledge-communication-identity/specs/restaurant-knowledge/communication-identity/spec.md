## Purpose

Capability này cho phép người dùng được ủy quyền mô tả thủ công cách
establishment muốn giao tiếp và thể hiện bản thân như một slice Restaurant
Knowledge, không biến nội dung đó thành Marketing, publishing, customer data,
legal enforcement hoặc generated content.

## ADDED Requirements

### Requirement: Identité de communication thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Ton & style de
communication`, `Façon de s’adresser aux clients` và `Éléments de langage &
choses à éviter`. Các value SHALL có semantic scope theo establishment trong
trusted tenant context hiện tại; Organization SHALL chỉ là tenancy/access
envelope. Establishment Profile SHALL NOT trở thành canonical owner hoặc source
của các value này.

#### Scenario: Xem Identité de communication của establishment hiện tại

- **WHEN** người dùng được phép xem slice `Identité de communication` trong
  trusted tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Identité de communication cho establishment hiện tại

- **WHEN** người dùng được phép lưu slice `Identité de communication` trong
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

#### Scenario: Hiển thị đúng ba value

- **WHEN** người dùng mở slice `Identité de communication`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm value hoặc structured communication category khác vào
  initial slice

#### Scenario: Ton & style de communication vẫn là mô tả chung

- **WHEN** người dùng nhập nội dung về tone hoặc communication style
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge của
  establishment
- **AND** SHALL NOT biến nội dung thành tone preset, enum, taxonomy, brand score,
  sentiment score hoặc AI model setting

#### Scenario: Façon de s’adresser aux clients không trở thành customer rule

- **WHEN** người dùng nhập nội dung mô tả cách establishment muốn giao tiếp với
  khách
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge
  chung của establishment
- **AND** SHALL NOT biến nội dung thành customer-specific preference, CRM rule,
  support rule, message template hoặc automated reply policy

#### Scenario: Éléments de langage & choses à éviter vẫn là descriptive free text

- **WHEN** người dùng nhập từ ngữ, cách diễn đạt, chủ đề hoặc thói quen giao
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

#### Scenario: OWNER có READ xem được Identité de communication

- **WHEN** OWNER trong valid trusted tenant context mở slice `Identité de
communication`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: MANAGER có READ xem được Identité de communication

- **WHEN** MANAGER trong valid trusted tenant context mở slice `Identité de
communication`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: STAFF bị từ chối xem theo default policy

- **WHEN** STAFF cố xem slice `Identité de communication` theo default
  Restaurant Knowledge policy
- **THEN** hệ thống SHALL từ chối quyền xem

#### Scenario: Profile permission không thay thế READ

- **WHEN** principal có Establishment Profile permission nhưng không có
  Restaurant Knowledge READ cố xem slice
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

#### Scenario: Marketing permission không thay thế READ

- **WHEN** principal có Marketing permission nhưng không có Restaurant
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

#### Scenario: OWNER có MANAGE sửa và lưu được

- **WHEN** OWNER trong valid trusted tenant context sửa một hoặc nhiều value và
  kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: MANAGER có MANAGE sửa và lưu được

- **WHEN** MANAGER trong valid trusted tenant context sửa một hoặc nhiều value
  và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: STAFF bị từ chối edit và save theo default policy

- **WHEN** STAFF cố sửa hoặc lưu slice `Identité de communication` theo default
  Restaurant Knowledge policy
- **THEN** hệ thống SHALL từ chối edit và save

#### Scenario: READ không thay thế MANAGE

- **WHEN** principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Marketing permission không cấp quyền quản lý knowledge

- **WHEN** principal có Marketing permission nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Identité de communication là optional và độc lập

Hệ thống SHALL cho phép `Ton & style de communication`, `Façon de s’adresser
aux clients` và `Éléments de langage & choses à éviter` tồn tại độc lập. Mỗi
value SHALL là optional và trạng thái cả ba cùng empty SHALL hợp lệ.

#### Scenario: All-empty state hợp lệ

- **WHEN** establishment chưa có value nào trong slice `Identité de
communication`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Ton & style de communication có giá trị

- **WHEN** `Ton & style de communication` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Façon de s’adresser aux clients có giá trị

- **WHEN** `Façon de s’adresser aux clients` có giá trị và hai value còn lại
  empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Éléments de langage & choses à éviter có giá trị

- **WHEN** `Éléments de langage & choses à éviter` có giá trị và hai value còn
  lại empty
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

### Requirement: Một explicit save lưu toàn bộ slice Identité de communication

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Identité de
communication`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của
cả ba value cho establishment hiện tại như một slice Restaurant Knowledge.

#### Scenario: Lưu cả ba value bằng một explicit save

- **WHEN** người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba value
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba value cho
  establishment hiện tại

#### Scenario: Lưu all-empty state

- **WHEN** người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save khi
  cả ba value empty
- **THEN** hệ thống SHALL lưu all-empty state như một trạng thái hợp lệ của slice

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba value đã được lưu

### Requirement: Slice không autosave

Hệ thống SHALL NOT persist thay đổi trong bất kỳ value `Identité de
communication` nào trước khi người dùng có Restaurant Knowledge MANAGE kích
hoạt explicit save của slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa một hoặc nhiều value nhưng chưa kích hoạt explicit
  save
- **THEN** hệ thống SHALL NOT persist các thay đổi đó như trạng thái canonical
  của Restaurant Knowledge

### Requirement: Slice không sử dụng Establishment Profile như data source hoặc consumer

Initial slice SHALL hoạt động mà không đọc, ghi, link, copy, derive hoặc
synchronize các value từ hoặc sang Establishment Profile. Establishment Profile
SHALL NOT là required source hoặc required consumer của ba value.

#### Scenario: Profile không phải source hoặc consumer

- **WHEN** slice `Identité de communication` được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc thay đổi Establishment Profile để cung
  cấp hoặc phản ánh ba value
- **AND** SHALL NOT yêu cầu Establishment Profile consume hoặc phản ứng với các
  value

### Requirement: Slice không tạo Marketing, Content, social, publishing hoặc external-provider relationship

Initial slice SHALL hoạt động mà không tạo campaign, post, generated content,
template, schedule, publication setting hoặc channel configuration; không
publish, import hoặc synchronize nội dung qua Marketing, Social, public website
hoặc external provider. Marketing/Content, Social, public website publishing và
external providers SHALL NOT là required source hoặc required consumer của ba
value.

#### Scenario: Slice không tạo campaign, post, content hoặc template

- **WHEN** người dùng xem, sửa hoặc lưu slice
- **THEN** hệ thống SHALL NOT tạo campaign, post, generated copy/content,
  template hoặc scheduled content

#### Scenario: Slice không cấu hình hoặc publish lên channel

- **WHEN** ba value tồn tại hoặc được lưu
- **THEN** hệ thống SHALL NOT tạo channel-specific configuration hoặc publication
  setting
- **AND** SHALL NOT publish hoặc synchronize chúng lên social channel hay public
  website

#### Scenario: Marketing và Content không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc ghi Marketing/Content data
- **AND** SHALL NOT yêu cầu Marketing/Content consume hoặc phản ứng với các value

#### Scenario: External provider không tham gia initial slice

- **WHEN** external provider hoặc provider output tồn tại
- **THEN** hệ thống SHALL NOT yêu cầu provider đó để view, edit hoặc save slice
- **AND** SHALL NOT dùng provider output làm source cho ba canonical values

### Requirement: Slice không tạo Reviews hoặc Reputation relationship

Initial slice SHALL hoạt động mà không đọc reviews/comments, derive
communication identity từ Reviews/Reputation, tạo hoặc gửi review reply, hay
synchronize review content. Reviews/Reputation SHALL NOT là required source
hoặc required consumer của ba value.

#### Scenario: Reviews không phải source cho Communication Identity

- **WHEN** review, comment hoặc feedback tồn tại
- **THEN** hệ thống SHALL NOT đọc, infer, derive hoặc tự động thay đổi ba value
  từ dữ liệu đó

#### Scenario: Slice không tạo review reply automation

- **WHEN** người dùng xem, sửa hoặc lưu slice
- **THEN** hệ thống SHALL NOT tạo, đề xuất, gửi hoặc schedule review reply
- **AND** SHALL NOT yêu cầu Reviews/Reputation consume hoặc phản ứng với các
  value

### Requirement: Slice không sử dụng AI, automatic learning hoặc inference

Initial slice SHALL giới hạn canonical input ở thao tác thủ công của người dùng
được ủy quyền. Hệ thống SHALL NOT dùng AI, automatic learning, inference,
prompts, providers, embeddings hoặc vector storage để tạo, đề xuất hoặc tự động
thay đổi ba value.

#### Scenario: AI hoặc inferred content không tạo canonical values

- **WHEN** AI output, automatic-learning signal hoặc inferred content tồn tại
- **THEN** hệ thống SHALL NOT dùng nguồn đó để tạo, đề xuất hoặc thay đổi
  canonical `Identité de communication` values

#### Scenario: Slice không tạo AI hoặc vector dependency

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT yêu cầu AI provider, prompt, embedding hoặc vector
  storage

### Requirement: Slice không lưu CRM hoặc customer-specific data

Ba value SHALL remain establishment-level descriptive knowledge. Initial slice
SHALL NOT model, link, import, derive hoặc synchronize customer profile, CRM
record, customer-specific communication preference, segmentation hoặc
personalization rule.

#### Scenario: Customer-specific preference không trở thành knowledge value

- **WHEN** preference hoặc profile của một customer cụ thể tồn tại
- **THEN** hệ thống SHALL NOT dùng dữ liệu đó làm source cho ba canonical values

#### Scenario: Slice không tạo CRM relationship

- **WHEN** người dùng xem, sửa hoặc lưu slice
- **THEN** hệ thống SHALL NOT tạo customer linkage, segmentation hoặc
  personalization rule
- **AND** SHALL NOT yêu cầu CRM/customer capability consume hoặc phản ứng với
  các value

### Requirement: Choses à éviter không tạo legal, compliance hoặc moderation enforcement

`Éléments de langage & choses à éviter` SHALL remain descriptive Restaurant
Knowledge. Initial slice SHALL NOT thực hiện legal claim validation, regulatory
compliance enforcement, prohibited-word enforcement, moderation hoặc automatic
content blocking.

#### Scenario: Descriptive content không trở thành legal rule

- **WHEN** người dùng mô tả một claim, từ ngữ hoặc chủ đề nên tránh
- **THEN** hệ thống SHALL giữ nội dung như descriptive free text
- **AND** SHALL NOT coi nội dung đó là legal approval hoặc compliance decision

#### Scenario: Slice không tự động enforce nội dung

- **WHEN** content ở nơi khác dùng từ ngữ hoặc claim được mô tả trong slice
- **THEN** hệ thống SHALL NOT tự động moderate, validate, approve hoặc block
  content đó trong change này

### Requirement: Slice không tạo cross-runtime relationship

Initial slice SHALL hoạt động trong cloud Restaurant Knowledge boundary mà
không đọc, ghi, publish, synchronize hoặc tạo required consumer relationship
với POS, Site Agent hoặc Display.

#### Scenario: POS và Site Agent không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc ghi POS operational data
- **AND** SHALL NOT synchronize với POS/Site Agent hoặc yêu cầu chúng consume
  các value

#### Scenario: Display không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc, ghi hoặc publish Display data
- **AND** SHALL NOT synchronize với Display hoặc yêu cầu Display consume các
  value

### Requirement: Slice không áp đặt content requirement hoặc Product classification

Hệ thống SHALL NOT áp đặt required content, minimum hoặc maximum length,
formatting rule, enum, taxonomy, tone preset, score, brand rating, sentiment
rating hoặc automatic classification cho ba value trong change này.

#### Scenario: Empty content không bị chặn

- **WHEN** một hoặc nhiều descriptive value empty
- **THEN** hệ thống SHALL NOT yêu cầu content hoặc minimum length để slice là
  hợp lệ

#### Scenario: Descriptive content không bị giới hạn bởi formatting hoặc length

- **WHEN** người dùng nhập thủ công một descriptive value
- **THEN** hệ thống SHALL NOT áp đặt Product formatting rule hoặc maximum length
  trong change này

#### Scenario: Manual content không bị phân loại hoặc chấm điểm

- **WHEN** người dùng nhập thủ công một hoặc nhiều descriptive value
- **THEN** hệ thống SHALL NOT yêu cầu enum, taxonomy, tone preset, score, brand
  rating, sentiment rating hoặc automatic classification để cho phép slice tồn
  tại hoặc được lưu
