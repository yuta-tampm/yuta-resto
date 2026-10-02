Change: formalites-authorization

Gate: 2 — Delta Specs

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-03T22:33:12.2323577+02:00

Approval scope: current Gate 2 hashes; Technical Design and Sensitive Design
Gate only. All Gate 1/Gate 2 reviewed artifact paths and hashes matched on resume.

Created: 2026-09-03T22:30:07.0904495+02:00

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization / cross-module semantic boundary

## Approved Gate 1 and bounded authority

[Gate 1](01-analysis-review.md) là APPROVED theo current-user instruction ngày
2026-09-03. Proposal và Analysis được kiểm tra lại exact paths/hashes trước
khi ghi approval; không có drift. Approval chỉ cho tạo Specs, không cho Design,
Tasks hoặc Apply.

Capability duy nhất: `authorization/formalites`.
Sensitive Design Gate: REQUIRED sau human Gate 2 approval.

## Artifact integrity

SHA-256 trên exact file bytes bằng
`Get-FileHash -Algorithm SHA256 -LiteralPath <path>`, lowercase hexadecimal.

| Repository-relative path                                                           | SHA-256                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/formalites-authorization/01-analysis-review.md`                      | `b6fc2871222a750ebaa2ffba99a717203fbf41f15bfdc7ff33634bc1a100bb57` |
| `openspec/changes/formalites-authorization/analysis.md`                            | `c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4` |
| `openspec/changes/formalites-authorization/proposal.md`                            | `2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613` |
| `openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md` | `601dd1417ac25527f201fdb3b95488b98474f6514ecfb0c428f68584d118ba46` |

Gate 1 packet hash ở trên là hash sau khi ghi explicit approval. Proposal và
Analysis hashes giữ nguyên so với Gate 1. Spec được format trước khi hash.
Resume phải kiểm tra lại complete reviewed path sets và hashes.

## Requirements and scenarios summary

Delta có 8 ADDED requirements và 27 scenarios:

1. READ/MANAGE độc lập; Formalités owns semantics, Shared Authorization owns
   representation/mapping/enforcement.
2. OWNER allow cả hai; MANAGER và STAFF deny cả hai.
3. Authenticated user, verified active matching membership, trusted organization
   và active establishment; missing/inactive/wrong-user/wrong-scope và browser
   authority không authorize.
4. Public/service denial; system role không bypass membership grants.
5. Không alias/reuse Personnel permission semantics hoặc kết quả Personnel check.
6. Giữ Personnel, Restaurant Knowledge, session/membership/tenancy và các domain
   authorization hiện tại.
7. Giữ prototype routes, development gates, source-read checks, navigation/UI.
8. Allow chỉ là authorization decision; không tự thực hiện persistence,
   workflow, provider, file hoặc production behavior.

Không định nghĩa field/schema/API, lifecycle draft hoặc implementation mechanics.
Những nội dung đó chỉ được nêu như exclusions, không trở thành requirements
để triển khai chúng.

## Validation evidence

- `openspec instructions specs --change formalites-authorization --json`:
  exit 0; resolved schema `yuta-spec-driven`, dependency Analysis done;
  không có pre-existing delta file.
- `openspec validate formalites-authorization --strict`:
  exit 0; exact output: `Change 'formalites-authorization' is valid`.
- `pnpm exec prettier --check openspec/changes/formalites-authorization/specs/authorization/formalites/spec.md docs/reviews/formalites-authorization/01-analysis-review.md`:
  exit 0; `All matched files use Prettier code style!`.
- `pnpm docs:check`: exit 0;
  `Documentation consistency check passed (36 current documents).`.
- `pnpm architecture:check`: exit 0;
  `Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.`.
- `pnpm -r --if-present typecheck`: exit 0; tất cả scheduled typechecks hoàn tất.
- `openspec status --change formalites-authorization --json`: Proposal,
  Analysis, Specs done; Design ready nhưng chưa tồn tại; Tasks blocked.
- Không chạy application tests/build/browser QA/database/provider; không có
  implementation. Không chạy repository-wide formatting hoặc sửa debt ngoài scope.

## Assumptions, conflicts and remaining ambiguity

Changed assumptions since Analysis: NONE. Không đổi initial grants, owners,
scope hoặc prototype behavior. Các semantic operations được mô tả không ràng
buộc implementation function/identifier/library.

Requirement-level ambiguity/conflict: NONE.

Giữ nguyên các finding ngoài scope của Gate 1: Identity / Access Home có
normative-routing wording cũ; durable inputs/eligibility/ownership implementation,
legal/template/retention và production cần quyết định riêng. Không resolve
chúng bằng Specs này.

Trong worktree có F07 và workflow documentation cleanup từ task khác.
Chúng không thuộc change này. HEAD:
`07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Lượt này chỉ sửa approval metadata Gate 1, tạo delta spec và packet Gate 2.
Không sửa Proposal/Analysis, application/permission code, main specs, archive,
schema/migration hoặc canonical knowledge. Không có production operation.

