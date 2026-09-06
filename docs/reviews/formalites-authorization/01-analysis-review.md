Change: formalites-authorization

Gate: 1 — Proposal / Analysis

Review status: APPROVED

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-03T22:29:13.6170536+02:00

Approval scope: Gate 1 current Proposal/Analysis hashes; proceed to Specs only.
Both reviewed artifact paths and hashes were rechecked and matched before approval.

Created: 2026-09-03T22:19:24.9678022+02:00

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization / cross-module semantic boundary

## Request and bounded-change summary

Current-user YUTA Control Tower handoff yêu cầu prerequisite CROSS_MODULE:
Formalités sở hữu semantics READ/MANAGE; Shared Authorization sở hữu
representation, grant mapping và enforcement. OWNER có cả hai; MANAGER/STAFF
không có. Discovery/Shaping đã COMPLETED theo handoff. Không tái sử dụng quyền
Personnel để ghi Formalités. Không mở persistent draft, UI, dữ liệu, provider
hoặc production. Handoff cho phép Proposal → Analysis → Gate 1, không phê duyệt
Gate 1 trước khi packet này được review.

Capability được đề nghị: `authorization/formalites`. Không sửa requirement của
main spec hiện có. Existing Formalités prototype routes giữ nguyên Personnel
source-read permission và development boundary hiện tại.

## Provenance and inventory

- Repository: `D:/working/yuta/yuta-resto`.
- HEAD trước authoring: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- `git status --short`: worktree đã dirty bởi F07 và workflow/documentation work;
  không quy các thay đổi đó cho change này.
- Status ban đầu: `Change 'formalites-authorization' not found. No changes exist.`
- Trước tạo shell, Proposal/Analysis/Specs/Design/Tasks và review packet chưa tồn tại.
  Không có adoption hoặc overwrite artifact có sẵn.
- `openspec new change formalites-authorization`: tạo shell, không truyền schema
  override; metadata pin `yuta-spec-driven`.
- CLI banner/planning-home default hiện `spec-driven`, nhưng resolved
  `schemaName`, instructions, project config và pinned metadata đều
  `yuta-spec-driven`; đã ghi nhận diagnostic khác biệt, không sửa tooling.
- Chỉ tạo `.openspec.yaml` qua CLI, `proposal.md`, `analysis.md`, packet này.
  Không tạo Specs/Design/Tasks, application/schema/migration code.
- Các implementation candidate permissions/session và Personnel permission test
  không có pre-existing Git edit tại lần kiểm tra; kiểm tra lại trước Apply.

## Authorities and findings

Authorities và implementation evidence được link đầy đủ trong Analysis bên dưới.
Product authority là current-user handoff, không phải code hoặc historical
prototype approval. Shared Authorization ở đây là Identity / Access ownership,
không phải một shared package mới.

- Requirement-level CONFLICT: NONE.
- Requirement-level unanswered Product/authority question: NONE.
- Documentation CONFLICT: Identity / Access Home mục 13–14 còn nói chưa có
  normative spec; main `authorization/restaurant-knowledge` và Authority Model
  cho thấy scoped normative authority hiện có. Không ảnh hưởng grants đã duyệt
  cho Formalités, không normalize canonical document tại Gate 1.
- NEEDS REVIEW ngoài scope: durable draft data owner implementation, required
  inputs, eligibility, template/legal, retention và production. Không quyết
  định chúng trong prerequisite này.
- Design-only questions: exact identifiers/helper shape/composition/testing
  seams; chưa thiết kế ở Gate 1.
- Stop conditions: new tenancy/security boundary, different canonical owner,
  grants beyond OWNER, cross-runtime, Personnel permission semantic reuse/change,
  hoặc Product decision ngoài scope → trở về Control Tower.

## Validation and gate boundary

- `openspec instructions proposal --change formalites-authorization --json`:
  thành công, resolved proposal path chưa tồn tại, dependencies rỗng.
- `openspec instructions analysis --change formalites-authorization --json`:
  thành công, dependency proposal done; đã đọc lại Proposal trước Analysis.
- `openspec status --change formalites-authorization --json`: Proposal và
  Analysis done; Specs ready; Design/Tasks blocked; planning chưa complete.
