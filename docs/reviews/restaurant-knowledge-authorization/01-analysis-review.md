Change: restaurant-knowledge-authorization
Gate: 1 — Analysis Review
Review status: APPROVED
Created: 2026-08-30T21:05:47.3214688+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — authorization/security và CROSS_MODULE durable boundary
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-08-30T21:32:31.3037141+02:00

# Gate 1 — Analysis Review

## Request and bounded-change summary

Đây là Control Tower-approved CROSS_MODULE prerequisite cho `restaurant-knowledge-concept-history`, theo Strategy B. Change chỉ tích hợp hai Restaurant Knowledge logical operations READ và MANAGE vào accepted Authorization mechanism.

Grant matrix được yêu cầu:

- READ: `OWNER`, `MANAGER`;
- MANAGE: `OWNER`, `MANAGER`;
- `STAFF`: không có Restaurant Knowledge access mặc định;
- READ và MANAGE vẫn là hai operation riêng.

Change giữ nguyên trusted active user/organization/establishment/membership chain, server-derived tenant context, no-system-role-bypass và organization/establishment tenancy boundary. Nó không reuse Establishment Profile permissions và không triển khai Restaurant Knowledge persistence, API, UI hoặc Concept/Histoire behavior.

Repository analysis xác nhận policy này có thể tích hợp vào shared module-specific Backoffice permission mechanism hiện có mà không tạo parallel system hoặc thay higher-authority tenancy/principal semantics.

## Exact proposal content

```markdown
## Why

Prerequisite `restaurant-knowledge-concept-history` không thể tiến tới Specs vì Restaurant Knowledge chưa có operation-level authorization riêng trong repository. Change CROSS_MODULE này bổ sung policy READ/MANAGE đã được Control Tower phê duyệt vào shared Authorization mechanism hiện có mà không kế thừa Establishment Profile permissions hoặc thay đổi tenancy boundary.

## What Changes

- Định nghĩa hai logical operations riêng biệt cho Restaurant Knowledge: READ và MANAGE.
- Gán READ cho `OWNER` và `MANAGER`; `STAFF` không có READ mặc định.
- Gán MANAGE cho `OWNER` và `MANAGER`; `STAFF` không có MANAGE mặc định.
- Giữ READ và MANAGE là hai logical operations độc lập dù initial grant sets giống nhau.
- Tích hợp representation, grant mapping và fail-closed enforcement vào shared Authorization mechanism hiện có sau trusted tenant resolution.
- Tiếp tục yêu cầu active user, active organization, active establishment, active establishment membership, server-derived tenant context và Restaurant Knowledge operation permission.
- Không cho `YUTA_ADMIN` hoặc `YUTA_SUPPORT` bypass restaurant membership hay Restaurant Knowledge permission.
- Không reuse hoặc inherit `establishment.profile.read` và `establishment.profile.manage`.
- Không thay đổi role/principal set, organization/establishment tenancy boundary, unrelated authorization contracts hoặc cross-runtime behavior.
- Không triển khai persistence, schema, API, UI hoặc behavior của `Concept`, `Histoire` hay section Restaurant Knowledge nào.

## Capabilities

### New Capabilities

- `authorization/restaurant-knowledge`: Shared Authorization behavior cho hai Restaurant Knowledge operations READ và MANAGE, approved role grants, trusted tenant enforcement và no-bypass boundaries.

### Modified Capabilities

Không có.

## Impact

- Shared Backoffice authorization mapping/guards và authorization-focused tests.
- Existing `@yuta/tenant` trusted context resolution, active membership validation và organization/establishment boundary được reuse, không thay đổi.
- Current Identity / Access và Restaurant Knowledge authority documentation cần phản ánh permission policy sau khi change được phê duyệt và triển khai; lifecycle values không tự động được promote.
- Không ảnh hưởng Establishment Profile permissions, persistence packages, contracts, UI routes, public apps, POS, Display hoặc external providers.
```

## Exact analysis content

```markdown
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
```

## Authorities consulted

- Product/Security decision: current Control Tower instruction for this exact prerequisite.
- Durable Product boundary: ADR-007 and current Establishment/Restaurant Knowledge Product Knowledge.
- Authorization ownership and enforcement: Identity / Access Product Knowledge, Tenancy, Authentication, Identity and Membership architecture, root and Backoffice instructions.
- Lifecycle: Module Registry and Lifecycle Status Model.
- Implemented State: Backoffice session and permission code, tenant resolution/foundation, cloud auth repository and focused permission/tenant tests.
- Governance: Authority Model and active OpenSpec normativity policy.

## CONFLICT and NEEDS REVIEW register

- `CONFLICT`: none.
- Requirement-level `NEEDS REVIEW`: none.
- Design-only detail: exact typed representation and test-file placement, bounded by the approved semantics and existing mechanism.

## Explicit Product/authority questions

None before Specs. The current instruction fully specifies operation separation, grant matrix, denied principals, tenancy preservation, no-inheritance, no-bypass and exclusions.

## Analysis conclusion and recommendation

`READY_FOR_SPECS`

Recommendation: approve Gate 1 for this exact change and artifact hashes, then create only the `authorization/restaurant-knowledge` delta spec. Because this is sensitive authorization work, a separate Design Gate will be mandatory after Gate 2 approval.

## Artifact hashes

Exact command:

```powershell
$files=@('openspec/changes/restaurant-knowledge-authorization/analysis.md','openspec/changes/restaurant-knowledge-authorization/proposal.md'); Get-FileHash -Algorithm SHA256 -LiteralPath $files | Sort-Object Path | ForEach-Object { '{0}|{1}' -f $_.Path,$_.Hash.ToLowerInvariant() }
```

| Repository-relative path                                          | SHA-256                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/restaurant-knowledge-authorization/analysis.md` | `88a4bf5b6ba44ca4be4fe631d04d49b867b6685f8c689a3c6e0ccb6c9c3cf6ff` |
| `openspec/changes/restaurant-knowledge-authorization/proposal.md` | `356b47691970101a0e760da13d559895d24d7347cb177cdbd97c86c32259d3fe` |

## Provenance and scope isolation

- Baseline HEAD: `bdef4ee48ca0f2e94edd34e655661fff7c88bae8`.
- Pre-existing unrelated untracked work: `docs/reviews/restaurant-knowledge-concept-history/**` and `openspec/changes/restaurant-knowledge-concept-history/**`; preserved byte-for-byte and outside this change.
- `restaurant-knowledge-authorization` artifacts existing before this run: none.
- Files created for Gate 1: `.openspec.yaml`, `proposal.md`, `analysis.md`, and this review packet.
- Specs, Design, Tasks and implementation: not created.
