# Pointage Authority Foundation Specification

## Purpose

Capability này xác lập ownership, tenancy, lifecycle-reference và evidence
invariants tối thiểu cho Pointage cloud/online trước khi một usable clocking
workflow có thể được thiết kế hoặc triển khai.

## Requirements

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
