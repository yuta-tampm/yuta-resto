## ADDED Requirements

### Requirement: Availability áp dụng cho toàn bộ Pointage entry do Backoffice host

Hệ thống SHALL áp dụng server-selected whole-instance Backoffice availability trước mọi Pointage-hosted UI, context/identification, protected state read, command, committed receipt replay/recovery hoặc interaction-end request, độc lập với Backoffice login và exact independent employee authority. Employee page `/pointage/[establishmentSlug]`, deferred authenticated Pointage entry và cả bảy API slices `context`, `identify`, `state`, `clock-in`, `clock-out`, `recover`, `end` SHALL chịu cùng tiền điều kiện availability.

Trong `release-a`, mọi entry nêu trên SHALL không khả dụng. Hệ thống SHALL không expose employee surface hoặc Pointage navigation/CTA, SHALL từ chối direct hosted requests trước capability read/mutation, SHALL không tiết lộ employee/dossier existence, protected state, receipt hoặc operation outcome, và SHALL không accept event hay mutate continuation chỉ vì caller có valid credential, continuation, current eligibility hoặc exact grant. Slug, known request identity, prior committed operation và browser claims SHALL NOT bypass điều kiện này.

Trong `internal`, availability SHALL chỉ cho phép entry được đánh giá tiếp; current independent employee/manager authority, credential/continuation validity, Personnel eligibility, trusted tenant/dossier scope, online acceptance, runtime/database guards và verified client-address provenance SHALL vẫn bắt buộc. Chọn `internal` SHALL NOT enable guarded raw persistence, thay test/disposable restrictions, phê duyệt client-address provider hoặc cấp production enablement.

Availability SHALL chỉ thay hosted exposure/admission. Closed command vocabulary, bốn raw transitions, immutable accepted evidence, derived sessions/no overlap, stable request identity, original committed receipt, concurrency, server instant/timezone, departure eligibility, minimal projections, provenance/legal policy và explicit non-scope SHALL giữ nguyên. Existing pure/repository semantics và raw evidence SHALL không bị sửa, xóa hoặc recompute thành competing source bởi việc đóng entry. Local clearing trên shared device SHALL vẫn thực hiện khi interaction kết thúc hoặc entry không khả dụng; local clearing SHALL NOT tự chứng minh server `end` đã commit.

#### Scenario: Release A đóng employee page và identification dù authority độc lập hợp lệ

- **WHEN** instance dùng `release-a` và một employee có valid exact independent Pointage credential thử mở employee page hoặc gọi `identify`
- **THEN** hệ thống SHALL không expose employee workflow và SHALL từ chối hosted entry trước protected initial-state read hoặc continuation issuance
- **AND** denial SHALL không xác nhận credential match, employee/dossier existence hoặc Personnel eligibility

#### Scenario: Release A đóng context và protected state reads

- **WHEN** instance dùng `release-a` và caller gọi `context` hoặc `state`, kể cả với valid continuation hoặc Backoffice manager grant
- **THEN** hệ thống SHALL từ chối trước Pointage capability read và SHALL không trả trusted context, own protected state hoặc establishment data

#### Scenario: Release A từ chối command và trực tiếp replay mutation đã commit

- **WHEN** instance dùng `release-a` và caller gọi `clock-in` hoặc `clock-out` với new request hoặc identity/intent của prior committed operation
- **THEN** hệ thống SHALL từ chối trước command acceptance hoặc protected receipt replay, SHALL không ghi event mới và SHALL không trả prior receipt
- **AND** original committed raw evidence và receipt SHALL được bảo toàn

#### Scenario: Release A từ chối protected recovery

- **WHEN** instance dùng `release-a` và caller gọi `recover` sau timeout/response loss với original request tuple và valid current authority
- **THEN** hệ thống SHALL không replay hoặc tiết lộ committed protected outcome và SHALL không tạo acceptance mới
- **AND** denial SHALL không suy ra prior operation đã thành công hay thất bại và SHALL không thay original evidence

#### Scenario: Release A đóng end API nhưng shared-device local clearing vẫn bắt buộc

