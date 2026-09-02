Change: restaurant-knowledge-customer-experience
Gate: 2 — Specs Review
Review status: APPROVED
Created: 2026-09-01T00:14:14.1686871+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — tenant-owned Restaurant Knowledge data, canonical ownership, authorization consumption, and tenant isolation
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-01T00:23:26.7564961+02:00

# Gate 2 — Specs Review

## Approved Gate 1 reference

Gate 1 was approved by the explicit current-user instruction
`APPROVE Gate 1`. Before creating Specs, the recorded Proposal and Analysis
hashes were recomputed and matched the approved packet exactly.

| Repository-relative path                                                      | SHA-256                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/restaurant-knowledge-customer-experience/01-analysis-review.md` | `ee9cf27559e46c3ece59bced9d3d341859d36e9c3a9b0268182dde993365c9ee` |
| `openspec/changes/restaurant-knowledge-customer-experience/analysis.md`       | `bd7e2df308415adc95b17ff1002c775d12e6fbc66c8526a466a2efb9bca37aa9` |
| `openspec/changes/restaurant-knowledge-customer-experience/proposal.md`       | `4b1cf04bbab4711918cee0166261f9c135d0db9911349c5ddaafca7757e992c3` |

Gate 1 packet status: `APPROVED`.

## Pre-existing dirty-worktree attribution

Before State 2, all dirty files outside this change's OpenSpec and review
directories were captured as a deterministic sorted status/path/SHA-256
manifest:

- file count: `44`;
- aggregate manifest SHA-256:
  `69f856d85ccae7d5fe247a3b4489b1a7cf6e50aa6c5522f1d39baeb4ed3e4c92`.

Those files belong to pre-existing work, principally the completed
Cuisine/savoir-faire change. State 2 does not attribute or modify them. The only
new State 2 artifact is the delta Spec below plus this Gate 2 packet; Gate 1 is
updated only with its bounded approval record.

## Delta Spec inventory and hash

Hash command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'openspec/changes/restaurant-knowledge-customer-experience/specs/restaurant-knowledge/customer-experience/spec.md'
```

| Repository-relative path                                                                                           | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-customer-experience/specs/restaurant-knowledge/customer-experience/spec.md` | `d028bcbbb1cec1dfb5c84c91174d1ea55985b7e056d776294626a1940f098ff6` |

## Requirements and scenarios summary

The delta contains 11 ADDED requirements and 26 scenarios:

1. Restaurant Knowledge canonical ownership, establishment semantic scope and
   Organization-only tenancy/access envelope.
2. Exactly three descriptive values with their approved meanings, without
   operational service semantics.
3. View protected by Restaurant Knowledge READ without Establishment Profile
   permission inheritance.
4. Edit and explicit save protected by MANAGE, independent from READ.
5. Three independently optional values, valid all-empty state and every
   single-value state.
6. Independent manual input/edit behavior.
7. One explicit save for the complete slice.
8. No persistence before explicit save.
9. No source, dependency or required-consumer relationship with Reservations,
   Reputation, Today, Personnel, POS/orders or Marketing.
10. No CRM, customer-profile, customer-specific preference or event-specific
    relationship/storage model.
11. No AI/automatic learning and no Product-required validation, taxonomy,
    checklist, scoring, structured category or analytics classification.

The existing normative authorization spec remains unchanged and supplies the
grant/tenant contract consumed here: OWNER and MANAGER receive READ + MANAGE;
STAFF receives neither by default; trusted active user, organization,
establishment and matching membership remain required.

## Exact delta Spec content

```markdown
## Purpose

Capability này cho phép người dùng được ủy quyền mô tả thủ công trải nghiệm mà
establishment muốn tạo cho khách như một slice Restaurant Knowledge, không biến
nội dung đó thành dữ liệu vận hành hoặc hồ sơ riêng của từng khách.

## ADDED Requirements

