## Purpose

Capability này định nghĩa employee raw clocking trong existing Backoffice cloud:
immutable actual-work evidence, current state/session derived và minimal scoped
reads trong trusted establishment và Personnel dossier scope.

## ADDED Requirements

### Requirement: Raw clocking sử dụng trusted cloud scope và online acceptance

Employee surface `/pointage/[establishmentSlug]` SHALL sử dụng trusted
server-resolved organization, establishment và Personnel dossier cùng exact
Pointage authority. Slug hoặc browser-provided identifiers SHALL chỉ là
untrusted input, không phải tenant authority. Mọi acceptance SHALL được xác
nhận bởi cloud; thiếu trusted scope, authority hoặc cloud availability MUST
fail closed, không accepted local evidence, offline queue hoặc sync fallback.

#### Scenario: Employee operation có đầy đủ prerequisites

- **WHEN** online employee gửi supported command trong trusted scope với current authority và Personnel eligibility hợp lệ
- **THEN** hệ thống SHALL đánh giá command theo raw-clocking transition và request identity requirements
- **AND** SHALL chỉ ghi evidence cho dossier đã bind trong scope đó

#### Scenario: Browser đổi scope hoặc dossier

- **WHEN** browser cố chọn organization, establishment hoặc dossier khác trusted employee binding
- **THEN** hệ thống MUST deny hoặc trả non-disclosing not-found, không đọc hoặc ghi cross-scope data

#### Scenario: Cloud hoặc database không xác nhận được kết quả

- **WHEN** employee surface không nhận được authoritative committed result do cloud/database không khả dụng hoặc timeout
- **THEN** surface MUST NOT trình bày operation là đã thành công hoặc tạo accepted local evidence
- **AND** SHALL phân biệt chưa xác nhận kết quả với committed success; timeout không chứng minh server chưa commit

### Requirement: Raw command vocabulary và bốn transition outcomes là đóng

Raw attendance command kinds SHALL chỉ gồm `CLOCK_IN` và `CLOCK_OUT`.
Sau khi current authorization, lifecycle và committed-replay checks đã được
đáp ứng, một new command SHALL tuân theo đúng bốn outcomes dưới đây.
Conflict hoặc unsupported command MUST NOT tạo raw event. Receipt replay
SHALL không được xử lý như new transition.

#### Scenario: NO_OPEN_SESSION nhận CLOCK_IN

- **WHEN** eligible authorized employee chưa có open session và gửi new CLOCK_IN hợp lệ
- **THEN** hệ thống SHALL accept đúng một CLOCK_IN event và derived state trở thành OPEN_SESSION

#### Scenario: OPEN_SESSION nhận CLOCK_OUT

- **WHEN** eligible authorized employee có open session và gửi new CLOCK_OUT hợp lệ
- **THEN** hệ thống SHALL accept đúng một CLOCK_OUT event đóng session đó và derived state trở thành NO_OPEN_SESSION

#### Scenario: OPEN_SESSION nhận CLOCK_IN

- **WHEN** eligible authorized employee có open session và gửi new CLOCK_IN
- **THEN** hệ thống SHALL trả state conflict, không tạo event và không mở thêm session

#### Scenario: NO_OPEN_SESSION nhận CLOCK_OUT

- **WHEN** eligible authorized employee không có open session và gửi new CLOCK_OUT
- **THEN** hệ thống SHALL trả state conflict, không tạo event và không tạo artificial session

#### Scenario: Caller gửi event kind ngoài vocabulary

- **WHEN** caller yêu cầu break, pause, meal, manual adjustment hoặc event kind khác CLOCK_IN/CLOCK_OUT
- **THEN** hệ thống MUST từ chối unsupported command và không ghi attendance event

### Requirement: Raw evidence immutable là sole canonical attendance source

Pointage SHALL sở hữu accepted raw events như sole canonical actual-work
evidence. Accepted content MUST được bảo toàn; recomputation, receipt replay,
state reads và mọi actor trong slice MUST NOT overwrite hoặc xóa raw event.
Future correction SHALL giữ original evidence nhưng không được cung cấp ở slice
này. Personnel tiếp tục sở hữu dossier/lifecycle; Planning sở hữu planned work.

Derived session/current state và technical receipt, continuation, security-audit
metadata MUST NOT trở thành competing attendance sources hoặc tự chứng minh
một attendance transition đã xảy ra. Receipt SHALL phản ánh original committed
raw operation, không tạo independent attendance fact.

#### Scenario: Derived state được tái dựng

