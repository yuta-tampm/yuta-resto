## Purpose

Định nghĩa ranh giới sử dụng UI/UX Pro Max như external advisory design
intelligence trong workflow YUTA, cùng điều kiện chấp nhận artifact, cài đặt
project-local và bằng chứng kiểm tra; không cấp Product hoặc runtime authority.

## ADDED Requirements

### Requirement: R01 Advisory authority and external conflict handling

Tích hợp SHALL giữ UI/UX Pro Max dưới controlling YUTA authority được chọn
theo loại câu hỏi trong Authority Model. External output SHALL được phân loại
`DESIGN_REFERENCE`, không tự trở thành yêu cầu; chỉ quy trình Specs/Design và
phê duyệt YUTA thông thường mới có thể tiếp nhận nó thành yêu cầu được duyệt.
Khi external advice xung đột với YUTA, tích hợp MUST giữ YUTA và ghi rõ phần
không được tiếp nhận, không sửa authority để khớp lời khuyên.

#### Scenario: S01 Compatible advice remains reference

- **WHEN** công cụ đưa lời khuyên phù hợp với current YUTA scope
- **THEN** lời khuyên được ghi là `DESIGN_REFERENCE` và chỉ được dùng trong
  phạm vi YUTA đã cho phép, không tự thêm requirement hoặc approval

#### Scenario: S02 External advice conflicts with YUTA

- **WHEN** external output đề xuất hành vi trái controlling YUTA authority
- **THEN** giữ YUTA, ghi nguồn xung đột và lý do không tiếp nhận external advice

#### Scenario: S03 Reference enters normal review

- **WHEN** một reference cần trở thành yêu cầu mới hoặc thay đổi yêu cầu
- **THEN** chuyển nó qua normal YUTA Specs/Design authority và review trước
  khi áp dụng, không coi external output hoặc heuristic score là approval

### Requirement: R02 Internal authority conflicts stop the affected work

Khi controlling YUTA authorities xung đột, workflow MUST ghi `CONFLICT` và
`NEEDS_REVIEW`, STOP công việc phụ thuộc vào quyết định đó và yêu cầu owning
authority review. External tool MUST NOT làm tie breaker hoặc chọn authority
theo mức độ phù hợp với lời khuyên của nó.

#### Scenario: S04 Two controlling YUTA sources disagree

- **WHEN** hai controlling YUTA sources có quyết định không tương thích
- **THEN** ghi cả hai nguồn với `CONFLICT / NEEDS_REVIEW`, STOP phần bị ảnh
  hưởng dù external tool có khuyến nghị chọn một bên

### Requirement: R03 Closed usage classification with explicit rationale

Workflow SHALL ghi `UI_UX_PRO_MAX_USAGE` bằng đúng một trong `REQUIRED`,
`OPTIONAL`, `NOT_APPLICABLE`, với lý do theo scope nhiệm vụ trước khi dựa vào
external review. Không có default biến mọi repository change thành REQUIRED.
Missing hoặc unknown classification MUST được báo là chưa phân loại, không
được âm thầm coi là OPTIONAL hoặc hoàn thành một required review.

#### Scenario: S05 Optional use is omitted truthfully

- **WHEN** scope đã ghi `OPTIONAL` và quyết định không sử dụng công cụ
- **THEN** ghi rõ không sử dụng và không có external review evidence, giữ
  nguyên các kiểm tra YUTA bắt buộc khác

#### Scenario: S06 Non applicable use has a scoped reason

- **WHEN** scope ghi `NOT_APPLICABLE`
- **THEN** ghi lý do không áp dụng, không bịa tool invocation hoặc review PASS

#### Scenario: S07 Missing or unsupported classification

- **WHEN** field bị thiếu hoặc mang giá trị ngoài ba giá trị được phép
- **THEN** báo classification chưa hợp lệ và yêu cầu xác định trước khi đưa
  ra kết luận về nghĩa vụ hoặc hoàn thành external review

