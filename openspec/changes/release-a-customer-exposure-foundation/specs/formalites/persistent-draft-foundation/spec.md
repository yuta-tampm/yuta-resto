## ADDED Requirements

### Requirement: Backoffice availability giới hạn cả persistent draft và fictional prototype entry

Hệ thống SHALL áp dụng server-selected whole-instance Backoffice availability trước mọi hosted Formalités entry, navigation/CTA, generic fictional prototype, employee-connected draft UI, list/load/read, source projection, create, EDIT, SAVE, REOPEN, reconciliation, ABANDON và mutation replay/recovery. Điều kiện này SHALL áp dụng cho mọi hosted observable scenario của capability, kể cả retained `ABANDONED` reads, non-CDI ineligible/recovery state hoặc CDI eligibility phục hồi; current OWNER grant và independent Personnel source authority SHALL NOT bypass availability.

Trong `release-a`, cả prototype và employee-connected entry SHALL không khả dụng: hệ thống SHALL không expose các surface đó và SHALL từ chối direct page/API/Server Action trước capability read/mutation. Denial SHALL không đọc hoặc serialize draft, stored/source snapshot, current Personnel facts hoặc protected committed outcome, và SHALL không tạo hoặc thay đổi durable draft/reconciliation/abandonment/replay state. Known employeeId/draftId, valid Formalités/Personnel permissions, prior save hoặc logical mutation identity SHALL NOT mở entry.

Trong `internal`, availability SHALL chỉ cho phép entry được đánh giá theo existing requirements và guards; nó SHALL NOT cấp Formalités hay Personnel permission, bỏ current development opt-in/runtime gate, thay legal meaning hoặc production-enable workflow. Personnel SHALL vẫn sở hữu current facts/lifecycle; Formalités SHALL vẫn sở hữu retained draft/workflow state. CDI eligibility, đúng bảy source facts/revision anchor, explicit persistence/no-autosave, active-draft cardinality, probationChoice meaning, per-fact KEEP/REFRESH, source-state acknowledgement, stale/replay rules, full tenant scope, no Personnel write-back và legal/retention/non-scope boundaries SHALL giữ nguyên.

Việc đóng hosted entry SHALL không xóa hoặc tái kích hoạt prototype hay persisted draft, không auto-abandon, auto-expire, purge hoặc anonymize record, và SHALL không đổi data/domain/persistence semantics của capability. Các pure/domain/persistence invariant SHALL không phụ thuộc exposure.

#### Scenario: Release A đóng cả prototype và employee-connected surface

- **WHEN** instance dùng `release-a` và authenticated OWNER có valid Formalités authority thử mở generic prototype, employee-connected list hoặc employee draft page
- **THEN** hệ thống SHALL không expose navigation/CTA/UI của các entry đó và SHALL từ chối direct entry trước capability operation
- **AND** prototype availability trong source hoặc current development gate SHALL không bypass profile

#### Scenario: Release A không đọc retained draft hoặc recovery state

- **WHEN** instance dùng `release-a` và authorized caller yêu cầu load/READ/REOPEN một active hoặc `ABANDONED` draft, kể cả khi current employee non-CDI hoặc eligibility vừa trở lại CDI
- **THEN** hệ thống SHALL từ chối trước draft/source read và SHALL không trả stored snapshot, authorized current Personnel values, divergence hoặc eligibility classification
- **AND** existing recovery/retention semantics SHALL không trở thành một hosted read exception cho A

#### Scenario: Release A chặn mutation và response-loss replay dù permissions hợp lệ

- **WHEN** instance dùng `release-a` và OWNER có current trusted scope, Formalités MANAGE và Personnel source authority gọi create, EDIT, SAVE, ABANDON hoặc replay cùng logical mutation sau response loss
- **THEN** hệ thống SHALL từ chối trước capability operation, không create/modify draft hoặc repeat effect và không tiết lộ prior committed outcome
- **AND** prior successful saved state và receipt/replay evidence SHALL được bảo toàn