- **WHEN** instance dùng `release-a` và một prior interaction gọi `end` hoặc được đóng ở browser
- **THEN** hosted `end` request SHALL bị từ chối trước continuation mutation và browser SHALL vẫn clear protected identity/state/receipt/pending intent/usable authority của interaction đó theo existing local lifecycle
- **AND** UI SHALL không tuyên bố server interaction đã ended hoặc revoked nếu không có authoritative committed end result

#### Scenario: Internal không bypass existing source guards

- **WHEN** instance dùng `internal` và Pointage entry khả dụng nhưng thiếu một current authority, Personnel eligibility, credential/continuation, scoped runtime/database hoặc verified client-address prerequisite hiện hành
- **THEN** hệ thống SHALL fail closed theo existing guard, không mở protected data hoặc raw acceptance
- **AND** profile choice SHALL không cấp provider/deployment/production authority

## MODIFIED Requirements

### Requirement: Raw clocking sử dụng trusted cloud scope và online acceptance

Employee surface `/pointage/[establishmentSlug]` SHALL sử dụng trusted
server-resolved organization, establishment và Personnel dossier cùng exact
Pointage authority. Slug hoặc browser-provided identifiers SHALL chỉ là
untrusted input, không phải tenant authority. Mọi acceptance SHALL được xác
nhận bởi cloud; thiếu trusted scope, authority hoặc cloud availability MUST
fail closed, không accepted local evidence, offline queue hoặc sync fallback.

Đối với read, command, receipt replay/recovery hoặc UI do Backoffice host trong requirement này, hệ thống SHALL chỉ thực hiện capability operation khi Pointage entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi current authority, Personnel eligibility, trusted scope, runtime, credential/continuation và provenance prerequisite hiện hành SHALL tiếp tục bắt buộc. Availability SHALL NOT thay raw-domain outcomes hoặc các invariant về original committed evidence/receipt.

#### Scenario: Employee operation có đầy đủ prerequisites

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và online employee gửi supported command trong trusted scope với current authority và Personnel eligibility hợp lệ
- **THEN** hệ thống SHALL đánh giá command theo raw-clocking transition và request identity requirements
- **AND** SHALL chỉ ghi evidence cho dossier đã bind trong scope đó

#### Scenario: Browser đổi scope hoặc dossier

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và browser cố chọn organization, establishment hoặc dossier khác trusted employee binding
- **THEN** hệ thống MUST deny hoặc trả non-disclosing not-found, không đọc hoặc ghi cross-scope data

#### Scenario: Cloud hoặc database không xác nhận được kết quả

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và employee surface không nhận được authoritative committed result do cloud/database không khả dụng hoặc timeout
- **THEN** surface MUST NOT trình bày operation là đã thành công hoặc tạo accepted local evidence
- **AND** SHALL phân biệt chưa xác nhận kết quả với committed success; timeout không chứng minh server chưa commit

### Requirement: Stable request identity bảo toàn committed receipt và replay

Mỗi mutation SHALL có stable request/idempotency identity trong trusted scoped
employee operation. Cùng identity và cùng intent với một committed operation
SHALL trả original committed receipt, không tạo event khác, sau khi current
authority và Personnel lifecycle được kiểm tra lại. Khác intent SHALL conflict,
không thay committed outcome hoặc tạo event mới. Request identity alone MUST
NOT cho quyền đọc receipt; matching SHALL không vượt organization,
establishment hoặc dossier boundary.

Exact identifier representation, storage, comparison implementation và
retention mechanics không được định nghĩa bởi requirement này.

Đối với read, command, receipt replay/recovery hoặc UI do Backoffice host trong requirement này, hệ thống SHALL chỉ thực hiện capability operation khi Pointage entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi current authority, Personnel eligibility, trusted scope, runtime, credential/continuation và provenance prerequisite hiện hành SHALL tiếp tục bắt buộc. Availability SHALL NOT thay raw-domain outcomes hoặc các invariant về original committed evidence/receipt.

#### Scenario: Cùng identity và intent sau commit

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và current authorized eligible employee retry cùng request identity và intent đã commit trong own scope
- **THEN** hệ thống SHALL replay original committed receipt với original event instant, không ghi event mới
- **AND** SHALL không chạy lại transition như command mới dù current state đã thay đổi