- `pnpm exec prettier --check openspec/changes/formalites-authorization/proposal.md openspec/changes/formalites-authorization/analysis.md`:
  exit 0, `All matched files use Prettier code style!`
- `pnpm docs:check`: exit 0,
  `Documentation consistency check passed (36 current documents).`
- `pnpm architecture:check`: exit 0,
  `Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.`
- `pnpm -r --if-present typecheck`: exit 0; all scheduled package/app typechecks completed.
- Không chạy strict delta validation vì Specs chưa được phép tạo. Không giả
  lập spec hoặc skip_specs để làm change validation pass tại Gate 1.
- Không chạy application tests/build/browser QA/database checks/provider calls:
  chưa có implementation. Repository-wide format check không chạy; chỉ targeted
  formatting, không sửa formatting debt ngoài scope.
- Không sync/archive, promote lifecycle, production operation hoặc implementation.

## Artifact integrity

SHA-256 trên exact file bytes, PowerShell:
`Get-FileHash -Algorithm SHA256 -LiteralPath <path>`; lowercase hexadecimal.

| Repository-relative path                                | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/formalites-authorization/analysis.md` | `c3d1babc03b1bb3088fe2178065e4fa6b2975c329050c3de847f59ca359794c4` |
| `openspec/changes/formalites-authorization/proposal.md` | `2da37c1b35c5450318ed051e1dec4b23941102e324dc4d453d8a932794b04613` |

Exact proposal/analysis contents bên dưới được nhúng nguyên văn. Resume phải
kiểm tra lại cả path set và hashes trước khi nhận approval.

## Exact proposal content

```markdown
## Why

Formalités cần quyền riêng cho dữ liệu draft/workflow mà module này sở hữu;
quyền đọc Personnel của prototype hiện tại không cấp quyền ghi Formalités.
Control Tower đã hoàn tất Discovery/Shaping và yêu cầu prerequisite
`CROSS_MODULE` này trước khi xem xét persistent draft.

## What Changes

- Giới thiệu hai logical operation độc lập: Formalités READ và MANAGE.
  READ cho đọc trạng thái durable thuộc Formalités; MANAGE cho quản lý trạng
  thái đó khi một workflow riêng được phê duyệt và triển khai. Hai quyền không
  tạo ra endpoint, thao tác lưu hay vòng đời draft trong change này.
- Formalités sở hữu ý nghĩa nghiệp vụ của READ/MANAGE. Shared Authorization
  (Identity / Access) sở hữu representation, grant mapping và enforcement theo
  convention Backoffice hiện có.
- OWNER được cấp cả READ và MANAGE; MANAGER và STAFF không được cấp quyền nào.
  READ/MANAGE vẫn là hai operation khác nhau dù grant ban đầu giống nhau.
- Giữ trusted organization, active establishment, verified membership/role và
  fail-closed behavior. Không lấy authority từ browser hoặc global system role.
- Không kế thừa hay thay đổi `personnel.employee.manage` hoặc bất kỳ quyền
  Personnel nào. Prototype chỉ đọc Personnel hiện tại giữ nguyên behavior.
- Bổ sung bằng chứng kiểm tra grant/denial, tính độc lập với Personnel và việc
  sử dụng trusted context, cùng tài liệu đúng phạm vi khi đến Apply.

Không có breaking change dự kiến đối với consumer hiện tại.

## Capabilities

### New Capabilities

- `authorization/formalites`: quyền READ/MANAGE độc lập cho Formalités-owned
  durable state, OWNER-only, enforced qua trusted cloud establishment context.

### Modified Capabilities

Không có. Không sửa requirement của Personnel hoặc
`authorization/restaurant-knowledge`; capability sau chỉ là convention tham khảo.

## Impact

- Runtime: cloud Backoffice; không thay đổi POS, Site Agent hoặc Display.
- Khu vực dự kiến: `apps/backoffice/src/server/auth/permissions.ts`, helper
  server auth phù hợp và focused tests trong `apps/backoffice/test/`; tài liệu
  Identity / Access và Personnel/Formalités chỉ phản ánh prerequisite được duyệt.