#### Scenario: Release A không mở reconciliation qua recovery

- **WHEN** instance dùng `release-a` và OWNER có đầy đủ current permissions gửi KEEP DRAFT VALUE hoặc REFRESH FROM PERSONNEL cho một divergence
- **THEN** hệ thống SHALL từ chối trước hosted source/draft read và reconciliation mutation
- **AND** SHALL không capture/refetch current Personnel facts hoặc thay stored draft/snapshot/acknowledgement state chỉ để phục vụ unavailable entry

#### Scenario: Release A bảo toàn persisted records khi entry đóng

- **WHEN** instance dùng `release-a` và một active hoặc abandoned draft đã được persist trước đó
- **THEN** exposure denial SHALL không thay lifecycle, source snapshot, draft values, acknowledgement hoặc original committed state của record
- **AND** denial SHALL không tạo automatic deletion/abandonment/expiry hoặc một infinite-retention/legal guarantee

#### Scenario: Internal vẫn cần independent source checks và current eligibility

- **WHEN** instance dùng `internal` và hosted Formalités entry khả dụng
- **THEN** hệ thống SHALL chỉ thực hiện read hoặc mutation sau existing Formalités operation, trusted scope và mọi independent Personnel source-read/current eligibility check áp dụng
- **AND** normal continuation, ineligible/recovery, reconciliation, conflict và replay SHALL giữ đúng existing behavior; chọn profile SHALL không tạo grant hoặc bỏ guard

#### Scenario: Internal không tự enable development-only workflow

- **WHEN** instance dùng `internal` nhưng current development/runtime gate hoặc opt-in của connected draft không thỏa
- **THEN** hệ thống SHALL giữ existing fail-closed restriction cho connected workflow
- **AND** prototype SHALL không trở thành durable Personnel/Formalités authority, và profile SHALL không cấp legal/template/production authority

## MODIFIED Requirements

### Requirement: Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope

Hệ thống SHALL chỉ cho phép tạo draft khi authenticated request có trusted
organization, trusted active establishment và một employee Personnel hiện tồn
tại trong chính xác scope đó, đồng thời `employmentTermType` hiện tại của
employee là `indefinite`. Hệ thống MUST từ chối tạo draft cho employee hiện tại
không phải CDI. Trạng thái full-time, upcoming, departure hoặc điều kiện pháp lý
về période d’essai MUST NOT trở thành eligibility gate của capability này.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Tạo draft cho employee CDI hợp lệ

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER được phép tạo draft cho employee hiện có trong trusted organization và active establishment, và Personnel hiện có `employmentTermType = indefinite`
- **THEN** hệ thống SHALL chấp nhận eligibility tạo draft

#### Scenario: Từ chối tạo draft cho employee CDD hiện tại

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee trong đúng trusted scope có `employmentTermType = fixed_term`
- **THEN** hệ thống SHALL từ chối tạo draft và SHALL không tạo durable draft

#### Scenario: Employee không thuộc đúng scope

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee không tồn tại trong tổ hợp trusted organization và active establishment của request
- **THEN** hệ thống SHALL fail closed và SHALL không tạo draft

#### Scenario: Không thêm eligibility gate ngoài CDI hiện tại

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee trong đúng trusted scope hiện là CDI nhưng có thuộc tính part-time, không upcoming hoặc có departure date
- **THEN** hệ thống SHALL NOT từ chối eligibility chỉ vì các thuộc tính đó

### Requirement: Formalités authorization và Personnel source authorization độc lập

Mọi thao tác đọc draft SHALL yêu cầu operation `formalites.read`; mọi thao tác
tạo, lưu, sửa, reconcile hoặc abandon draft SHALL yêu cầu operation
`formalites.manage`. Việc đọc current Personnel source để kiểm tra eligibility,
hiển thị giá trị hiện tại hoặc reconcile SHALL tiếp tục yêu cầu Personnel source
read authorization độc lập. Capability này SHALL NOT định nghĩa lại role grants
hoặc dùng Personnel permission thay cho Formalités permission.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Đọc draft với Formalités READ

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller có trusted scoped context và `formalites.read` nhưng không thực hiện mutation
- **THEN** hệ thống SHALL cho phép đọc draft thuộc đúng scope, tùy thuộc các source-read checks áp dụng