- **WHEN** hệ thống tái dựng current state hoặc session
- **THEN** kết quả SHALL dựa trên canonical raw evidence của đúng scoped dossier
- **AND** raw events SHALL không thay đổi do việc tái dựng

#### Scenario: Actor yêu cầu sửa hoặc xóa raw event

- **WHEN** employee, manager hoặc operation trong slice yêu cầu destructive mutation hay correction raw evidence
- **THEN** hệ thống MUST không cung cấp quyền đó và MUST bảo toàn original event

#### Scenario: Technical metadata được dùng làm attendance fact

- **WHEN** technical receipt, continuation hoặc security audit tồn tại nhưng không có corresponding committed raw evidence
- **THEN** hệ thống MUST NOT suy ra một accepted attendance event hoặc session transition chỉ từ metadata đó

### Requirement: Sessions và current state chỉ derived và không overlap

Hệ thống SHALL derive session/current state từ raw events; SHALL NOT có
canonical hoặc materialized session table trong slice. Mỗi scoped dossier
SHALL có tối đa một open session, không overlapping sessions. Nhiều sequential
sessions SHALL được phép, không arbitrary daily quota hoặc automatic
end-of-day closure. Missing CLOCK_OUT SHALL không được bù bằng fabricated event.

#### Scenario: Employee tạo nhiều sequential sessions

- **WHEN** employee hợp lệ hoàn tất CLOCK_IN/CLOCK_OUT rồi bắt đầu và kết thúc các session tiếp theo trong cùng ngày
- **THEN** mỗi valid transition SHALL được đánh giá bình thường, không bị từ chối chỉ do số session trong ngày
- **AND** các sessions SHALL tuần tự và không overlap

#### Scenario: Session thiếu clock-out

- **WHEN** raw evidence có CLOCK_IN chưa được đóng và không có accepted CLOCK_OUT tiếp theo
- **THEN** derived session SHALL vẫn open, không automatic close hoặc inferred CLOCK_OUT

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

#### Scenario: Cùng identity và intent sau commit

- **WHEN** current authorized eligible employee retry cùng request identity và intent đã commit trong own scope
- **THEN** hệ thống SHALL replay original committed receipt với original event instant, không ghi event mới
- **AND** SHALL không chạy lại transition như command mới dù current state đã thay đổi

#### Scenario: Cùng identity nhưng intent khác

- **WHEN** current authorized eligible employee dùng identity đã commit CLOCK_IN để gửi CLOCK_OUT
- **THEN** hệ thống SHALL trả request-identity conflict, không đổi original receipt và không tạo event

#### Scenario: Receipt lookup từ employee hoặc establishment khác

- **WHEN** caller có request identity nhưng trusted employee/establishment/organization scope không khớp committed operation
- **THEN** hệ thống MUST không replay hoặc tiết lộ receipt của scope khác

#### Scenario: Timeout retry

- **WHEN** kết quả mutation chưa biết vì timeout và employee retry cùng intent
- **THEN** retry SHALL dùng cùng request identity, không tự tạo identity mới để tránh uncertainty
- **AND** nếu original đã commit, hệ thống SHALL replay receipt sau current checks; nếu chưa commit, request chỉ được xét như một new command theo current prerequisites

#### Scenario: Replay sau khi lifecycle hoặc authority không còn hợp lệ

- **WHEN** original operation đã commit nhưng current requester không còn exact authority hoặc Personnel eligibility
- **THEN** hệ thống MUST deny replay mà không trả receipt được bảo vệ hoặc tạo event mới
- **AND** original committed evidence MUST được bảo toàn

### Requirement: Concurrent competing requests có tối đa một acceptance

Các distinct requests cạnh tranh cùng một transition của scoped dossier SHALL
có tối đa một acceptance; các request còn lại SHALL không tạo duplicate hoặc
incompatible raw evidence. Repeated submissions của cùng request identity
SHALL không nhân đôi committed operation. Exact locking, transaction, index,
stale-tab mechanism hoặc isolation level là Sensitive Design, không phải
requirement-level choice.

#### Scenario: Hai distinct CLOCK_IN cạnh tranh từ no-open state

- **WHEN** hai eligible authorized requests khác identity cùng cạnh tranh mở session từ cùng NO_OPEN_SESSION
- **THEN** tối đa một request SHALL tạo accepted CLOCK_IN và open session
- **AND** request thua SHALL không tạo event và nhận conflict khi transition không còn hợp lệ

#### Scenario: Hai distinct CLOCK_OUT cạnh tranh đóng cùng session