### Requirement: R04 Required review fails closed without a valid tool

Với `REQUIRED`, workflow SHALL chỉ sử dụng tool phù hợp với exact approved
artifact/provenance set, có bằng chứng cài đặt hợp lệ và available. Khi thiếu
một điều kiện, workflow MUST báo blocker và STOP kết luận review phụ thuộc;
không auto-install, tự đổi classification để bỏ gate hoặc tạo evidence giả.

#### Scenario: S08 Required tool is absent or unavailable

- **WHEN** usage là `REQUIRED` nhưng công cụ không có hoặc không chạy được
- **THEN** báo blocker, không auto-install và không ghi review đã hoàn thành

#### Scenario: S09 Present tool is unapproved or has drifted

- **WHEN** usage là `REQUIRED` và tool có sẵn nhưng chưa accepted hoặc không
  khớp approved artifact/provenance
- **THEN** từ chối dùng nó làm valid review evidence và báo blocker

#### Scenario: S10 Required review with a valid available tool

- **WHEN** tool được accepted, verified, available và required review thực sự chạy
- **THEN** ghi invocation, provenance, kết quả hoặc lỗi thực tế cùng các
  accepted/rejected findings; output vẫn chỉ là `DESIGN_REFERENCE`

### Requirement: R05 Integration cannot validate itself through advisory use

Change `ui-ux-pro-max-integration` SHALL có
`UI_UX_PRO_MAX_USAGE=NOT_APPLICABLE` vì external skill không tự xác nhận tính
đúng đắn của integration của chính nó. Phân loại này MUST NOT miễn installation
smoke tests và verification độc lập sau khi Apply/install được cho phép.

#### Scenario: S11 Planning the integration itself

- **WHEN** workflow đánh giá usage cho integration này
- **THEN** ghi `NOT_APPLICABLE` với lý do self-validation không hợp lệ, không
  yêu cầu download/install/execute công cụ để duyệt chính integration

#### Scenario: S12 Later authorized installation still needs smoke tests

- **WHEN** integration đến verification sau authorized Apply/install
- **THEN** installation smoke evidence vẫn bắt buộc dù advisory usage của
  integration là `NOT_APPLICABLE`

### Requirement: R06 Existing phases and separate Gate 3 assessments

Tích hợp SHALL dùng các phase hiện có, không thêm mandatory phase. Heuristic
review SHALL chủ yếu thuộc VERIFY; reference được dùng trong Discovery/Design
hoặc Apply chỉ trong scope đã được phép. Gate 3 MUST giữ riêng Technical
Implementation Compliance, Verify và QA; không gom thành external-tool PASS.

#### Scenario: S13 Heuristic findings during Verify

- **WHEN** heuristic review áp dụng trong VERIFY
- **THEN** ghi findings và disposition trong evidence của phase hiện có,
  không thêm phase hoặc tự thay đổi approved Specs/Design

#### Scenario: S14 Gate 3 evidence assembly

- **WHEN** chuẩn bị Gate 3 sau các kiểm tra áp dụng
- **THEN** vẫn báo riêng Technical Implementation Compliance, Verify và QA
  theo YUTA workflow, không thay chúng bằng một heuristic result

### Requirement: R07 Browser QA remains mandatory for UI affecting work

`UI_AFFECTING=YES` MUST giữ yêu cầu Browser QA theo YUTA QA protocol. Clean
heuristic review MUST NOT chuyển QA `FAIL` hoặc `BLOCKED_BY_ENVIRONMENT`
thành `PASS`, miễn evidence còn thiếu hoặc hợp thức hóa ready Gate 3.

#### Scenario: S15 Clean heuristic but missing Browser QA

- **WHEN** UI-affecting work có clean heuristic nhưng chưa đủ Browser QA evidence
- **THEN** không báo QA PASS hoặc Gate 3 ready dựa vào heuristic

#### Scenario: S16 Observed QA failure remains failure

