Change: restaurant-knowledge-team-culture
Gate: 2 — Requirements Review
Review status: APPROVED
Created: 2026-09-01T23:34:28.0562924+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, canonical ownership, authorization consumption, and tenant isolation
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-01T23:42:51.6143670+02:00

# Gate 2 — Requirements Review

## Approved Gate 1 reference

Gate 1 được phê duyệt bằng explicit current-user instruction
`APPROVE Gate 1` cho change `restaurant-knowledge-team-culture`, với decision
`APPROVED_FOR_SPECS` và scope `Proceed with Specs only`.

Trước khi tạo Specs, Proposal và Analysis hashes được recompute và match Gate 1
packet. Gate 1 packet đã được cập nhật thành `APPROVED` với approval source,
recorded-by và timestamp theo integrity protocol.

| Repository-relative path                                               | SHA-256                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-team-culture/01-analysis-review.md` | `9bbe1d2fd1bfb4dbb12fce77d2fec893e70a4831898b95bb6a535f3ec8869994` |
| `openspec/changes/restaurant-knowledge-team-culture/analysis.md`       | `7c0372d810a33b6828ad1014976d0685b35e112de6af8fedd7fdf016cf92ec95` |
| `openspec/changes/restaurant-knowledge-team-culture/proposal.md`       | `1538e96384b77c3cbc37a119dff4251b797744ab338175bb4d5e1c8cc8dc83d0` |

Gate 1 packet status: `APPROVED`.

## Change-scoped attribution

Shared worktree vẫn chứa pre-existing implementation, documentation, normative
specs, archives và review evidence của các Restaurant Knowledge slices trước.
State 2 không attribute hoặc sửa các path đó.

Các State 2 changes duy nhất là:

- approval record trong Gate 1 packet;
- delta Spec dưới change hiện tại;
- Gate 2 packet này.

Không có Design, Tasks, implementation, Product Knowledge, main normative spec,
schema, migration, API, shared contract, permission hoặc runtime file nào được
tạo hoặc sửa cho change này.

## Delta Spec inventory and hash

Hash command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/restaurant-knowledge-team-culture/specs/restaurant-knowledge/team-culture/spec.md'
```

| Repository-relative path                                                                             | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-team-culture/specs/restaurant-knowledge/team-culture/spec.md` | `0e7aa521a264b03cde23eefab5034d2b69019537809dd5a34f9b2b584d5b4d44` |

## Requirements and scenarios summary

Delta chứa **14 ADDED requirements** và **38 scenarios**:

1. Restaurant Knowledge canonical ownership, establishment semantic scope và
   Organization-only tenancy/access envelope.
2. Đúng ba descriptive values và approved meanings, không employee-specific,
   HR hoặc operational semantics.
3. View được bảo vệ bởi Restaurant Knowledge READ; OWNER và MANAGER có READ,
   STAFF không có access mặc định; Profile permissions không thay thế READ.
4. Edit/save được bảo vệ bởi Restaurant Knowledge MANAGE; OWNER và MANAGER có
   MANAGE, STAFF không có access mặc định; READ hoặc Profile MANAGE không thay
   thế MANAGE.
5. Ba values independently optional, valid all-empty state và từng
   single-populated-value state.
6. Manual input/edit độc lập.
7. Một explicit save duy nhất cho toàn bộ slice.
8. Không persistence trước explicit save; no autosave.
9. Không employee-specific state hoặc Personnel/Salariés source, consumer hay
   synchronization relationship.
10. `Transmission & intégration` không tạo Formalités,
    onboarding/training workflow, status, progress, history, acknowledgement,
    signature hoặc HR document.
11. Không Planning, Pointage, Today hoặc Tâches du jour source, consumer, task,
    checklist, anomaly, shift hoặc operational workflow.
12. Không POS, Site Agent hoặc Display cross-runtime relationship.
13. Không Marketing/social hoặc external-provider relationship.
14. Không AI/inference/automatic enrichment và không required content, length,
    formatting, enum, taxonomy, checklist/task/SOP, scoring, analytics hoặc
    competency classification.

Spec không chọn database schema, table/repository representation, migration
mechanics, API, shared contract hoặc component architecture. Technical
representation vẫn là Design decision.

## Exact delta Spec content

```markdown
## Purpose

