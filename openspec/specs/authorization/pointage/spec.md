# Pointage Authorization Specification

## Purpose

Capability này định nghĩa dedicated Pointage employee credential và các
authorization semantics fail-closed cho employee self-service cùng
establishment-scoped manager visibility mà không tạo POS hoặc cloud-user access.

## Requirements

### Requirement: Pointage employee credential là dedicated và establishment-scoped

Mỗi Pointage employee credential SHALL chỉ đại diện cho đúng một Personnel
dossier trong một trusted organization và establishment scope. Credential SHALL
tách khỏi POS PIN, POS identity, YUTA cloud-user login, restaurant membership và
mọi credential của establishment khác.

Successful Pointage credential validation SHALL NOT tạo generic cloud-user
session, restaurant membership authority, POS access hoặc authority cho domain
khác.

#### Scenario: Credential khớp scoped dossier

- **WHEN** dedicated Pointage credential được xác thực trong đúng trusted organization và establishment
- **THEN** kết quả SHALL chỉ identify Personnel dossier đã bind trong scope đó
- **AND** SHALL không cấp authority ngoài Pointage employee operations được grant

#### Scenario: Credential được dùng ở establishment khác

- **WHEN** một Pointage credential được trình bày trong trusted establishment khác scope đã bind
- **THEN** hệ thống MUST deny fail closed
- **AND** MUST không identify, chuyển hoặc merge dossier từ scope gốc

#### Scenario: POS PIN được trình bày như Pointage credential

- **WHEN** caller dùng POS PIN hoặc local POS identity để yêu cầu Pointage access
- **THEN** hệ thống MUST NOT coi đó là Pointage credential proof
- **AND** MUST không tạo cloud Pointage authority từ local state

#### Scenario: Pointage credential được dùng cho cloud-user access

- **WHEN** một employee credential đã xác thực được dùng để yêu cầu Backoffice membership hoặc YUTA cloud-user operation
- **THEN** hệ thống MUST deny theo Pointage capability
- **AND** SHALL không chuyển credential result thành generic authenticated user context

### Requirement: Durable plaintext credential và permanent manager retrieval bị cấm

Hệ thống MUST NOT lưu durable plaintext representation của Pointage employee
credential secret. OWNER, MANAGER, STAFF và employee MUST NOT có operation cho
phép retrieve permanent plaintext secret từ durable state.

Nếu một approved issuance hoặc regeneration flow làm secret khả dụng tạm thời,
khả năng đó MUST không trở thành durable retrievable plaintext. Exact credential
format, entropy, protection, storage representation và presentation mechanism là
Sensitive Design decisions, không được định nghĩa bởi requirement này.

#### Scenario: Durable credential state được đọc

- **WHEN** một authorized actor đọc durable Pointage credential state
- **THEN** hệ thống MUST NOT trả plaintext credential secret

#### Scenario: Manager yêu cầu xem lại secret hiện tại

- **WHEN** OWNER hoặc MANAGER yêu cầu retrieve permanent plaintext của credential hiện tại
- **THEN** hệ thống MUST deny hoặc không cung cấp operation đó

#### Scenario: Issuance làm secret khả dụng tạm thời

- **WHEN** một future approved issuance flow làm credential secret khả dụng cho giao nhận
- **THEN** hệ thống MUST NOT biến secret đó thành durable retrievable plaintext
- **AND** exact presentation mechanism SHALL remain a Sensitive Design decision

### Requirement: Credential lifecycle hỗ trợ issue, reset và regeneration

Dedicated Pointage credential lifecycle SHALL hỗ trợ authorized issuance,
reset và regeneration. Sau một reset hoặc regeneration thành công, credential cũ
MUST không còn authorize bất kỳ Pointage employee operation nào.

Capability này SHALL NOT định nghĩa credential algorithm, value format,
collision handling, recovery mechanics, throttling values hoặc persistence
shape.

#### Scenario: Credential được issue cho correctly scoped dossier

