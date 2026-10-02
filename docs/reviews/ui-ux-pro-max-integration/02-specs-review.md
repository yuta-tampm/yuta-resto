Change: ui-ux-pro-max-integration
Gate: 2
Review status: APPROVED
Created: 2026-09-08T14:31:13.492Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — Gate 2b REQUIRED

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T14:55:46Z

Current decision: Gate 2 approved cho exact 18 requirements / 42 scenarios;
chỉ Design được phép. Các đoạn awaiting review bên dưới giữ làm lịch sử.
Không có license acceptance, Tasks, Apply, download/install hoặc production.

# Gate 2 — Specs Review

## Scope and current authorization

Control Tower đã explicitly approve Gate 1 với exact Proposal/Analysis hashes,
Strategy A và mandatory Sensitive Design Gate. Lần này chỉ được phép Specs cho
`tooling/external-design-intelligence`, không Design/Tasks/Apply.

`UI_UX_PRO_MAX_USAGE=NOT_APPLICABLE` cho integration này: skill không tự
validate integration của chính nó. Installation smoke vẫn bắt buộc ở giai
đoạn được phép sau này. Không download/install/execute UI/UX Pro Max.

License state: `LICENSE_PROVENANCE_UNCERTAIN`.
`2.15.0` chỉ là investigated candidate, không được acceptance bằng Specs.
Không có license/provenance acceptance hoặc production authorization.

## Gate 1 approval and integrity

[Gate 1 packet](01-analysis-review.md) chỉ thay approval/status metadata để
ghi current explicit decision; giữ nội dung review lịch sử và artifact bytes.

