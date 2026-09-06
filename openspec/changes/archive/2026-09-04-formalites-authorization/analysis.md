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
