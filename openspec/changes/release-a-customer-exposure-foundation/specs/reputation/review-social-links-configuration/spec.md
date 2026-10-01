## ADDED Requirements

### Requirement: Availability đóng Backoffice social-link settings nhưng giữ public feedback-web consumer

Hệ thống SHALL áp dụng server-selected whole-instance Backoffice availability trước mọi navigation/subsection, UI, private configuration read, serialization, add/replace/clear, explicit Save, no-op, reload, conflict retry hoặc response-loss replay/recovery của `googleReviewUrl`, `facebookReviewUrl` và `instagramUrl` do `apps/backoffice` host. Tiền điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, độc lập với base `reputation.read` hoặc OWNER `reputation.settings.manage`.

Trong `release-a`, Backoffice Satisfaction/social-link settings slice SHALL không khả dụng: hệ thống SHALL không expose section hoặc thao tác, SHALL không đọc/serialize private settings payload cho entry đó và SHALL từ chối direct page/API/Server Action trước capability read/mutation/replay. Valid OWNER permissions, existing settings row, valid provider URL hoặc known committed request SHALL NOT bypass availability. Allowed Google Avis/Integrations exposure SHALL không tự mở manual social-link configuration.

Trong `internal`, availability SHALL chỉ cho phép entry được đánh giá theo existing OWNER-only settings authority và trusted organization/active-establishment prerequisites. Current permission mapping, exact ba nullable fields, provisioning/missing-row behavior, normalization/provider URL policy, manual-only Google URL, explicit-save/no-autosave, atomic settings/audit, no-op và stale/replay semantics SHALL giữ nguyên. Các pure validator và persistence/audit invariant SHALL không phụ thuộc exposure.

Điều kiện availability này SHALL chỉ chi phối Backoffice-hosted configuration entry. Independent public `feedback-web` SHALL tiếp tục đọc/render safe configured CTA theo trusted server-resolved public organization/establishment, không lấy Backoffice profile làm permission hoặc tắt public consumer. Việc đóng settings trong A SHALL không thay/xóa existing configured values, không auto-provision row, không derive URL từ GBP/OAuth và không đổi external destination thành connector, review publication hoặc proof of external review.

#### Scenario: Release A đóng settings read cho valid OWNER

- **WHEN** instance dùng `release-a` và authenticated OWNER có current `reputation.settings.manage` thử mở settings subsection hoặc direct private read
- **THEN** hệ thống SHALL không expose section, không đọc/serialize ba configuration values cho entry đó và SHALL từ chối direct read trước capability operation
- **AND** existing settings/URL values SHALL không được tiết lộ qua unavailable section, empty/populated state hoặc denial

#### Scenario: Release A từ chối Save no-op và replay

- **WHEN** instance dùng `release-a` và valid OWNER gọi explicit Save để add/replace/clear, normalized no-op, conflict reload/retry hoặc replay prior committed mutation
- **THEN** hệ thống SHALL từ chối trước settings read/mutation hoặc protected outcome recovery, SHALL không thay provider values và SHALL không tạo duplicate persistence/audit effect
- **AND** existing canonical settings và prior committed audit/receipt evidence SHALL được bảo toàn

#### Scenario: Google setup không bypass manual link availability

- **WHEN** instance dùng `release-a` và OWNER có quyền dùng allowed Google Integrations flow hoặc selected GBP location
- **THEN** authority đó SHALL không mở Backoffice social-link settings read/save
- **AND** GBP/OAuth operation SHALL không derive hoặc write `googleReviewUrl`

#### Scenario: Public Feedback CTA vẫn dùng safe persisted configuration

- **WHEN** Backoffice instance dùng `release-a` nhưng independent `feedback-web` có trusted public scope và valid configured Google, Facebook hoặc Instagram URL
- **THEN** public consumer SHALL tiếp tục render đúng CTA theo existing safe destination/attributes rules
- **AND** null/unsafe legacy URL và browser-provided tenant claims SHALL tiếp tục fail closed theo public requirements hiện hành

#### Scenario: Internal giữ OWNER-only authority và configuration behavior

- **WHEN** instance dùng `internal` và Backoffice settings slice khả dụng
- **THEN** hệ thống SHALL vẫn require current `reputation.settings.manage`, trusted membership/organization/active establishment và các configuration guards trước private read hoặc Save
- **AND** missing row, URL validation, atomic audit, no-op và recoverable conflict/replay SHALL giữ existing behavior; availability SHALL không tạo row hoặc cấp thêm grant

## MODIFIED Requirements

### Requirement: Reputation sở hữu cấu hình theo trusted organization và active establishment

Reputation SHALL là semantic/data owner của `googleReviewUrl`,
`facebookReviewUrl` và `instagramUrl`. Mọi private read hoặc mutation SHALL dùng
authenticated trusted user, verified active membership, trusted organization và
active establishment do server xác lập; browser claims SHALL NOT tạo authority.
Nếu không tồn tại `reputation_settings` row cho đúng trusted organization và
establishment, capability SHALL fail closed với trạng thái configuration
unavailable, SHALL NOT synthesize hoặc auto-create row, và SHALL không tự suy ra
giá trị cho các field Reputation khác. Provisioning row đó thuộc một Product
decision riêng và nằm ngoài capability này.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: Đọc đúng scope hiện hành

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và authorized OWNER mở settings trong trusted organization và active establishment
- **THEN** hệ thống SHALL chỉ trả ba giá trị Reputation của đúng scope đó

