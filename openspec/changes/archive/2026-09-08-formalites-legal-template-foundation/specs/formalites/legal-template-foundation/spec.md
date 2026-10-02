## Purpose

Định nghĩa durable GLOBAL YUTA Formalités template identity, mutable working draft và immutable canonical version với exact content/applicability binding. Foundation chuẩn bị dữ liệu cho future legal review mà không triển khai review, evidence, publication, qualification, retirement hoặc generation.

## ADDED Requirements

### Requirement: Global template foundation giữ dedicated ownership boundary

Template Identity, Working Draft và Template Version SHALL thuộc `GLOBAL_YUTA_FORMALITES_TEMPLATES`, với Formalités là semantic owner và `@yuta/db-cloud` là persistence family qua dedicated global boundary. Resources SHALL NOT thuộc organization hoặc establishment, yêu cầu `TenantContext`, dùng system organization giả hoặc reuse tenant repository bằng cách bỏ scope. Platform Admin SHALL chỉ là future administration runtime boundary; Personnel và Documents SHALL giữ nguyên ownership hiện có.

#### Scenario: Global identity không cần restaurant owner

- **WHEN** authorized internal actor tạo template identity trong global boundary mà không có restaurant membership
- **THEN** capability SHALL không yêu cầu organization, establishment hoặc `TenantContext` làm owner/context
- **AND** identity SHALL không trở thành tenant-owned hoặc restaurant-customizable resource

#### Scenario: Tenant fallback không tạo global access

- **WHEN** caller cung cấp tenant scope, thiếu tenant scope hoặc fabricated system organization để yêu cầu global template access
- **THEN** các giá trị đó SHALL NOT cung cấp global authority hoặc chuyển tenant repository thành global repository
- **AND** capability SHALL chỉ cho access khi independent trusted system authorization hợp lệ

### Requirement: Foundation sử dụng exact existing system operations và fail closed

Capability SHALL giữ nguyên đúng năm independent operations `formalites.template.read`, `formalites.template.draft.manage`, `formalites.template.review.submit`, `formalites.template.publish`, `formalites.template.retire`. `YUTA_ADMIN` SHALL giữ explicit per-operation grants; `YUTA_SUPPORT` SHALL nhận none. Authority SHALL dựa trên trusted authenticated active internal YUTA user và exact operation grant, không browser/caller role assertion hoặc restaurant membership. Không wildcard, prefix matching, implication, role hierarchy, caller policy, new role/principal hoặc sixth operation.

Trong slice này, `read` SHALL kiểm soát identity/draft/retained-version-history read; `draft.manage` SHALL kiểm soát create identity/create working draft/edit mutable draft; `review.submit` SHALL kiểm soát freeze. `publish` và `retire` SHALL giữ existing authorization nhưng SHALL NOT có domain execution trong foundation.

#### Scenario: Exact read và draft operations của trusted admin

- **WHEN** trusted active `YUTA_ADMIN` yêu cầu read hoặc create/edit thuộc bounded foundation
- **THEN** capability SHALL kiểm tra đúng `formalites.template.read` hoặc `formalites.template.draft.manage` cho requested action
- **AND** grant của operation khác SHALL NOT thay thế exact required grant

#### Scenario: Freeze cần exact submission operation

- **WHEN** caller yêu cầu freeze chỉ dựa trên read hoặc draft-management authorization result
- **THEN** capability SHALL không freeze bằng result đó
- **AND** freeze SHALL yêu cầu trusted authorization cho `formalites.template.review.submit`

#### Scenario: Support và restaurant-only actors bị denied

- **WHEN** actor là `YUTA_SUPPORT` hoặc chỉ có OWNER/MANAGER/STAFF membership mà không có required system grant
- **THEN** capability SHALL từ chối global identity/draft/version read và mutation
- **AND** membership hoặc tenant permission SHALL NOT cung cấp fallback

#### Scenario: Untrusted hoặc unsupported authority fail closed

