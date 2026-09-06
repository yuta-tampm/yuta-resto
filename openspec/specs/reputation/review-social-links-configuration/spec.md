# Reputation Review Social Links Configuration Specification

## Purpose

Định nghĩa cách OWNER quản lý ba liên kết review/social công khai thuộc Reputation theo établissement và cách feedback-web chỉ hiển thị các destination hợp lệ, an toàn.

## Requirements

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

#### Scenario: Đọc đúng scope hiện hành

- **WHEN** authorized OWNER mở settings trong trusted organization và active establishment
- **THEN** hệ thống SHALL chỉ trả ba giá trị Reputation của đúng scope đó

#### Scenario: Sai establishment fail closed

- **WHEN** request tham chiếu settings thuộc establishment khác với trusted active establishment
- **THEN** hệ thống SHALL từ chối mà không đọc hoặc thay đổi các giá trị của establishment kia

#### Scenario: Browser claims không tạo scope

- **WHEN** browser gửi organization, establishment, role hoặc permission claims khác trusted server context
- **THEN** hệ thống SHALL bỏ qua các claims đó khi xác lập authority và scope

#### Scenario: Runtime ngoài scope không tham gia

- **WHEN** capability đọc hoặc lưu ba giá trị
- **THEN** hệ thống SHALL NOT đọc, ghi hoặc đồng bộ Employee, POS, Site Agent hay Display data

#### Scenario: Missing row trên private read

- **WHEN** không có `reputation_settings` row cho trusted organization và establishment
- **THEN** capability SHALL fail closed với bounded configuration-unavailable state, settings surface SHALL không enable Save, và hệ thống SHALL NOT synthesize settings data hoặc đọc row của establishment khác

#### Scenario: Missing row trên Save

- **WHEN** authorized OWNER attempts Save nhưng trusted settings row không tồn tại
- **THEN** mutation SHALL fail closed, Save SHALL không được thực hiện, và hệ thống SHALL NOT create/upsert row, modify link hoặc tạo SETTINGS mutation audit

#### Scenario: Missing row không tạo field Reputation khác

- **WHEN** trusted settings row không tồn tại
- **THEN** capability SHALL NOT derive, default hoặc create `brandVoice`, `publicFeedbackSlug` hay bất kỳ Reputation-owned settings field nào khác

#### Scenario: Recovery sau external provisioning

- **WHEN** một valid separate Reputation provisioning flow sau đó tạo scoped row
- **THEN** subsequent reload MAY expose normal settings capability từ authoritative persisted row mà không định nghĩa provisioning mechanism trong capability này

### Requirement: Settings dùng authority Reputation hiện hành và chỉ OWNER được truy cập

Base Reputation page access SHALL tiếp tục dùng `reputation.read`. Settings
section visibility, read và management SHALL yêu cầu
`reputation.settings.manage`, hiện chỉ OWNER có. Capability SHALL NOT định nghĩa
lại permission map hoặc dùng connector, review-response, marketing hay
Establishment permission làm thay thế.

#### Scenario: OWNER được xem và quản lý settings

- **WHEN** authenticated OWNER có trusted active membership và mở settings section
- **THEN** hệ thống SHALL cho phép đọc và thực hiện explicit Save

#### Scenario: MANAGER không thấy settings surface

- **WHEN** MANAGER có base `reputation.read` nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL không hiển thị hoặc cấp read-management access cho settings section

#### Scenario: STAFF không thấy settings surface

- **WHEN** STAFF có base `reputation.read` nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL không hiển thị hoặc cấp read-management access cho settings section

#### Scenario: Permission khác không thay thế settings authority

- **WHEN** actor có connector, review-response, marketing hoặc Establishment permission nhưng không có `reputation.settings.manage`
- **THEN** hệ thống SHALL từ chối settings read-management authority

#### Scenario: Browser role không bypass OWNER-only authority

- **WHEN** browser tự khai role OWNER hoặc `reputation.settings.manage`
- **THEN** hệ thống SHALL không cấp settings access nếu trusted server context không chứng minh quyền đó

### Requirement: Capability chỉ quản lý đúng ba giá trị nullable

Capability SHALL quản lý đúng `googleReviewUrl`, `facebookReviewUrl` và
`instagramUrl`, mỗi giá trị là URL hợp lệ hoặc `null`. Capability SHALL NOT tạo
generic social-link entity, status phụ hoặc provider tùy ý.

#### Scenario: Initial empty state