Capability này cho phép người dùng được ủy quyền mô tả thủ công văn hóa, tinh
thần và cách làm việc chung của establishment như một slice Restaurant
Knowledge, không biến nội dung đó thành dữ liệu Personnel, HR workflow hoặc dữ
liệu vận hành nhân viên.

## ADDED Requirements

### Requirement: Équipe & culture thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Valeurs & état
d’esprit`, `Façon de travailler ensemble` và `Transmission & intégration`.
Các value SHALL có semantic scope theo establishment trong trusted tenant
context hiện tại; Organization SHALL chỉ là tenancy/access envelope.
Establishment Profile SHALL NOT trở thành canonical owner hoặc source của các
value này.

#### Scenario: Xem Équipe & culture của establishment hiện tại

- **WHEN** người dùng được phép xem slice `Équipe & culture` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Équipe & culture cho establishment hiện tại

- **WHEN** người dùng được phép lưu slice `Équipe & culture` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của ba value dưới ownership
  của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành
  semantic owner

### Requirement: Slice chứa đúng ba descriptive knowledge values

Initial slice SHALL chỉ chứa `Valeurs & état d’esprit`, `Façon de travailler
ensemble` và `Transmission & intégration`. `Valeurs & état d’esprit` SHALL mô
tả các giá trị và tinh thần chung establishment muốn đội ngũ thể hiện. `Façon
de travailler ensemble` SHALL mô tả cách establishment muốn đội ngũ hợp tác ở
mức văn hóa Restaurant Knowledge. `Transmission & intégration` SHALL mô tả
cách establishment muốn truyền đạt văn hóa và cách làm việc chung cho thành
viên mới. Ba value SHALL remain descriptive establishment knowledge, không
phải employee-specific state, HR workflow hoặc operational staff-management
data.

#### Scenario: Hiển thị đúng ba value

- **WHEN** người dùng mở slice `Équipe & culture`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm value, employee attribute hoặc structured HR category
  khác vào initial slice

#### Scenario: Valeurs & état d’esprit vẫn là mô tả chung

- **WHEN** người dùng nhập nội dung về giá trị hoặc tinh thần đội ngũ
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge của
  establishment
- **AND** SHALL NOT biến nội dung thành employee rating, performance indicator,
  disciplinary criterion hoặc employee-specific attribute

#### Scenario: Façon de travailler ensemble không trở thành quy trình vận hành

- **WHEN** người dùng nhập nội dung mô tả cách đội ngũ nên hợp tác
- **THEN** hệ thống SHALL giữ nội dung ở mức văn hóa và cách làm việc chung
- **AND** SHALL NOT biến nội dung thành checklist, task, SOP, procedure, shift
  workflow, handover workflow hoặc staff assignment

#### Scenario: Transmission & intégration không trở thành training state

- **WHEN** người dùng nhập nội dung mô tả cách truyền đạt văn hóa cho thành
  viên mới
- **THEN** hệ thống SHALL giữ nội dung như descriptive Restaurant Knowledge
- **AND** SHALL NOT biến nội dung thành onboarding/training workflow,
  completion status, employee progress, acknowledgement, signature, training
  history hoặc certification

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem ba value của `Équipe &
culture`. OWNER và MANAGER SHALL có Restaurant Knowledge READ. STAFF SHALL
không có Restaurant Knowledge READ theo default policy. Hệ thống SHALL NOT
reuse hoặc inherit `establishment.profile.read` hay
`establishment.profile.manage` để cấp quyền xem slice này.

#### Scenario: OWNER có READ xem được Équipe & culture

- **WHEN** OWNER trong valid trusted tenant context mở slice `Équipe & culture`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: MANAGER có READ xem được Équipe & culture

- **WHEN** MANAGER trong valid trusted tenant context mở slice `Équipe &
culture`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: STAFF bị từ chối xem theo default policy

- **WHEN** STAFF cố xem slice `Équipe & culture` theo default Restaurant
  Knowledge policy
- **THEN** hệ thống SHALL từ chối quyền xem

#### Scenario: Profile permission không thay thế READ

- **WHEN** principal có Establishment Profile permission nhưng không có
  Restaurant Knowledge READ cố xem slice
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ value nào
trong slice `Équipe & culture` và để thực hiện explicit save. OWNER và MANAGER
SHALL có Restaurant Knowledge MANAGE. STAFF SHALL không có Restaurant Knowledge
MANAGE theo default policy. Restaurant Knowledge READ và MANAGE SHALL remain
separate logical operations; READ riêng SHALL NOT cấp quyền edit hoặc save.

#### Scenario: OWNER có MANAGE sửa và lưu được

- **WHEN** OWNER trong valid trusted tenant context sửa một hoặc nhiều value và
  kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: MANAGER có MANAGE sửa và lưu được

- **WHEN** MANAGER trong valid trusted tenant context sửa một hoặc nhiều value
  và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: STAFF bị từ chối edit và save theo default policy

- **WHEN** STAFF cố sửa hoặc lưu slice `Équipe & culture` theo default
  Restaurant Knowledge policy
- **THEN** hệ thống SHALL từ chối edit và save

#### Scenario: READ không thay thế MANAGE

- **WHEN** principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Équipe & culture là optional và độc lập

Hệ thống SHALL cho phép `Valeurs & état d’esprit`, `Façon de travailler
ensemble` và `Transmission & intégration` tồn tại độc lập. Mỗi value SHALL là
optional và trạng thái cả ba cùng empty SHALL hợp lệ.

#### Scenario: All-empty state hợp lệ

- **WHEN** establishment chưa có value nào trong slice `Équipe & culture`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Valeurs & état d’esprit có giá trị

- **WHEN** `Valeurs & état d’esprit` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Façon de travailler ensemble có giá trị

- **WHEN** `Façon de travailler ensemble` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Transmission & intégration có giá trị

- **WHEN** `Transmission & intégration` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

### Requirement: Người dùng nhập và sửa ba value thủ công

Hệ thống SHALL cho phép người dùng có Restaurant Knowledge MANAGE nhập và sửa
thủ công từng value trong slice mà không bắt buộc hai value còn lại phải được
nhập hoặc thay đổi.

#### Scenario: Sửa một value độc lập

- **WHEN** người dùng sửa thủ công một value mà không thay đổi hai value còn lại
- **THEN** hệ thống SHALL giữ nguyên hai value còn lại trong trạng thái slice
  chờ lưu

#### Scenario: Để trống một hoặc nhiều value

- **WHEN** người dùng để một hoặc nhiều value empty trong trạng thái slice chờ
  lưu
- **THEN** hệ thống SHALL coi các value đó là optional
- **AND** SHALL NOT bắt buộc value khác phải empty hoặc có nội dung

### Requirement: Một explicit save lưu toàn bộ slice Équipe & culture

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Équipe &
culture`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của cả ba
value cho establishment hiện tại như một slice Restaurant Knowledge.