#### Scenario: Mutation thiếu Formalités MANAGE

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller yêu cầu tạo, lưu, sửa, reconcile hoặc abandon mà không có `formalites.manage`
- **THEN** hệ thống SHALL từ chối mutation và SHALL không thay đổi draft

#### Scenario: Personnel READ không cấp Formalités authority

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller có Personnel source read permission nhưng thiếu Formalités operation cần thiết
- **THEN** hệ thống SHALL từ chối Formalités operation

#### Scenario: Formalités READ không cấp Personnel source authority

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller có `formalites.read` nhưng bị từ chối Personnel source read cần thiết để reopen và so sánh current source
- **THEN** hệ thống SHALL fail closed cho operation cần source đó và SHALL không lộ current Personnel values

### Requirement: Draft lifecycle sử dụng explicit persistence

Tạo thành công SHALL đưa record vào trạng thái `DRAFT`. Một `DRAFT` SHALL hỗ
trợ explicit SAVE, leave, REOPEN, EDIT và explicit ABANDON. Hệ thống MUST NOT
autosave; chỉ một explicit mutation thành công mới được trình bày là durable.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Create tạo trạng thái DRAFT

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và một create hợp lệ hoàn tất thành công
- **THEN** hệ thống SHALL tạo một durable record ở trạng thái `DRAFT`

#### Scenario: Explicit save

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER thực hiện explicit SAVE hợp lệ cho active `DRAFT`
- **THEN** hệ thống SHALL lưu trạng thái Formalités-owned được chấp nhận

#### Scenario: Không autosave khi rời trang

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER sửa cục bộ rồi rời trang mà không có explicit SAVE thành công
- **THEN** hệ thống SHALL NOT trình bày hoặc lưu các thay đổi cục bộ đó như durable state

#### Scenario: Reopen draft đã lưu

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER rời, reload hoặc quay lại một active `DRAFT` đã được lưu thành công
- **THEN** hệ thống SHALL mở lại last successful saved state của draft

### Requirement: Abandonment yêu cầu reason và giữ record

ABANDON SHALL yêu cầu một `abandonmentReason` không blank. Reason này SHALL là
workflow metadata, SHALL được giữ cùng record đã abandon và SHALL NOT được coi
là input nội dung chuẩn bị hợp đồng thứ hai. ABANDON thành công SHALL chuyển
record sang `ABANDONED`; workflow này MUST NOT hard-delete record đó và
`ABANDONED` MUST NOT được sửa như active `DRAFT`.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Abandon thiếu reason

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER yêu cầu ABANDON mà reason bị thiếu hoặc chỉ gồm khoảng trắng
- **THEN** hệ thống SHALL từ chối abandonment và SHALL giữ nguyên active `DRAFT`

#### Scenario: Abandon thành công

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER có `formalites.manage` gửi ABANDON hợp lệ với reason không blank
- **THEN** hệ thống SHALL chuyển draft sang `ABANDONED` và SHALL giữ reason với workflow record

#### Scenario: Không sửa abandoned draft

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller cố EDIT hoặc SAVE một record `ABANDONED` như active draft
- **THEN** hệ thống SHALL từ chối mutation và SHALL không tái kích hoạt record

#### Scenario: Không hard-delete khi abandon

- **WHEN** draft được abandon thành công
- **THEN** workflow SHALL giữ record `ABANDONED` thay vì hard-delete record đó

### Requirement: Có thể tạo draft mới sau abandonment