- **WHEN** identity không authenticated, internal user không tồn tại/không active, hoặc caller dùng unknown operation, wildcard, prefix hay caller-defined policy
- **THEN** capability SHALL từ chối requested access/mutation
- **AND** caller-provided role hoặc operation similarity SHALL NOT tạo allow

#### Scenario: System allow không cấp tenant resource access

- **WHEN** actor có valid global template authorization yêu cầu employee dossier, tenant preparation draft hoặc tenant resource khác
- **THEN** global grant SHALL NOT authorize tenant access
- **AND** independent tenant authorization và resource scope SHALL tiếp tục áp dụng, không merge/fallback

### Requirement: Stable Template Identity không bị repurpose qua version

Template Identity SHALL đại diện một stable legal purpose/type qua các versions. Fundamental legal purpose/type khác SHALL yêu cầu identity khác, không overwrite purpose/type của existing identity để tái sử dụng lịch sử. Content/applicability revisions giữ cùng fundamental purpose SHALL có thể thuộc các versions của cùng identity.

Metadata ảnh hưởng legal meaning, rendered content, applicability, selection, generation hoặc legal-review scope SHALL là version-significant. Chỉ explicitly approved internal presentation-only metadata SHALL được thay ngoài version; capability SHALL NOT tự coi một field là presentation-only để tránh version boundary.

#### Scenario: Nhiều revisions cùng legal purpose

- **WHEN** canonical content hoặc applicability được thay đổi nhưng fundamental legal purpose/type giữ nguyên
- **THEN** changed revision SHALL có thể giữ cùng Template Identity và SHALL có immutable Version khác sau freeze

#### Scenario: Fundamental legal purpose thay đổi

- **WHEN** requested purpose/type không còn là fundamental purpose/type của existing Template Identity
- **THEN** capability SHALL yêu cầu Template Identity khác cho purpose/type đó
- **AND** SHALL không repurpose existing identity hoặc historical versions

#### Scenario: Metadata không được dùng làm version bypass

- **WHEN** một metadata change ảnh hưởng rendered/legal content, applicability, selection, generation hoặc review scope của frozen version
- **THEN** change SHALL tuân new-version rule
- **AND** nhãn display/presentation-only do caller tự đặt SHALL NOT cho phép sửa frozen binding

### Requirement: Một active mutable Working Draft không phải canonical version

Mỗi Template Identity SHALL có tối đa một active mutable Working Draft và SHALL cho phép `0..N` immutable Template Versions. Working Draft SHALL NOT được coi là canonical Template Version hoặc mang qualification. Authorized draft management SHALL cho phép sửa mutable content/applicability trước freeze mà không giả tạo immutable version cho mỗi edit.

Sau successful freeze, working draft đã freeze SHALL không tiếp tục được sửa như active mutable draft; continuation SHALL dùng Working Draft khác. Multiple frozen historical/review candidates SHALL không vi phạm one-active-working-draft rule.

#### Scenario: Identity chưa có immutable version

- **WHEN** identity tồn tại nhưng chưa có successful freeze
- **THEN** authorized read SHALL có thể phản ánh zero immutable versions
- **AND** active working draft nếu có SHALL không được trình bày như canonical version

#### Scenario: Active draft thứ hai bị ngăn

- **WHEN** một identity đã có active mutable working draft và có yêu cầu tạo active draft khác, kể cả competing requests
- **THEN** kết quả durable SHALL có tối đa một active mutable draft cho identity đó
- **AND** capability SHALL không báo thành công tạo thêm một independently active draft trái rule

#### Scenario: Edit mutable working draft

- **WHEN** authorized actor sửa content/applicability của active mutable draft trước freeze
- **THEN** successful mutation SHALL thay working draft state và có thể được đọc lại
- **AND** edit đó SHALL không tự tạo canonical version, legal review hoặc qualification

#### Scenario: Continuation sau freeze giữ historical candidates