- Không cần package, framework, database permission table, schema, migration,
  API công khai, provider hoặc thay đổi membership/session model.
- Sensitive change: YES — authorization và cross-module semantic boundary;
  cần Sensitive Design Gate sau Specs, không tạo Design ở Gate 1.

### Out of scope

Draft persistence/schema/migration/repository/UI; thay đổi Personnel projection;
lưu address, remuneration hoặc probationChoice; PDF/preview; legal templates;
DPAE/DSN workflow; signature/provider; Documents integration; external delivery;
AI/OCR; payroll; MANAGER/STAFF access; Personnel write-back; production enablement;
legal-compliance claims. Không sửa navigation hoặc gate của prototype hiện tại.

### Stop conditions

Trả về Control Tower nếu cần tenancy/security boundary mới, canonical owner
khác, grant ngoài OWNER, cross-runtime behavior, tái sử dụng/thay đổi semantics
quyền Personnel hoặc Product decision ngoài scope authorization đã duyệt.

### Workflow boundary

Lượt này chỉ tạo Proposal, Analysis và Gate 1; dừng chờ human review trước Specs.
Không sync, archive, implement hoặc tự promote lifecycle/readiness.
```

## Exact analysis content

```markdown
# Change Analysis

## Scope and Change Type

`formalites-authorization` là prerequisite `CROSS_MODULE` do YUTA Control Tower
chuyển giao; Discovery/Shaping đã COMPLETED theo yêu cầu hiện tại. Đây là
behavioral authorization change, không phải documentation-only hoặc persistent
draft implementation. Scope chỉ là hai logical operations Formalités READ và
MANAGE, grant OWNER-only và enforcement theo trusted context hiện có.

Sensitive change: YES — authorization và cross-module ownership semantics.
Không tạo Specs, Design, Tasks hoặc implementation trước gate tương ứng.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md),
  [Tenant instructions](../../../packages/tenant/AGENTS.md).
- [Documentation index](../../../docs/README.md), [Current State](../../../docs/CURRENT_STATE.md),
  [Authority Model](../../../docs/AUTHORITY_MODEL.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [Normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md),
  [run-change skill](../../../.agents/skills/yuta-run-change/SKILL.md).
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md),
  [Personnel Product Knowledge](../../../docs/features/personnel/README.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md),
  [Lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Tenancy](../../../docs/architecture/TENANCY.md),
  [Authentication](../../../docs/architecture/AUTHENTICATION.md),
  [Identity and Membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md).
- [Formalités Product Scope](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/PRODUCT_SCOPE.md),
  [Formalités data/interaction evidence](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/DATA_AND_INTERACTION_SPEC.md).
- [Permission definitions/mappings/guards](../../../apps/backoffice/src/server/auth/permissions.ts),
  [Server session resolution](../../../apps/backoffice/src/server/auth/session.ts),
  [Tenant resolution and guards](../../../packages/tenant/src/index.ts).
- [Existing authorization spec](../../specs/authorization/restaurant-knowledge/spec.md),
  [Restaurant Knowledge permission tests](../../../apps/backoffice/test/restaurant-knowledge-permissions.test.ts),
  [Personnel permission tests](../../../apps/backoffice/test/personnel-permissions.test.ts).
- [Connected Formalités route](<../../../apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx>),
  [Generic prototype route](<../../../apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/page.tsx>),
  [Projection tests](../../../apps/backoffice/test/formalites-cdi-connected-read.test.tsx),
  [Prototype tests](../../../apps/backoffice/test/formalites-cdi-prototype.test.tsx).

## Authority and Product Decision

Authority cho delta là current-user Control Tower handoff: Formalités sở hữu
semantics; Shared Authorization sở hữu representation, grant mapping và
enforcement; OWNER có READ/MANAGE; MANAGER/STAFF không có; quyền Personnel không
authorize Formalités-owned durable writes. Đây là quyết định mới có giới hạn,
không suy từ việc OWNER hiện có quyền Personnel.

Shared Authorization khớp với Identity / Access foundation hiện tại, không phải
package/runtime mới. Nền tảng security vẫn là server session, active matching
membership, organization và active establishment. Global system role và input
browser không bypass boundary này. Không có quyền bổ sung ngoài READ/MANAGE.

