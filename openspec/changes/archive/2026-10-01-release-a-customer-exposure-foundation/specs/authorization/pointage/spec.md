## ADDED Requirements

### Requirement: Hosted Pointage consumer có availability prerequisite độc lập với authority

Hệ thống SHALL áp dụng profile availability do server chọn cho toàn instance Backoffice trước mọi hosted Pointage entry, UI, identification/continuation issuance, protected own/manager read, credential lifecycle execution, command, receipt replay/recovery hoặc continuation mutation. Điều kiện này SHALL áp dụng cho employee page `/pointage/[establishmentSlug]` và bảy APIs `context`, `identify`, `state`, `clock-in`, `clock-out`, `recover`, `end`; slug, exact grant, valid credential/continuation, current eligibility hoặc committed request identity SHALL NOT bypass availability.

Trong `release-a`, các entry này SHALL không khả dụng. Hệ thống SHALL từ chối hosted operation trước protected read/serialization hoặc mutation, SHALL không disclose employee identity, state, receipt hoặc committed outcome, và SHALL không cấp/renew continuation hoặc accept new event. Denial SHALL không xác nhận credential match, dossier existence hoặc Personnel lifecycle classification; prior canonical evidence và committed receipts SHALL không bị sửa/xóa bởi availability.

Availability SHALL không thay dedicated credential validation/binding, employee self-only authority, six-operation catalog, OWNER/MANAGER dedicated grant evaluation, Personnel eligibility hoặc pure domain results. Pure credential/grant/lifecycle evaluation SHALL giữ kết quả theo requirements hiện hành; một allow hoặc valid-final-day result SHALL không tự authorize hosted delivery. Trong `internal`, entry khả dụng SHALL vẫn yêu cầu đầy đủ current authority, scope, credential/continuation validity, Personnel eligibility, runtime/database guards và verified client-address provenance; profile choice SHALL không enable guarded persistence, đổi test/disposable restrictions hoặc phê duyệt provider/deployment/production.

Credential reset/regeneration đã thành công SHALL vẫn invalid old authority; expiry, interaction-end isolation, shared-device local clearing, plaintext-secret protections, non-enumeration và cross-scope denials SHALL tiếp tục hiệu lực kể cả khi hosted entry không khả dụng. Browser SHALL vẫn clear previous protected identity/state/receipt/pending intent/usable authority theo existing local lifecycle; local clearing SHALL NOT chứng minh server `end` đã commit. Availability SHALL không tạo credential revoke/suspend operation hoặc thay Sensitive Design/Legal/Privacy decisions.

#### Scenario: Release A không issue continuation hoặc trả own state

- **WHEN** instance dùng `release-a` và current eligible employee có valid dedicated credential hoặc continuation yêu cầu hosted identify hoặc own-state read
- **THEN** hệ thống SHALL từ chối trước protected identity/state read hoặc continuation issuance/renewal
- **AND** denial SHALL không tiết lộ credential match, dossier existence hoặc lifecycle classification

#### Scenario: Release A không replay original receipt dù current authority hợp lệ

- **WHEN** instance dùng `release-a` và current eligible employee có exact own-operation authority retry hoặc recover committed identity/intent trong đúng scope
- **THEN** consumer SHALL từ chối protected receipt/outcome delivery trước replay read, không accept event mới và không thay original committed evidence/receipt
- **AND** prior success hoặc receipt identity SHALL không mở hosted access

#### Scenario: Release A giữ clearing và old-authority invalidation

- **WHEN** instance dùng `release-a` và một interaction cũ kết thúc hoặc credential đã được reset/regenerate thành công
- **THEN** existing shared-device local clearing và old-credential/continuation invalidation SHALL vẫn bắt buộc; unavailable hosted `end` SHALL không được trình bày như committed server end
- **AND** previous employee identity, state, receipt hoặc usable authority SHALL không được khôi phục cho caller kế tiếp

#### Scenario: Internal không biến grant result thành blanket consumer access

- **WHEN** instance dùng `internal` và hosted Pointage entry khả dụng nhưng một current credential/continuation, exact authority, scope, Personnel eligibility, runtime/database hoặc trusted-address prerequisite không thỏa
- **THEN** hệ thống SHALL fail closed theo existing prerequisite, không disclose protected state/receipt hoặc accept raw evidence
- **AND** availability SHALL không cấp permission, provider approval hoặc production authority

## MODIFIED Requirements

### Requirement: Employee credential chỉ có self-only Pointage authority

Sau successful credential validation và Personnel eligibility checks, employee
actor SHALL chỉ được:

- self-identify như scoped Personnel dossier đã bind;
- đọc current Pointage state tối thiểu cần cho own clocking decision;
- gửi Pointage operation cho chính dossier đó.

Ba semantic authorities này SHALL độc lập với establishment-wide visibility.
Employee credential MUST NOT đọc employee khác, quản lý credential, xem
establishment-wide data, sửa raw evidence hoặc nhận Personnel/Planning/domain
permission khác.