- **WHEN** cả ba authoritative values là `null`
- **THEN** settings SHALL hiển thị ba trường trống tương ứng mà không tạo placeholder persisted value

#### Scenario: Populated state

- **WHEN** một hoặc nhiều authoritative values khác `null`
- **THEN** settings SHALL hiển thị đúng normalized persisted values của ba provider tương ứng

#### Scenario: Provider ngoài ba giá trị bị từ chối

- **WHEN** caller cố lưu một provider hoặc status field ngoài ba giá trị được định nghĩa
- **THEN** hệ thống SHALL không mở rộng mutation sang field đó

### Requirement: Thay đổi chỉ xảy ra qua một explicit Save

Hệ thống SHALL hỗ trợ add, replace và clear-to-`null` cho một hoặc nhiều giá trị
trong một explicit Save. Hệ thống MUST NOT autosave khi người dùng nhập, xóa,
blur hoặc đóng settings surface.

#### Scenario: Add một link

- **WHEN** OWNER nhập một valid URL vào field đang `null` và explicit Save
- **THEN** hệ thống SHALL persist normalized URL đó và giữ nguyên hai field còn lại

#### Scenario: Add nhiều link

- **WHEN** OWNER nhập nhiều valid URL vào các field đang `null` và explicit Save
- **THEN** hệ thống SHALL persist tất cả thay đổi trong cùng mutation

#### Scenario: Replace một link

- **WHEN** OWNER thay một persisted URL bằng valid URL khác và explicit Save
- **THEN** hệ thống SHALL replace đúng provider value và giữ nguyên field không đổi

#### Scenario: Replace nhiều link

- **WHEN** OWNER thay nhiều persisted URL bằng các valid URL khác và explicit Save
- **THEN** hệ thống SHALL persist toàn bộ replacements trong cùng mutation

#### Scenario: Clear bằng blank thành null

- **WHEN** OWNER để một field blank sau trim và explicit Save
- **THEN** hệ thống SHALL persist provider value đó thành `null`

#### Scenario: Mixed add update remove

- **WHEN** một explicit Save chứa một add, một replace và một clear hợp lệ
- **THEN** hệ thống SHALL xử lý cả ba thay đổi như một mutation duy nhất

#### Scenario: Nhập liệu không autosave

- **WHEN** OWNER thay đổi field nhưng chưa explicit Save
- **THEN** authoritative persisted values SHALL không thay đổi

#### Scenario: Đóng khi chưa save không ghi dữ liệu

- **WHEN** OWNER đóng settings surface mà không explicit Save
- **THEN** hệ thống SHALL không persist draft input hoặc tạo audit

### Requirement: Save nhiều field là all-or-nothing

Mọi changed provider trong một explicit Save SHALL thành công hoặc thất bại cùng
nhau. Validation error, server failure hoặc audit failure SHALL giữ nguyên toàn
bộ prior authoritative settings.

#### Scenario: Một field invalid làm toàn bộ save thất bại

- **WHEN** multi-field Save có ít nhất một URL invalid
- **THEN** hệ thống SHALL reject toàn bộ mutation và không persist bất kỳ changed field nào

#### Scenario: Server failure giữ nguyên prior state

- **WHEN** server không thể hoàn tất mutation
- **THEN** toàn bộ prior authoritative values SHALL giữ nguyên và caller SHALL có thể retry

#### Scenario: Audit failure không để settings diverge

- **WHEN** required settings audit không thể hoàn tất cùng real mutation
- **THEN** settings mutation SHALL thất bại toàn bộ và prior authoritative values SHALL giữ nguyên

### Requirement: Normalized no-op không ghi và success trả authoritative state

Hệ thống SHALL so sánh normalized proposed values với authoritative values.
Normalized no-op SHALL không tạo persistence mutation hoặc audit. Real success
SHALL trả hoặc reload authoritative persisted state thay vì chỉ tin browser
draft.

#### Scenario: No-op sau normalization

- **WHEN** trim và blank-to-null tạo ra đúng ba authoritative current values
- **THEN** hệ thống SHALL trả trạng thái thành công/no-change mà không persist mutation

#### Scenario: No-op không tạo audit

- **WHEN** explicit Save là normalized no-op
- **THEN** hệ thống SHALL không tạo Reputation SETTINGS audit

#### Scenario: Successful reload

- **WHEN** real mutation commit thành công
- **THEN** caller SHALL nhận hoặc reload ba authoritative persisted values đã commit

