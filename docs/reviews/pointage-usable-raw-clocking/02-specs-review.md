Change: pointage-usable-raw-clocking
Gate: GATE 2 — REQUIREMENTS REVIEW
Review status: APPROVED
Created: 2026-09-08T00:06:48.8853576+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T00:17:40.0113171+02:00
Gate 2 decision: APPROVED_FOR_DESIGN

Resume integrity: exact revised two-Spec path set/hashes, 20 requirements /
62 scenarios, Gate 1 artifacts và packet đều MATCH. Pre-approval packet SHA-256:
`63041ffbc8b8fc9d35904ede0984d1ac6ea24cf8c75cffcf2de3a331bd351260`.
Approval chỉ cho Design và required pre-approval UI planning, rồi Sensitive
Design Gate. Original review/stop statements dưới đây là historical snapshot;
không approval cho Tasks, Implementation Plan, Technical Implementation
Contract, Apply hoặc production.

# Gate 2 Review Packet — Authority-layer Correction

## Review History and Current Authorization

Current-user Gate 2 review: `CHANGES_REQUIRED`. Workflow đã ghi status
`CHANGES_REQUESTED` trước khi sửa; packet này được tái tạo với
`AWAITING_HUMAN_REVIEW`. Đây không phải requirements approval hoặc Design
authorization.

Previous packet SHA-256:
`88ebe0570c222bb9878932422f2e8d0a92ec7c50169a44ab19cd486c1bc1817b`.

Trước write, exact old Gate 2 contents/hashes/path set và inherited Gate 1
artifacts đều MATCH. Chỉ hai existing delta Specs và packet này được sửa;
không tạo file mới hoặc Design/page pack/Tasks/migration/code.

Authority correction: P13/P14 vẫn APPROVED cho current implementation,
testing và readiness, nhưng không phải permanent raw-clocking domain
invariant. Durable security behavior và không tự cấp readiness vẫn ở Specs;
current synthetic-only/real-data restriction và provider-only constraint
được giữ ở change authority, không normative domain behavior.

## Approved Gate 1 — Preserved Byte-for-byte

[Gate 1 packet](01-analysis-review.md) vẫn APPROVED với
`Gate 1 decision: APPROVED_FOR_SPECS`.
Không sửa Proposal, Analysis, Gate 1 packet hoặc scaffold trong lượt này.

| Repository-relative path                                          | Exact-byte SHA-256                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md` | `ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557` |
| `openspec/changes/pointage-usable-raw-clocking/.openspec.yaml`    | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/pointage-usable-raw-clocking/analysis.md`       | `f04e66f9f2307dc92aa9cdbd134fb4a35f9c1089459440c0ccfdb40c4a3e9146` |
| `openspec/changes/pointage-usable-raw-clocking/proposal.md`       | `d42975cd06290431701e39d499edac93774275c1bb0f28f8474f6ff0e61816f1` |

Các diễn đạt synthetic-only của Proposal/Analysis tiếp tục là scope và
implementation/testing/readiness authority của change theo current-user
correction; không được dùng làm permanent employee/data classifier hoặc
intrinsic prohibition khi sync main capability Specs trong tương lai.

## Bounded Correction and Unchanged Behavior

Chỉ ba source regions thay đổi:

1. Raw-clocking Purpose: bỏ giới hạn synthetic khỏi permanent capability
   description, thay bằng trusted establishment/Personnel dossier scope.
2. Raw R12: refactor `Synthetic-only là authorization và readiness boundary`
   thành `Capability giữ fail-closed provenance và tách biệt production policy`.
   Giữ verified provenance, explicit forwarded/browser distrust, no
   unknown-client/candidate-only/offline-local fallback; capability không tự
   định nghĩa legal/privacy policy, approve provider hoặc prove readiness.
3. Authorization A7: giữ cùng requirement heading, non-enumeration và distributed
   candidate/client protections; bỏ “synthetic test provider only” khỏi
   permanent authorization semantics. Provider composition cần separate
   runtime/deployment authority; authorization capability không tự define/
   approve production provider.

