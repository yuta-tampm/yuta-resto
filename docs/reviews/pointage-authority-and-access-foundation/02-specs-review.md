Change: pointage-authority-and-access-foundation
Gate: 2 — Requirements Review
Review status: APPROVED
Created: 2026-09-06T22:58:45.6909135+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — credential/security, authorization, tenancy, personnel/privacy data và possible cloud migration
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T23:04:50.2706621+02:00

# Gate 2 — Requirements Review

## Approved Gate 1 Reference

- Packet: `docs/reviews/pointage-authority-and-access-foundation/01-analysis-review.md`
- Gate 1 status: `APPROVED`
- Approval source: explicit current-user instruction ngày 2026-09-06.
- Gate 1 packet SHA-256: `0bd04c07e4f1f3967e2155b7b7ed0c0a45194f7f85127f2b31b4c4fd55ebd548`
- Approved Proposal SHA-256: `900e2c99c7f88d655a02ddc4b58d2dc5a61c140b1dea29319546d84458627494`
- Approved Analysis SHA-256: `fe06a094fb0b3772cbcd2b1ca8b222055ad96f2f00e54c06451e1b7adb40f0ed`

Gate 1 artifact path-set và hashes đã được recompute trước revision và vẫn khớp
chính xác với packet đã duyệt.

## Requested Corrections Resolved

Gate 2 trước nhận current-user decision `CHANGES_REQUIRED`. Revision này chỉ sửa
`authorization/pointage`; `pointage/authority-foundation` giữ nguyên exact bytes.

### Issue 1 — Credential issuance tách khỏi clocking eligibility

- Scenario issuance nay chỉ yêu cầu authorized credential-management operation và correctly scoped Personnel dossier.
- Issuance hoặc credential existence SHALL NOT tự xác lập eligibility tạo Pointage evidence.
- Evidence-creation eligibility tiếp tục được đánh giá độc lập theo Personnel employment-period requirements.
- Không thêm quy tắc cho phép hoặc cấm upcoming employee nhận credential trước entry date.

### Issue 2 — Không có standalone invalidation operation

- Lifecycle operations trong foundation chỉ còn issue và reset/regeneration.
- Successful reset/regeneration MUST làm superseded credential mất hiệu lực.
- Audit attribution bao phủ resulting old-credential invalidation.
- Không định nghĩa standalone invalidate, revoke hoặc suspend operation.

Previous `authorization/pointage` SHA-256 được review và yêu cầu sửa:
`514ec115b56eb86ebb52a884064b9a67eab92db1e84fe088a7252f8d670feb0a`.

## Delta Spec Paths and Hashes

| Path                                                                                                    | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/pointage-authority-and-access-foundation/specs/authorization/pointage/spec.md`        | `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058` |
| `openspec/changes/pointage-authority-and-access-foundation/specs/pointage/authority-foundation/spec.md` | `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613` |

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

Hashes được tính trên exact file bytes, ghi dưới dạng lowercase hexadecimal và
sorted theo repository-relative path.

## Exact Delta Spec: `authorization/pointage`

Path: `openspec/changes/pointage-authority-and-access-foundation/specs/authorization/pointage/spec.md`

```markdown
## Purpose

Capability này định nghĩa dedicated Pointage employee credential và các
authorization semantics fail-closed cho employee self-service cùng
establishment-scoped manager visibility mà không tạo POS hoặc cloud-user access.

## ADDED Requirements

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
```

## Exact Delta Spec: `pointage/authority-foundation`

Path: `openspec/changes/pointage-authority-and-access-foundation/specs/pointage/authority-foundation/spec.md`

```markdown
## Purpose

Capability này xác lập ownership, tenancy, lifecycle-reference và evidence
invariants tối thiểu cho Pointage cloud/online trước khi một usable clocking
workflow có thể được thiết kế hoặc triển khai.

## ADDED Requirements

### Requirement: Pointage sở hữu actual-work evidence

Pointage SHALL là canonical owner của raw evidence ghi nhận actual worked time.
Personnel SHALL tiếp tục sở hữu employee dossier và employment lifecycle;
Planning SHALL tiếp tục sở hữu planned work và SHALL NOT trở thành source of
truth cho actual worked time.