### Requirement: Expérience client thuộc Restaurant Knowledge của establishment hiện tại

Hệ thống SHALL coi Restaurant Knowledge là canonical owner của `Expérience
souhaitée`, `Accueil & service` và `Attention particulière au client`, cùng
persistence/domain boundary của ba value. Các value SHALL có semantic scope
theo establishment trong trusted tenant context hiện tại; Organization SHALL
chỉ là tenancy/access envelope. Establishment Profile SHALL NOT trở thành
canonical owner hoặc source của các value này.

#### Scenario: Xem Expérience client của establishment hiện tại

- **WHEN** người dùng được phép xem slice `Expérience client` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL hiển thị ba value Restaurant Knowledge của
  establishment đó
- **AND** SHALL NOT lấy các value từ Establishment Profile như canonical source

#### Scenario: Lưu Expérience client cho establishment hiện tại

- **WHEN** người dùng được phép lưu slice `Expérience client` trong trusted
  tenant context của một establishment
- **THEN** hệ thống SHALL lưu trạng thái canonical của ba value dưới ownership
  của Restaurant Knowledge cho establishment đó
- **AND** Organization SHALL remain tenancy/access envelope thay vì trở thành
  semantic owner

### Requirement: Slice chứa đúng ba descriptive knowledge values

Initial slice SHALL chỉ chứa `Expérience souhaitée`, `Accueil & service` và
`Attention particulière au client`. `Expérience souhaitée` SHALL mô tả trải
nghiệm tổng thể establishment muốn tạo; `Accueil & service` SHALL mô tả phong
cách tiếp đón và phục vụ ở mức Restaurant Knowledge; `Attention particulière
au client` SHALL mô tả các nguyên tắc hoặc điểm chú ý chung trong trải nghiệm
khách. Ba value SHALL remain descriptive establishment knowledge, không phải
operational customer/service data.

#### Scenario: Hiển thị đúng ba value

- **WHEN** người dùng mở slice `Expérience client`
- **THEN** hệ thống SHALL trình bày đúng ba value đã được phê duyệt
- **AND** SHALL NOT thêm structured service category, checklist, score hoặc
  analytics value vào slice

#### Scenario: Accueil & service không trở thành quy trình vận hành

- **WHEN** người dùng nhập nội dung mô tả phong cách tiếp đón hoặc phục vụ
- **THEN** hệ thống SHALL giữ nội dung ở mức descriptive Restaurant Knowledge
- **AND** SHALL NOT biến nội dung thành checklist, procédure opérationnelle,
  staff task, workflow hoặc service SLA

#### Scenario: Attention particulière vẫn là nguyên tắc chung

- **WHEN** người dùng nhập nội dung về điểm establishment muốn chú ý trong trải
  nghiệm khách
- **THEN** hệ thống SHALL giữ nội dung như nguyên tắc chung của establishment
- **AND** SHALL NOT mô hình hóa nội dung thành preference hoặc event record của
  một khách cụ thể

### Requirement: View sử dụng Restaurant Knowledge READ

Hệ thống SHALL require Restaurant Knowledge READ để xem ba value của
`Expérience client`. Hệ thống SHALL NOT reuse hoặc inherit
`establishment.profile.read` hay `establishment.profile.manage` để cấp quyền
xem slice này.

#### Scenario: Principal có READ xem được Expérience client

- **WHEN** principal có Restaurant Knowledge READ trong valid trusted tenant
  context mở slice `Expérience client`
- **THEN** hệ thống SHALL cho phép xem ba value của establishment hiện tại

#### Scenario: Principal không có READ bị từ chối xem

- **WHEN** principal không có Restaurant Knowledge READ cố xem slice
  `Expérience client`
- **THEN** hệ thống SHALL từ chối quyền xem
- **AND** Establishment Profile permission SHALL NOT thay thế Restaurant
  Knowledge READ