Complete source bytes sau edit khớp expected output tạo từ đúng ba approved
region replacements. 18 requirement blocks còn lại byte-for-byte unchanged,
kể cả R13 explicit functional non-scope. Không formatter-write hai Specs.

P1–P12, raw ownership, canonical/derived separation, state machine,
idempotency/replay, concurrency, server-time/midnight/departure, employee/
manager scope, continuation và shared-device behavior không thay đổi.
Không thêm `isSynthetic`, employee category, schema flag, enum, permission
hoặc runtime classifier.

Không MODIFIED/REMOVED/RENAMED foundation requirements. Existing capability
`authorization/pointage` tiếp tục nhận ADDED requirements only; NEW
`pointage/raw-clocking` có Purpose và ADDED requirements. Không delta cho
`pointage/authority-foundation`, Personnel hoặc Tenancy.

## Exact Delta Paths, Hashes and Counts

| Repository-relative path                                                             | Requirements | Scenarios | Exact-byte SHA-256                                                 |
| ------------------------------------------------------------------------------------ | ------------ | --------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md` | 7            | 21        | `1ba6a0e6bfd3d82fb0f0d010f62e01dd2eacd7e934158ea3144c84ecf203fd66` |
| `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`  | 13           | 41        | `4bfa64e863ad465a144341c18aa5d0db3ce0806ada52ad40183cf9a4e321f90e` |
| Total                                                                                | 20           | 62        | Exactly two delta Specs                                            |

Previous hashes: authorization
`f911c8b32643326ee30abc1d97fa9e8a13d67135450821374d4928013c084cdf`;
raw-clocking
`e4ff6cf23156cacbfae7c641d08a9a12744509a12efa2b7ca15650343d8f56eb`.
Counts thay từ 20 requirements / 63 scenarios thành 20 / 62:
R12 còn ba durable scenarios thay bốn scenarios cũ; A7 vẫn ba scenarios.

Exact hash/count commands đã chạy với từng `$taskPath` trong các bảng:

```powershell
(Get-FileHash -LiteralPath $taskPath -Algorithm SHA256).Hash.ToLowerInvariant()
[regex]::Matches($taskContent,'(?m)^### Requirement:').Count
[regex]::Matches($taskContent,'(?m)^#### Scenario:').Count
```

Hashes dùng raw file bytes, không normalization. Exact contents bên dưới:
UTF-8 không BOM, LF và final LF ngay trước closing fence. Resume cần exact
path-set và hash equality, không chỉ requirement-count equality.

## Exact Delta Content — authorization/pointage

Source: `openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md`.

```text
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
```

## Exact Delta Content — pointage/raw-clocking

Source: `openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md`.

```text
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
```

## Requirement and Scenario Summary

A/R chỉ là review navigation, không runtime identifiers.

| Review label | Exact requirement heading                                                      | Scenarios |
| ------------ | ------------------------------------------------------------------------------ | --------- |
| A1           | Usable consumer dùng dedicated short-lived Pointage continuation               | 2         |
| A2           | Continuation chỉ self-only trong trusted binding và closed catalog             | 3         |
| A3           | Current Personnel eligibility áp dụng cho cả ba employee operations            | 5         |
| A4           | Committed replay không bypass current authorization                            | 2         |
| A5           | Expiry reset và interaction end không để lại stale authority                   | 3         |
| A6           | Continuation không serialize trusted context hoặc persist plaintext credential | 3         |
| A7           | Usable consumer giữ non-enumeration và trusted-address prerequisite            | 3         |
| R1           | Raw clocking sử dụng trusted cloud scope và online acceptance                  | 3         |
| R2           | Raw command vocabulary và bốn transition outcomes là đóng                      | 5         |
| R3           | Raw evidence immutable là sole canonical attendance source                     | 3         |
| R4           | Sessions và current state chỉ derived và không overlap                         | 2         |
| R5           | Stable request identity bảo toàn committed receipt và replay                   | 5         |
| R6           | Concurrent competing requests có tối đa một acceptance                         | 3         |
| R7           | Accepted event time do server quyết định và giữ historical context             | 3         |
| R8           | Cross-midnight grouping không thay departure eligibility                       | 2         |
| R9           | Employee chỉ thấy own minimal current state và receipt                         | 4         |
| R10          | Manager read chỉ server-side và establishment-scoped                           | 3         |
| R11          | Shared-device UI bảo toàn isolation và trung thực về operation state           | 4         |
| R12          | Capability giữ fail-closed provenance và tách biệt production policy           | 3         |
| R13          | Usable slice không mở rộng explicit non-scope                                  | 1         |

P1/P2 -> R2; P3 -> R5/R6/A4; P4 -> R4; P5 -> R9/A6; P6 -> R10/A2;
P7 -> R7; P8/P9 -> R8/A3; P10 -> R3/R4/A6; P11 -> R11/A5/A6;
P12 -> A1–A6. Tất cả giữ nguyên behavior.

P13/P14 -> current change-authority section ngay dưới đây. Durable security/
authority-separation portion -> R1/R12/A7. Không biến P13/P14 thành permanent
synthetic employee rule.

## Current Change Authority — Not Permanent Domain Behavior

P13/P14 vẫn fully APPROVED và bắt buộc cho change này:

- Implementation, integration tests và Browser QA chỉ dùng
  synthetic/disposable attendance.
- Real employee attendance: NOT_AUTHORIZED trong development, staging và
  production.
- Current credential-processing implementation/testing chỉ dùng approved
  injected synthetic test provider. Không tạo production
  TrustedPointageClientAddressProvider.
- Production enablement: NOT_AUTHORIZED.
- Trusted production client-address provenance: unresolved.
- Không thêm employee classifier, field/schema flag/enum/permission để thay
  human data/readiness authorization.
- Passing Specs/implementation/tests/QA không tự sửa các restrictions này.

Những giới hạn này là current authority; việc bỏ permanent synthetic-only
normative wording không cho phép dùng real data, đổi provider hoặc enable
production. Future separately reviewed runtime/deployment authority vẫn phải
đáp ứng durable verified provenance và non-enumeration invariants.

### Mandatory Carry-forward to Later Gates

Khi từng artifact sau được authorize tạo, nó phải carry forward P13/P14 và
các blockers này rõ ràng:

| Future location                                     | Required preserved constraint                                                                                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sensitive Design                                    | Synthetic/disposable-only implementation/test scope; approved injected test provider only; no production provider; no real attendance; no readiness promotion. |
| Tasks / embedded Technical Implementation Contracts | Same data/provider restrictions thành explicit phase constraints và stop conditions, không synthetic employee schema/classifier.                               |
| Tests / QA data policy                              | Synthetic/disposable data only trong fixtures, integration và real-route Browser QA; không real personnel attendance ở bất kỳ environment nào.                 |
| Production/readiness evidence                       | Bảy unresolved blockers được giữ; không claim production enablement hoặc provider provenance.                                                                  |

Không tạo Design, Tasks, Technical Implementation Contracts hoặc QA files ở
lượt sửa này; đây là carry-forward obligation cho các gates sau, không approval.

### Unresolved Legal/Privacy and Production Blockers

1. Exact retention duration.
2. Deletion/anonymization execution.
3. Legal hold.
4. Backup-retention interaction.
5. Employee notice.
6. Detailed audit visibility.
7. Trusted production client-address provenance.

Không import Personnel retention hoặc tự định nghĩa keep-forever/default
cleanup. Raw-clocking/authorization Specs không tự quyết định các policy này.
Current change không close blocker nào hoặc promote lifecycle/readiness.

## Authorities and Remaining Questions

Authority routing giữ từ approved Analysis:

- [Authority Model](../../AUTHORITY_MODEL.md).
- [Activation policy](../../OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md).
- [Normativity policy](../../OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md),
  đặc biệt normative scope và production/lifecycle separation.
- [Normative Pointage foundation](../../../openspec/specs/pointage/authority-foundation/spec.md).
- [Normative Pointage authorization](../../../openspec/specs/authorization/pointage/spec.md).
- [Personnel Product Knowledge](../../features/personnel/README.md).
- [Authentication](../../architecture/AUTHENTICATION.md),
  [Tenancy](../../architecture/TENANCY.md),
  [database ownership ADR](../../decisions/ADR-003-database-ownership-boundaries.md).
- [Production Readiness](../../operations/PRODUCTION_READINESS.md).
- Current-user P1–P14, approved Gate 1 và current bounded authority-layer
  correction. Code/tests không tạo Product approval.

Personnel own display-name projection không đổi: approved P5 cho minimal
trusted scoped output từ Personnel, không Personnel dossier permission hoặc
second identity. Existing OWNER-only dossier-management boundary không bị
mở rộng. Không phát hiện mới một Personnel read prohibition; nếu Design/Apply
phát hiện controlling conflict, STOP về Control Tower, không invent contract.

Current State broad wording inconsistency đã ghi trong Analysis vẫn
context-only documentation NEEDS REVIEW ngoài target scope. Không sửa
canonical knowledge hoặc historical foundation.

Không còn requirement-level blocker được phát hiện sau bounded correction,
nhưng revised Specs vẫn cần human review. Sensitive Design vẫn phải giải
quyết continuation representation/lifetime/storage/rotation/binding/reset/
CSRF/inactivity/clearing; atomic acceptance/concurrency/stale-tab/idempotency;
time precision/DST/calendar representation; raw/receipt/audit separation,
persistence/migration/rollback; test-provider composition, transport/cache/
cross-user leakage; UI/page-pack design. Không chọn mechanism ở Specs.

## UI and Future QA

UI_AFFECTING: YES
BROWSER_QA_REQUIRED: YES

P1–P12 UI-visible states và scope không đổi. Future Browser QA vẫn gồm
mobile, tablet/shared tablet và applicable desktop; invalid credential,
rate limit, lifecycle denial, NOT_CLOCKED_IN/CLOCKED_IN, CLOCK_IN/CLOCK_OUT
success, conflict, double submit, retry sau unknown timeout, cloud/database
unavailable, shared-device clearing, basic accessibility, screenshots + hashes.
Data policy là synthetic/disposable-only theo P13/P14, không normative
employee classifier. Chưa chạy Browser QA hoặc tạo page pack.

## Validation Evidence

| Exact command / check                                                      | Result                                                                                                                                  |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec status --change pointage-usable-raw-clocking --json`             | Exit 0; yuta-spec-driven, exact two delta paths; Design/Tasks absent. Raw Design-ready status không phải approval.                      |
| `openspec instructions specs --change pointage-usable-raw-clocking --json` | Exit 0; scope/path/context rules retained.                                                                                              |
| `openspec validate pointage-usable-raw-clocking --strict --json`           | Exit 0; valid true, issues [], one passed, zero failed.                                                                                 |
| `pnpm docs:check`                                                          | Exit 0; 36 current documents passed.                                                                                                    |
| `pnpm architecture:check`                                                  | Exit 0; runtime/import/database/client/migration boundaries valid.                                                                      |
| `pnpm -r --if-present typecheck`                                           | Exit 0; workspace typechecks complete.                                                                                                  |
| Two-Spec scoped Prettier check                                             | Exit 0; no formatter write needed on either Spec.                                                                                       |
| Bounded source comparison                                                  | Complete targets match exact expected substitutions; 18 other requirement blocks unchanged.                                             |
| Final packet exact-content/inherited hashes/formatting                     | PASS: exact embedded Spec bytes và inherited Gate 1 hashes MATCH; exact path set, 20 requirements/62 scenarios; scoped formatting PASS. |