- **WHEN** một authorized credential-management operation issue credential cho một correctly scoped Personnel dossier
- **THEN** resulting credential SHALL chỉ có Pointage scope của dossier đó
- **AND** lifecycle result SHALL hỗ trợ attribution cho operation đã thực hiện
- **AND** issuance hoặc credential existence SHALL NOT tự xác lập eligibility tạo Pointage evidence
- **AND** evidence-creation eligibility SHALL được đánh giá độc lập theo Personnel employment-period requirements

#### Scenario: Credential được reset hoặc regenerate

- **WHEN** authorized reset hoặc regeneration hoàn tất thành công
- **THEN** credential trước đó MUST bị invalid cho mọi future Pointage request
- **AND** chỉ resulting current credential state SHALL có thể tiếp tục tới validation

#### Scenario: Credential cũ được dùng sau reset

- **WHEN** caller trình bày credential đã bị thay thế bởi successful reset hoặc regeneration
- **THEN** hệ thống MUST deny fail closed

#### Scenario: Unauthorized actor yêu cầu credential lifecycle operation

- **WHEN** actor thiếu dedicated Pointage credential-management grant yêu cầu issue, reset hoặc regeneration
- **THEN** hệ thống MUST deny và MUST không thay đổi current credential validity

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

Specification này không định nghĩa concrete operation identifiers, raw clock
event kinds hoặc final clocking workflow.

#### Scenario: Employee đọc own current Pointage state

- **WHEN** eligible employee actor yêu cầu current Pointage state của dossier đã bind
- **THEN** hệ thống SHALL chỉ trả state tối thiểu được authorize cho own clocking decision
- **AND** SHALL không trả establishment-wide hoặc employee khác data

#### Scenario: Employee gửi operation cho chính mình

- **WHEN** eligible employee actor gửi một supported Pointage operation cho dossier đã bind
- **THEN** authorization SHALL chỉ cho phép operation tiếp tục trong own scope
- **AND** mọi domain và eligibility prerequisite khác SHALL vẫn được áp dụng

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

### Requirement: OWNER và MANAGER cần dedicated Pointage grants

Authenticated cloud user có verified active matching establishment membership
role OWNER hoặc MANAGER SHALL được establishment-wide Pointage visibility chỉ
khi exact requested operation có dedicated Pointage grant. STAFF SHALL không
được establishment-wide Pointage visibility chỉ nhờ role STAFF.

Pointage operation semantics SHALL thuộc Pointage; Shared Authorization SHALL
biểu diễn và enforce grants. Personnel permissions, generic membership access
hoặc role name alone SHALL NOT thay thế exact Pointage operation evaluation.

#### Scenario: OWNER có dedicated Pointage grant

- **WHEN** authenticated OWNER có active matching membership và dedicated Pointage grant cho requested establishment-wide operation
- **THEN** hệ thống SHALL allow operation trong trusted establishment scope

#### Scenario: MANAGER có dedicated Pointage grant

- **WHEN** authenticated MANAGER có active matching membership và dedicated Pointage grant cho requested establishment-wide operation
- **THEN** hệ thống SHALL allow operation trong trusted establishment scope

#### Scenario: OWNER hoặc MANAGER thiếu exact grant

- **WHEN** OWNER hoặc MANAGER thiếu dedicated grant cho exact requested Pointage operation
- **THEN** hệ thống MUST deny dù membership role hợp lệ
- **AND** SHALL không suy ra blanket Pointage authority từ role name

#### Scenario: STAFF chỉ có role membership

- **WHEN** authenticated STAFF không có separately approved dedicated Pointage grant yêu cầu establishment-wide visibility
- **THEN** hệ thống MUST deny

#### Scenario: Personnel permission được dùng như Pointage grant

- **WHEN** caller cung cấp Personnel permission allow để yêu cầu Pointage operation
- **THEN** hệ thống MUST vẫn đánh giá exact dedicated Pointage grant
- **AND** MUST NOT alias Personnel authorization thành Pointage authority

### Requirement: Pointage authorization chỉ sử dụng trusted scoped context

Employee và manager Pointage authorization SHALL chỉ sử dụng trusted
server-resolved organization, establishment, actor identity, scoped Personnel
dossier khi áp dụng, và exact requested semantic operation. Browser-provided
organization, establishment, dossier, credential binding, role, membership,
permission hoặc grant MUST NOT tạo hoặc override authority.