### Requirement: Edit và explicit save sử dụng Restaurant Knowledge MANAGE

Hệ thống SHALL require Restaurant Knowledge MANAGE để sửa bất kỳ value nào
trong slice `Expérience client` và để thực hiện explicit save. Restaurant
Knowledge READ và MANAGE SHALL remain separate logical operations; quyền READ
riêng SHALL NOT cấp quyền edit hoặc save.

#### Scenario: Principal có MANAGE sửa và lưu được

- **WHEN** principal có Restaurant Knowledge MANAGE trong valid trusted tenant
  context sửa một hoặc nhiều value và kích hoạt explicit save
- **THEN** hệ thống SHALL cho phép thực hiện edit và save cho slice

#### Scenario: READ không thay thế MANAGE

- **WHEN** principal có Restaurant Knowledge READ nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

#### Scenario: Establishment Profile MANAGE không cấp quyền quản lý knowledge

- **WHEN** principal có `establishment.profile.manage` nhưng không có Restaurant
  Knowledge MANAGE cố sửa hoặc lưu slice
- **THEN** hệ thống SHALL từ chối edit hoặc save

### Requirement: Ba value Expérience client là optional và độc lập

Hệ thống SHALL cho phép `Expérience souhaitée`, `Accueil & service` và
`Attention particulière au client` tồn tại độc lập. Mỗi value SHALL là optional
và trạng thái cả ba cùng empty SHALL hợp lệ.

#### Scenario: All-empty state hợp lệ

- **WHEN** establishment chưa có value nào trong slice `Expérience client`
- **THEN** hệ thống SHALL hiển thị cả ba value empty như một trạng thái hợp lệ

#### Scenario: Chỉ Expérience souhaitée có giá trị

- **WHEN** `Expérience souhaitée` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Accueil & service có giá trị

- **WHEN** `Accueil & service` có giá trị và hai value còn lại empty
- **THEN** hệ thống SHALL hiển thị value đã có và giữ hai value còn lại empty

#### Scenario: Chỉ Attention particulière au client có giá trị

- **WHEN** `Attention particulière au client` có giá trị và hai value còn lại
  empty
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

### Requirement: Một explicit save lưu toàn bộ slice Expérience client

Hệ thống SHALL cung cấp một explicit save duy nhất cho slice `Expérience
client`. Khi save thành công, hệ thống SHALL lưu trạng thái hiện tại của cả ba
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

Hệ thống SHALL NOT persist thay đổi trong bất kỳ value `Expérience client` nào
trước khi người dùng có Restaurant Knowledge MANAGE kích hoạt explicit save của
slice.

#### Scenario: Thay đổi chưa explicit save không được persist

- **WHEN** người dùng sửa một hoặc nhiều value nhưng chưa kích hoạt explicit
  save
- **THEN** hệ thống SHALL NOT persist các thay đổi đó như trạng thái canonical
  của Restaurant Knowledge

### Requirement: Expérience client không tạo dependency hoặc consumer relationship với module vận hành

Initial slice SHALL hoạt động mà không đọc, ghi, link, copy, infer hoặc
synchronize dữ liệu thuộc Reservations, Reputation/reviews, Today,
Personnel/Gestion équipe, POS/orders hoặc Marketing. Các module đó SHALL NOT là
required data source hoặc required consumer của ba value trong change này.

#### Scenario: Reservations không phải source hoặc consumer

- **WHEN** người dùng xem, sửa hoặc lưu slice `Expérience client`
- **THEN** hệ thống SHALL NOT đọc hoặc ghi reservation, guest preference, table
  preference, special request hoặc reservation rule
- **AND** SHALL NOT yêu cầu Reservations consume hoặc phản ứng với các value

#### Scenario: Reputation không phải source hoặc consumer

- **WHEN** review, comment hoặc feedback tồn tại
- **THEN** hệ thống SHALL NOT đọc, derive hoặc thay đổi `Expérience client` từ
  dữ liệu đó