Final three-file formatting command (exit 0):

```text
pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md docs/reviews/pointage-usable-raw-clocking/02-specs-review.md
```

Exact-content check: đọc mỗi Spec bằng `[IO.File]::ReadAllBytes`, extract
corresponding fenced content kể cả final LF, encode UTF-8 và so sánh complete
bytes qua `[Convert]::ToBase64String`; cả hai MATCH. Recomputed Gate 1
packet/Proposal/Analysis/scaffold hashes MATCH. Docs/architecture checks chạy
lại sau packet creation đều exit 0. Final protected-group digests đều MATCH
baseline; không added/removed paths, HEAD unchanged. Không formatter-write
hai Specs hoặc Gate 1 artifacts.

Strict validation output:

```json
{
  "items": [
    {
      "id": "pointage-usable-raw-clocking",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 27
    }
  ],
  "summary": {
    "totals": {
      "items": 1,
      "passed": 1,
      "failed": 0
    },
    "byType": {
      "change": {
        "items": 1,
        "passed": 1,
        "failed": 0
      }
    }
  },
  "version": "1.0",
  "root": {
    "path": "D:\\working\\yuta\\yuta-resto",
    "source": "nearest"
  }
}
```

Exact scoped source formatting command:

```text
pnpm exec prettier --check openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md
```