- **WHEN** actor muốn tiếp tục thay đổi sau khi một working draft đã freeze thành Version
- **THEN** continuation SHALL dùng working draft khác theo one-active rule
- **AND** các immutable versions đã tồn tại SHALL không bị biến thành editable drafts hoặc bị thay bởi draft mới

### Requirement: Freeze tạo exact durable immutable version binding

Successful freeze SHALL tạo một stable Template Version identity bound với exact Template Identity, content profile, canonical content bytes, identified checksum algorithm/checksum và immutable applicability declaration của exact working-draft revision được freeze. Capability SHALL không báo freeze thành công khi binding thiếu hoặc không nhất quán; partial/mixed snapshot SHALL không được coi là successful immutable Version.

Successful identity/draft/version persistence SHALL có thể được đọc lại qua authorized read độc lập với transient caller state. Stable version identity SHALL không thay đổi giữa các lần đọc.

#### Scenario: Freeze exact candidate

- **WHEN** authorized freeze của một exact working-draft revision thành công
- **THEN** authorized read SHALL trả một immutable Version với toàn bộ binding của đúng revision đó
- **AND** canonical bytes/applicability SHALL không được thay bằng dữ liệu từ revision khác

#### Scenario: Competing edit không tạo mixed snapshot

- **WHEN** working content/applicability thay đổi cạnh tranh với freeze của một exact revision
- **THEN** capability SHALL không báo successful freeze cho một snapshot trộn nhiều revisions hoặc khác exact revision được freeze
- **AND** chỉ complete consistent binding SHALL được coi là successful Version

#### Scenario: Reopen durable foundation state

- **WHEN** authorized actor đọc lại identity, saved working draft hoặc successfully frozen version sau khi transient caller state không còn
- **THEN** capability SHALL trả corresponding durable state
- **AND** một frozen version SHALL giữ original stable identity và exact binding, không tái tạo từ current working draft

### Requirement: Frozen content profile và applicability không thể sửa tại chỗ

Sau freeze, template/version identity binding, content profile, canonical bytes, checksum algorithm/checksum và applicability declaration SHALL bất biến. Content/applicability changes SHALL yêu cầu Working Draft khác và Template Version khác; edit permission SHALL NOT cho phép sửa một frozen Version. Later profile/format rules SHALL NOT recanonicalize, normalize, formatter-rewrite hoặc reinterpret original byte identity của historical versions.

#### Scenario: Frozen content hoặc applicability bị edit

- **WHEN** caller yêu cầu sửa content/applicability tại existing frozen Version, kể cả bằng draft-management authority
- **THEN** capability SHALL không thay frozen Version
- **AND** requested revision SHALL cần working draft khác và new Version

#### Scenario: Formatting được coi là minor change

- **WHEN** caller muốn trim whitespace, normalize Unicode hoặc formatter-rewrite canonical content sau freeze vì coi đó là non-semantic cleanup
- **THEN** original frozen bytes và checksum SHALL giữ nguyên
- **AND** changed canonical content SHALL không được lưu dưới existing Version identity

#### Scenario: Content profile tiến hóa

- **WHEN** một future profile/format rule khác được sử dụng cho later work
- **THEN** historical Version SHALL giữ original profile identity, bytes, algorithm/checksum và applicability binding
- **AND** foundation SHALL không tự recanonicalize hoặc overwrite historical content

### Requirement: Canonical Legal Source Profile V1 giữ exact textual byte rules

Canonical Legal Source Profile V1 SHALL là textual source artifact có explicit content-profile identity. Canonical source bytes SHALL là valid UTF-8 không BOM và dùng LF line endings. Canonicalization SHALL xảy ra trước freeze; SHALL NOT Unicode-normalize hoặc silently trim whitespace. Frozen profile/bytes SHALL không chịu formatter rewrite. AST, DOCX, PDF và rendered output SHALL NOT thay canonical textual source identity trong foundation này.