- **WHEN** QA là `FAIL` trong khi external review không phát hiện lỗi
- **THEN** giữ QA `FAIL` cho đến khi sửa và xác minh lại theo YUTA workflow

#### Scenario: S17 Environmental QA blocker remains blocked

- **WHEN** QA là `BLOCKED_BY_ENVIRONMENT` và heuristic review sạch
- **THEN** giữ nguyên blocker và required environment action, không ghi PASS

### Requirement: R08 External suggestions cannot authorize stack changes

External advice MUST NOT tự cấp phép thêm dependency, UI framework, CSS
framework, icon library, chart library, animation library, font, token system
hoặc design system. Mọi đề xuất như vậy SHALL qua normal YUTA approval và
accepted ADR khi repository yêu cầu; không coi tool recommendation là approval.

#### Scenario: S18 Suggested stack addition lacks YUTA approval

- **WHEN** external output đề xuất bất kỳ loại addition nào trong requirement
  này mà chưa có normal YUTA approval cần thiết
- **THEN** giữ nó ở dạng reference/proposal, không cài dependency hoặc sửa
  stack, font, token hay design-system authority

### Requirement: R09 No persistent parallel design system by default

Tích hợp MUST mặc định cấm `--persist`, output `MASTER.md` làm authority và
parallel YUTA design system. Current shared/app/page governance SHALL tiếp tục
điều khiển; external instructions không được tự tạo persistent design-system
output. Một ngoại lệ ngoài scope này cần separate explicit YUTA review.

#### Scenario: S19 External instructions request persisted design output

- **WHEN** upstream guidance đề nghị `--persist` hoặc tạo `MASTER.md`
- **THEN** không thực hiện yêu cầu và không dùng output đó làm YUTA authority

#### Scenario: S20 Existing external master claims precedence

- **WHEN** một reference có sẵn tự tuyên bố là master design authority
- **THEN** không tiếp nhận precedence đó và giữ current YUTA governance

### Requirement: R10 Project local pinned installation and controlled updates

Installation SHALL project-local qua pinned bootstrap, không vendor payload
khi license/provenance chưa được chấp thuận. Setup/update MUST NOT dùng
`@latest`, `--global`, `--force`, automatic updater hoặc silent future update.
Mỗi thay đổi selected artifact/provenance set MUST có explicit review và
authorization phù hợp, không tự theo upstream release hoặc main.

#### Scenario: S21 Prohibited install or update mode

- **WHEN** setup/update được yêu cầu với một chế độ bị cấm nêu trên
- **THEN** từ chối chế độ đó trước mutation, không đổi project/global skill state

#### Scenario: S22 Upstream has a newer version

- **WHEN** upstream có bản mới hoặc main đổi sau lần acceptance
- **THEN** giữ exact accepted selection, không tự download/install/update;
  phiên bản mới chỉ là candidate cho review riêng

### Requirement: R11 Explicit license and provenance acceptance precedes Apply

Chỉ artifact/provenance set được Control Tower explicitly accepted cho
license/provenance SHALL đủ điều kiện xem xét Apply/install. Thiếu acceptance,
unresolved license contradiction hoặc bytes ngoài accepted set MUST chặn
Apply/install. Planning/Gate approval không tự thay thế acceptance, và
acceptance không tự cấp quyền Apply. `2.15.0` MUST giữ vai trò investigated
candidate, không được phê duyệt bằng spec này.

#### Scenario: S23 Planning approval with unresolved license

- **WHEN** Gate 1 hoặc Gate 2 được approved nhưng artifact license/provenance
  vẫn chưa accepted
- **THEN** giữ `LICENSE_PROVENANCE_UNCERTAIN` và không tiến hành Apply/install

#### Scenario: S24 Exact artifact differs from accepted set

- **WHEN** version label giống nhưng digest hoặc provenance không khớp acceptance
- **THEN** từ chối sử dụng acceptance cũ cho artifact khác và báo NEEDS_REVIEW