Skipped: repository-wide `pnpm format:check` (scoped diagnostics instead),
`pnpm test:cloud`, `pnpm test:local`, `pnpm build:cloud`, migrations/
database operations và Browser QA vì chỉ bounded planning correction.
Không claim implementation compliance, formal VERIFY hoặc QA PASS.

## Provenance and Protected Scope

Repository: `D:\working\yuta\yuta-resto`.
HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Fresh baseline: `2026-09-08T00:04:02.2176655+02:00`.

Chỉ ba existing paths được sửa:

```text
docs/reviews/pointage-usable-raw-clocking/02-specs-review.md
openspec/changes/pointage-usable-raw-clocking/specs/authorization/pointage/spec.md
openspec/changes/pointage-usable-raw-clocking/specs/pointage/raw-clocking/spec.md
```

Gate 1 files, main Specs, archive, code và unrelated dirty work được giữ
nguyên; không stage/commit/revert/normalize file khác, kể cả Formalités hunk
trong `packages/auth/src/index.ts`.

Protected baseline aggregate digests dùng sorted repository-relative paths từ
`git ls-files --cached --others --exclude-standard`; rows
`path + TAB + lowercase SHA256`, LF-join không trailing LF, hashed UTF-8:

| Group             | Files | Aggregate SHA-256                                                  |
| ----------------- | ----- | ------------------------------------------------------------------ |
| implementation    | 1218  | `50d2146d8ef5f288c685c1dcd07ea818b0daae81a7e13acc9ef352be99e60e28` |
| mainSpecs         | 16    | `bd349acbbbf35fc0a8251b13f8232c2220cbef8878d0ac1748847c1257cacf05` |
| foundationArchive | 7     | `ba70f7956163e612bdc9c58b8a77c3035439f297415f646071a8e2465c4d74bf` |
| foundationReview  | 10    | `db809efbf915e9e6f449e694947993d3865c8f2de7d58f381a61047e103412b4` |
| workflow          | 19    | `7de69d2bb52312ffea1d706dd6bdd4a328ae687ccecf933a5a6c48743ccd6059` |
| knowledge         | 4     | `08c3c8678ba525a2805cc55bdcef465079fd10c72e2f40e7a540ede0b79d4074` |

Groups gồm apps/packages implementation, main Specs, exact foundation archive,
foundation review directory, workflow skill/schema/config và bốn current
knowledge files. Final comparison phải MATCH, không claim whole checkout clean.

## Recommendation and Required Stop

Review lại đúng hai revised delta Specs và authority-layer correction.
P13/P14 không bị rút approval; chỉ chuyển permanent normative behavior về đúng
layer. Recommendation không phải approval.

GATE 2 — REQUIREMENTS REVIEW
Review status: AWAITING_HUMAN_REVIEW

Cần explicit current-user `Gate 2 decision: APPROVED_FOR_DESIGN` trên exact
hashes/path set trước Design. Không tạo Design, page pack, Tasks, migration
hoặc implementation trong lượt này.

Apply authorization: NOT_GRANTED
Real employee attendance: NOT_AUTHORIZED
Production enablement: NOT_AUTHORIZED
Lifecycle/readiness promotion: NOT_AUTHORIZED