F5-07 mô tả Product lifecycle tương lai không thay thế authorization contract.
Handoff hiện tại giải quyết prerequisite quyền, không giải quyết durable input,
data ownership implementation, eligibility, template hoặc production approval.

## Current Implemented State

### 1. Authorization representation and declaration

`apps/backoffice/src/server/auth/permissions.ts` là file `server-only`, khai báo
typed string-literal unions theo capability: ReputationPermission,
BookingPermission, EstablishmentPermission, RestaurantKnowledgePermission và
PersonnelPermission. Chưa có Formalités permission. Không tìm thấy Formalités
permission trong `packages/auth`, `packages/tenant`, contracts hoặc cloud schema.
Không có lý do repository để tạo database grant table hoặc shared package mới.

### 2. Role-grant mechanism

Cùng file dùng `Record<Permission, readonly TenantRole[]>` và kiểm tra role từ
`context.actor`. Restaurant Knowledge có READ/MANAGE riêng mặc dù cùng grant;
đây là convention gần nhất, không phải authority sao chép grants. Formalités
chỉ được OWNER theo handoff; các mapping hiện tại phải giữ nguyên.

### 3. Server enforcement

Convention là boolean `has...Permission` và throwing `require...Permission`;
denial dùng `TenantError('Permission denied.', 'CROSS_TENANT_ACCESS_DENIED', 403)`.
Đây là permission predicates trên trusted context, không tự xác thực session
hay resource ownership. `requireAuthenticatedTenant` lấy scope từ validated
session, tải metadata và gọi `resolveAuthenticatedTenant`; resolver kiểm tra
active membership khớp user/organization/establishment. `requireEstablishment`
loại bỏ organization-only context. Các lớp này phải được kết hợp, không xem
một boolean role check là bằng chứng đầy đủ về quyền truy cập resource.

### 4. Existing Formalités overlap

Generic route và connected route đang dùng `personnel.employee.read`. Connected
route có development opt-in, UUID validation và scoped employee lookup. Những
check này chỉ bảo vệ prototype/Personnel source read, không có Formalités
durable resource hay write operation. Không có permission semantic overlap với
hai operation mới. Không chuyển route/navigation/projection hoặc bỏ Personnel
source authorization trong prerequisite này.

### 5. Required test evidence by current conventions

Các permission tests dùng Vitest, mock `server-only`, tạo `TenantContext` có
scope synthetic rồi kiểm tra từng logical operation. Evidence cần cho delta:

- OWNER allow độc lập READ/MANAGE; MANAGER và STAFF deny cả hai;
- public/service deny; global system role không bypass membership grants;
- throwing guard và boolean decision nhất quán với denial convention;
- operation độc lập, không alias/call Personnel permission để authorize;
- Personnel và các mapping cũ giữ nguyên grant/denial;
- missing/inactive/mismatched trusted prerequisites không tạo authorization;
  missing active establishment fail closed; input browser không tạo context;
- existing prototype behavior/gates không đổi.

Không cần tạo draft endpoint hoặc database row chỉ để chứng minh prerequisite.
Test helper thuần chỉ chứng minh mapping, không chứng minh session validation;
cần phân biệt evidence giữa các lớp. Vị trí test cụ thể và cách ghép enforcement
để chứng minh boundary là việc Design sau Gate 2, không quyết định ở đây.

### 6. Unverified runtime

Không gọi app, database hoặc provider; không claim deployed authorization.
Source/test inspection không phải test execution hay production evidence.

## Affected Boundaries

- Canonical semantics: Formalités; representation/grants/enforcement: Shared
  Authorization trong cloud Backoffice hiện có.
- Không đổi user/membership/session schema, tenant/security model hoặc resource
  ownership. Future draft owner/persistence không được quyết định qua change này.
- Không đổi Personnel reads/writes/history, Documents, Registre, POS, Site
  Agent, Display, provider, file storage hoặc audit lifecycle.
- Logical operations tồn tại như prerequisite; việc wire vào durable workflow
  chưa tồn tại thuộc change riêng. Không cấp quyền thao tác chưa được phê duyệt.