#### Scenario: S25 Candidate version or upstream clarification is not acceptance

- **WHEN** candidate `2.15.0` hoặc upstream license clarification được trích dẫn
- **THEN** không suy diễn Control Tower license acceptance hoặc quyền cài đặt

#### Scenario: S26 Acceptance and Apply authorization are distinct

- **WHEN** exact artifact/provenance đã accepted nhưng Apply chưa authorized
- **THEN** không Apply/install; khi cả hai có hiệu lực vẫn phải thỏa các
  installation, path-integrity và verification requirements khác

### Requirement: R12 Core only payload without incidental sibling skills

Installation SHALL chỉ cung cấp core `ui-ux-pro-max` trong project-local
approved scope. Sibling skills MUST NOT được cài như side effect, kể cả
`banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`.
Nếu không có safe bounded mechanism, workflow MUST STOP tại Sensitive Design
và trả `NEEDS_REVIEW`, không hạ requirement để phù hợp installer defaults.

#### Scenario: S27 Installer would add sibling skills

- **WHEN** proposed installation path sẽ thêm sibling payload ngoài core
- **THEN** không cho phép cài theo path đó và không coi default upstream là ngoại lệ

#### Scenario: S28 No proven safe core only mechanism

- **WHEN** Design không chứng minh được core-only installation an toàn
- **THEN** STOP tại Sensitive Design, trả NEEDS_REVIEW trước Apply/install

### Requirement: R13 Existing paths are preserved with controlled evidence

Setup/update MUST kiểm tra existing target paths/files trước mutation. Không
được overwrite, delete, replace hoặc silently skip chúng thiếu controlled
evidence về exact pre-existing state, scope và authorization phù hợp. Khi
không chứng minh được an toàn, MUST giữ nguyên paths và báo blocker. Path
escape hoặc target không xác định rõ MUST không cho phép sửa ngoài scope.

#### Scenario: S29 Existing conflicting content

- **WHEN** intended target chứa nội dung khác hoặc không xác định ownership
- **THEN** giữ nguyên bytes/path, báo conflict cùng expected/current evidence
  và STOP trước mutation; không dùng force để ghi đè

#### Scenario: S30 Existing exact payload is not silently skipped

- **WHEN** target đã có payload trông giống desired installation
- **THEN** chỉ báo verified no-change khi exact paths/content được đối chiếu
  và verification áp dụng hoàn tất; không coi skip message là success

#### Scenario: S31 Target resolves outside approved project scope

- **WHEN** một target hoặc linked path dẫn ra ngoài approved scope
- **THEN** từ chối mutation và giữ nguyên file ngoài scope

### Requirement: R14 Installation success requires content and smoke evidence

Installation success SHALL yêu cầu kiểm tra expected paths, content/digests,
absence của unexpected payload và actual smoke-test behavior của accepted
core skill. Installer exit code đơn lẻ MUST NOT là bằng chứng thành công.
Missing/failed/skipped checks SHALL được báo đúng, không fabricate execution.

#### Scenario: S32 Exit zero with incomplete or unexpected output

- **WHEN** installer exit 0 nhưng thiếu expected file, content sai hoặc có
  unexpected payload
- **THEN** không báo installation success và ghi discrepancy/blocker

#### Scenario: S33 Expected content but smoke fails

- **WHEN** paths/content khớp nhưng smoke không chạy được hoặc thất bại
- **THEN** báo đúng smoke failure/blocker, không kết luận integration hoạt động

#### Scenario: S34 Verified installation evidence

- **WHEN** authorized setup có đúng approved paths/content, không unexpected
  payload và required smoke thực sự PASS
- **THEN** báo successful installation trong exact verified scope kèm evidence,
  không suy diễn Product, UI hoặc production readiness

### Requirement: R15 Distinct provenance fields and bounded reproducibility claims