Một work session, time total hoặc projection khác được tính từ Pointage raw
evidence SHALL được nhận diện là derived value. Derived value SHALL NOT thay thế
ownership của raw evidence hoặc biến planned work thành actual-work evidence.

#### Scenario: Actual-work evidence được phân loại theo owner

- **WHEN** hệ thống xử lý một raw Pointage record đại diện cho actual worked time
- **THEN** record đó SHALL thuộc Pointage ownership
- **AND** Personnel và Planning SHALL NOT được coi là canonical owner của record đó

#### Scenario: Session hoặc total được tạo từ raw evidence

- **WHEN** một work session hoặc time total được suy ra từ Pointage raw evidence
- **THEN** kết quả SHALL được coi là Pointage-derived value
- **AND** raw evidence SHALL tiếp tục là nguồn có thẩm quyền cho phép tái dựng kết quả

#### Scenario: Planned work khác actual worked time

- **WHEN** Planning data khác với Pointage raw evidence
- **THEN** hệ thống SHALL NOT tự thay Planning data cho raw actual-work evidence
- **AND** SHALL NOT tự sửa Planning để hợp thức hóa khác biệt đó

### Requirement: Raw evidence là immutable và future correction không phá hủy nguồn

Sau khi một raw Pointage record được chấp nhận, hệ thống MUST bảo toàn nội dung
gốc như durable evidence. Mọi future correction, adjustment hoặc reconciliation
SHALL được biểu diễn theo cách không overwrite, xóa hoặc làm mất khả năng nhận
biết raw record gốc.

Capability foundation này SHALL NOT tự định nghĩa correction workflow, actor
grants, reason taxonomy hoặc derived recomputation policy.

#### Scenario: Derived projection được tính lại

- **WHEN** hệ thống tính lại một session hoặc total từ raw Pointage evidence
- **THEN** hệ thống SHALL giữ nguyên raw records nguồn
- **AND** SHALL NOT ghi kết quả derived đè lên raw evidence

#### Scenario: Future correction tham chiếu raw evidence

- **WHEN** một future capability được phép ghi correction cho Pointage evidence
- **THEN** correction SHALL không overwrite hoặc xóa raw record gốc
- **AND** hệ thống SHALL giữ đủ quan hệ để phân biệt raw evidence với correction

#### Scenario: Yêu cầu destructive mutation

- **WHEN** một operation cố sửa tại chỗ hoặc xóa raw Pointage evidence đã được chấp nhận
- **THEN** hệ thống MUST deny operation đó theo foundation này

### Requirement: Pointage chỉ tham chiếu Personnel dossier trong trusted establishment scope

Mọi Pointage employee reference SHALL resolve tới một Personnel dossier bằng
trusted `organizationId`, trusted `establishmentId` và dossier identifier thuộc
đúng scope đó. Resource identifier alone, browser-provided organization hoặc
establishment, hay một match ở scope khác MUST NOT tạo authority hoặc identity
match.

Pointage SHALL NOT tạo global employee identity, merge dossier giữa các
establishment hoặc biến một dossier của establishment thành identity dùng chung
cho establishment khác.

#### Scenario: Dossier khớp đầy đủ trusted scope

- **WHEN** một Pointage operation tham chiếu dossier thuộc đúng trusted organization và establishment
- **THEN** hệ thống SHALL sử dụng dossier đó làm Personnel reference trong đúng scope
- **AND** SHALL không chuyển ownership của dossier hoặc lifecycle sang Pointage

#### Scenario: Identifier tồn tại ở establishment khác

- **WHEN** dossier identifier không thuộc trusted organization và establishment hiện tại
- **THEN** hệ thống MUST fail closed bằng denial hoặc non-disclosing not-found behavior
- **AND** MUST không trả hoặc ghi Pointage data của scope khác

#### Scenario: Browser cung cấp tenant scope

- **WHEN** browser gửi organization hoặc establishment values để chọn Pointage scope
- **THEN** hệ thống MUST NOT coi các values đó là trusted authority
- **AND** SHALL chỉ tiếp tục khi server đã resolve trusted organization và establishment context

#### Scenario: Cùng một người có dossier ở nhiều establishment