- **WHEN** hai eligible authorized requests khác identity cùng cạnh tranh đóng một open session
- **THEN** tối đa một request SHALL tạo accepted CLOCK_OUT cho transition đó, không double-close

#### Scenario: Double submit cùng request identity

- **WHEN** cùng mutation identity/intent được submit đồng thời nhiều lần
- **THEN** tối đa một committed event SHALL tồn tại cho mutation và successful replay SHALL tham chiếu cùng original receipt

### Requirement: Accepted event time do server quyết định và giữ historical context

Accepted raw event SHALL giữ server-observed authoritative absolute instant
cùng đủ establishment timezone/calendar context để diễn giải lịch sử.
Browser clock, backdating input, Planning schedule hoặc rounding MUST NOT
quyết định hoặc silently thay raw actual timestamp. Replay SHALL giữ original
instant. Exact precision, storage fields và DST implementation chờ Sensitive
Design; raw absolute instants MUST không mất tính phân biệt do local-time display.

#### Scenario: Browser gửi clock hoặc backdated timestamp khác server

- **WHEN** command kèm browser timestamp hoặc backdating input khác thời điểm server quan sát
- **THEN** hệ thống MUST NOT dùng input đó làm accepted instant hoặc quyền backdate
- **AND** bất kỳ accepted event nào SHALL giữ server-observed instant

#### Scenario: Actual time lệch Planning

- **WHEN** actual clock time khác planned time hoặc một rounding boundary
- **THEN** raw evidence SHALL giữ actual server instant, không consume Planning để round hoặc reconcile

#### Scenario: Local date/time cần được diễn giải lại

- **WHEN** raw event được đọc sau đó, gồm thời điểm local clock có thể lặp lại do DST
- **THEN** absolute instant và retained establishment calendar/timezone context SHALL cho phép diễn giải event mà không coi local clock label là sole time authority

### Requirement: Cross-midnight grouping không thay departure eligibility

Session qua midnight SHALL vẫn là một session, grouping ban đầu theo
CLOCK_IN business date trong establishment context. Mỗi event SHALL giữ
independent absolute instant. Midnight SHALL không tạo split, artificial
CLOCK_OUT/CLOCK_IN hoặc payroll/day allocation.

Mọi new CLOCK_OUT SHALL vẫn chịu current Personnel eligibility theo ngày
có thẩm quyền tại operation; CLOCK_IN business-date grouping MUST NOT kéo dài
eligibility qua departure boundary.

#### Scenario: Session đi qua midnight trong employment period

- **WHEN** employee CLOCK_IN trước midnight và CLOCK_OUT hợp lệ sau midnight
- **THEN** hai events SHALL tạo một derived session grouped theo CLOCK_IN business date, giữ cả hai absolute instants

#### Scenario: CLOCK_OUT sau departure date

- **WHEN** session mở vào valid final employment day nhưng CLOCK_OUT được thử sau departure date
- **THEN** hệ thống MUST deny, không ghi CLOCK_OUT hoặc automatic close
- **AND** session SHALL vẫn open cho một future separately approved correction capability

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

#### Scenario: Employee chưa clock-in

- **WHEN** current eligible authorized employee đọc own state không có open session
- **THEN** surface SHALL hiển thị own display name và NOT_CLOCKED_IN, không prior clock-out, daily total hoặc history

#### Scenario: Employee đang clock-in

- **WHEN** current eligible authorized employee đọc own state có open session
- **THEN** surface SHALL hiển thị own display name, CLOCKED_IN và start date/time của open session đó
- **AND** SHALL không trả các closed sessions hoặc attendance totals

#### Scenario: Minimal Personnel projection

- **WHEN** Pointage cần display name của employee đã được authorize trong trusted scope
- **THEN** chỉ own display name projection từ Personnel SHALL được dùng cho hiển thị, không lộ broader Personnel dossier hoặc chuyển ownership

#### Scenario: Employee yêu cầu lịch sử

- **WHEN** employee yêu cầu today history, totals, prior clock-out hoặc historical attendance
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

#### Scenario: Authorized manager đọc bounded state

- **WHEN** OWNER/MANAGER có active matching membership và pointage.establishment.read yêu cầu bounded read
- **THEN** hệ thống SHALL chỉ trả current-day raw events và current open-session data trong trusted establishment
- **AND** SHALL không trả monthly/payroll/correction/security-audit view hoặc closed attendance history ngoài phạm vi ngày

#### Scenario: Manager thiếu scope hoặc exact grant

- **WHEN** manager thiếu active matching membership hoặc dedicated establishment-read grant
- **THEN** hệ thống MUST deny và không trả establishment data