### Requirement: Stale conflict và response-loss replay phải recoverable

Hệ thống SHALL ngăn silent last-write-wins. Một stale materially different Save
SHALL bị từ chối bằng recognizable recoverable conflict, giữ nguyên current
authoritative state và cho phép reload. Replay tương đương của mutation đã
commit sau response loss SHALL không tạo duplicate write/audit; materially
different retry SHALL NOT được xem là equivalent replay.

#### Scenario: Stale materially different save bị từ chối

- **WHEN** authoritative settings đã đổi sau khi caller load và caller gửi materially different stale Save
- **THEN** hệ thống SHALL trả recognizable conflict thay vì overwrite current values

#### Scenario: Stale reject giữ nguyên authoritative state

- **WHEN** stale Save bị từ chối
- **THEN** current authoritative values SHALL giữ nguyên và không có partial mutation

#### Scenario: Caller reload sau conflict

- **WHEN** caller nhận conflict
- **THEN** hệ thống SHALL cho phép reload current authoritative values để recover

#### Scenario: Response-loss equivalent replay

- **WHEN** mutation đã commit nhưng response bị mất và caller replay mutation tương đương
- **THEN** hệ thống SHALL recover committed authoritative outcome mà không duplicate persistence effect hoặc audit

#### Scenario: Materially different retry không phải equivalent replay

- **WHEN** retry thay đổi ít nhất một normalized proposed value so với mutation đã commit
- **THEN** hệ thống SHALL NOT coi retry đó là equivalent replay

#### Scenario: Retry sau server failure

- **WHEN** mutation chưa commit vì server failure và OWNER retry cùng intended values trên current state hợp lệ
- **THEN** hệ thống SHALL cho phép mutation được đánh giá lại mà không mất recoverability

### Requirement: Mọi provider URL tuân thủ normalization và safety chung

Trước khi persist hoặc audit, hệ thống SHALL trim outer whitespace, chuyển blank
sau trim thành `null`, và với non-null value SHALL yêu cầu HTTPS, parse được,
không quá 2048 application characters, parsed `username` rỗng và parsed
`password` rỗng. Hostname SHALL được so khớp exact hoặc theo dot-bound rule được
explicit approve. Hệ thống SHALL NOT canonicalize path/query làm đổi semantic
destination, gọi provider, follow redirect hoặc chấp nhận generic shortener.

#### Scenario: Outer whitespace được trim

- **WHEN** valid provider URL có outer whitespace và OWNER Save
- **THEN** hệ thống SHALL đánh giá và persist URL sau khi trim mà giữ nguyên semantic path/query

#### Scenario: Blank sau trim thành null

- **WHEN** input chỉ chứa whitespace
- **THEN** normalized value SHALL là `null`

#### Scenario: HTTP bị từ chối

- **WHEN** non-null provider URL dùng `http:`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Malformed URL bị từ chối

- **WHEN** non-null input không parse thành URL hợp lệ
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: URL quá dài bị từ chối

- **WHEN** normalized non-null URL vượt 2048 application characters
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Embedded username bị từ chối

- **WHEN** parsed provider URL có `username` khác rỗng
- **THEN** hệ thống SHALL reject toàn bộ Save trước persistence và audit

#### Scenario: Embedded password bị từ chối

- **WHEN** parsed provider URL có `password` khác rỗng
- **THEN** hệ thống SHALL reject toàn bộ Save trước persistence và audit

#### Scenario: Rejected credentials không được ghi lại

- **WHEN** URL chứa username hoặc password bị reject
- **THEN** hệ thống SHALL NOT persist hoặc audit credential đó và prior authoritative values SHALL giữ nguyên

#### Scenario: Hostname lookalike bị từ chối

- **WHEN** hostname chỉ chứa provider name nhưng không exact hoặc dot-bound với approved host
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Generic shortener bị từ chối

- **WHEN** URL dùng generic shortener không nằm trong approved provider boundary
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Không follow redirect hoặc gọi provider

- **WHEN** hệ thống validate URL
- **THEN** validation SHALL hoàn tất từ parsed input mà không follow redirect hoặc gửi provider network request

#### Scenario: Không đổi semantic path query

- **WHEN** accepted URL có path hoặc query hợp lệ
- **THEN** normalization SHALL NOT rewrite path/query theo cách đổi destination semantics

### Requirement: Google URL chỉ chấp nhận destination phục vụ review hoặc Maps

