# Change Analysis

## Scope and Change Type

Change này thiết lập một authorization foundation mới, bị giới hạn cho internal administration của GLOBAL YUTA Formalités template resources qua Platform Admin boundary. Đây là behavioral, cross-module và authorization/security-sensitive; không UI-affecting, không data/schema-affecting và không triển khai template lifecycle.

Phạm vi chỉ gồm năm semantic operations đã được Control Tower chấp thuận, explicit grant cho `YUTA_ADMIN`, explicit deny cho `YUTA_SUPPORT`, trusted system-only authorization context, tenant isolation, fail-closed behavior và security-audit requirements cần thiết cho authorization contract.

## Sources Consulted

- Product/authority quyết định hiện tại: Control Tower return cho `platform-admin-formalites-template-authority-foundation` ngày 2026-09-06.
- [YUTA Authority Model](../../../docs/AUTHORITY_MODEL.md)
- [YUTA Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md)
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [Architecture Overview](../../../docs/architecture/OVERVIEW.md)
- [Authentication](../../../docs/architecture/AUTHENTICATION.md)
- [Identity and Membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
- [Data Model](../../../docs/architecture/DATA_MODEL.md)
- [Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md) và [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md)
- Existing normative [Formalités authorization spec](../../specs/authorization/formalites/spec.md)
- Current implementation evidence: [`packages/auth/src/session.ts`](../../../packages/auth/src/session.ts), [`packages/auth/test/session.test.ts`](../../../packages/auth/test/session.test.ts), [`packages/contracts/src/tenant-foundation/index.ts`](../../../packages/contracts/src/tenant-foundation/index.ts), [`packages/db-cloud/src/schema/users.ts`](../../../packages/db-cloud/src/schema/users.ts), [`packages/db-cloud/src/auth-repository.ts`](../../../packages/db-cloud/src/auth-repository.ts) và Backoffice permission guards.

## Authority and Product Decision

Control Tower đã chấp thuận Product/authority scope cụ thể sau:

- Platform Admin chỉ là internal administration runtime/access boundary cho GLOBAL YUTA Formalités templates, không phải general-purpose Platform Admin product.
- Formalités giữ semantic ownership của template resources.
- Global resources không thuộc organization, establishment hoặc tenant authorization; restaurant memberships chỉ là future consumers.
- `YUTA_ADMIN` là initial principal và chỉ được grant năm operations tường minh: template read, manage draft, submit for review, publish và retire.
- `YUTA_SUPPORT` không được grant operation nào; không role mới, inheritance hoặc blanket platform permission.
- System-only context phải dựa trên authenticated YUTA user, accepted system role và explicit operation; không yêu cầu restaurant membership và không cấp tenant-resource authority.
- Legal opinion vẫn là external/manual governance; change không tạo legal reviewer role hoặc evidence persistence.

Các quyết định này đủ để định nghĩa precise authorization behavior. Chúng không tự promote lifecycle state, authorize template persistence hoặc production deployment.

## Current Implemented State

Repository hiện có:

- global user record với nullable `YUTA_ADMIN` hoặc `YUTA_SUPPORT` system role;
- provider-neutral `createAuthService` có thể resolve authenticated internal user mà không tạo `TenantContext`;
- `requireSystemRole` thực hiện exact allowlist check và fail closed khi role không được cho phép;
- unit tests chứng minh `YUTA_SUPPORT` không thỏa yêu cầu `YUTA_ADMIN`;
- tenant membership roles và system roles là hai contract riêng biệt;
- tenant-scoped `formalites.read`/`formalites.manage` tiếp tục deny system-role bypass.

Repository chưa có:

- `apps/platform-admin` application hoặc system-only application session;
- accepted system-operation vocabulary hoặc operation-to-role mapping;
- trusted system authorization context kết hợp authenticated user, system role và requested operation;
- Platform Admin production consumer của `requireSystemRole`;
- global Formalités template schema, repository, API, UI hoặc audit store.

Current Backoffice password/session flow yêu cầu active restaurant membership. Change này không sửa hoặc tái sử dụng flow đó như Platform Admin authentication, nên không tạo tenant bypass. Repository state không chứng minh environment hoặc production deployment.

## Affected Boundaries

- **Runtime/access boundary:** future `apps/platform-admin`, chỉ ở mức authorization contract; không tạo application runtime hoặc UI trong change này.
- **Semantic owner:** Formalités giữ template-resource semantics; Identity / Access chỉ biểu diễn và enforce system authorization.
- **Authentication/authorization:** system-only context tách khỏi `TenantContext`; explicit operation evaluation; fail closed; `YUTA_SUPPORT` deny.
- **Tenant boundary:** không thay đổi tenant sessions, memberships, entitlements hoặc Backoffice permission mappings. System authorization không được dùng để bypass arbitrary tenant resources.
- **Persistence:** không ảnh hưởng executable data shape. `@yuta/db-cloud` chỉ được ghi nhận là approved persistence family cho một future change.
- **Legal governance:** legal opinion, reviewer identity, evidence store và qualification workflow không bị thay đổi hoặc triển khai.
- **External provider/device/local runtimes:** không ảnh hưởng.

## Lifecycle Baseline

Baseline hiện tại của Platform Admin trong Module Registry:

- Product Decision: `APPROVED` chỉ cho reserved boundary; Control Tower hiện chấp thuận thêm đúng bounded authority scope của change này, chưa cập nhật Registry.
- Implementation: `NOT_STARTED` cho Platform Admin product; các low-level system-role/auth primitives đã tồn tại nhưng không tạo capability.
- Environment: `NOT_ENABLED`.
- Production Readiness: `NOT_ASSESSED`.
- External Dependency: không có dependency được triển khai trong scope này.

Formalités legal templates, generated versions và qualification vẫn `PROPOSED`/`NOT_STARTED` hoặc separately gated; các legal/template/audit production gates vẫn blocked. Workflow progression không thay đổi các giá trị này.

## Requirement Readiness

`READY_FOR_SPECS`

Precise behavioral specs có thể được viết mà không cần đoán vì principal, operation semantics, grant matrix, global scope, trusted-context inputs, tenant non-bypass, fail-closed behavior, legal boundary và exclusions đã được Control Tower quyết định.

Concrete operation identifiers có thể theo dotted lowercase authorization convention hiện hữu trong repository mà không thay đổi năm semantics đã chấp thuận. Exact contract placement và audit representation là Design questions, không phải Product blockers.

Change có observable authorization behavior nên không được dùng `skip_specs: true`.

## UI / UX Applicability

`UI_AFFECTING: NO`

Không tạo Platform Admin route, navigation, form, state hoặc visual surface. Browser QA không được suy ra là cần thiết từ capability name; QA applicability sẽ được xác nhận ở planning/implementation dựa trên non-UI authorization contract.

## Conflicts and Unknowns

Không có requirement-level `CONFLICT`.

Các câu hỏi còn lại được giới hạn cho Specs/Design và không làm thay đổi approved behavior:

- concrete dotted identifiers cho năm operations;
- package-level representation của trusted system authorization context và explicit grant mapping;
- security logger/audit event shape tối thiểu, không trở thành legal-evidence persistence;
- cách future Platform Admin runtime sẽ cung cấp authenticated user cho contract, ngoài scope implementation hiện tại.

Nếu Design cho thấy system-only authentication bắt buộc phải sửa tenant-bound Backoffice session architecture, change phải STOP và quay lại Control Tower theo stop condition. Hiện tại provider-neutral auth primitive cho phép giữ boundary này tách biệt, nên chưa có blocker đó.

## Analysis Conclusion

Bounded scope đã được xác nhận cho một new capability: `authorization/platform-admin-formalites-template-administration`.

Specs có thể tiến hành cho explicit system operations, `YUTA_ADMIN` grants, `YUTA_SUPPORT` denial, trusted system-only context, tenant isolation, fail-closed behavior và authorization security audit. Specs phải giữ toàn bộ template persistence, legal evidence, qualification workflow, UI/API và production operation ngoài phạm vi.

Change là authority-sensitive và sẽ cần Design cùng Sensitive Design Gate trước Tasks/Apply. Không có unresolved Product/authority blocker tại Gate 1.

`READY_FOR_SPECS`
