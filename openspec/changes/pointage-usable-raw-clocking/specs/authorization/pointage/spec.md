## ADDED Requirements

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