Thiếu, invalid, inactive hoặc mismatched prerequisite MUST fail closed mà không
trả partial authorized context, cross-scope data hoặc authority fallback.

#### Scenario: Thiếu trusted establishment

- **WHEN** authorization không có trusted organization và establishment context đầy đủ
- **THEN** hệ thống MUST deny mà không tự chọn establishment

#### Scenario: Dossier không khớp credential binding

- **WHEN** requested dossier không khớp trusted dossier binding của employee credential
- **THEN** hệ thống MUST deny và MUST không trả partial authorized context

#### Scenario: Manager membership sai establishment

- **WHEN** OWNER hoặc MANAGER có Pointage grant nhưng active membership không khớp trusted establishment
- **THEN** hệ thống MUST deny establishment-wide operation

#### Scenario: Browser cố nâng quyền

- **WHEN** browser gửi role, membership, permission hoặc grant khác trusted server state
- **THEN** hệ thống MUST NOT dùng các values đó làm authorization proof
- **AND** SHALL đánh giá chỉ trusted context và exact Pointage grant

#### Scenario: Unsupported actor hoặc operation

- **WHEN** actor type hoặc semantic operation không được capability này hỗ trợ
- **THEN** hệ thống MUST deny fail closed
- **AND** SHALL không fallback sang Personnel, POS hoặc generic cloud-user authorization

### Requirement: Personnel lifecycle tiếp tục giới hạn employee operations

Successful credential validation SHALL NOT tự chứng minh employee đủ điều kiện
clocking. Trước một operation có khả năng tạo new raw evidence, authorization
boundary MUST yêu cầu Personnel employment-period eligibility từ
`pointage/authority-foundation` trong cùng trusted scope.

Upcoming employee trước entry date và former employee sau departure date MUST bị
từ chối; valid final departure day SHALL tiếp tục đủ điều kiện. Credential state
MUST NOT override Personnel lifecycle.

#### Scenario: Valid credential trước entry date

- **WHEN** valid employee credential yêu cầu operation tạo evidence trước entry date
- **THEN** hệ thống MUST deny theo Personnel eligibility

#### Scenario: Valid credential vào final departure day

- **WHEN** valid employee credential yêu cầu supported operation vào đúng final departure day
- **THEN** lifecycle check SHALL cho phép operation tiếp tục tới các prerequisite khác

#### Scenario: Valid credential sau departure date

- **WHEN** valid employee credential yêu cầu operation tạo evidence sau departure date
- **THEN** hệ thống MUST deny và MUST không tạo new raw evidence

### Requirement: Credential lifecycle và authorization decisions hỗ trợ audit attribution

Issue và reset/regeneration, bao gồm resulting old-credential invalidation sau
successful reset/regeneration, SHALL cung cấp actor, scoped dossier, trusted
organization/establishment, action semantics và outcome cho downstream
security/operational audit attribution. Denied Pointage authorization SHALL cung
cấp enough non-secret decision context để attribution có thể được thực hiện mà
không biến audit output thành credential disclosure.

Exact audit event schema, storage, taxonomy, retention, employee-facing
visibility và legal-evidence meaning SHALL remain Sensitive Design hoặc
Legal/Privacy decisions và không được định nghĩa bởi capability này.

#### Scenario: Credential lifecycle operation hoàn tất

- **WHEN** issue hoặc reset/regeneration được allow hoặc deny
- **THEN** authorization boundary SHALL cung cấp scoped actor/action/outcome attribution
- **AND** successful reset/regeneration SHALL hỗ trợ attribution cho resulting old-credential invalidation
- **AND** SHALL NOT bao gồm plaintext credential secret trong audit attribution

#### Scenario: Authorization bị từ chối

- **WHEN** một Pointage authorization request bị deny
- **THEN** boundary SHALL hỗ trợ attribution của decision mà không cấp partial authority
- **AND** SHALL không tiết lộ plaintext credential hoặc cross-scope employee data