#### Scenario: Sai establishment fail closed

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và request tham chiếu settings thuộc establishment khác với trusted active establishment
- **THEN** hệ thống SHALL từ chối mà không đọc hoặc thay đổi các giá trị của establishment kia

#### Scenario: Browser claims không tạo scope

- **WHEN** browser gửi organization, establishment, role hoặc permission claims khác trusted server context
- **THEN** hệ thống SHALL bỏ qua các claims đó khi xác lập authority và scope

#### Scenario: Runtime ngoài scope không tham gia

- **WHEN** capability đọc hoặc lưu ba giá trị
- **THEN** hệ thống SHALL NOT đọc, ghi hoặc đồng bộ Employee, POS, Site Agent hay Display data

#### Scenario: Missing row trên private read

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và không có `reputation_settings` row cho trusted organization và establishment
- **THEN** capability SHALL fail closed với bounded configuration-unavailable state, settings surface SHALL không enable Save, và hệ thống SHALL NOT synthesize settings data hoặc đọc row của establishment khác

#### Scenario: Missing row trên Save

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và authorized OWNER attempts Save nhưng trusted settings row không tồn tại
- **THEN** mutation SHALL fail closed, Save SHALL không được thực hiện, và hệ thống SHALL NOT create/upsert row, modify link hoặc tạo SETTINGS mutation audit

#### Scenario: Missing row không tạo field Reputation khác

- **WHEN** trusted settings row không tồn tại
- **THEN** capability SHALL NOT derive, default hoặc create `brandVoice`, `publicFeedbackSlug` hay bất kỳ Reputation-owned settings field nào khác

#### Scenario: Recovery sau external provisioning

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và một valid separate Reputation provisioning flow sau đó tạo scoped row
- **THEN** subsequent reload MAY expose normal settings capability từ authoritative persisted row mà không định nghĩa provisioning mechanism trong capability này

### Requirement: Settings dùng authority Reputation hiện hành và chỉ OWNER được truy cập

Base Reputation page access SHALL tiếp tục dùng `reputation.read`. Settings
section visibility, read và management SHALL yêu cầu
`reputation.settings.manage`, hiện chỉ OWNER có. Capability SHALL NOT định nghĩa
lại permission map hoặc dùng connector, review-response, marketing hay
Establishment permission làm thay thế.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: OWNER được xem và quản lý settings

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và authenticated OWNER có trusted active membership và mở settings section
- **THEN** hệ thống SHALL cho phép đọc và thực hiện explicit Save

#### Scenario: MANAGER không thấy settings surface

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và MANAGER có base `reputation.read` nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL không hiển thị hoặc cấp read-management access cho settings section

#### Scenario: STAFF không thấy settings surface

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và STAFF có base `reputation.read` nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL không hiển thị hoặc cấp read-management access cho settings section

#### Scenario: Permission khác không thay thế settings authority

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và actor có connector, review-response, marketing hoặc Establishment permission nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL từ chối settings read-management authority

#### Scenario: Browser role không bypass OWNER-only authority

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và browser tự khai role OWNER hoặc `reputation.settings.manage`
- **THEN** hệ thống SHALL không cấp settings access nếu trusted server context không chứng minh quyền đó

### Requirement: Capability chỉ quản lý đúng ba giá trị nullable

Capability SHALL quản lý đúng `googleReviewUrl`, `facebookReviewUrl` và
`instagramUrl`, mỗi giá trị là URL hợp lệ hoặc `null`. Capability SHALL NOT tạo
generic social-link entity, status phụ hoặc provider tùy ý.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: Initial empty state

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và cả ba authoritative values là `null`
- **THEN** settings SHALL hiển thị ba trường trống tương ứng mà không tạo placeholder persisted value

#### Scenario: Populated state

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và một hoặc nhiều authoritative values khác `null`
- **THEN** settings SHALL hiển thị đúng normalized persisted values của ba provider tương ứng

#### Scenario: Provider ngoài ba giá trị bị từ chối

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và caller cố lưu một provider hoặc status field ngoài ba giá trị được định nghĩa
- **THEN** hệ thống SHALL không mở rộng mutation sang field đó

### Requirement: Thay đổi chỉ xảy ra qua một explicit Save

Hệ thống SHALL hỗ trợ add, replace và clear-to-`null` cho một hoặc nhiều giá trị
trong một explicit Save. Hệ thống MUST NOT autosave khi người dùng nhập, xóa,
blur hoặc đóng settings surface.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: Add một link

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER nhập một valid URL vào field đang `null` và explicit Save
- **THEN** hệ thống SHALL persist normalized URL đó và giữ nguyên hai field còn lại

#### Scenario: Add nhiều link

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER nhập nhiều valid URL vào các field đang `null` và explicit Save
- **THEN** hệ thống SHALL persist tất cả thay đổi trong cùng mutation