#### Scenario: Cùng identity nhưng intent khác

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và current authorized eligible employee dùng identity đã commit CLOCK_IN để gửi CLOCK_OUT
- **THEN** hệ thống SHALL trả request-identity conflict, không đổi original receipt và không tạo event

#### Scenario: Receipt lookup từ employee hoặc establishment khác

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và caller có request identity nhưng trusted employee/establishment/organization scope không khớp committed operation
- **THEN** hệ thống MUST không replay hoặc tiết lộ receipt của scope khác

#### Scenario: Timeout retry

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và kết quả mutation chưa biết vì timeout và employee retry cùng intent
- **THEN** retry SHALL dùng cùng request identity, không tự tạo identity mới để tránh uncertainty
- **AND** nếu original đã commit, hệ thống SHALL replay receipt sau current checks; nếu chưa commit, request chỉ được xét như một new command theo current prerequisites

#### Scenario: Replay sau khi lifecycle hoặc authority không còn hợp lệ

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và original operation đã commit nhưng current requester không còn exact authority hoặc Personnel eligibility
- **THEN** hệ thống MUST deny replay mà không trả receipt được bảo vệ hoặc tạo event mới
- **AND** original committed evidence MUST được bảo toàn

### Requirement: Employee chỉ thấy own minimal current state và receipt

Sau đầy đủ current self-only authority/Personnel checks, employee SHALL chỉ
thấy own display name, `NOT_CLOCKED_IN` hoặc `CLOCKED_IN`, current
open-session start date/time khi có, và immediate operation receipt.
NO_OPEN_SESSION SHALL map thành NOT_CLOCKED_IN; OPEN_SESSION SHALL map
thành CLOCKED_IN. Historical receipt replay chỉ phục vụ retry của operation
đó, MUST NOT trở thành attendance-history browsing.

Display name SHALL là minimal trusted scoped projection từ Personnel-owned
dossier, không second employee record, Personnel permission hay quyền đọc
toàn bộ dossier. Không mở Personnel list/details, identity history, documents
hoặc write-back. Không có employee today history, daily totals, prior
clock-out display hoặc historical attendance access.

Đối với read, command, receipt replay/recovery hoặc UI do Backoffice host trong requirement này, hệ thống SHALL chỉ thực hiện capability operation khi Pointage entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi current authority, Personnel eligibility, trusted scope, runtime, credential/continuation và provenance prerequisite hiện hành SHALL tiếp tục bắt buộc. Availability SHALL NOT thay raw-domain outcomes hoặc các invariant về original committed evidence/receipt.

#### Scenario: Employee chưa clock-in

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và current eligible authorized employee đọc own state không có open session
- **THEN** surface SHALL hiển thị own display name và NOT_CLOCKED_IN, không prior clock-out, daily total hoặc history

#### Scenario: Employee đang clock-in

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và current eligible authorized employee đọc own state có open session
- **THEN** surface SHALL hiển thị own display name, CLOCKED_IN và start date/time của open session đó
- **AND** SHALL không trả các closed sessions hoặc attendance totals

#### Scenario: Minimal Personnel projection

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và Pointage cần display name của employee đã được authorize trong trusted scope
- **THEN** chỉ own display name projection từ Personnel SHALL được dùng cho hiển thị, không lộ broader Personnel dossier hoặc chuyển ownership

#### Scenario: Employee yêu cầu lịch sử

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và employee yêu cầu today history, totals, prior clock-out hoặc historical attendance
- **THEN** slice MUST không cấp read đó; immediate committed receipt/retry SHALL không mở history capability

### Requirement: Manager read chỉ server-side và establishment-scoped

Minimal manager server read SHALL dùng existing `pointage.establishment.read`
cho authenticated OWNER/MANAGER với active matching membership và exact grant.
Nội dung SHALL giới hạn scoped current-day raw events và current open session;
open session có thể bắt đầu ngày trước, không mở quyền đọc closed history.
Scope và ngày hiện tại SHALL theo trusted establishment context.