#### Scenario: Lưu cả ba value bằng một explicit save

- **WHEN** người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save sau
  khi chỉnh sửa một, hai hoặc cả ba value
- **THEN** hệ thống SHALL lưu trạng thái hiện tại của cả ba value cho
  establishment hiện tại

#### Scenario: Xem lại trạng thái đã lưu

- **WHEN** explicit save đã thành công và người dùng có Restaurant Knowledge
  READ xem lại slice của cùng establishment
- **THEN** hệ thống SHALL hiển thị ba value đã được lưu

### Requirement: Slice không autosave

Hệ thống SHALL NOT persist thay đổi trong bất kỳ value `Équipe & culture` nào
trước khi người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save của
slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa một hoặc nhiều value nhưng chưa kích hoạt explicit
  save
- **THEN** hệ thống SHALL NOT persist các thay đổi đó như trạng thái canonical
  của Restaurant Knowledge

### Requirement: Slice không tạo employee-specific state hoặc Personnel relationship

Initial slice SHALL hoạt động mà không đọc, ghi, link, copy, derive hoặc
synchronize dữ liệu Personnel/Salariés. Slice SHALL NOT tạo employee-specific
state, employee profile field, employee evaluation, competency record,
disciplinary record hoặc employee performance classification. Personnel SHALL
NOT là required source hoặc required consumer của ba value.