Google URL SHALL chỉ chấp nhận các bounded class sau qua HTTPS:

- `g.page` với normal path/query;
- `maps.app.goo.gl` với normal path/query;
- exact `google.com`, `www.google.com`, `google.fr` hoặc `www.google.fr`, với
  pathname bắt đầu `/maps/`;
- exact `search.google.com` với pathname bắt đầu `/local/writereview`.

Mọi Google hostname/subdomain khác SHALL fail closed. Một arbitrary Google
property SHALL NOT trở thành hợp lệ chỉ vì là subdomain hoặc có artificial
`/maps/` path. Capability SHALL đặc biệt từ chối `mail.google.com`,
`accounts.google.com`, `docs.google.com`, arbitrary `*.google.com`, hostname
lookalike và generic shortener. `maps.google.com` hoặc Google hostname khác
SHALL NOT được thêm nếu chưa có Product approval riêng.

#### Scenario: Accept g.page

- **WHEN** OWNER Save `https://g.page/example-review`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept maps.app.goo.gl

- **WHEN** OWNER Save `https://maps.app.goo.gl/example`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept google.com Maps destination

- **WHEN** OWNER Save một HTTPS URL có exact host `google.com` và pathname bắt đầu `/maps/`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept www.google.com Maps destination

- **WHEN** OWNER Save một HTTPS URL có exact host `www.google.com` và pathname bắt đầu `/maps/`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept google.fr Maps destination

- **WHEN** OWNER Save một HTTPS URL có exact host `google.fr` và pathname bắt đầu `/maps/`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept www.google.fr Maps destination

- **WHEN** OWNER Save một HTTPS URL có exact host `www.google.fr` và pathname bắt đầu `/maps/`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Accept search.google.com write-review destination

- **WHEN** OWNER Save một HTTPS URL có exact host `search.google.com` và pathname bắt đầu `/local/writereview`
- **THEN** Google value SHALL vượt qua provider-purpose validation

#### Scenario: Reject google.com non-Maps destination

- **WHEN** Google URL có exact host `google.com` nhưng pathname không bắt đầu `/maps/`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject mail.google.com

- **WHEN** Google URL dùng host `mail.google.com`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject mail.google.com với artificial Maps path

- **WHEN** Google URL dùng host `mail.google.com` và pathname bắt đầu `/maps/`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject accounts.google.com

- **WHEN** Google URL dùng host `accounts.google.com`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject accounts.google.com với artificial Maps path

- **WHEN** Google URL dùng host `accounts.google.com` và pathname bắt đầu `/maps/`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject docs.google.com

- **WHEN** Google URL dùng host `docs.google.com`, kể cả với artificial `/maps/` path
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject unlisted Google hostname

- **WHEN** Google URL dùng hostname ngoài bảy exact first-slice Google hosts
- **THEN** hệ thống SHALL reject toàn bộ Save dù pathname bắt đầu `/maps/`

#### Scenario: Reject Google hostname lookalike

- **WHEN** Google URL dùng hostname như `google.com.example.invalid`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject generic Google shortener

- **WHEN** Google URL dùng `goo.gl` hoặc generic shortener khác ngoài `g.page` và `maps.app.goo.gl`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Google credentials hoặc HTTP

- **WHEN** Google destination chứa username/password hoặc không dùng HTTPS
- **THEN** hệ thống SHALL reject toàn bộ Save theo common safety rules

### Requirement: Facebook URL có bounded provider-host policy

Facebook URL SHALL chỉ chấp nhận HTTPS destination trên exact `facebook.com`,
`www.facebook.com`, `m.facebook.com` hoặc `fb.me`, đồng thời tuân thủ toàn bộ
common safety rules. Mọi Facebook hostname/subdomain khác SHALL fail closed.
Capability SHALL NOT yêu cầu Facebook OAuth hoặc một exact review path.

#### Scenario: Accept Facebook URL

- **WHEN** OWNER Save một HTTPS URL trên exact `facebook.com`
- **THEN** Facebook value SHALL vượt qua provider validation

#### Scenario: Accept www.facebook.com

- **WHEN** OWNER Save một HTTPS URL trên exact `www.facebook.com`
- **THEN** Facebook value SHALL vượt qua provider validation

#### Scenario: Accept m.facebook.com

- **WHEN** OWNER Save một HTTPS URL trên exact `m.facebook.com`
- **THEN** Facebook value SHALL vượt qua provider validation

