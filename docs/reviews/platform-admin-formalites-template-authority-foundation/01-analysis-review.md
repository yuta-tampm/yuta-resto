Change: platform-admin-formalites-template-authority-foundation
Gate: 1 — Analysis Review
Review status: APPROVED
Created: 2026-09-06T20:56:53.7832202+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — authorization/security, runtime boundary và cross-module durable boundary
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-06T21:04:44.0073453+02:00

# Gate 1 — Analysis Review

## Request and Bounded-Change Summary

Control Tower chấp thuận một bounded Platform Admin capability chỉ để quản trị authorization cho GLOBAL YUTA Formalités template resources. Formalités giữ semantic ownership; Platform Admin chỉ là internal runtime/access boundary. `YUTA_ADMIN` được grant đúng năm semantic operations tường minh, `YUTA_SUPPORT` bị deny toàn bộ, không role mới hoặc inheritance. System-only context không yêu cầu restaurant membership và không được trở thành tenant bypass.

Change này không tạo general-purpose Platform Admin, template persistence/content/version implementation, legal-review evidence store, qualification workflow, generation, PDF/DOCX/HTML, signature, Documents handoff, provider integration, restaurant customization, tenant permission hoặc production deployment.

## Exact Proposal Content

Path: `openspec/changes/platform-admin-formalites-template-authority-foundation/proposal.md`

```markdown
## Why

YUTA chưa có authorization contract cho việc quản trị nội bộ các legal template toàn cục thuộc Formalités. Platform Admin hiện chỉ là runtime boundary dự trữ, còn `YUTA_ADMIN`, `YUTA_SUPPORT` và `requireSystemRole` chưa xác lập operation, resource scope hoặc system-only context đủ để cho phép quản trị template mà không tạo tenant bypass.

## What Changes

- Thiết lập một capability Platform Admin bị giới hạn duy nhất cho authorization của GLOBAL YUTA Formalités template resources; Formalités vẫn là semantic owner.
- Định nghĩa năm logical operations độc lập cho đọc template, quản lý draft, gửi review, publish và retire; concrete identifiers sẽ theo convention hiện hữu trong Specs/Design.
- Grant cả năm operations cho `YUTA_ADMIN` bằng mapping tường minh; grant không operation nào cho `YUTA_SUPPORT`; không tạo role mới, inheritance hoặc blanket platform permission.
- Thiết lập trusted system-only authorization context từ authenticated YUTA user, accepted system role và requested operation, không yêu cầu organization/establishment membership và không cấp quyền đối với tenant resource.
- Yêu cầu fail-closed và security-audit behavior ở mức authorization contract.
- Giữ legal opinion và legal-review evidence ở external/manual governance boundary; change này không lưu evidence và không triển khai qualification workflow.
- Không tạo Platform Admin tổng quát, template data model, persistence, UI/API, generation, PDF/DOCX/HTML, signature, Documents handoff, provider integration, tenant permission hoặc production deployment.

## Capabilities

### New Capabilities

- `authorization/platform-admin-formalites-template-administration`: Authorization behavior cho system-only Platform Admin administration của GLOBAL YUTA Formalités templates, gồm explicit operation grants, denial, scope isolation và audit requirements.

### Modified Capabilities

- Không có. Existing tenant-scoped `authorization/formalites` requirements giữ nguyên.

## Impact

- Affected boundaries: portable cloud authentication/system authorization, future `apps/platform-admin` access boundary và Formalités global-resource ownership contract.
- Expected later implementation scope: authorization contracts/guards, focused tests và current authority documentation cần thiết; không có template repository hoặc runtime product surface.
- Existing restaurant Backoffice sessions, tenant resolution, Formalités OWNER-only authorization, Personnel behavior và production readiness không thay đổi.
```

## Exact Analysis Content

Path: `openspec/changes/platform-admin-formalites-template-authority-foundation/analysis.md`

```markdown
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
```

## Authorities Consulted

- `AGENTS.md` và nearest package instructions cho `packages/auth`, `packages/contracts`, `packages/tenant`, `packages/db-cloud`.
- `docs/AUTHORITY_MODEL.md`.
- `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`.
- `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md` và activation report.
- Product Knowledge, Module Registry, lifecycle, authentication, identity/membership, data-model, database-boundary và Formalités normative sources được liệt kê trong Analysis.
- Current auth/contracts/schema code và focused tests dùng chỉ để xác minh Implemented State.

## Conflicts and Needs Review

- Requirement-level `CONFLICT`: không có.
- Requirement-level `NEEDS REVIEW`: không có sau Control Tower decisions hiện tại.
- Design-sensitive items còn mở nhưng không thay đổi requirement semantics: concrete operation identifiers, package-level system context representation và security logger/audit event shape tối thiểu.
- Stop condition được giữ nguyên: nếu Design cho thấy cần sửa tenant-bound Backoffice session architecture hoặc tạo implicit tenant bypass, phải quay lại Control Tower.

## Product / Authority Questions Requiring Answers

Không còn câu hỏi Product/authority nào bắt buộc phải trả lời trước Specs. Gate 1 reviewer cần xác nhận Proposal và Analysis phản ánh đúng các quyết định Control Tower hiện tại.

## Artifact Integrity

Hash command/tool:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

Hashes được tính trên exact file bytes, lowercase hexadecimal, sorted theo repository-relative path:

| Path                                                                                   | SHA-256                                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/analysis.md` | `6f39ed1cb07ccc2b1db66c7cad920d97c01e4183d23bcbad5783c419dc3ec73b` |
| `openspec/changes/platform-admin-formalites-template-authority-foundation/proposal.md` | `ef4ce308839aa02bf15f89254bce366a65fe115c35eeec04da367ffcfc7efa91` |

Formatting verification:

```text
pnpm exec prettier --check "openspec/changes/platform-admin-formalites-template-authority-foundation/proposal.md" "openspec/changes/platform-admin-formalites-template-authority-foundation/analysis.md"
PASS — All matched files use Prettier code style.
```

## Provenance and Scope Isolation

- Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
- Pre-existing unrelated edits under Backoffice integration/UI, `packages/ui`, `pnpm-lock.yaml`, `async-interaction-feedback-foundation` và related tests/reviews remain outside this change and were not modified.
- Files created for this Gate: change metadata, Proposal, Analysis và this review packet only.
- Không Specs, Design, Tasks, implementation, sync hoặc archive action đã chạy.

## Recommendation

`APPROVE_GATE_1_TO_PROCEED_TO_SPECS`

Exact approval needed next:

```text
$yuta-run-change platform-admin-formalites-template-authority-foundation
Analysis review approved. Continue.
```