#### Scenario: Replace một link

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER thay một persisted URL bằng valid URL khác và explicit Save
- **THEN** hệ thống SHALL replace đúng provider value và giữ nguyên field không đổi

#### Scenario: Replace nhiều link

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER thay nhiều persisted URL bằng các valid URL khác và explicit Save
- **THEN** hệ thống SHALL persist toàn bộ replacements trong cùng mutation

#### Scenario: Clear bằng blank thành null

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER để một field blank sau trim và explicit Save
- **THEN** hệ thống SHALL persist provider value đó thành `null`

#### Scenario: Mixed add update remove

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và một explicit Save chứa một add, một replace và một clear hợp lệ
- **THEN** hệ thống SHALL xử lý cả ba thay đổi như một mutation duy nhất

#### Scenario: Nhập liệu không autosave

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER thay đổi field nhưng chưa explicit Save
- **THEN** authoritative persisted values SHALL không thay đổi

#### Scenario: Đóng khi chưa save không ghi dữ liệu

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và OWNER đóng settings surface mà không explicit Save
- **THEN** hệ thống SHALL không persist draft input hoặc tạo audit

### Requirement: Save nhiều field là all-or-nothing

Mọi changed provider trong một explicit Save SHALL thành công hoặc thất bại cùng
nhau. Validation error, server failure hoặc audit failure SHALL giữ nguyên toàn
bộ prior authoritative settings.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: Một field invalid làm toàn bộ save thất bại

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và multi-field Save có ít nhất một URL invalid
- **THEN** hệ thống SHALL reject toàn bộ mutation và không persist bất kỳ changed field nào

#### Scenario: Server failure giữ nguyên prior state

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và server không thể hoàn tất mutation
- **THEN** toàn bộ prior authoritative values SHALL giữ nguyên và caller SHALL có thể retry

#### Scenario: Audit failure không để settings diverge

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và required settings audit không thể hoàn tất cùng real mutation
- **THEN** settings mutation SHALL thất bại toàn bộ và prior authoritative values SHALL giữ nguyên

### Requirement: Normalized no-op không ghi và success trả authoritative state

Hệ thống SHALL so sánh normalized proposed values với authoritative values.
Normalized no-op SHALL không tạo persistence mutation hoặc audit. Real success
SHALL trả hoặc reload authoritative persisted state thay vì chỉ tin browser
draft.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: No-op sau normalization

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và trim và blank-to-null tạo ra đúng ba authoritative current values
- **THEN** hệ thống SHALL trả trạng thái thành công/no-change mà không persist mutation

#### Scenario: No-op không tạo audit

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và explicit Save là normalized no-op
- **THEN** hệ thống SHALL không tạo Reputation SETTINGS audit

#### Scenario: Successful reload

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và real mutation commit thành công
- **THEN** caller SHALL nhận hoặc reload ba authoritative persisted values đã commit

### Requirement: Stale conflict và response-loss replay phải recoverable

Hệ thống SHALL ngăn silent last-write-wins. Một stale materially different Save
SHALL bị từ chối bằng recognizable recoverable conflict, giữ nguyên current
authoritative state và cho phép reload. Replay tương đương của mutation đã
commit sau response loss SHALL không tạo duplicate write/audit; materially
different retry SHALL NOT được xem là equivalent replay.

Đối với settings entry do Backoffice host, UI, private read, explicit Save hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi settings slice khả dụng trong profile do server chọn. Khi slice khả dụng, OWNER-only Reputation authority, trusted scope và mọi configuration/validation/conflict prerequisite hiện hành SHALL vẫn bắt buộc. Availability SHALL NOT thay Reputation ownership, nullable/normalization semantics, transactional/no-op/audit guarantees hoặc independent public feedback-web consumption.

#### Scenario: Stale materially different save bị từ chối

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và authoritative settings đã đổi sau khi caller load và caller gửi materially different stale Save
- **THEN** hệ thống SHALL trả recognizable conflict thay vì overwrite current values

#### Scenario: Stale reject giữ nguyên authoritative state

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và stale Save bị từ chối
- **THEN** current authoritative values SHALL giữ nguyên và không có partial mutation

#### Scenario: Caller reload sau conflict

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và caller nhận conflict
- **THEN** hệ thống SHALL cho phép reload current authoritative values để recover

#### Scenario: Response-loss equivalent replay

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và mutation đã commit nhưng response bị mất và caller replay mutation tương đương
- **THEN** hệ thống SHALL recover committed authoritative outcome mà không duplicate persistence effect hoặc audit

#### Scenario: Materially different retry không phải equivalent replay

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và retry thay đổi ít nhất một normalized proposed value so với mutation đã commit
- **THEN** hệ thống SHALL NOT coi retry đó là equivalent replay

#### Scenario: Retry sau server failure

- **WHEN** settings slice do Backoffice host khả dụng trong profile do server chọn và mutation chưa commit vì server failure và OWNER retry cùng intended values trên current state hợp lệ
- **THEN** hệ thống SHALL cho phép mutation được đánh giá lại mà không mất recoverability