Một prior `ABANDONED` record SHALL NOT tự động được tái kích hoạt và SHALL NOT
chặn vĩnh viễn draft mới. Hệ thống SHALL cho phép OWNER tạo draft mới cho cùng
employee và formality type khi current eligibility, authorization và cardinality
đều hợp lệ.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Tạo mới sau abandonment

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và prior draft của cùng employee và formality type là `ABANDONED`, không còn active draft và current Personnel eligibility hợp lệ
- **THEN** hệ thống SHALL cho phép một create mới mà không sửa hoặc tái kích hoạt prior record

#### Scenario: Không tạo mới nếu eligibility đã mất

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và prior draft đã `ABANDONED` nhưng employee hiện không còn CDI
- **THEN** hệ thống SHALL từ chối create mới theo current Personnel eligibility

### Requirement: Tối đa một active draft trong business scope

Tại mọi thời điểm, hệ thống MUST duy trì tối đa một active `DRAFT` cho cùng tổ
hợp organization, establishment, employee và formality type. Create MUST NOT
silent-overwrite active draft hiện có. Caller SHALL nhận outcome có thể phân
biệt create thành công, existing active draft hoặc conflict.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Active draft đã tồn tại trước create

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và một create hợp lệ được yêu cầu nhưng active `DRAFT` đã tồn tại trong cùng business scope
- **THEN** hệ thống SHALL không tạo record active thứ hai và SHALL trả outcome existing active draft có thể nhận biết

#### Scenario: Hai create đồng thời

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và hai create hợp lệ cạnh tranh cho cùng business scope khi chưa có active draft
- **THEN** hệ thống MUST kết thúc với nhiều nhất một active `DRAFT`
- **AND** mỗi caller SHALL nhận outcome create thành công, existing active draft hoặc conflict có thể nhận biết, không silent overwrite

### Requirement: probationChoice có ba trạng thái chuẩn bị đã duyệt

Durable `probationChoice` SHALL chỉ có ba semantic states: `UNDECIDED`,
`INCLUDE` và `EXCLUDE`. Meaning hiển thị tương ứng MUST là `À décider`,
`Prévoir une période d’essai` và `Ne pas prévoir de période d’essai`. Draft mới
SHALL khởi tạo là `UNDECIDED`, và explicit SAVE SHALL được phép trong trạng thái
này. Capability MUST NOT thêm `NOT_APPLICABLE` hoặc mặc định ngầm sang INCLUDE
hay EXCLUDE.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Draft mới bắt đầu ở UNDECIDED

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và draft được tạo thành công
- **THEN** `probationChoice` SHALL là `UNDECIDED` với meaning `À décider`

#### Scenario: Lưu khi chưa quyết định

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER explicit SAVE một draft hợp lệ với `probationChoice = UNDECIDED`
- **THEN** hệ thống SHALL cho phép lưu trạng thái đang làm dở đó

#### Scenario: Lưu INCLUDE

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER chọn `INCLUDE` và explicit SAVE thành công
- **THEN** hệ thống SHALL giữ hướng chuẩn bị `Prévoir une période d’essai`

#### Scenario: Lưu EXCLUDE

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER chọn `EXCLUDE` và explicit SAVE thành công
- **THEN** hệ thống SHALL giữ hướng chuẩn bị `Ne pas prévoir de période d’essai`

#### Scenario: Từ chối state ngoài allowlist

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và untrusted input cung cấp probation choice không phải UNDECIDED, INCLUDE hoặc EXCLUDE
- **THEN** hệ thống SHALL từ chối giá trị đó và SHALL không thay đổi durable draft

### Requirement: Reopen phát hiện relevant Personnel divergence theo source facts

Khi REOPEN hoặc đọc active draft, hệ thống SHALL so sánh current authoritative
Personnel source với stored snapshot. Revision anchor thay đổi một mình MUST NOT
tự động được trình bày là relevant draft divergence; divergence SHALL được xác
định từ thay đổi của bảy approved raw source facts. Hệ thống MUST NOT silent
refresh snapshot hoặc draft values.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Relevant source fact thay đổi

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và ít nhất một trong bảy approved source facts khác giữa stored snapshot và current Personnel
- **THEN** hệ thống SHALL báo relevant divergence cho đúng fact bị ảnh hưởng