#### Scenario: Accept fb.me

- **WHEN** OWNER Save một HTTPS URL trên exact `fb.me`
- **THEN** Facebook value SHALL vượt qua provider validation

#### Scenario: Reject unlisted Facebook subdomain

- **WHEN** Facebook URL dùng một subdomain của `facebook.com` ngoài `www.facebook.com` và `m.facebook.com`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Facebook lookalike

- **WHEN** Facebook URL dùng hostname như `facebook.com.example.invalid`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Facebook HTTP

- **WHEN** Facebook URL dùng HTTP thay vì HTTPS
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Facebook embedded credentials

- **WHEN** Facebook URL có parsed username hoặc password khác rỗng
- **THEN** hệ thống SHALL reject toàn bộ Save trước persistence và audit

### Requirement: Instagram URL có bounded provider-host policy

Instagram URL SHALL chỉ chấp nhận HTTPS destination trên exact `instagram.com`
hoặc `www.instagram.com`, đồng thời tuân thủ toàn bộ common safety rules. Mọi
Instagram hostname/subdomain khác SHALL fail closed. Capability SHALL NOT yêu
cầu Instagram OAuth.

#### Scenario: Accept Instagram profile URL

- **WHEN** OWNER Save một HTTPS profile URL trên exact `instagram.com`
- **THEN** Instagram value SHALL vượt qua provider validation

#### Scenario: Accept www.instagram.com

- **WHEN** OWNER Save một HTTPS URL trên exact `www.instagram.com`
- **THEN** Instagram value SHALL vượt qua provider validation

#### Scenario: Reject unlisted Instagram subdomain

- **WHEN** Instagram URL dùng một subdomain của `instagram.com` ngoài `www.instagram.com`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Instagram lookalike

- **WHEN** Instagram URL dùng hostname như `instagram.com.example.invalid`
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Instagram HTTP

- **WHEN** Instagram URL dùng HTTP thay vì HTTPS
- **THEN** hệ thống SHALL reject toàn bộ Save

#### Scenario: Reject Instagram embedded credentials

- **WHEN** Instagram URL có parsed username hoặc password khác rỗng
- **THEN** hệ thống SHALL reject toàn bộ Save trước persistence và audit

### Requirement: Google review URL là manual-only và độc lập GBP connector

`googleReviewUrl` SHALL là `MANUAL_ONLY` trong capability này. Google Business
Profile connection, selected location, OAuth/token lifecycle hoặc provider
lookup SHALL NOT derive, write hoặc silently update giá trị này.

#### Scenario: Manual Save là source duy nhất

- **WHEN** `googleReviewUrl` thay đổi trong slice này
- **THEN** thay đổi SHALL xuất phát từ authorized OWNER explicit Save

#### Scenario: Connect GBP không derive URL

- **WHEN** OWNER kết nối Google Business Profile
- **THEN** hệ thống SHALL NOT tự derive hoặc write `googleReviewUrl`

#### Scenario: Selected GBP location không update URL

- **WHEN** selected Google Business Profile location thay đổi
- **THEN** hệ thống SHALL NOT silently update `googleReviewUrl`

#### Scenario: OAuth refresh không update URL

- **WHEN** Google OAuth token được refresh hoặc thay đổi
- **THEN** hệ thống SHALL NOT thay đổi `googleReviewUrl`

#### Scenario: Không cần provider lookup

- **WHEN** OWNER đọc hoặc lưu settings
- **THEN** capability SHALL NOT yêu cầu Google/Facebook/Instagram network lookup

### Requirement: feedback-web chỉ render safe configured CTA theo trusted public scope

feedback-web SHALL đọc public link configuration từ trusted server-resolved
organization + establishment context. Mỗi valid configured URL SHALL chỉ điều
khiển CTA tương ứng; `null`, malformed hoặc unsupported legacy value SHALL fail
closed và không render unsafe destination. External CTA SHALL dùng
`target="_blank"` và `rel="noopener noreferrer"`.

#### Scenario: Valid Google CTA visible

- **WHEN** trusted public configuration có valid non-null Google URL
- **THEN** Google CTA SHALL hiển thị với destination đó

#### Scenario: Valid Facebook CTA visible

- **WHEN** trusted public configuration có valid non-null Facebook URL
- **THEN** Facebook CTA SHALL hiển thị với destination đó

#### Scenario: Valid Instagram CTA visible