#### Scenario: Canonical source không BOM và dùng LF

- **WHEN** freeze thành công theo Canonical Legal Source Profile V1
- **THEN** persisted canonical bytes SHALL decode thành valid UTF-8, không bắt đầu bằng UTF-8 BOM và không dùng CR/CRLF làm line endings
- **AND** LF canonicalization SHALL hoàn tất trước khi immutable checksum/binding được thiết lập

#### Scenario: Invalid UTF-8 không được âm thầm sửa thành reviewed content

- **WHEN** source input không biểu diễn valid UTF-8 cho canonical profile
- **THEN** capability SHALL không báo successful freeze của input đó như valid canonical source
- **AND** SHALL không silently replace invalid encoding để claim exact content identity

#### Scenario: Unicode sequence không bị normalize

- **WHEN** hai valid UTF-8 sources dùng different Unicode sequences dù hiển thị tương tự
- **THEN** canonicalization SHALL giữ từng Unicode sequence mà không normalize chúng thành một source
- **AND** exact byte identity SHALL không được thay bằng visual equivalence

#### Scenario: Meaningful whitespace được giữ

- **WHEN** source chứa leading/trailing spaces hoặc blank lines hợp lệ trước freeze
- **THEN** canonicalization SHALL không silently trim chúng
- **AND** frozen bytes SHALL giữ whitespace ngoài approved line-ending canonicalization

### Requirement: SHA-256 được tính trên exact canonical bytes

Mỗi immutable Version SHALL bind identified SHA-256 content checksum tính trên exact canonical source bytes của version đó. Checksum SHALL không lấy từ mutable draft khác, rendered content hoặc một normalized/truncated substitute. Caller-supplied checksum alone SHALL NOT chứng minh matching content; successful binding SHALL nhất quán với exact persisted bytes. Checksum SHALL chỉ biểu thị content identity, không reviewer authority, opinion authenticity hoặc qualification.

#### Scenario: Independent checksum recomputation

- **WHEN** authorized read cung cấp exact canonical source bytes của frozen Version để kiểm chứng
- **THEN** SHA-256 recomputation trên những bytes đó SHALL bằng checksum bound với Version
- **AND** identified algorithm và profile SHALL có thể được đối chiếu với version binding

#### Scenario: Checksum không khớp bytes

- **WHEN** claimed checksum không bằng SHA-256 của exact canonical bytes được bind
- **THEN** capability SHALL không chấp nhận binding đó như successful consistent freeze
- **AND** valid actor authority SHALL không thay thế content-integrity check

#### Scenario: Checksum không phải legal evidence

- **WHEN** canonical bytes và SHA-256 khớp
- **THEN** kết quả SHALL chỉ xác lập bounded content identity
- **AND** SHALL không xác lập external review, legal opinion authenticity, publication hoặc qualification

### Requirement: Applicability change tạo Version khác dù content checksum giống nhau

Immutable applicability declaration SHALL bound với exact Version độc lập với content checksum. Applicability change sau freeze SHALL yêu cầu Working Draft khác và Version khác dù canonical content bytes/checksum không đổi. Capability SHALL NOT deduplicate hai applicability revisions thành cùng Version chỉ vì content checksum giống nhau hoặc kế thừa review/qualification từ checksum.

#### Scenario: Envelope đổi nhưng content giữ nguyên

- **WHEN** actor thay applicability của frozen content qua another working draft, giữ canonical content bytes không đổi và freeze thành công
- **THEN** resulting Version SHALL khác prior Version, có new immutable applicability binding
- **AND** same content checksum SHALL không merge hai Version identities

#### Scenario: Same checksum không cho qualification inheritance

- **WHEN** two Versions có cùng canonical content checksum nhưng applicability declarations khác nhau
- **THEN** foundation SHALL không dùng checksum equality làm qualification, review hoặc applicability equivalence

### Requirement: Applicability assertions không tạo canonical truth hoặc automatic matching