- **AND** SHALL NOT sửa review/reply hoặc yêu cầu Reputation consume các value

#### Scenario: Today và Personnel không phải consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT tạo Today card, alert, anomaly, staff checklist,
  task, employee procedure hoặc training workflow
- **AND** SHALL NOT yêu cầu Today hoặc Personnel consume hay phản ứng với các
  value

#### Scenario: POS và Marketing không phải source hoặc consumer

- **WHEN** slice được xem, sửa hoặc lưu
- **THEN** hệ thống SHALL NOT đọc order history, table/order data hoặc infer
  customer behavior từ POS
- **AND** SHALL NOT synchronize với POS hoặc yêu cầu Marketing/social consume
  các value

### Requirement: Slice không lưu CRM hoặc customer-specific preference

Ba value SHALL remain establishment-level descriptive knowledge. Initial slice
SHALL NOT model, link, import hoặc synchronize customer profile, CRM record,
customer-specific preference hoặc event-specific information.

#### Scenario: Thông tin của một khách cụ thể không trở thành knowledge value

- **WHEN** customer-specific preference, identity hoặc future event information
  tồn tại trong một module khác
- **THEN** hệ thống SHALL NOT dùng dữ liệu đó làm source cho ba canonical value
- **AND** SHALL NOT tạo customer/CRM relationship từ slice

### Requirement: Slice không tự động enrich hoặc áp đặt Product classification

Initial slice SHALL giới hạn behavior ở manual input, view, edit và explicit
save. Hệ thống SHALL NOT tự động tạo hoặc thay đổi ba value từ AI, automatic
learning hoặc inferred content. Hệ thống SHALL NOT áp đặt required content,
length, formatting, enum, taxonomy, checklist, scoring, structured service
category hoặc analytics model cho các value trong change này.

#### Scenario: AI hoặc inferred content không tự thay đổi canonical values

- **WHEN** AI output, automatic-learning signal hoặc inferred content tồn tại
- **THEN** hệ thống SHALL NOT tự động dùng nguồn đó để tạo hoặc thay đổi
  canonical `Expérience client` values

#### Scenario: Manual descriptive content không bị phân loại ngoài scope

- **WHEN** người dùng nhập thủ công một hoặc nhiều descriptive value
- **THEN** hệ thống SHALL NOT yêu cầu taxonomy, score, analytics category hoặc
  structured service classification để cho phép slice tồn tại hoặc được lưu
```

## Strict validation

Command:

```text
pnpm exec openspec validate restaurant-knowledge-customer-experience --strict
```

Exact result:

```text
Change 'restaurant-knowledge-customer-experience' is valid
```

Exit code: `0`.

## Changed assumptions since Analysis

None. The Specs preserve the approved three-value descriptive scope,
Restaurant Knowledge ownership, establishment semantic scope, Organization
tenancy/access envelope, READ/MANAGE behavior, optional independent values,
valid all-empty state, manual input, one explicit save, no autosave and every
explicit module/external exclusion.

The Specs do not select a schema, table, repository, API, storage
representation, shared contract or migration. They add no permission, role,
principal, validation limit, enum, taxonomy, scoring or analytics model.

## Remaining ambiguity

No requirement-level ambiguity remains. Technical persistence/data shape and
migration/rollback mechanics remain deferred to Design. If Design requires a
shared contract, additional permission, changed tenancy/canonical ownership,
prohibited module dependency, external provider or cross-runtime behavior, the
change must stop and return to review.

The non-blocking Product Knowledge documentation drift recorded at Gate 1
remains a later bounded documentation correction; it does not change this
delta's semantics.

## Recommendation

Approve Gate 2 for the exact delta Spec above. Because this is sensitive
tenant-owned data and canonical-ownership work, the next approved step must
create Design and stop at mandatory Gate 2b before Tasks or Apply.