#### Scenario: Personnel không phải source hoặc consumer

- **WHEN** người dùng xem, sửa hoặc lưu slice `Équipe & culture`
- **THEN** hệ thống SHALL NOT đọc hoặc ghi employee dossier, role, position,
  qualification, contract, salary, acompte hoặc congé data
- **AND** SHALL NOT yêu cầu Personnel consume hoặc phản ứng với các value

#### Scenario: Nội dung không trở thành employee-specific state

- **WHEN** người dùng nhập descriptive content về văn hóa hoặc cách làm việc
  chung
- **THEN** hệ thống SHALL NOT link content đó với một employee
- **AND** SHALL NOT tạo employee evaluation, rating, disciplinary record,
  competency matrix hoặc performance indicator

### Requirement: Transmission & intégration không tạo Formalités hoặc onboarding/training workflow

`Transmission & intégration` SHALL remain descriptive Restaurant Knowledge.
Initial slice SHALL NOT create hoặc integrate Formalités, onboarding workflow,
training workflow, training step, completion/progress state, employee
acknowledgement, document acceptance, signature, training history,
certification hoặc HR document generation. Formalités và training/onboarding
capabilities SHALL NOT là required source hoặc required consumer của value này.

#### Scenario: Descriptive transmission không trở thành onboarding workflow

- **WHEN** người dùng mô tả cách establishment muốn truyền đạt văn hóa cho
  thành viên mới
- **THEN** hệ thống SHALL NOT tạo onboarding checklist, training step,
  completion state hoặc employee progress

#### Scenario: Formalités không được kích hoạt

- **WHEN** slice `Équipe & culture` được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT tạo Formalités record, HR document,
  acknowledgement hoặc signature flow
- **AND** SHALL NOT yêu cầu Formalités consume hoặc phản ứng với các value

### Requirement: Slice không tạo dependency với Planning, Pointage, Today hoặc Tâches du jour

Initial slice SHALL hoạt động mà không đọc, ghi, link, copy, derive hoặc
synchronize dữ liệu Planning, Pointage, Today hoặc Tâches du jour. Các module
này SHALL NOT là required source hoặc required consumer của ba value.

#### Scenario: Planning không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc tạo schedule, shift, assignment, staffing
  rule hoặc schedule template
- **AND** SHALL NOT yêu cầu Planning consume hoặc phản ứng với các value

#### Scenario: Pointage không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc clock-in/out record, derive culture từ
  attendance hoặc tạo attendance rule/anomaly
- **AND** SHALL NOT yêu cầu Pointage consume hoặc phản ứng với các value

#### Scenario: Today và Tâches du jour không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT tạo Today card, task, checklist, alert, anomaly,
  handover hoặc follow-up item
- **AND** SHALL NOT yêu cầu Today hoặc Tâches du jour consume hoặc phản ứng với
  các value

### Requirement: Slice không tạo cross-runtime relationship

Initial slice SHALL hoạt động trong cloud Restaurant Knowledge boundary mà
không đọc, ghi, synchronize hoặc tạo required consumer relationship với POS,
Site Agent hoặc Display.

#### Scenario: POS và Site Agent không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc ghi POS operational data
- **AND** SHALL NOT synchronize với POS/Site Agent hoặc yêu cầu chúng consume
  các value

#### Scenario: Display không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc hoặc ghi Display data
- **AND** SHALL NOT synchronize với Display hoặc yêu cầu Display consume các
  value

### Requirement: Slice không tạo Marketing, social hoặc external-provider relationship

Initial slice SHALL hoạt động mà không đọc, ghi, publish, import, synchronize
hoặc tạo required consumer relationship với Marketing, Facebook, Instagram,
social channel hoặc external provider.

#### Scenario: Marketing và social không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT publish hoặc synchronize các value với Marketing,
  Facebook, Instagram hoặc social channel