Applicability declaration SHALL bảo toàn jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, effective-date constraints, exclusions và binding conditions. Canonical references SHALL chỉ sử dụng khi approved authoritative owner đã tồn tại; otherwise declaration SHALL giữ explicit assertions/assumptions, không duplicate owning capability truth hoặc invent Product enums/reference-data authority.

Unsupported, unmapped, missing hoặc unknown declarations SHALL NOT thành executable applicability facts. Foundation SHALL không automatic-match declared use, select applicable/current template hoặc claim assertions đã được external review. Missing/unknown SHALL không được diễn giải thành unrestricted applicability hoặc không có conditions.

#### Scenario: Approved owner reference và assertion được phân biệt

- **WHEN** một dimension có approved owning canonical reference còn dimension khác chưa có authoritative owner
- **THEN** declaration SHALL giữ boundary giữa reference hợp lệ và explicit assertion/assumption
- **AND** SHALL không tạo substitute canonical employer/collective configuration trong Formalités

#### Scenario: Unsupported hoặc unknown applicability

- **WHEN** declaration chứa unsupported/unmapped/unknown value hoặc thiếu thông tin cần để xác định applicability
- **THEN** foundation SHALL không coi value đó là executable match, unrestricted applicability hoặc qualified use
- **AND** SHALL không tự map sang invented enum/default để cho phép use

#### Scenario: Asserted conditions không được thực thi như engine

- **WHEN** declaration có exclusions, effective-date assumptions hoặc binding conditions
- **THEN** foundation SHALL preserve declaration trong exact version binding
- **AND** SHALL không tự thực thi applicability matching hoặc tuyên bố điều kiện đã đạt/legal review đã xảy ra

### Requirement: Repeated freeze cùng draft revision không tạo duplicate Versions

Repeated hoặc concurrent freeze của cùng working-draft revision SHALL không tạo nhiều immutable Versions cho revision đó. Successful Version đã tạo SHALL giữ stable identity và exact binding. Rule này SHALL không cho coi different draft revisions hoặc changed applicability là cùng candidate chỉ vì cùng content checksum; exact concurrency/idempotency mechanism không được quy định bởi requirement này.

#### Scenario: Retry freeze sau response loss

- **WHEN** freeze đã tạo Version thành công nhưng caller không nhận response và gửi lại freeze cùng draft revision
- **THEN** capability SHALL không tạo second immutable Version cho revision đó
- **AND** SHALL không báo một newly created Version khác như effect của repeated freeze

#### Scenario: Concurrent freeze của cùng revision

- **WHEN** nhiều authorized requests freeze cùng working-draft revision cạnh tranh
- **THEN** durable result SHALL chứa tối đa một resulting Version cho revision đó
- **AND** resulting stable binding SHALL không bị overwrite bởi competing request

### Requirement: Version ordinal không phải applicability selector

Template Version SHALL có stable identity, không phụ thuộc vào việc có ordinal hay không. Nếu capability cung cấp ordinal/version number, giá trị đó SHALL unique trong cùng Template Identity nhưng SHALL NOT biểu thị applicability, publication hoặc qualification. Highest/latest Version SHALL NOT được tự chọn cho declared use.

#### Scenario: Optional ordinal unique trong template

- **WHEN** capability cung cấp ordinal cho nhiều Versions của cùng Template Identity
- **THEN** distinct Versions SHALL không dùng cùng ordinal trong identity đó
- **AND** ordinal SHALL không thay stable Version identity

#### Scenario: Highest Version chưa phải applicable Version

- **WHEN** authorized caller đọc history có latest/highest ordinal hoặc nhiều frozen candidates
- **THEN** foundation SHALL không suy ra Version đó applicable, reviewed, published hoặc qualified
- **AND** thứ tự history SHALL không tạo automatic selection behavior

### Requirement: Bounded internal traceability không lưu private legal evidence

