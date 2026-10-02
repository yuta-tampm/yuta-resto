# Change Analysis

## Scope and Change Type

Đây là behavior-changing, authorization/security-sensitive và CROSS_MODULE prerequisite cho `restaurant-knowledge-concept-history`, theo `Strategy B — coordinated bounded changes`.

Phạm vi chỉ gồm:

- tích hợp hai Restaurant Knowledge logical operations READ và MANAGE vào accepted Authorization mechanism;
- grant cả READ và MANAGE cho `OWNER` và `MANAGER`;
- deny `STAFF` mặc định cho cả hai operation;
- giữ READ và MANAGE là hai operation riêng dù initial grant sets giống nhau;
- giữ nguyên active user/organization/establishment/membership validation, server-derived tenant context và fail-closed operation permission enforcement;
- xác minh authorization behavior bằng tests.

Change không triển khai Restaurant Knowledge persistence/schema/API/UI, `Concept`/`Histoire` behavior, AI, automatic learning, Marketing integration, section-specific permissions, STAFF expansion hoặc cross-runtime behavior.

## Sources Consulted

### Product Intent và dependency context

- [ADR-007 — Composed General Information and Restaurant Knowledge](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [Informations générales Page Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [Blocked dependent-change analysis](../restaurant-knowledge-concept-history/analysis.md), chỉ dùng làm non-normative dependency context.

### Authority, tenancy và security

- [Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [Tenancy and Authorization architecture](../../../docs/architecture/TENANCY.md)
- [Authentication architecture](../../../docs/architecture/AUTHENTICATION.md)
- [Identity and Membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
- [Root instructions](../../../AGENTS.md)
- [Backoffice instructions](../../../apps/backoffice/AGENTS.md)
- [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
- [OpenSpec Normativity Activation](../../../docs/OPENSPEC_YUTA_NORMATIVITY_ACTIVATION_REPORT.md)

### Current Implemented State

- [`apps/backoffice/src/server/auth/permissions.ts`](../../../apps/backoffice/src/server/auth/permissions.ts)
- [`apps/backoffice/src/server/auth/session.ts`](../../../apps/backoffice/src/server/auth/session.ts)
- [`packages/tenant/src/index.ts`](../../../packages/tenant/src/index.ts)
- [`packages/tenant/src/foundation.ts`](../../../packages/tenant/src/foundation.ts)
- [`packages/db-cloud/src/auth-repository.ts`](../../../packages/db-cloud/src/auth-repository.ts)
- [`apps/backoffice/test/establishment-profile-permissions.test.ts`](../../../apps/backoffice/test/establishment-profile-permissions.test.ts)
- [`apps/backoffice/test/personnel-permissions.test.ts`](../../../apps/backoffice/test/personnel-permissions.test.ts)
- [`packages/tenant/test/tenant.test.ts`](../../../packages/tenant/test/tenant.test.ts)

## Authority and Product Decision

Current Control Tower instruction là bounded Product/Security decision cho prerequisite này và phê duyệt:

- Restaurant Knowledge sở hữu semantic meaning của READ và MANAGE;
- shared Authorization capability sở hữu representation, grant, enforcement và integration với accepted tenant/access mechanism;
- READ grant: `OWNER`, `MANAGER`;
- MANAGE grant: `OWNER`, `MANAGER`;
- `STAFF` không có access mặc định;
- READ và MANAGE phải là hai operation riêng;
- không reuse/inherit `establishment.profile.read` hoặc `establishment.profile.manage`;
- `YUTA_ADMIN` và `YUTA_SUPPORT` không bypass active restaurant membership hoặc operation permission;
- organization/establishment tenancy boundary và principal semantics giữ nguyên.

Quyết định này giải quyết operation-level permission blocker được ADR-007 và current Restaurant Knowledge Product Knowledge ghi nhận. Nó không chuyển semantic ownership của Restaurant Knowledge sang Identity / Access và không cho phép Authorization sở hữu Restaurant Knowledge data hoặc behavior.

OpenSpec change này vẫn non-normative. Gate progression không tự cập nhật Product Knowledge, lifecycle hoặc implementation state.

## Current Implemented State

Repository hiện có một accepted mechanism phù hợp để tích hợp policy này:

1. Backoffice session repository chỉ chấp nhận session hợp lệ của active user và giữ trusted organization/establishment scope.
2. `requireAuthenticatedTenant` resolve current session metadata rồi gọi `resolveAuthenticatedTenant`.
3. `resolveAuthenticatedTenant` yêu cầu active matching membership và tạo immutable `TenantContext` chứa trusted organization, establishment, user actor, membership và role.
4. Module-specific authorization trong `apps/backoffice/src/server/auth/permissions.ts` dùng typed logical permission values, role-to-permission mapping, `has*Permission` và fail-closed `require*Permission` guards.
5. Current permission guards chỉ cho `actor.type === 'user'`; public/service actors bị deny. Global `systemRole` không xuất hiện trong `TenantContext.actor` và không tham gia module permission grant.
6. Existing tests chứng minh role mapping, deny behavior và trusted tenant/cross-scope rules cho các capability hiện có.

Repository chưa có Restaurant Knowledge permission type, mapping, guard hoặc authorization test. Không có Restaurant Knowledge API/UI/persistence call site để enforce operation trong change này, và các call site đó bị loại trừ rõ ràng.

Không có current deployment/runtime evidence cho Restaurant Knowledge authorization. Repository implementation evidence không chứng minh environment enablement hoặc production readiness.

## Affected Boundaries

- **Semantic operation owner:** Restaurant Knowledge sở hữu nghĩa của READ và MANAGE.
- **Authorization owner:** shared Backoffice Authorization mechanism sở hữu typed representation, grant mapping, fail-closed guard và integration point.
- **Authentication/tenant enforcement:** reuse current validated session → active tenant metadata → active membership → server-derived `TenantContext`; không thay đổi.
- **Principal semantics:** giữ nguyên `OWNER`, `MANAGER`, `STAFF`; không thêm role hoặc principal.
- **System-role boundary:** `YUTA_ADMIN`/`YUTA_SUPPORT` không được chuyển thành restaurant principal và không bypass membership/permission.
- **Tenancy boundary:** organization/establishment hierarchy và establishment-scoped semantics giữ nguyên; không thêm tenant semantics.
- **Data/runtime ownership:** không tạo data owner, persistence, API, UI hoặc runtime mới.
- **Unrelated authorization:** Establishment Profile, Booking, Reputation, Personnel và Access Audit contracts giữ nguyên.
- **Cross-runtime/external:** không ảnh hưởng POS, Site Agent, Display, public apps hoặc external providers.

## Lifecycle Baseline

Current Module Registry và Product Knowledge ghi nhận:

- Tenant / membership boundary: Product Decision `APPROVED`, Implementation `IMPLEMENTED`, Environment `UNVERIFIED`, Production Readiness `NOT_READY`, External Dependency `NOT_ASSESSED`.
- Access / membership administration: Implementation `IMPLEMENTED`, nhưng Product Decision evidence tổng thể vẫn có review marker riêng; prerequisite này không mở rộng membership administration.
- Restaurant Knowledge: Product Decision `APPROVED`, Implementation `NOT_STARTED`, Environment `NOT_ENABLED`, Production Readiness `NOT_ASSESSED`, External Dependency `NOT_ASSESSED`, với operation-level permissions là blocker hiện tại.

Control Tower decision phê duyệt bounded authorization policy cho change này, nhưng analysis không promote bất kỳ lifecycle value nào. Repository implementation vẫn chưa có Restaurant Knowledge mapping cho đến khi một approved apply/verify flow hoàn tất.

## Requirement Readiness

`READY_FOR_SPECS`

Precise behavioral specs có thể được viết mà không đoán:

- hai operation đã được xác định và phải tách biệt;
- accepted principals và grant matrix đã đầy đủ;
- STAFF default denial đã rõ;
- no-inheritance và no-system-role-bypass đã rõ;
- accepted tenant enforcement chain và unchanged boundary đã rõ;
- exclusions ngăn scope lan sang persistence, API, UI, section-level policy hoặc cross-runtime behavior.

Exact code symbol/string representation và test-file placement là design/implementation details, không làm thay đổi requirement. Change có spec-level behavior và không đủ điều kiện `skip_specs: true`.

## UI / UX Applicability

Không áp dụng. Change không thêm hoặc sửa UI, route visibility, navigation hay client state. UI visibility trong future dependent change không được dùng thay server authorization.

Không tạo hoặc sửa page pack trong prerequisite này trừ khi later implementation làm thay đổi một current UI-delivery statement; hiện không có UI delta.

## Conflicts and Unknowns

### CONFLICT

Không có requirement-level conflict. Approved policy bổ sung module-specific permissions theo đúng pattern hiện có và giữ nguyên higher-authority tenancy/security invariants.

### NEEDS REVIEW

Không có requirement-level `NEEDS REVIEW` trước Specs.

Các chi tiết representation và code organization được defer sang design, với điều kiện không tạo parallel authorization system, không đổi accepted tenant mechanism và không thay unrelated contracts.

## Analysis Conclusion

`READY_FOR_SPECS`

Capability `authorization/restaurant-knowledge` có thể tiến tới delta Specs sau explicit Gate 1 approval. Specs phải giới hạn ở READ/MANAGE logical separation, approved `OWNER`/`MANAGER` grants, STAFF denial, trusted active tenant/membership enforcement, no Establishment Profile inheritance và no system-role bypass.

Change được phân loại sensitive vì ảnh hưởng authorization/security và cross-module durable boundary. Sau Gate 2, design phải có `02b-design-review.md` và explicit approval trước Tasks/Apply.

Không có Specs, Design, Tasks hoặc implementation được tạo tại Gate 1.