#### Scenario: Chỉ revision thay đổi

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và Personnel revision thay đổi nhưng cả bảy approved source facts vẫn bằng stored snapshot
- **THEN** hệ thống SHALL NOT báo relevant draft divergence chỉ dựa trên revision change

#### Scenario: Không silent refresh

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và relevant divergence được phát hiện khi REOPEN
- **THEN** hệ thống SHALL giữ stored draft/snapshot cho tới khi OWNER thực hiện reconciliation hợp lệ

### Requirement: Reconciliation là explicit và per divergent fact

Khi approved source facts diverge, hệ thống SHALL hiển thị stored draft/snapshot
value và current Personnel value cho từng fact được hỗ trợ. OWNER SHALL có thể
chọn riêng `KEEP DRAFT VALUE` hoặc `REFRESH FROM PERSONNEL` cho mỗi divergent
fact. REFRESH SHALL dùng current trusted server-side Personnel value tại lúc
reconciliation được chấp nhận; browser replacement MUST NOT trở thành Personnel
source. Các lựa chọn chỉ thay đổi Formalités-owned draft state.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Hiển thị hai phía của divergence

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và một approved source fact có relevant divergence
- **THEN** hệ thống SHALL hiển thị stored draft/snapshot value và current Personnel value cho fact đó

#### Scenario: Mixed KEEP và REFRESH

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và nhiều facts diverge và OWNER chọn KEEP cho một fact, REFRESH cho fact khác
- **THEN** hệ thống SHALL áp dụng từng lựa chọn rõ ràng trong một reconciliation thành công

#### Scenario: REFRESH dùng trusted current value

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER chọn REFRESH FROM PERSONNEL
- **THEN** hệ thống SHALL lấy giá trị từ current trusted server-side Personnel source
- **AND** SHALL NOT dùng browser-provided replacement như authoritative Personnel value

### Requirement: Reconciliation thành công giải quyết đúng source state đã đối chiếu

Một reconciliation thành công SHALL giải quyết reconciliation episode được trình
bày đối với đúng trusted Personnel source state thực tế đã được đối chiếu. Với
`KEEP DRAFT VALUE`, hệ thống SHALL giữ Formalités draft value và SHALL thể hiện
rằng OWNER đã acknowledge divergence đó đối với source state cụ thể đã đối
chiếu; hệ thống MUST NOT tuyên bố hoặc ngụ ý draft value được giữ lại bằng
current Personnel value. Nếu Personnel source không đổi so với source state đã
đối chiếu, cùng acknowledged divergence MUST NOT bị trình bày lặp lại như một
unresolved reconciliation mới mỗi lần REOPEN. Với `REFRESH FROM PERSONNEL`,
Formalités draft value SHALL trở thành trusted current Personnel value được chấp
nhận bởi reconciliation và divergence đó SHALL được xem là resolved cho source
state đã đối chiếu. Nếu bất kỳ approved source fact nào thay đổi sau đó, hệ thống
SHALL phát hiện relevant divergence mới; prior KEEP/REFRESH acknowledgement MUST
NOT bao phủ source state mới và reconciliation mới SHALL được yêu cầu khi áp dụng.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: KEEP không lặp lại prompt khi Personnel source không đổi

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER đã reconcile thành công một divergence bằng KEEP DRAFT VALUE và approved Personnel source facts vẫn bằng source state đã đối chiếu
- **THEN** lần REOPEN sau SHALL NOT trình bày lại cùng acknowledged divergence như một unresolved reconciliation mới

#### Scenario: KEEP không định nghĩa lại Personnel truth

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và reconciliation KEEP DRAFT VALUE thành công và retained draft value khác current Personnel value đã đối chiếu
- **THEN** hệ thống SHALL giữ Formalités draft value nhưng MUST NOT trình bày nó là current Personnel truth hoặc là giá trị bằng current Personnel