- **WHEN** trusted public configuration có valid non-null Instagram URL
- **THEN** Instagram CTA SHALL hiển thị với destination đó

#### Scenario: Null CTA hidden

- **WHEN** một provider value là `null`
- **THEN** CTA tương ứng SHALL không hiển thị

#### Scenario: Legacy unsafe URL hidden

- **WHEN** stored legacy provider value malformed hoặc không còn thuộc approved provider-purpose boundary
- **THEN** CTA tương ứng SHALL bị ẩn và unsafe destination SHALL không được render

#### Scenario: Browser tenant identity không tạo public authority

- **WHEN** browser cố cung cấp tenant hoặc establishment identity khác trusted server resolution
- **THEN** public projection SHALL không dùng browser identity đó làm authority

#### Scenario: External CTA có safe attributes

- **WHEN** một valid external CTA được render
- **THEN** anchor SHALL có `target="_blank"` và `rel="noopener noreferrer"`

### Requirement: Real mutation và SETTINGS audit phải thành công hoặc thất bại cùng nhau

Mỗi real successful mutation SHALL tạo đúng một mutation-level Reputation
`SETTINGS` audit có actor, trusted organization, trusted establishment,
timestamp và previous/new public URL cho từng changed provider. Settings write
và required audit SHALL thành công hoặc thất bại coherently. Audit SHALL NOT
chứa session/OAuth token, connector credential, rejected URL credential, full
request dump, IP hoặc user-agent.

#### Scenario: Single-provider mutation tạo một audit

- **WHEN** một provider value thực sự thay đổi và mutation commit thành công
- **THEN** hệ thống SHALL tạo đúng một SETTINGS audit mô tả provider delta đó

#### Scenario: Multi-provider mutation tạo một mutation-level audit

- **WHEN** nhiều provider values thay đổi trong cùng successful Save
- **THEN** hệ thống SHALL tạo đúng một SETTINGS audit chứa tất cả changed provider deltas

#### Scenario: Audit chứa bounded attribution

- **WHEN** SETTINGS audit được tạo
- **THEN** audit SHALL xác định actor, trusted organization, trusted establishment, changed providers, previous/new public URLs và timestamp

#### Scenario: No-op không audit

- **WHEN** Save là normalized no-op
- **THEN** hệ thống SHALL không tạo SETTINGS audit

#### Scenario: Invalid input không audit

- **WHEN** Save bị reject vì bất kỳ URL nào invalid
- **THEN** hệ thống SHALL không tạo SETTINGS audit

#### Scenario: Stale reject không audit

- **WHEN** Save bị reject do stale materially different conflict
- **THEN** hệ thống SHALL không tạo SETTINGS audit

#### Scenario: Failed transaction không audit hoặc partial write

- **WHEN** settings/audit operation không commit hoàn chỉnh
- **THEN** hệ thống SHALL không giữ partial settings write hoặc orphan audit

#### Scenario: Audit không chứa forbidden data

- **WHEN** SETTINGS audit được ghi
- **THEN** audit SHALL NOT chứa session token, OAuth token, connector credential, rejected embedded credentials, full request dump, IP hoặc user-agent

### Requirement: Capability không mở rộng sang provider workflow hoặc production operation

Capability SHALL NOT tạo Google OAuth expansion, Facebook/Instagram OAuth,
review import/aggregation, social publishing, AI content, analytics, QR,
generic social-link engine, automatic Google URL derivation, provider network
verification, redirect resolution, unrelated Establishment/Reputation refactor,
production migration, production data mutation, route production enablement
hoặc deployment.

#### Scenario: Provider connection không được tạo

- **WHEN** capability được sử dụng
- **THEN** hệ thống SHALL NOT tạo hoặc mở rộng Google, Facebook hay Instagram OAuth behavior

#### Scenario: Không tạo content hoặc analytics workflow

- **WHEN** links được lưu hoặc render
- **THEN** hệ thống SHALL NOT import reviews, publish social content, invoke AI, generate analytics hoặc QR

#### Scenario: Không tạo generic engine

- **WHEN** ba provider values được quản lý
- **THEN** hệ thống SHALL NOT tạo generic social-link type, provider registry hoặc arbitrary provider workflow

#### Scenario: Planning không production-enable

- **WHEN** capability tiến qua OpenSpec planning hoặc repository implementation
- **THEN** trạng thái đó SHALL NOT tự authorize production migration, data mutation, route enablement hoặc deployment