- **AND** SHALL NOT yêu cầu các capability đó consume hoặc phản ứng với các
  value

#### Scenario: External provider không tham gia initial slice

- **WHEN** external provider hoặc provider output tồn tại
- **THEN** hệ thống SHALL NOT yêu cầu provider đó để view, edit hoặc save slice
- **AND** SHALL NOT dùng provider output làm source cho ba canonical values

### Requirement: Slice không tự động enrich hoặc áp đặt Product classification

Initial slice SHALL giới hạn behavior ở manual input, view, edit và explicit
save. Hệ thống SHALL NOT tự động tạo hoặc thay đổi ba value từ AI, automatic
learning hoặc inferred content. Hệ thống SHALL NOT áp đặt required content,
length limit, formatting rule, enum, taxonomy, checklist, task, SOP, scoring,
analytics model hoặc competency classification cho các value trong change này.

#### Scenario: AI hoặc inferred content không tự thay đổi canonical values

- **WHEN** AI output, automatic-learning signal hoặc inferred content tồn tại
- **THEN** hệ thống SHALL NOT tự động dùng nguồn đó để tạo hoặc thay đổi
  canonical `Équipe & culture` values

#### Scenario: Empty content không bị chặn bởi requirement ngoài scope

- **WHEN** một hoặc nhiều descriptive value empty
- **THEN** hệ thống SHALL NOT yêu cầu content, minimum length hoặc formatting
  rule để slice là hợp lệ

#### Scenario: Manual descriptive content không bị phân loại ngoài scope

- **WHEN** người dùng nhập thủ công một hoặc nhiều descriptive value
- **THEN** hệ thống SHALL NOT yêu cầu enum, taxonomy, checklist, task, SOP,
  score, analytics category hoặc competency classification để cho phép slice
  tồn tại hoặc được lưu
```

## Strict validation

Repository-supported command:

```text
pnpm exec openspec validate restaurant-knowledge-team-culture --strict
```

Exact result:

```text
Change 'restaurant-knowledge-team-culture' is valid
```

Exit code: `0`.

## Changed assumptions since Analysis

Không có. Specs giữ approved three-value descriptive scope, Restaurant
Knowledge ownership, establishment semantic scope, Organization tenancy/access
envelope, READ/MANAGE behavior và grants, optional independent values, valid
all-empty state, manual input, one explicit whole-slice save, no autosave và
mọi explicit module/runtime/provider exclusion.

Specs không thêm permission, role, principal, shared contract, API, database
shape, migration, implementation architecture hoặc Product validation.

## Remaining CONFLICT

- Non-blocking documentation drift từ Gate 1 vẫn còn:
  `docs/PRODUCT_KNOWLEDGE.md` mô tả broad Restaurant Knowledge state cũ hơn
  Module Registry, page Product Knowledge, normative specs và current
  implementation. Conflict này không thay đổi requirement semantics của delta
  và không được sửa trong State 2.

Không có requirement-level `CONFLICT`.

## Remaining NEEDS REVIEW

- Exact persistence shape, table/repository representation, page-local
  component/server boundary và migration/rollback mechanics vẫn được defer sang
  Design.
- Nếu Design cần shared contract, permission mới, tenant/canonical ownership
  change, employee-specific data/state, prohibited module dependency,
  legal/privacy decision, external provider hoặc cross-runtime behavior, change
  phải dừng và quay lại Product/authority review.

Không có requirement-level `NEEDS REVIEW` block Gate 2.

## Later mandatory gates

- `UI_AFFECTING: YES`: Browser QA với responsive coverage, basic
  accessibility, role/state coverage và hashed screenshot evidence bắt buộc
  trước Gate 3.
- `Sensitive change: YES`: sau explicit Gate 2 approval, Design phải được tạo
  và dừng tại Sensitive Design Gate trước Tasks hoặc Apply.

## Recommendation

Review exact delta Spec và approve Gate 2 only if its observable requirements
match the bounded Product decision. Do not proceed to Design without explicit
current-user Gate 2 approval. If approved, the next workflow state is Design
followed by mandatory Sensitive Design Gate; Tasks/Apply remain prohibited.