#### Scenario: REFRESH giải quyết divergence bằng trusted accepted value

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER reconcile thành công bằng REFRESH FROM PERSONNEL với trusted current Personnel value
- **THEN** Formalités draft value SHALL trở thành đúng trusted value được chấp nhận
- **AND** divergence SHALL được xem là resolved đối với source state đã đối chiếu

#### Scenario: Personnel đổi lại sau reconciliation thành công

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và một approved Personnel source fact thay đổi sau khi prior KEEP hoặc REFRESH reconciliation đã thành công
- **THEN** hệ thống SHALL phát hiện relevant divergence mới đối với source state mới
- **AND** prior acknowledgement MUST NOT làm divergence mới được coi là đã resolved

### Requirement: Reconciliation stale phải fail visibly

Nếu relevant Personnel facts thay đổi lần nữa trước khi reconciliation được
cam kết, hệ thống MUST NOT silent-apply lựa chọn dựa trên current values đã lỗi
thời. Reconciliation SHALL bị từ chối bằng outcome conflict/stale có thể nhận
biết và draft đã persist trước đó SHALL còn nguyên.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Personnel đổi trong lúc OWNER reconcile

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER chuẩn bị KEEP/REFRESH choices nhưng relevant Personnel source lại thay đổi trước khi reconciliation được cam kết
- **THEN** hệ thống SHALL từ chối stale reconciliation và SHALL yêu cầu đọc lại current source
- **AND** SHALL không partial-apply bất kỳ choice nào

### Requirement: Current Personnel eligibility độc lập với reconciliation choice

Current Personnel state SHALL luôn là eligibility authority. `KEEP DRAFT VALUE`
MUST NOT bảo lưu CDI eligibility. Khi hosted entry khả dụng và employee của existing retained draft trở
thành non-CDI, hệ thống SHALL cho phép READ, REOPEN trong bounded
ineligible/recovery state, xem stored snapshot, xem authorized current Personnel
values và ABANDON với required reason. Trong khi employee còn non-CDI, hệ thống
MUST từ chối normal EDIT, normal SAVE, REFRESH để tiếp tục eligible CDI workflow
và create active draft khác. Hệ thống MUST NOT auto-abandon, auto-delete hoặc tự
đổi formality type.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: CDI chuyển thành CDD sau create

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và active draft đã tồn tại nhưng current Personnel `employmentTermType` chuyển từ `indefinite` sang non-CDI
- **THEN** hệ thống SHALL mở draft trong ineligible/recovery state thay vì active editable state

#### Scenario: Recovery state cho phép đọc và abandon

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và authorized OWNER mở existing draft trong lúc employee hiện non-CDI
- **THEN** hệ thống SHALL cho phép xem stored snapshot và authorized current values
- **AND** SHALL cho phép ABANDON khi có reason hợp lệ

#### Scenario: Recovery state chặn normal continuation

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee hiện non-CDI và caller yêu cầu normal EDIT, SAVE hoặc REFRESH để tiếp tục CDI workflow
- **THEN** hệ thống SHALL từ chối mutation và SHALL giữ prior durable state

#### Scenario: KEEP không giữ eligibility

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và stored snapshot có CDI và OWNER từng chọn KEEP DRAFT VALUE nhưng current Personnel là non-CDI
- **THEN** hệ thống SHALL vẫn coi draft là ineligible theo current Personnel

#### Scenario: Không tự xử lý draft khi mất eligibility

- **WHEN** current Personnel chuyển sang non-CDI
- **THEN** hệ thống SHALL NOT tự abandon, delete hoặc chuyển draft sang formality type khác

#### Scenario: Eligibility đổi sang non-CDI trước khi mutation cam kết

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và OWNER đã mở editable draft lúc current Personnel là CDI nhưng authoritative Personnel trở thành non-CDI trước khi normal SAVE hoặc EDIT được cam kết
- **THEN** hệ thống SHALL từ chối mutation dựa trên stale eligibility và SHALL giữ nguyên prior successful persisted draft state
- **AND** current non-CDI eligibility SHALL kiểm soát outcome, đồng thời hệ thống SHALL expose hoặc reload bounded ineligible/recovery condition