## Exact delta spec content

```markdown
## Purpose

Xác định authorization prerequisite cho Formalités READ và MANAGE đối với
trạng thái durable thuộc Formalités, độc lập với Personnel và giữ nguyên
trusted organization/active-establishment boundary hiện tại.

## ADDED Requirements

### Requirement: Formalités READ và MANAGE là hai logical operations độc lập

Shared Authorization SHALL biểu diễn và đánh giá Formalités READ và Formalités
MANAGE như hai operation riêng. Formalités sở hữu ý nghĩa đọc hoặc quản lý trạng
thái durable của mình; Shared Authorization sở hữu representation, grant mapping
và enforcement. Grant hoặc kết quả kiểm tra một operation SHALL NOT thay thế
việc kiểm tra operation còn lại, dù initial grant sets giống nhau.

#### Scenario: Đánh giá đúng operation được yêu cầu

- **WHEN** một caller yêu cầu Formalités READ hoặc Formalités MANAGE
- **THEN** hệ thống SHALL đánh giá operation được yêu cầu theo grant riêng của nó
- **AND** SHALL NOT dùng kết quả của operation còn lại thay cho đánh giá đó

### Requirement: Initial grants chỉ cho OWNER

Trong trusted context hợp lệ, hệ thống SHALL grant cả Formalités READ và
Formalités MANAGE cho authenticated user có verified active establishment
membership role OWNER. Hệ thống SHALL deny cả hai operation cho MANAGER và STAFF.

#### Scenario: OWNER được READ

- **WHEN** OWNER có trusted context và active matching membership hợp lệ yêu cầu Formalités READ
- **THEN** hệ thống SHALL allow READ

#### Scenario: OWNER được MANAGE

- **WHEN** OWNER có trusted context và active matching membership hợp lệ yêu cầu Formalités MANAGE
- **THEN** hệ thống SHALL allow MANAGE

#### Scenario: MANAGER bị từ chối

- **WHEN** MANAGER yêu cầu Formalités READ hoặc MANAGE dù membership đang active
- **THEN** hệ thống SHALL deny operation được yêu cầu

#### Scenario: STAFF bị từ chối

- **WHEN** STAFF yêu cầu Formalités READ hoặc MANAGE dù membership đang active
- **THEN** hệ thống SHALL deny operation được yêu cầu

### Requirement: Authorization chỉ sử dụng trusted authenticated establishment context

Hệ thống SHALL chỉ authorize Formalités READ/MANAGE từ authenticated user với
verified active membership khớp trusted organization và trusted active
establishment. Các điều kiện active user, organization, establishment và session
validation hiện tại SHALL được giữ nguyên. Browser-provided tenant, organization,
establishment, membership, role hoặc permission values SHALL NOT tạo authority,
thay thế hoặc ghi đè trusted context. Không có required scope hoặc context không
khớp SHALL dẫn tới denial, kể cả khi actor tự khai hoặc có role OWNER ở scope khác.

#### Scenario: Không có authenticated user hợp lệ

- **WHEN** một yêu cầu READ/MANAGE không có authenticated user hợp lệ theo session validation hiện tại
- **THEN** hệ thống SHALL deny trước khi role grant có thể authorize operation

#### Scenario: Không có membership

- **WHEN** không tìm thấy verified active membership khớp authenticated user và requested trusted scope
- **THEN** hệ thống SHALL deny READ/MANAGE

#### Scenario: Membership không active

- **WHEN** membership cho scope được yêu cầu không active
- **THEN** hệ thống SHALL deny READ/MANAGE dù role được lưu là OWNER

#### Scenario: Membership sai user

- **WHEN** membership không thuộc authenticated user đang yêu cầu operation
- **THEN** hệ thống SHALL deny READ/MANAGE

#### Scenario: Thiếu active establishment

- **WHEN** context chỉ có organization hoặc không có required active establishment
- **THEN** hệ thống SHALL deny READ/MANAGE mà không tự chọn establishment

#### Scenario: Sai organization

- **WHEN** organization scope được yêu cầu không khớp trusted organization và verified membership
- **THEN** hệ thống SHALL deny READ/MANAGE mà không chuyển scope dựa trên input yêu cầu

#### Scenario: Sai establishment

- **WHEN** establishment scope được yêu cầu không khớp trusted active establishment và verified membership
- **THEN** hệ thống SHALL deny READ/MANAGE kể cả khi user là OWNER tại establishment khác

#### Scenario: User organization hoặc establishment không active

- **WHEN** user, organization hoặc establishment không đáp ứng active-status checks hiện tại
- **THEN** hệ thống SHALL deny READ/MANAGE

#### Scenario: Browser cố cung cấp authority

- **WHEN** browser gửi tenant, organization, establishment, membership, role hoặc permission để nhận Formalités access
- **THEN** hệ thống SHALL NOT coi những giá trị đó là authorization proof
- **AND** chỉ trusted context hợp lệ cùng grant của operation được yêu cầu mới có thể authorize

### Requirement: Unsupported actors và system-role bypass bị từ chối

Hệ thống SHALL deny Formalités READ/MANAGE cho public và service actors.
YUTA_ADMIN hoặc YUTA_SUPPORT SHALL NOT tự cấp Formalités access; user có system
role vẫn phải thỏa verified active restaurant membership và operation grant.

#### Scenario: Public actor

- **WHEN** public actor yêu cầu Formalités READ hoặc MANAGE
- **THEN** hệ thống SHALL deny

#### Scenario: Service actor

- **WHEN** service actor yêu cầu Formalités READ hoặc MANAGE
- **THEN** hệ thống SHALL deny

#### Scenario: System role không có membership hợp lệ

- **WHEN** user có YUTA_ADMIN hoặc YUTA_SUPPORT nhưng thiếu matching active establishment membership
- **THEN** hệ thống SHALL deny READ/MANAGE

#### Scenario: System role không nâng grant membership

- **WHEN** user có system role và matching membership MANAGER hoặc STAFF yêu cầu Formalités READ/MANAGE
- **THEN** hệ thống SHALL deny theo membership grant, không nâng quyền từ system role

### Requirement: Formalités không kế thừa Personnel authorization

Formalités permission evaluation SHALL NOT alias, reuse hoặc inherit semantics
của `personnel.employee.manage` hay Personnel permission khác để authorize
Formalités-owned state. Personnel access SHALL NOT là authorization proof cho
Formalités READ/MANAGE. Việc OWNER được grant cả hai domain SHALL NOT làm hai
domain permission trở thành cùng một operation.

#### Scenario: Personnel permission không thay thế Formalités evaluation

- **WHEN** caller cung cấp kết quả Personnel permission allow cho một yêu cầu Formalités READ/MANAGE
- **THEN** hệ thống SHALL vẫn đánh giá đúng Formalités operation bằng trusted context và Formalités grants
- **AND** SHALL NOT dùng Personnel result làm quyết định authorize Formalités

#### Scenario: MANAGE không dùng Personnel semantics

- **WHEN** hệ thống quyết định Formalités MANAGE
- **THEN** quyết định SHALL sử dụng Formalités MANAGE semantics và grant mapping riêng
- **AND** SHALL NOT delegate quyết định đó cho `personnel.employee.manage`

### Requirement: Existing authorization và tenancy giữ nguyên

Bổ sung Formalités authorization SHALL NOT thay đổi Personnel permissions,
grant mappings hoặc enforcement; Restaurant Knowledge authorization; các
authorization contract khác; membership/session model; hoặc organization và
establishment tenancy boundary. Grant Formalités SHALL NOT cấp Personnel
write-back hay authority của domain khác.

#### Scenario: Personnel authorization không đổi

- **WHEN** một Personnel permission được đánh giá sau khi có Formalités operations
- **THEN** grant và denial behavior SHALL giống trước thay đổi này

#### Scenario: Restaurant Knowledge authorization không đổi

- **WHEN** Restaurant Knowledge READ hoặc MANAGE được đánh giá
- **THEN** initial role grants, independence và trusted-context enforcement hiện tại SHALL giữ nguyên

#### Scenario: Membership session và scope không đổi

- **WHEN** hệ thống xác thực session, resolve membership hoặc chuyển establishment theo luồng hiện tại
- **THEN** existing validation và tenant-isolation behavior SHALL giữ nguyên
- **AND** Formalités grant SHALL NOT bypass các kiểm tra đó hoặc cấp quyền domain khác

### Requirement: Existing Formalités prototype không đổi

Prerequisite này SHALL NOT thay đổi current Formalités prototype routes,
development gates, Personnel source-read authorization, navigation hoặc UI.
Logical operations mới SHALL NOT tự chuyển prototype thành durable workflow
hoặc tự mở quyền cho một route hiện có.

#### Scenario: Generic prototype được sử dụng như trước

- **WHEN** người dùng mở current generic Formalités prototype
- **THEN** existing route access, navigation và UI behavior SHALL giữ nguyên

#### Scenario: Connected prototype giữ source-read và development gates

- **WHEN** người dùng mở employee-connected Formalités prototype
- **THEN** existing development opt-in, Personnel source-read authorization và scoped employee checks SHALL giữ nguyên
- **AND** Formalités grant SHALL NOT bỏ qua hoặc thay thế các kiểm tra đó

### Requirement: Authorization prerequisite không kích hoạt capability ngoài phạm vi

Kết quả allow của Formalités READ/MANAGE SHALL chỉ biểu thị authorization cho
operation được yêu cầu; SHALL NOT tự tạo durable state, thực hiện workflow,
thay đổi Personnel projection, cấp quyền MANAGER/STAFF hoặc bật production.
Specification này không định nghĩa draft persistence, schema/migration, draft
lifecycle, lưu address/remuneration/probationChoice, API, PDF/preview, template,
signature/provider, DPAE/DSN workflow, Documents integration, external delivery,
AI/OCR, payroll hoặc legal-compliance behavior.

#### Scenario: Allow không tự thực hiện workflow

- **WHEN** một yêu cầu authorization Formalités được allow
- **THEN** authorization evaluation SHALL NOT tự tạo hoặc thay đổi draft, Personnel hay document state
- **AND** SHALL NOT sinh file, gọi provider hoặc gửi dữ liệu ra ngoài

#### Scenario: Không mở rộng role hoặc production từ prerequisite

- **WHEN** prerequisite authorization được cung cấp mà không có phê duyệt riêng cho workflow hoặc production
- **THEN** hệ thống SHALL NOT tự bật durable draft capability, production enablement hoặc grants ngoài OWNER
```

## Recommendation and stop

Đề nghị human review và duyệt Gate 2 của `formalites-authorization` nếu nội
dung/hashes trên được chấp nhận. Approval tiếp theo chỉ cho Technical Design và
Sensitive Design Gate; không tự cho phép Tasks hoặc Apply.

YUTA operational state: STOP — AWAITING_HUMAN_REVIEW.
Raw Design-ready không phải human authorization.