| Path                                                           | SHA-256                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/ui-ux-pro-max-integration/01-analysis-review.md` | `0b70e41d2201f3375ff567b927f9f17b2b6b4a66f5918e92fafb397994d03a8a` |
| `openspec/changes/ui-ux-pro-max-integration/.openspec.yaml`    | `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820` |
| `openspec/changes/ui-ux-pro-max-integration/analysis.md`       | `88198e944804810a145e463513127e498a9e7dfccb19ef0656dcea019bb235d7` |
| `openspec/changes/ui-ux-pro-max-integration/proposal.md`       | `04454de85462b9f571b18022f250a9fdb996b43636eb22a3a7710897b2ba5d45` |

Gate 1 packet trước metadata:
`7c8040a41cc1a528ad6f5a1483727b2847f0c7ca1b13a13d5f971f71d76d0d3e`.
Hash inventory trước ghi Specs: 29/29 table entries khớp, gồm 26 protected
source-context files và 3 artifact/metadata files. Không silently rebaseline.

Hash method: Node built-in
`createHash("sha256").update(fs.readFileSync(path)).digest("hex")` trên exact
bytes, không normalize. Packet hash này trả riêng sau khi hoàn tất để tránh
self-hash cycle.

## Exact delta spec and hash

Path:
`openspec/changes/ui-ux-pro-max-integration/specs/tooling/external-design-intelligence/spec.md`

SHA-256:
`568d37a253878fee2a9f853b027a21f95f708af77c8df496ae99fa67f38b2646`

Đúng một delta capability, chỉ `ADDED Requirements`; không tạo hoặc sửa
normative main spec. Exact file content:

```markdown
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
```

## Requirement and scenario mapping

18/18 requirements; 42/42 scenarios. Đây là documentary coverage của Specs,
không phải test execution hoặc Technical Implementation Compliance PASS.

| Requirement                                                       | Scenarios          |
| ----------------------------------------------------------------- | ------------------ |
| R01 Advisory authority and external conflict handling             | S01, S02, S03      |
| R02 Internal authority conflicts stop the affected work           | S04                |
| R03 Closed usage classification with explicit rationale           | S05, S06, S07      |
| R04 Required review fails closed without a valid tool             | S08, S09, S10      |
| R05 Integration cannot validate itself through advisory use       | S11, S12           |
| R06 Existing phases and separate Gate 3 assessments               | S13, S14           |
| R07 Browser QA remains mandatory for UI affecting work            | S15, S16, S17      |
| R08 External suggestions cannot authorize stack changes           | S18                |
| R09 No persistent parallel design system by default               | S19, S20           |
| R10 Project local pinned installation and controlled updates      | S21, S22           |
| R11 Explicit license and provenance acceptance precedes Apply     | S23, S24, S25, S26 |
| R12 Core only payload without incidental sibling skills           | S27, S28           |
| R13 Existing paths are preserved with controlled evidence         | S29, S30, S31      |
| R14 Installation success requires content and smoke evidence      | S32, S33, S34      |
| R15 Distinct provenance fields and bounded reproducibility claims | S35, S36           |
| R16 App preset inheritance does not create numeric authority      | S37, S38           |
| R17 Tooling boundary cannot enable product or runtime changes     | S39, S40           |
| R18 Review gates remain explicit and scope bound                  | S41, S42           |

## Control Tower required behavior mapping

Mỗi số dưới đây tương ứng đúng mục 1–24 trong current Gate 1 approval.

| Approval item | Requirement | Scenarios          |
| ------------- | ----------- | ------------------ |
| 1             | R01         | S01, S02, S03      |
| 2             | R01         | S01, S02, S03      |
| 3             | R02         | S04                |
| 4             | R03         | S05, S06, S07      |
| 5             | R04         | S08, S09, S10      |
| 6             | R05         | S11, S12           |
| 7             | R01         | S01, S02, S03      |
| 8             | R06         | S13, S14           |
| 9             | R06         | S13, S14           |
| 10            | R07         | S15, S16, S17      |
| 11            | R07         | S15, S16, S17      |
| 12            | R06         | S13, S14           |
| 13            | R08         | S18                |
| 14            | R09         | S19, S20           |
| 15            | R10         | S21, S22           |
| 16            | R11         | S23, S24, S25, S26 |
| 17            | R12         | S27, S28           |
| 18            | R13         | S29, S30, S31      |
| 19            | R14         | S32, S33, S34      |
| 20            | R15         | S35, S36           |
| 21            | R15         | S35, S36           |
| 22            | R11         | S23, S24, S25, S26 |
| 23            | R16         | S37, S38           |
| 24            | R17         | S39, S40           |

R18/S41–S42 bổ sung traceability trực tiếp cho NEXT ACTION và mandatory
Sensitive Design/STOP boundaries trong cùng approval, không thêm scope mới.

## Changes in assumptions and unresolved choices

So với Analysis giữ nguyên bytes, current approval đã làm rõ:

- field `UI_UX_PRO_MAX_USAGE` và ba giá trị đóng;
- integration tự thân là NOT_APPLICABLE, không được tự validate;
- heuristic chủ yếu ở VERIFY, không thay QA hoặc ba Gate 3 assessments;
- yêu cầu explicit Control Tower license/provenance acceptance trước Apply/install;
- provenance fields riêng, không gọi top-level pin là full reproducibility.

Các làm rõ được đưa vào Specs theo explicit current-user decision, không
rewrite Proposal/Analysis hoặc giải quyết upstream license contradiction.

U1 license/provenance acceptance còn mở, chặn Apply/install. U2 core-only
safe mechanism, U3 dependency reproducibility/pin proof và U4 activation/exact
placement thuộc Design, không chọn giải pháp trong Specs. Nếu không có safe
core-only mechanism: STOP tại Sensitive Design, NEEDS_REVIEW. U5 numeric
presets vẫn advisory/out of scope. Không có Product/runtime authority mới,
không thêm mandatory phase, không cấp quyền stack/framework/font/token mới.

Existing YUTA authorities, shared/app/page ownership, Browser QA, production
và lifecycle boundaries giữ nguyên. Không tạo source authority song song.

## Repository baseline and concurrent attribution

HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Fresh baseline: `2026-09-08T14:31:13.492Z`, 2570 tracked/untracked
non-ignored file paths. `git status --short` được đọc trước ghi file.
Inventory bằng `git ls-files --cached --others --exclude-standard -z`,
deduplicate, kiểm tra existence và SHA-256 từng file; ignored secrets không
nằm trong inventory.

Concurrent Pointage context trước lần chạy này:

- `packages/db-cloud/test/pointage-raw-clocking.integration.test.ts`
- Last observed Gate 1 hash:
  `684a259db7affbc00556669e8ba0652882bdd6987f131947be1bf35a5a4ac79c`
- Current observed hash:
  `cf3b34ddf6009a0884b51123a21de39bb771a70f7fea9c9a1ae3d388edd6a367`

Path đã drift giữa hai lần chạy, không thuộc 26 protected authority files.
Không sửa/revert/merge, không phê duyệt semantics Pointage và không rebaseline
protected authority. Các Formalités/Pointage/async-interaction dirty paths khác
được giữ ngoài delivery. Fresh baseline chỉ phục vụ attribution của lần chạy.

Authorized delivery path-set:

1. `openspec/changes/ui-ux-pro-max-integration/specs/tooling/external-design-intelligence/spec.md` — mới.
2. `docs/reviews/ui-ux-pro-max-integration/02-specs-review.md` — mới.
3. `docs/reviews/ui-ux-pro-max-integration/01-analysis-review.md` — approval metadata only.

## Checks and truthful results

| Check                                                                   | Result                                                                                                                                    |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec validate ui-ux-pro-max-integration --strict --no-interactive` | exit 0, valid                                                                                                                             |
| `openspec status --change ui-ux-pro-max-integration --json`             | exit 0; schema yuta-spec-driven; Specs done, Design ready theo graph, Tasks blocked; không cấp quyền đi Design                            |
| `pnpm docs:check`                                                       | exit 0; 36 current documents passed                                                                                                       |
| `pnpm architecture:check`                                               | exit 0                                                                                                                                    |
| `pnpm -r --if-present typecheck`                                        | exit 0; scope 15/16 projects; compatibility only                                                                                          |
| `pnpm format:check`                                                     | exit 1; 67 inherited warning files, tất cả có trong pre-run baseline và giữ nguyên bytes; không relabel PASS                              |
| Scoped formatting, exact embedding and integrity                        | exit 0; ba delivery files format PASS; 29/29 Gate 1 hash entries khớp; exact Specs embedding, 18 requirements và 42 unique scenarios PASS |