### Requirement: CDI eligibility phục hồi không bỏ qua reconciliation

Nếu Personnel sau đó trở lại `employmentTermType = indefinite`, hệ thống SHALL
đánh giá lại eligibility từ current trusted Personnel source. Khi còn relevant
divergence, OWNER MUST hoàn tất required reconciliation với current source trước
khi normal EDIT hoặc SAVE được tiếp tục. Một `ABANDONED` record MUST NOT tự tái
kích hoạt khi eligibility trở lại.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: CDD trở lại CDI với relevant divergence

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee của retained active draft trở lại CDI và current approved source facts còn diverge với stored snapshot
- **THEN** hệ thống SHALL yêu cầu reconciliation với current source trước normal EDIT hoặc SAVE

#### Scenario: Eligibility được đánh giá lại

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee trở lại CDI
- **THEN** hệ thống SHALL đánh giá eligibility từ current trusted Personnel, không từ stored CDI snapshot

#### Scenario: Abandoned draft không tái kích hoạt

- **WHEN** employee trở lại CDI nhưng prior record đã là `ABANDONED`
- **THEN** hệ thống SHALL giữ prior record ở `ABANDONED`

### Requirement: Save failure giữ nguyên authoritative saved state

Một explicit SAVE chỉ được báo thành công khi toàn bộ approved Formalités-owned
draft state của mutation đã persist thành công. Nếu save thất bại, hệ thống MUST
giữ nguyên prior successful saved state và MUST NOT trình bày partial hoặc
unsaved local state như authoritative persisted state.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Save thành công rồi reload

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và explicit SAVE hoàn tất thành công và OWNER reload hoặc reopen draft
- **THEN** hệ thống SHALL trả lại đúng committed saved state

#### Scenario: Save thất bại

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và explicit SAVE không hoàn tất thành công
- **THEN** prior successful saved state SHALL còn nguyên
- **AND** hệ thống SHALL báo failure mà không tuyên bố partial authoritative state

### Requirement: Concurrent và stale mutations không dùng silent last-write-wins

Hệ thống MUST bảo vệ active draft trước save-vs-save, save-vs-abandon và stale
editor sau một mutation thành công khác. Một stale conflicting mutation SHALL bị
từ chối bằng outcome có thể nhận biết và MUST NOT silent-overwrite authoritative
draft. Replay của cùng logical mutation sau response loss SHALL không tạo duplicate
effect; caller SHALL có thể nhận lại authoritative committed outcome. Một request
khác nội dung MUST NOT được coi là replay tương đương.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Hai save xung đột

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và hai editors dựa trên cùng prior saved state gửi các save khác nhau và một save cam kết trước
- **THEN** save stale còn lại SHALL bị từ chối mà không ghi đè save đã cam kết

#### Scenario: Save cạnh tranh với abandon

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và SAVE và ABANDON dựa trên cùng prior state cạnh tranh và một mutation cam kết trước
- **THEN** mutation stale còn lại SHALL bị từ chối và SHALL không tạo partial lifecycle state

#### Scenario: Stale editor sau mutation khác

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và editor cũ gửi mutation sau khi authoritative draft đã được thay đổi thành công nơi khác
- **THEN** hệ thống SHALL trả outcome stale/conflict có thể nhận biết thay vì last-write-wins

#### Scenario: Replay sau response loss

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và caller replay cùng logical mutation vì không nhận được response của lần cam kết thành công
- **THEN** hệ thống SHALL không áp dụng effect lần thứ hai và SHALL trả authoritative committed outcome có thể nhận biết

#### Scenario: Mutation khác biệt đáng kể không phải equivalent replay

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và một request sau response loss khác biệt đáng kể về intended draft mutation so với logical mutation đã được cam kết
- **THEN** hệ thống MUST NOT coi request đó là equivalent replay hoặc trả prior outcome như thể hai mutation giống nhau
- **AND** SHALL đánh giá request đó như một mutation riêng theo current authorization, eligibility và stale-conflict rules