Foundation SHALL NOT persist external reviewer identity/professional data, legal opinion/correspondence, private evidence URL/path, evidence attachment/record hoặc publication evidence. Nó SHALL không cung cấp standalone legal-evidence CRUD/storage/upload hoặc reviewer YUTA account.

Nếu internal mutation traceability được cung cấp, nó SHALL chỉ phục vụ bounded identity creation, working-draft mutation và version freeze; internal actor attribution SHALL dùng minimal YUTA actor identifier, không duplicate email/name/contact. Traceability SHALL phân biệt actual mutation outcome với authorization/security decision và SHALL NOT là legal-review evidence, publication audit hoặc qualification evidence. Privacy/retention production prerequisites SHALL còn nguyên; không invent duration hoặc indefinite-retention guarantee.

#### Scenario: Minimal internal mutation attribution

- **WHEN** foundation ghi traceability cho create/edit/freeze đã thực hiện
- **THEN** actor attribution SHALL giới hạn ở minimal internal actor identifier cho bounded action
- **AND** SHALL không copy user email/name/contact hoặc gọi record đó là legal-review/publication evidence

#### Scenario: Private evidence không được nhét vào foundation

- **WHEN** yêu cầu persistence bao gồm reviewer personal/professional data, opinion, correspondence, private evidence locator, attachment hoặc legal-review/publication evidence record
- **THEN** foundation SHALL không persist dữ liệu đó như capability của slice này
- **AND** existing draft/submit/publish authority SHALL không được suy diễn thành evidence CRUD

#### Scenario: Security allow không là completed mutation hoặc retention approval

- **WHEN** chỉ có authorization allow hoặc bounded mutation traceability
- **THEN** capability SHALL không coi security allow là completed freeze và không coi traceability là legal review/publication/qualification
- **AND** các records SHALL không tạo production privacy approval hoặc indefinite-retention obligation

### Requirement: Freeze và foundation completion không triển khai excluded capabilities

Freeze SHALL chỉ tạo immutable review candidate/version; SHALL NOT chứng minh external reviewer received it, review occurred, evidence exists, publication completed hoặc qualification. Existing governance ba outcomes và qualification prerequisites SHALL không bị thay đổi hoặc triển khai qua frozen-state labels. Existing publish/retire grants SHALL không tạo domain publication, qualification hoặc retirement execution trong foundation.

Change SHALL NOT cung cấp actual CDI/CDD content, legal engagement/review, Platform Admin runtime/UI, Backoffice UI/session change, employer/employee collection, collective-agreement canonical configuration, placeholder/conditional execution, generated contract, preview/PDF/DOCX rendering, signature, Documents handoff, provider hoặc production enablement. Personnel facts, tenant draft behavior, signed Documents và POS/Display boundaries SHALL giữ nguyên. Workflow/spec completion SHALL không tự promote canonical Knowledge hoặc lifecycle/readiness.

#### Scenario: Freeze không gửi review và không qualify

- **WHEN** exact candidate freeze thành công
- **THEN** outcome SHALL chỉ là immutable Version creation
- **AND** SHALL không ghi hoặc claim external receipt, legal review, evidence, publication hoặc qualification

#### Scenario: Publish hoặc retire authority không tạo domain execution

- **WHEN** actor có existing `formalites.template.publish` hoặc `formalites.template.retire` grant yêu cầu thực hiện lifecycle action qua foundation này
- **THEN** foundation SHALL không thực hiện publication, qualification hoặc retirement
- **AND** SHALL không làm action đó thông qua freeze/draft-management fallback

#### Scenario: Specs hoặc foundation được hoàn tất

- **WHEN** artifacts được approved/validated hoặc bounded foundation được implement trong future authorized Apply
- **THEN** kết quả SHALL không tạo actual template content, evidence store, application/UI, generation/provider hoặc production capability
- **AND** SHALL không tự thay canonical Knowledge/lifecycle/readiness hoặc existing tenant/Personnel/Documents behavior