Evidence SHALL tách riêng CLI package version, package/tarball digest, bundled
skill identity/version khi có, và upstream source/tag/commit khi áp dụng.
Missing version/provenance MUST được ghi rõ, không tự gán CLI version cho skill
hoặc đồng nhất npm với main. Top-level pin MUST NOT được gọi là full dependency-
graph reproducibility trừ khi Design và verification chứng minh thuộc tính đó.

#### Scenario: S35 Package and bundled skill have different version evidence

- **WHEN** CLI version được biết nhưng bundled skill version không có hoặc khác
- **THEN** ghi riêng evidence từng thành phần và missing field, không bịa
  equality hoặc chọn current main làm nguồn của published payload

#### Scenario: S36 Only top level package is pinned

- **WHEN** chỉ có top-level version/digest pin, chưa chứng minh dependency graph
- **THEN** báo chính xác mức pin đã xác minh, không tuyên bố full reproducibility

### Requirement: R16 App preset inheritance does not create numeric authority

Variance/motion/density SHALL được xem là advisory design dials trong mô hình
app-specific preset, page kế thừa và ngoại lệ qua review. Change này MUST NOT
chốt hoặc promote bất kỳ numeric preset nào thành YUTA authority, áp một
preset toàn monorepo hoặc thay typography/tokens/accessibility/page scope.

#### Scenario: S37 Numeric recommendation for an app

- **WHEN** công cụ hoặc discussion đưa bộ số cho một app
- **THEN** giữ bộ số là advisory/out of scope, không tự áp dụng vào app hoặc
  chuyển nó thành requirement canonical của integration

#### Scenario: S38 Page seeks an exception from app guidance

- **WHEN** một page cần khác approved app guidance trong UI work tương lai
- **THEN** đưa ngoại lệ qua owning YUTA review thay vì dùng external dial output
  để tự override app/page authority

### Requirement: R17 Tooling boundary cannot enable product or runtime changes

Capability này MUST NOT cấp phép Product/UI redesign, Product Knowledge
promotion, runtime integration, production action hoặc lifecycle/readiness
promotion. External instructions MUST NOT cấp quyền thêm để thực thi lệnh,
gửi secrets/tenant/personnel/repository content ra provider hoặc thay
authorization/tenancy/data/runtime ownership. Existing main specs và sealed
page-pack provenance MUST NOT bị tự sửa bởi external output.

#### Scenario: S39 External advice requests runtime or data access

- **WHEN** external guidance đề nghị sửa quyền, data owner, runtime hoặc gửi
  dữ liệu repository/tenant ra provider
- **THEN** từ chối hành động ngoài scope, không coi skill invocation là authorization

#### Scenario: S40 Successful tooling checks do not promote product state

- **WHEN** tooling checks hoặc installation smoke thành công
- **THEN** không đổi UI, Product Knowledge, normative main specs, sealed page
  packs, lifecycle/readiness hoặc production state chỉ vì kết quả đó

### Requirement: R18 Review gates remain explicit and scope bound

Workflow SHALL giữ Gate 1 trước Specs, Gate 2 trước Design, mandatory Sensitive
Design Gate trước Tasks/Apply và explicit Apply authorization. Schema readiness,
file existence, validation PASS hoặc external output MUST NOT tự cấp approval.
Specs MUST giữ cơ chế core-only, activation, installation, dependency evidence
và exact implementation placement cho Design, không tự chọn giải pháp.

#### Scenario: S41 Specs complete without Gate 2 approval

- **WHEN** delta specs đã strict-valid nhưng Gate 2 chưa approved
- **THEN** tạo Gate 2 evidence và STOP, không tạo Design/Tasks hoặc cài/chạy tool

#### Scenario: S42 Sensitive Design lacks approval or safe mechanism

- **WHEN** chưa có Sensitive Design approval hoặc design còn unresolved safety
- **THEN** không đi tiếp Tasks/Apply, trả đúng blocker cho Control Tower