Formatting write chỉ trên new Specs và workflow review packet đang được phép;
không format approved Proposal/Analysis hoặc canonical files. Không
repository-wide formatter-write.

Không chạy `pnpm test:cloud`, `pnpm test:local`, `pnpm build:cloud`,
Browser QA, bootstrap hoặc smoke: lần này chỉ Specs, không executable delivery
và explicit user cấm execute/download/install UI/UX Pro Max. Không claim các
check này PASS. Smoke/installation checks vẫn là yêu cầu cho authorized Apply.

### Scoped evidence method

`pnpm exec prettier --check openspec/changes/ui-ux-pro-max-integration/specs/tooling/external-design-intelligence/spec.md docs/reviews/ui-ux-pro-max-integration/01-analysis-review.md docs/reviews/ui-ux-pro-max-integration/02-specs-review.md`
đã chạy exit 0. `git diff --check -- openspec/changes/ui-ux-pro-max-integration docs/reviews/ui-ux-pro-max-integration`
exit 0, bổ sung Node exact-byte checks vì delivery chứa untracked files.

Node read-only kiểm tra 29 hash entries Gate 1; bỏ đúng approval/status metadata
vừa thêm tái lập exact pre-edit Gate 1 hash; exact embedded Specs bằng file gốc;
18 requirement blocks đều có SHALL/MUST và scenario; S01–S42 không trùng/thiếu.
Expected Design/Tasks và core/six sibling directories đều absent. Full
tracked/untracked non-ignored inventory xác nhận main specs và protected
authority/source bytes không thay đổi. Không có install/download/execute tool.

### Concurrent changes observed during checks

Đối chiếu `2026-09-08T14:35:40.688Z` ghi nhận thêm ba Pointage paths ngoài
delivery thay đổi trong lúc task chạy:

| Path                                                                         | Pre-run SHA-256                                                    | Observed SHA-256                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                     | `790a464e6021226d9e80724bad90841192ebfca6eb043eacecbde13cd4ff02fc` | `53d0ff7f82e4bad36dc2185ae6c5feb14b0512fa3c41e8dd7424612aa02393c5` |
| `packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts`      | `ff46783b29e37ee4c609b7bc521476198135d10b23c0f5bed42c22b7fe9cafe2` | `7589f19f838cec21d85708c662fd509c5517495784c42f26b80a7677b6ee62b7` |
| `packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts` | `47e684d9e997599fbbf1dbfe05619c83ae48aa8774325169da92b4bb4d0d52b7` | `eb5693a3ba0f907e74862fa2e26c5d39e916c38ec54d219ed652a09af0aff2cc` |

Không có lệnh ghi vào các paths này từ task UI/UX. Chỉ ghi attribution theo
path/context; không xác nhận semantic cause, approval hoặc readiness Pointage,
không revert/edit/silently rebaseline. Ngoài ba delivery paths và ba observed
concurrent paths, toàn bộ inventory giữ nguyên tại snapshot đó. Typecheck
exit 0 là actual command result trong checkout có concurrent work, không phải
chứng nhận final Pointage snapshot sau drift. Gate 2 vẫn chỉ review Specs
UI/UX; protected Gate 1 sources và approved Proposal/Analysis không drift.

## Remaining review and stop

Recommendation: review exact 18 requirements / 42 scenarios và phê duyệt
Gate 2 nếu phù hợp. Cần explicit Control Tower Gate 2 approval trước Design;
Sensitive Design Gate tiếp tục REQUIRED trước Tasks/Apply.

Status: AWAITING_HUMAN_REVIEW.
Design/Tasks: ABSENT.
Core và sáu sibling skill directories: ABSENT.
Apply/install/license acceptance: NOT AUTHORIZED.
Sync/Archive/Knowledge Consolidation: không thực hiện.
Production: NOT AUTHORIZED.