- **WHEN** các establishment khác nhau có Personnel dossier riêng cho cùng một con người
- **THEN** mỗi dossier SHALL giữ Pointage identity và evidence scope riêng
- **AND** hệ thống SHALL NOT tự merge hoặc chuyển evidence giữa các dossier

### Requirement: Eligibility tạo evidence tuân theo employment period

Một operation có khả năng tạo Pointage raw actual-work evidence SHALL chỉ được
phép khi ngày làm việc thuộc employment period có thẩm quyền của scoped Personnel
dossier. Upcoming employee MUST bị từ chối trước entry date; active employee
SHALL đủ điều kiện; departure date hợp lệ SHALL vẫn là ngày đủ điều kiện cuối
cùng; former employee MUST bị từ chối đối với evidence mới sau departure date.

Eligibility SHALL được đánh giá từ trusted Personnel lifecycle data và SHALL NOT
được suy ra từ credential validity, role input hoặc browser-provided dates.

#### Scenario: Upcoming employee trước entry date

- **WHEN** một operation cố tạo raw evidence cho ngày trước Personnel entry date
- **THEN** hệ thống MUST deny và MUST không tạo raw Pointage record

#### Scenario: Active employee trong employment period

- **WHEN** một operation hợp lệ cố tạo raw evidence cho ngày nằm trong active employment period
- **THEN** employment-period eligibility SHALL cho phép operation tiếp tục tới các kiểm tra Pointage khác

#### Scenario: Ngày departure cuối cùng

- **WHEN** một operation hợp lệ cố tạo raw evidence cho đúng Personnel departure date
- **THEN** ngày đó SHALL vẫn được coi là nằm trong employment period

#### Scenario: Former employee sau departure date

- **WHEN** một operation cố tạo raw evidence cho ngày sau Personnel departure date
- **THEN** hệ thống MUST deny và MUST không tạo raw Pointage record mới

#### Scenario: Credential hợp lệ nhưng dossier không đủ điều kiện

- **WHEN** credential validation thành công nhưng Personnel employment-period eligibility thất bại
- **THEN** hệ thống MUST deny operation
- **AND** credential validity SHALL NOT override Personnel lifecycle

### Requirement: Pointage V1 là cloud và online only

Pointage foundation SHALL chỉ cho phép operation qua trusted cloud server
boundary khi online. POS, Site Agent, Display, local database hoặc local-only
credential state MUST NOT tạo, authorize, cache như accepted evidence hoặc đồng
bộ Pointage raw evidence cho capability này.

Không có online cloud availability hoặc không resolve được trusted establishment
context MUST dẫn tới fail-closed behavior; hệ thống SHALL NOT chuyển sang offline
acceptance hoặc local fallback.

#### Scenario: Trusted cloud request đang online

- **WHEN** một Pointage request tới trusted cloud server boundary với trusted establishment context hợp lệ
- **THEN** cloud/online boundary SHALL cho phép request tiếp tục tới các kiểm tra khác

#### Scenario: Cloud không khả dụng

- **WHEN** dedicated Pointage surface không thể xác nhận request với trusted cloud boundary
- **THEN** hệ thống MUST NOT chấp nhận operation như raw Pointage evidence
- **AND** MUST NOT tạo local accepted record để đồng bộ sau

#### Scenario: POS hoặc Site Agent cố tạo Pointage evidence

- **WHEN** POS, Site Agent hoặc local database state được dùng để tạo hay authorize raw Pointage evidence
- **THEN** hệ thống MUST deny hoặc không cung cấp capability đó
- **AND** MUST NOT đồng bộ local attendance state vào cloud Pointage

### Requirement: Pointage data giữ personnel-related operational/legal classification

Raw Pointage evidence và derived Pointage data SHALL được xử lý như
personnel-related operational/legal data và SHALL chỉ được đọc hoặc xử lý trong
trusted organization, establishment, dossier và authorized-operation scope áp
dụng. Credential lifecycle và mọi future correction path SHALL cung cấp audit
attribution boundary, nhưng foundation này SHALL NOT quy định audit schema hoặc
detailed audit visibility.