## Lifecycle Baseline

Registry hiện ghi tenant/membership boundary APPROVED / IMPLEMENTED /
UNVERIFIED / NOT_READY / NOT_ASSESSED. Access/membership administration có
Product Decision chưa rõ (`—`, NEEDS REVIEW); đó không phải blocker cho grant
Formalités đã được Control Tower quyết định riêng.

Formalités prototype: APPROVED / PROTOTYPE / DEVELOPMENT_ONLY / BLOCKED /
BLOCKED. Durable Formalités lifecycle: PROPOSED / NOT_STARTED / NOT_ENABLED /
BLOCKED / BLOCKED. Không thay đổi bất kỳ lifecycle value nào. New permission
chưa được triển khai; production enablement không được cho phép.

## Requirement Readiness

Có thể viết behavioral specs cho đúng `authorization/formalites`: hai logical
operations, OWNER-only mapping, trusted scope, fail-closed denial, không kế thừa
Personnel và không làm thay đổi authorization hiện tại. Handoff đã giới hạn
owner/grants và loại trừ mọi draft workflow/data decision.

Không cần invent field, permission tier, entitlement, provider hoặc tenancy
boundary để mô tả yêu cầu này. Không dùng `skip_specs: true` vì hành vi
authorization mới cần specification.

## UI / UX Applicability

UI_AFFECTING: NO trong phạm vi prerequisite này. Không đổi giao diện, navigation,
visibility, read-only state hoặc các route prototype. Không cần UX-flow artifact;
phân loại QA cuối cùng thuộc giai đoạn planning sau các gate.

## Conflicts and Unknowns

- CONFLICT ảnh hưởng requirement: NONE.
- CONFLICT tài liệu/routing, không ảnh hưởng grant mới: Identity / Access Home
  mục 13–14 vẫn nói chưa có normative spec, trong khi main spec
  `authorization/restaurant-knowledge` đã tồn tại và Authority Model xác nhận
  normative role. Đây là wording tổng quát cũ, không phủ định scoped grants;
  không sửa canonical knowledge trong Gate 1 hoặc lấy wording đó để bypass gate.
- NEEDS REVIEW ngoài scope: persistent draft inputs/eligibility, durable data
  ownership implementation, legal/template/retention và production. Giữ nguyên;
  không phải prerequisite của việc khai báo hai logical operations.
- Design-only: exact operation identifier/helper shape, vị trí composition và
  test seams theo convention hiện có; không tự chốt implementation trong Analysis.
- CLI provenance: banner/default planning-home metadata nói `spec-driven`, nhưng
  `schemaName`, artifact instructions, `.openspec.yaml` và project config đều là
  `yuta-spec-driven`. Dùng pinned/resolved schema; không sửa CLI/config/skills.
- Pre-existing dirty work: F07 và workflow documentation/skills nằm ngoài scope.
  File permissions/session và permission test đang sạch tại thời điểm kiểm tra;
  phải kiểm tra lại trước Apply. Không sửa phần đang làm ở task khác.

Nếu implementation đòi tenancy/security boundary mới, canonical owner khác,
grant ngoài OWNER, cross-runtime, Personnel permission semantic change/reuse
hoặc Product decision ngoài handoff: STOP và trả về Control Tower.

## Analysis Conclusion

READY_FOR_SPECS

Bounded prerequisite đã rõ; `authorization/formalites` có thể chuyển sang Specs
chỉ sau human Gate 1 approval. Không có requirement-level blocker mới. Sensitive
Design Gate bắt buộc sau Specs vì đây là authorization change. Kết luận này
không phải gate approval, implementation authorization hoặc lifecycle promotion.
```

## Recommendation and required approval

READY_FOR_SPECS, subject to explicit human Gate 1 approval for this packet.

YUTA operational state: STOP — AWAITING_HUMAN_REVIEW.
Raw CLI Specs-ready không tự cho phép tạo Specs.

Approval cần tiếp theo: duyệt Gate 1 của `formalites-authorization` với
Proposal/Analysis hashes hiện tại và cho phép chỉ tạo delta Specs.
Sensitive Design Gate vẫn bắt buộc ở giai đoạn sau.