#### Scenario: Audit visibility chưa được phê duyệt

- **WHEN** detailed audit visibility hoặc retention chưa có Legal/Privacy decision
- **THEN** capability SHALL NOT suy ra một visibility hoặc retention policy mặc định

### Requirement: Authorization foundation không triển khai final workflow hoặc Sensitive Design

Authorization allow SHALL chỉ xác nhận exact Pointage authority trong trusted
scope; SHALL NOT tự tạo UI, raw clock event, derived session, correction,
Planning write-back, payroll output, local/offline fallback, synchronization,
environment enablement hoặc production readiness.

Capability này SHALL NOT chốt credential crypto/storage format, throttling
numbers, repository/schema shape, exact establishment-entry mechanism, audit
schema, migration/rollback strategy, retention/deletion/legal-hold rules,
backup-retention interaction, employee notice wording hoặc detailed audit
visibility.

#### Scenario: Authorization được allow

- **WHEN** employee, OWNER hoặc MANAGER được allow exact Pointage operation
- **THEN** result SHALL chỉ mang authority cho operation và scope đó
- **AND** SHALL không tự thực hiện domain side effect hoặc capability ngoài phạm vi

#### Scenario: Foundation được triển khai

- **WHEN** dedicated credential và authorization prerequisites tồn tại
- **THEN** hệ thống SHALL NOT coi final Pointage workflow, legal/privacy readiness hoặc production enablement là hoàn tất

### Requirement: Usable consumer dùng dedicated short-lived Pointage continuation

Usable employee consumer SHALL hỗ trợ dedicated short-lived Pointage
continuation sau successful Pointage identification với đủ trusted scope,
current credential validity và Personnel eligibility. Continuation SHALL chỉ
phục vụ bounded Pointage interaction, không generic cloud-user session,
restaurant membership, Personnel permission, POS access hoặc domain khác.
Continuation existence alone MUST NOT được coi là current employee authority.

Exact representation, lifetime, storage, rotation, binding, credential-reset
mechanism và CSRF/replay implementation SHALL remain Sensitive Design choices.
Các requirements foundation hiện có tiếp tục áp dụng, không được thay thế.

#### Scenario: Tiếp tục own Pointage interaction

- **WHEN** employee đã identify hợp lệ dùng valid continuation cho own supported Pointage operation
- **THEN** consumer SHALL đánh giá current scoped authority và lifecycle cho exact operation trước khi cho tiếp tục
- **AND** SHALL không tạo generic cloud-user hoặc Personnel authority

#### Scenario: Pointage continuation dùng ngoài domain

- **WHEN** continuation được trình bày cho cloud-user login, membership, Personnel, Planning hoặc POS operation
- **THEN** hệ thống MUST không chấp nhận nó như authorization proof cho domain đó

### Requirement: Continuation chỉ self-only trong trusted binding và closed catalog

Continuation SHALL chỉ đại diện cho đúng organization, establishment và
Personnel dossier của bounded identification; browser input MUST NOT override
binding. Employee consumer SHALL chỉ có exact identify, own-state read và own
operation authority khi current checks hợp lệ. Existing six-operation catalog
và OWNER/MANAGER dedicated grants SHALL giữ nguyên; CLOCK_IN/CLOCK_OUT là
domain commands, không grant mới.

Employee continuation MUST NOT cho establishment.read, credential.issue/reset,
Personnel dossier access, employee khác hoặc destructive raw-evidence mutation.
Unsupported operation hoặc không establish được current trusted context MUST
fail closed, không alias Personnel/POS/cloud-user authorization.

#### Scenario: Continuation được dùng cho employee khác

- **WHEN** browser yêu cầu dossier khác dù cùng establishment, hoặc đổi establishment/organization của continuation
- **THEN** hệ thống MUST deny non-disclosing, không đọc/ghi data hoặc chuyển identity giữa scopes

#### Scenario: Continuation yêu cầu privileged operation

- **WHEN** employee continuation yêu cầu establishment.read, credential.issue/reset hoặc sửa/xóa raw event
- **THEN** hệ thống MUST deny, không derive manager grant từ employee identity