Đối với consumer do Backoffice host, protected identity/state delivery hoặc
operation execution SHALL chỉ được thực hiện khi Pointage entry khả dụng trong
profile do server chọn. Pure self-only authorization evaluation SHALL vẫn giữ
exact scope và operation semantics; kết quả allow SHALL không thay availability
hoặc current domain/eligibility prerequisites. Các self-only, non-disclosure và
destructive-mutation protections SHALL tiếp tục bắt buộc trong mọi profile.

Specification này không định nghĩa concrete operation identifiers, raw clock
event kinds hoặc final clocking workflow.

#### Scenario: Employee đọc own current Pointage state

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và eligible employee actor yêu cầu current Pointage state của dossier đã bind
- **THEN** hệ thống SHALL chỉ trả state tối thiểu được authorize cho own clocking decision
- **AND** SHALL không trả establishment-wide hoặc employee khác data

#### Scenario: Employee gửi operation cho chính mình

- **WHEN** eligible employee actor gửi một supported Pointage operation cho dossier đã bind
- **THEN** authorization SHALL chỉ cho phép operation tiếp tục trong own scope
- **AND** mọi domain và eligibility prerequisite khác SHALL vẫn được áp dụng
- **AND** đối với hosted consumer, authorization allow SHALL không cho operation vượt availability denial trong profile do server chọn

#### Scenario: Employee yêu cầu dossier khác

- **WHEN** employee actor yêu cầu read hoặc operation cho dossier khác dù cùng establishment
- **THEN** hệ thống MUST deny hoặc trả non-disclosing not-found behavior
- **AND** MUST không tiết lộ employee khác có tồn tại hay không

#### Scenario: Employee yêu cầu establishment-wide visibility

- **WHEN** employee actor chỉ có dedicated employee credential yêu cầu establishment-wide Pointage data
- **THEN** hệ thống MUST deny

#### Scenario: Employee cố mutate raw evidence

- **WHEN** employee actor yêu cầu overwrite hoặc xóa raw Pointage evidence
- **THEN** hệ thống MUST deny

### Requirement: Usable consumer dùng dedicated short-lived Pointage continuation

Usable employee consumer SHALL hỗ trợ dedicated short-lived Pointage
continuation sau successful Pointage identification với đủ trusted scope,
current credential validity và Personnel eligibility. Continuation SHALL chỉ
phục vụ bounded Pointage interaction, không generic cloud-user session,
restaurant membership, Personnel permission, POS access hoặc domain khác.
Continuation existence alone MUST NOT được coi là current employee authority.

Đối với consumer do Backoffice host, identification/continuation issuance và
protected continued interaction SHALL có tiền điều kiện Pointage entry khả dụng
trong profile do server chọn. Khi entry khả dụng, current scoped authority,
credential/continuation validity và Personnel lifecycle SHALL vẫn được đánh giá
cho exact operation; availability SHALL không cấp hoặc gia hạn authority.

Exact representation, lifetime, storage, rotation, binding, credential-reset
mechanism và CSRF/replay implementation SHALL remain Sensitive Design choices.
Các requirements foundation hiện có tiếp tục áp dụng, không được thay thế.

#### Scenario: Tiếp tục own Pointage interaction

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và employee đã identify hợp lệ dùng valid continuation cho own supported Pointage operation
- **THEN** consumer SHALL đánh giá current scoped authority và lifecycle cho exact operation trước khi cho tiếp tục
- **AND** SHALL không tạo generic cloud-user hoặc Personnel authority

#### Scenario: Pointage continuation dùng ngoài domain

- **WHEN** continuation được trình bày cho cloud-user login, membership, Personnel, Planning hoặc POS operation
- **THEN** hệ thống MUST không chấp nhận nó như authorization proof cho domain đó

### Requirement: Committed replay không bypass current authorization

Replay SHALL áp dụng current exact Pointage employee authority, scoped binding
và Personnel lifecycle như access được bảo vệ, không chỉ dựa vào receipt,
request identity, prior success hoặc continuation existence. Allowed replay
SHALL chỉ trả own original committed receipt trong bounded retry behavior;
MUST NOT mở history browsing hoặc ghi new raw evidence.

Đối với consumer do Backoffice host, protected receipt replay/recovery SHALL chỉ
được thực hiện khi Pointage entry khả dụng trong profile do server chọn. Current
exact authorization và Personnel lifecycle checks SHALL tiếp tục bắt buộc khi
entry khả dụng; prior allow hoặc committed identity SHALL không mở entry không
khả dụng. Availability denial SHALL không thay original evidence hoặc receipt.

#### Scenario: Authorized replay

- **WHEN** Pointage entry do Backoffice host khả dụng trong profile do server chọn và current eligible employee có exact own-operation authority retry cùng committed identity/intent trong đúng scope
- **THEN** consumer SHALL cho phép original receipt replay theo raw-clocking requirements, không tạo event mới

#### Scenario: Prior success nhưng current access mất hiệu lực

- **WHEN** requester có committed request identity nhưng current credential/continuation, scope, exact authority hoặc lifecycle không còn hợp lệ
- **THEN** hệ thống MUST deny protected receipt replay và không cấp partial authority