Không manager UI, browser manager workflow, monthly/payroll/correction hoặc
security-audit view. STAFF hoặc employee continuation MUST NOT nhận
establishment-wide visibility. Read SHALL không cho quyền mutate raw evidence.

Đối với read, command, receipt replay/recovery hoặc UI do Backoffice host trong requirement này, hệ thống SHALL chỉ thực hiện capability operation khi Pointage entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi current authority, Personnel eligibility, trusted scope, runtime, credential/continuation và provenance prerequisite hiện hành SHALL tiếp tục bắt buộc. Availability SHALL NOT thay raw-domain outcomes hoặc các invariant về original committed evidence/receipt.

#### Scenario: Authorized manager đọc bounded state

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và OWNER/MANAGER có active matching membership và pointage.establishment.read yêu cầu bounded read
- **THEN** hệ thống SHALL chỉ trả current-day raw events và current open-session data trong trusted establishment
- **AND** SHALL không trả monthly/payroll/correction/security-audit view hoặc closed attendance history ngoài phạm vi ngày

#### Scenario: Manager thiếu scope hoặc exact grant

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và manager thiếu active matching membership hoặc dedicated establishment-read grant
- **THEN** hệ thống MUST deny và không trả establishment data

#### Scenario: STAFF hoặc employee xin manager read

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và STAFF hoặc employee-only actor yêu cầu establishment-wide read
- **THEN** hệ thống MUST deny, không mở thêm grant hoặc manager UI

### Requirement: Shared-device UI bảo toàn isolation và trung thực về operation state

Employee surface SHALL hỗ trợ shared device, clear employee-specific identity,
current-state display, receipt và reusable interaction authority khi interaction
kết thúc; người kế tiếp MUST NOT nhận state hoặc quyền của người trước.
Plaintext credential, trusted employee context hoặc employee identity MUST NOT
được lưu trong durable browser storage.

Surface SHALL phân biệt pending/unconfirmed, committed success, authorized
state conflict và access failure; không trình bày optimistic success như
committed evidence. Public failure MUST giữ non-enumeration. Exact inactivity
timeout, clearing mechanism, visual layout/component design không được chọn ở đây.

Đối với read, command, receipt replay/recovery hoặc UI do Backoffice host trong requirement này, hệ thống SHALL chỉ thực hiện capability operation khi Pointage entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi current authority, Personnel eligibility, trusted scope, runtime, credential/continuation và provenance prerequisite hiện hành SHALL tiếp tục bắt buộc. Availability SHALL NOT thay raw-domain outcomes hoặc các invariant về original committed evidence/receipt.

Các yêu cầu clear/isolation khi interaction kết thúc hoặc browser restore SHALL vẫn bắt buộc cả khi availability bị từ chối; các scenario về protected mutation/access state dưới đây chỉ chạy trong hosted interaction khả dụng. Local clearing SHALL không ngụ ý hosted end request đã commit.

#### Scenario: Interaction kết thúc trên shared tablet

- **WHEN** employee hoàn tất hoặc rời interaction theo bounded interaction lifecycle
- **THEN** employee-specific display, receipt và reusable authority SHALL không còn khả dụng cho người kế tiếp
- **AND** subsequent employee SHALL phải có own identification/authority

#### Scenario: Browser khôi phục state cũ

- **WHEN** refresh, back navigation hoặc cached content xảy ra sau khi interaction đã kết thúc
- **THEN** surface MUST NOT khôi phục identity, receipt hoặc usable authority của employee trước

#### Scenario: Mutation pending, success hoặc conflict

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và employee submit mutation rồi nhận committed success hoặc authorized state conflict
- **THEN** surface SHALL phân biệt pending với kết quả đã xác nhận, chỉ hiển thị committed receipt khi có commit
- **AND** conflict SHALL không được trình bày như accepted clock event

#### Scenario: Invalid credential, rate limit hoặc lifecycle denial

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và identification/access bị từ chối do credential invalid, rate limiting hoặc lifecycle
- **THEN** surface SHALL thể hiện access failure không tiết lộ credential match, dossier existence hoặc lifecycle classification
- **AND** MUST không hiển thị protected employee state hoặc success