#### Scenario: Browser cung cấp trusted-context claims

- **WHEN** browser gửi role, grant, membership hoặc employee-context claims để bổ sung continuation
- **THEN** consumer MUST không dùng các claims đó như trusted authority và SHALL chỉ dựa trên validated server scope

### Requirement: Current Personnel eligibility áp dụng cho cả ba employee operations

Trước `pointage.employee.identify`, `pointage.employee.state.read` và
`pointage.employee.operation.create`, consumer MUST kiểm tra current
Personnel employment-period eligibility trong đúng trusted scope, dù proof là
credential hay continuation. Before entry và after departure MUST deny; entry
và valid departure day SHALL inclusive; missing/unverifiable lifecycle MUST
fail closed. Credential validation hoặc issuance SHALL NOT thay eligibility
hoặc định nghĩa upcoming-credential issuance rule.

#### Scenario: Identify trước entry hoặc sau departure

- **WHEN** employee yêu cầu identify ngoài Personnel employment period dù credential còn valid
- **THEN** hệ thống MUST deny, không disclose identity hoặc cấp usable continuation

#### Scenario: State read ngoài employment period

- **WHEN** continuation còn trong lifetime nhưng employee yêu cầu state.read trước entry hoặc sau departure
- **THEN** hệ thống MUST deny, không trả protected state hoặc historical self-service

#### Scenario: Mutation sau departure với session đang mở

- **WHEN** employee có open session và yêu cầu operation.create sau departure date
- **THEN** hệ thống MUST deny; open session và valid continuation SHALL không override lifecycle

#### Scenario: Ngày entry hoặc final departure hợp lệ

- **WHEN** một trong ba employee operations được yêu cầu đúng entry hoặc valid departure day
- **THEN** lifecycle check SHALL cho phép tới các current credential, exact authority và domain prerequisites còn lại, không blanket allow

#### Scenario: Không xác minh được lifecycle hiện tại

- **WHEN** consumer không đọc hoặc xác minh được trusted scoped Personnel lifecycle cho requested employee operation
- **THEN** hệ thống MUST deny, không dùng cached prior success như authority thay thế

### Requirement: Committed replay không bypass current authorization

Replay SHALL áp dụng current exact Pointage employee authority, scoped binding
và Personnel lifecycle như access được bảo vệ, không chỉ dựa vào receipt,
request identity, prior success hoặc continuation existence. Allowed replay
SHALL chỉ trả own original committed receipt trong bounded retry behavior;
MUST NOT mở history browsing hoặc ghi new raw evidence.

#### Scenario: Authorized replay

- **WHEN** current eligible employee có exact own-operation authority retry cùng committed identity/intent trong đúng scope
- **THEN** consumer SHALL cho phép original receipt replay theo raw-clocking requirements, không tạo event mới

#### Scenario: Prior success nhưng current access mất hiệu lực

- **WHEN** requester có committed request identity nhưng current credential/continuation, scope, exact authority hoặc lifecycle không còn hợp lệ
- **THEN** hệ thống MUST deny protected receipt replay và không cấp partial authority

### Requirement: Expiry reset và interaction end không để lại stale authority

Continuation đã expiry hoặc interaction đã kết thúc MUST NOT authorize
identify, state read, mutation hoặc receipt replay. Successful credential
reset/regeneration SHALL không bị bypass bằng continuation bắt nguồn từ
superseded credential; future requests dựa trên old authority MUST fail closed.

Shared-device clearing SHALL chấm dứt reuse của previous employee interaction;
người kế tiếp phải có own valid Pointage identification. Requirement này
không tạo standalone credential revoke/suspend operation. Exact invalidation,
rotation, timeout và reset-race mechanics chờ Sensitive Design.

#### Scenario: Continuation hết hạn

- **WHEN** caller dùng expired continuation cho state, mutation hoặc replay
- **THEN** hệ thống MUST deny theo continuation đó và yêu cầu valid identification cho interaction mới

#### Scenario: Credential reset nhưng browser còn continuation cũ