Exact retention duration, deletion hoặc anonymization execution, legal-hold
rules, backup-retention interaction, employee notice wording và detailed audit
visibility MUST remain unresolved production-gate decisions. Hệ thống MUST NOT
suy ra từ foundation này rằng Pointage data được giữ vĩnh viễn, tự động được xóa
theo một thời hạn mặc định hoặc đã đáp ứng legal/privacy readiness.

#### Scenario: Authorized scoped processing

- **WHEN** một authorized Pointage operation xử lý data của employee
- **THEN** data SHALL chỉ được xử lý trong trusted organization, establishment và dossier scope tương ứng

#### Scenario: Cross-scope data request

- **WHEN** một caller yêu cầu Pointage data ngoài trusted hoặc authorized scope
- **THEN** hệ thống MUST fail closed mà không tiết lộ personnel-related data của scope khác

#### Scenario: Credential lifecycle hoặc future correction xảy ra

- **WHEN** credential được issue/reset/regenerate hoặc một future correction được thực hiện
- **THEN** boundary SHALL hỗ trợ attribution cho security/operational audit
- **AND** SHALL NOT tự định nghĩa legal evidence, retention duration hoặc audit visibility

#### Scenario: Không có approved legal retention decision

- **WHEN** exact retention, deletion, legal hold, backup interaction hoặc notice policy chưa được phê duyệt
- **THEN** foundation SHALL NOT áp dụng một policy mặc định như normative Pointage behavior
- **AND** Production Readiness SHALL không được suy ra từ sự tồn tại của capability này

### Requirement: Foundation không kích hoạt workflow ngoài phạm vi

Capability này SHALL NOT tự cung cấp final employee clock-in/clock-out UI,
manager Pointage UI, Planning reconciliation, anomaly detection, correction
workflow, acknowledgement, weekly/monthly views, HS/HC, absence, jours fériés,
avantages en nature, payroll/TESE, monthly closure, export hoặc Today integration.

Foundation SHALL NOT tự enable environment, production, local/offline behavior,
sync hoặc lifecycle promotion.

#### Scenario: Foundation requirements được đáp ứng

- **WHEN** authority/access foundation được triển khai và kiểm tra thành công
- **THEN** hệ thống SHALL NOT coi usable clocking workflow hoặc production Pointage là đã được bật
- **AND** mọi capability ngoài phạm vi SHALL vẫn cần authority và workflow riêng

#### Scenario: Downstream consumer yêu cầu derived data