#### Scenario: STAFF hoặc employee xin manager read

- **WHEN** STAFF hoặc employee-only actor yêu cầu establishment-wide read
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

#### Scenario: Interaction kết thúc trên shared tablet

- **WHEN** employee hoàn tất hoặc rời interaction theo bounded interaction lifecycle
- **THEN** employee-specific display, receipt và reusable authority SHALL không còn khả dụng cho người kế tiếp
- **AND** subsequent employee SHALL phải có own identification/authority

#### Scenario: Browser khôi phục state cũ

- **WHEN** refresh, back navigation hoặc cached content xảy ra sau khi interaction đã kết thúc
- **THEN** surface MUST NOT khôi phục identity, receipt hoặc usable authority của employee trước

#### Scenario: Mutation pending, success hoặc conflict

- **WHEN** employee submit mutation rồi nhận committed success hoặc authorized state conflict
- **THEN** surface SHALL phân biệt pending với kết quả đã xác nhận, chỉ hiển thị committed receipt khi có commit
- **AND** conflict SHALL không được trình bày như accepted clock event

#### Scenario: Invalid credential, rate limit hoặc lifecycle denial

- **WHEN** identification/access bị từ chối do credential invalid, rate limiting hoặc lifecycle
- **THEN** surface SHALL thể hiện access failure không tiết lộ credential match, dossier existence hoặc lifecycle classification
- **AND** MUST không hiển thị protected employee state hoặc success

### Requirement: Capability giữ fail-closed provenance và tách biệt production policy

Credential processing MUST có verified server-trusted client-address
provenance. Missing hoặc untrusted provenance MUST fail closed; arbitrary
`Forwarded`, `X-Forwarded-For`, `X-Real-IP` hoặc browser-supplied headers
MUST NOT được coi là trusted proof. Không được fallback sang shared
unknown-client bucket, candidate-only limiter hoặc unsafe offline/local
acceptance.

Capability này SHALL NOT tự định nghĩa hoặc phê duyệt retention duration,
deletion/anonymization execution, legal hold, backup-retention interaction,
employee notice hoặc detailed audit visibility policy. Các policy đó SHALL
thuộc separately approved Legal/Privacy/operations authority; không được suy
ra keep-forever hoặc default cleanup policy từ raw-evidence immutability.

Sự tồn tại, implementation hoặc successful checks của capability SHALL NOT
tự chứng minh production readiness hay cấp production enablement.
Provider composition SHALL cần separately approved runtime/deployment
authority; capability này SHALL NOT tự định nghĩa hoặc phê duyệt production
client-address provider.

#### Scenario: Thiếu trusted client-address provenance

- **WHEN** credential processing không có verified trusted client-address provenance hoặc chỉ có untrusted forwarded/browser headers
- **THEN** hệ thống MUST fail closed, không trust các headers đó và không dùng unknown-client, candidate-only hoặc offline/local acceptance fallback

#### Scenario: Production legal policy chưa được duyệt

- **WHEN** retention, deletion, legal hold, backup interaction, notice hoặc audit visibility chưa có approval riêng
- **THEN** capability MUST NOT tự đặt default legal policy, thực hiện cleanup hoặc tuyên bố đã đáp ứng policy đó

#### Scenario: Capability được triển khai và kiểm tra thành công

- **WHEN** raw-clocking capability tồn tại hoặc implementation và checks đã hoàn tất
- **THEN** kết quả SHALL không tự cấp production enablement, chứng minh production readiness hoặc phê duyệt provider composition

### Requirement: Usable slice không mở rộng explicit non-scope

Slice SHALL NOT cung cấp manager/credential-management UI, monthly dashboard,
employee attendance history/totals/prior clock-out view, break/pause/meal/manual
adjustment, correction, auto-close, weekly acknowledgement, Planning
reconciliation/rounding, +/-15-minute anomalies, Today integration,
weekly/monthly/payroll allocation, HS/HC, absences, jours fériés, avantages
en nature, payroll/TESE, closure hoặc PDF/export.

Slice SHALL NOT thêm canonical/materialized session table, redesign credential
crypto/grants, standalone revoke/suspend, global identity, Personnel write-back,
new app/deployment topology, POS/Site Agent/Display/db-pos, offline
acceptance/replay queue/sync hoặc production enablement.

#### Scenario: Downstream hoặc ngoài phạm vi yêu cầu capability

- **WHEN** caller yêu cầu một workflow, read, write hoặc integration thuộc explicit non-scope
- **THEN** slice MUST không cung cấp authority hoặc side effect đó; raw-clocking approval không thay thế separate reviewed change