- **WHEN** successful reset/regeneration đã thay credential và một future request dùng continuation từ superseded credential
- **THEN** hệ thống MUST không cho continuation giữ old employee authority hoặc bypass reset bằng receipt replay

#### Scenario: Interaction đã kết thúc trên shared device

- **WHEN** subsequent caller cố reuse previous interaction continuation sau khi interaction kết thúc
- **THEN** hệ thống MUST deny reuse và không trả previous employee identity, state hoặc receipt

### Requirement: Continuation không serialize trusted context hoặc persist plaintext credential

Consumer MUST NOT serialize trusted Pointage employee context thành browser
authority, persist plaintext credential, hoặc dùng client claims làm server
context. Employee identity, trusted employee context và plaintext credential
MUST NOT được lưu ở durable browser storage. Credential secret MUST NOT xuất
hiện trong receipt, continuation payload được expose, URL hoặc logging/audit
output. Allowlisted own display projection SHALL không trở thành trusted
context hoặc broader Personnel contract.

Technical continuation, receipt và security-audit metadata MUST NOT trở thành
canonical employee identity hoặc competing attendance evidence. Exact token/
session representation hoặc storage mechanism không được quyết định ở đây.

#### Scenario: Browser nhận continuation và current-state response

- **WHEN** valid employee interaction nhận continuation cùng allowed own-state display
- **THEN** response MUST không serialize trusted employee context, plaintext credential hoặc grant claims như browser authority
- **AND** own display name SHALL chỉ là scoped Personnel-owned display projection

#### Scenario: Durable browser storage hoặc diagnostics

- **WHEN** consumer lưu browser state hoặc tạo URL, logs, receipt hay audit attribution
- **THEN** plaintext credential MUST không bị persist/expose trong các outputs đó
- **AND** durable browser storage MUST không chứa employee identity hoặc trusted context

#### Scenario: Technical metadata được tái dùng làm evidence

- **WHEN** downstream logic xử lý continuation, receipt hoặc security audit
- **THEN** metadata MUST không tạo attendance fact độc lập với canonical raw events hoặc second employee identity

### Requirement: Usable consumer giữ non-enumeration và trusted-address prerequisite

Credential processing cho usable consumer MUST giữ existing distributed
candidate/client protection và verified server-trusted client-address
prerequisite. Missing/untrusted provenance MUST fail closed trước credential
processing; continuation SHALL không được dùng để bootstrap access bỏ qua
prerequisite đó. Arbitrary `Forwarded`, `X-Forwarded-For`, `X-Real-IP` hoặc
browser-supplied headers MUST NOT tạo trusted client-address proof; không
unknown-client hoặc candidate-only fallback.

Public credential/access failures MUST không tiết lộ credential match,
dossier existence, cross-scope identity hoặc Personnel lifecycle classification.
Exact failure transport, throttling values và continuation security mechanics
không được chọn ở đây. Capability này SHALL NOT tự định nghĩa hoặc phê duyệt
production client-address provider; provider composition SHALL cần separately
approved runtime/deployment authority. Authorization success SHALL không tự
chứng minh production readiness hoặc resolve Legal/Privacy policy.

#### Scenario: Missing hoặc untrusted client-address provider

- **WHEN** credential identification không có verified trusted-address provenance
- **THEN** hệ thống MUST refuse credential processing, không fallback Forwarded/X-Forwarded-For/X-Real-IP/browser headers, unknown-client bucket hoặc candidate-only limiter

#### Scenario: Public access failure

- **WHEN** credential mismatch, rate limit, invalid continuation hoặc Personnel eligibility denial xảy ra
- **THEN** response MUST không cho phép suy ra credential đúng, dossier tồn tại hoặc lifecycle classification
- **AND** hệ thống MUST không trả partial employee authority hoặc protected display

#### Scenario: Provider composition cần authority riêng

- **WHEN** một runtime/deployment đề nghị dùng client-address provider cho credential processing
- **THEN** việc đáp ứng authorization requirements SHALL không tự phê duyệt provider đó
- **AND** provider composition SHALL cần separately approved runtime/deployment authority, đồng thời giữ verified provenance và fail-closed prerequisites