### Requirement: Employee-connected capability được mở rộng mà không phá prototype hiện tại

Capability này SHALL mở rộng employee-connected Formalités flow và SHALL giữ
Personnel source-read protections hiện có. Nó MUST NOT yêu cầu xóa hoặc thay thế
generic fictional prototype, current development gate hoặc navigation bằng hành
vi ngoài phạm vi; việc di chuyển UI seam cụ thể thuộc Technical Design.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

Việc giữ fictional prototype SHALL bảo toàn source và existing internal behavior dưới current guards, không phải một availability exception: cả prototype lẫn employee-connected hosted entry SHALL không khả dụng trong `release-a`. Đóng entry SHALL không yêu cầu xóa prototype, thay navigation/domain owner hoặc biến fictional state thành durable authority.

#### Scenario: Generic fictional prototype không bị xóa theo spec này

- **WHEN** persistent employee-connected capability được bổ sung
- **THEN** spec này SHALL NOT yêu cầu xóa hoặc biến fictional generic prototype thành durable authority

#### Scenario: Existing source-read protection được giữ

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và employee-connected flow đọc current Personnel source
- **THEN** existing independent Personnel authorization và trusted scope checks SHALL tiếp tục áp dụng

### Requirement: Workflow giữ draft mà không hứa retention vô hạn

Workflow SHALL giữ cả `DRAFT` và `ABANDONED` records trong bounded first slice
này. Capability MUST NOT cung cấp user hard delete và MUST NOT tự động expiry,
purge hoặc anonymize các records đó. Việc slice này không có automatic deletion
MUST NOT được hiểu là Product guarantee về infinite retention. Final retention/
deletion policy nằm ngoài slice và chỉ có thể thay đổi hành vi này bằng một
future privacy/production decision được duyệt riêng. Capability SHALL không tự
tái dùng Personnel retention và SHALL không tạo legal-hold/mandatory-retention
override.

Đối với entry do Backoffice host, các thao tác hiển thị, read/load/REOPEN, create, EDIT, SAVE, reconciliation, ABANDON hoặc replay/recovery trong requirement này SHALL chỉ được thực hiện khi Formalités entry khả dụng trong profile do server chọn. Khi entry khả dụng, mọi Formalités authorization, independent Personnel source-read authorization, trusted scope, current eligibility và development/runtime guard hiện hành SHALL vẫn bắt buộc. Các invariant domain/persistence, source truth và retained record protections của requirement SHALL giữ nguyên cả khi entry không khả dụng.

#### Scenario: Active draft được giữ mà không có automatic expiry

- **WHEN** một `DRAFT` đã được persist thành công và không có lifecycle mutation được duyệt
- **THEN** workflow SHALL giữ record để authorized OWNER có thể REOPEN khi hosted entry khả dụng và existing prerequisites thỏa
- **AND** slice này SHALL NOT tự expiry, purge hoặc anonymize record

#### Scenario: Abandoned record vẫn được giữ và đọc theo quyền

- **WHEN** Formalités entry do Backoffice host khả dụng trong profile do server chọn và authorized caller đọc một retained `ABANDONED` record trong đúng trusted scope
- **THEN** hệ thống SHALL trả record đó mà không tự expiry, purge hoặc anonymize trong slice này
- **AND** SHALL không tuyên bố record được Product bảo đảm giữ vĩnh viễn

#### Scenario: Workflow không cung cấp user hard delete

- **WHEN** caller cố hard-delete draft thông qua capability này
- **THEN** hệ thống SHALL từ chối vì user hard delete nằm ngoài workflow được duyệt

#### Scenario: Final retention policy cần quyết định riêng

- **WHEN** một future change muốn thêm retention timer, deletion, purge, anonymization hoặc mandatory-retention override
- **THEN** change đó SHALL cần một privacy/production decision được duyệt riêng
- **AND** MUST NOT coi bounded first slice này là authority cho behavior mới