- **WHEN** Planning, Today, payroll, export hoặc một downstream consumer yêu cầu Pointage data
- **THEN** foundation này SHALL NOT tự cấp integration, access hoặc write-back behavior
```

## Requirements and Scenarios Summary

Hai delta Specs thêm tổng cộng 16 requirements với 58 scenarios.

### `authorization/pointage` — 9 requirements, 34 scenarios

1. Dedicated establishment-scoped Pointage credential, tách POS PIN, POS identity, cloud-user login và restaurant membership.
2. Cấm durable plaintext và permanent manager retrieval; presentation/crypto/storage mechanism để lại Sensitive Design.
3. Credential lifecycle chỉ hỗ trợ authorized issue và reset/regeneration; successful reset/regeneration làm credential cũ mất hiệu lực. Issuance không quyết định evidence eligibility.
4. Employee credential chỉ có self-identify, own current-state read và own Pointage operation; không establishment-wide hoặc cross-employee access.
5. OWNER/MANAGER chỉ có establishment-wide visibility qua exact dedicated Pointage grant; STAFF không được grant chỉ nhờ role.
6. Trusted server-resolved organization, establishment, actor, dossier và operation; mọi missing/mismatch/untrusted input fail closed.
7. Personnel employment-period eligibility độc lập tiếp tục giới hạn operation tạo new raw evidence.
8. Credential lifecycle và authorization decisions hỗ trợ non-secret audit attribution, gồm resulting old-credential invalidation, nhưng không chốt audit schema/visibility/retention.
9. Authorization allow không triển khai final workflow, Sensitive Design choice, production hoặc downstream side effect.

### `pointage/authority-foundation` — 7 requirements, 24 scenarios

1. Pointage sở hữu actual-work evidence; Personnel sở hữu dossier/lifecycle; Planning sở hữu planned work.
2. Raw evidence immutable; derived recomputation và future correction không overwrite hoặc xóa raw source.
3. Personnel dossier reference luôn dùng trusted organization + establishment + dossier scope; không global employee identity.
4. Evidence-creation eligibility theo employment period: upcoming deny, active allow, final departure day allow, former deny.
5. V1 cloud/online only; không POS, Site Agent, local accepted record, offline fallback hoặc sync.
6. Personnel-related operational/legal classification, scoped access và audit attribution boundary; exact legal/privacy policies giữ unresolved.
7. Foundation không tự bật final UI/workflow, Planning/payroll/correction/export integrations, environment hoặc Production Readiness.

## Strict Validation

Command:

```text
openspec validate "pointage-authority-and-access-foundation" --type change --strict --json --no-interactive
```

Exact result:

```json
{
  "items": [
    {
      "id": "pointage-authority-and-access-foundation",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 17
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

Result: `PASS` — one change passed, zero failed, zero issues.

Formatting:

```text
pnpm exec prettier --check "openspec/changes/pointage-authority-and-access-foundation/specs/authorization/pointage/spec.md" "openspec/changes/pointage-authority-and-access-foundation/specs/pointage/authority-foundation/spec.md"
PASS — All matched files use Prettier code style.
```

## Changed Assumptions Since Analysis

Không có Product, authority, ownership, runtime, privacy hoặc scope assumption mới.
Hai corrections loại bỏ các assumption vượt P1-P7:

- credential issuance không còn bị gắn với employment-period evidence eligibility;
- invalidation không còn được biểu diễn như standalone credential lifecycle operation.

Capability paths, Gate 1 authority, explicit non-scope, `UI_AFFECTING: NO`,
Sensitive Design deferrals và Legal/Privacy production blockers giữ nguyên.

## Remaining Ambiguity

Không có requirement-level ambiguity ngăn Gate 2 review.

P1-P7 chưa quyết định thời điểm upcoming employee có thể nhận credential. Specs
cố ý không allow hoặc deny issuance dựa trên entry date; chỉ actual-work evidence
creation bị ràng buộc bởi employment period.

Các chi tiết sau được giữ rõ cho mandatory Sensitive Design:

- credential format, entropy, cryptographic protection và durable representation;
- collision, non-enumerating lookup, concurrent use, throttling/brute-force behavior và recovery mechanics;
- exact establishment-entry mechanism và cloud application placement trong approved topology;
- actor/context type, concrete operation identifiers và grant-mapping representation;
- repository/schema/API shape, audit schema/taxonomy và migration/rollback strategy;
- exact credential presentation mechanism khi issue/regenerate;
- failure behavior chi tiết miễn là giữ các normative fail-closed outcomes.

Các Legal/Privacy production gates vẫn unresolved và ngoài normative behavior của
foundation: exact retention duration, deletion/anonymization execution, legal hold,
backup-retention interaction, employee notice wording và detailed audit visibility.
Specs không áp đặt keep-forever, automatic deletion hoặc readiness mặc định.

## Scope Preservation

Delta Specs không thêm:

- final employee clock-in/clock-out hoặc manager Pointage UI;
- raw-event capture implementation, concrete clock event kinds hoặc correction workflow;
- Planning reconciliation, anomalies, acknowledgement, weekly/monthly views, HS/HC, absences, jours fériés, avantages en nature, payroll/TESE, closure hoặc export;
- POS, Site Agent, Display, local database, offline mode hoặc synchronization;
- global employee identity, cross-establishment dossier merge/transfer hoặc Personnel permission mutation;
- standalone credential invalidate/revoke/suspend operation;
- rule quyết định khi nào upcoming employee được issue credential;
- exact crypto/storage/throttling/schema/API/audit/migration design;
- exact legal retention/deletion/legal-hold/backup/notice/audit-visibility policy;
- environment enablement, deployment, lifecycle hoặc Production Readiness promotion.

## Recommendation

`APPROVE_GATE_2_TO_PROCEED_TO_MANDATORY_SENSITIVE_DESIGN`

Exact approval needed next:

```text
$yuta-run-change pointage-authority-and-access-foundation
Requirements review approved. Continue to Design and Sensitive Design Gate only.
```
