# Change Analysis

## Scope and Change Type

Change này thiết lập prerequisite authority/access foundation cho Pointage, không
triển khai usable clock-in / clock-out. Đây là change `CROSS_MODULE`, behavioral,
authorization/security-sensitive, personnel/privacy-sensitive và có khả năng
data-affecting; owning capability là Pointage, với Personnel và Shared
Authorization/Tenancy là supporting boundaries.

Phạm vi chỉ gồm ownership của immutable raw actual-work evidence, reference và
eligibility theo establishment-scoped Personnel dossier/lifecycle, cloud/online
runtime boundary, dedicated Pointage employee credential, independent self-only
employee authorization, OWNER/MANAGER establishment visibility qua dedicated
grant, STAFF denial, trusted tenant isolation và privacy/readiness constraints
tối thiểu. Final Pointage workflow, Planning reconciliation, payroll, offline và
production enablement nằm ngoài phạm vi.

`Sensitive change: YES` vì change chạm credential, authentication-like employee
access, authorization, tenancy, personnel-related operational/legal data và có
thể cần cloud migration trong Apply sau này. Sensitive Design Gate là bắt buộc.

## Sources Consulted

- Product/authority quyết định hiện tại: Control Tower P1-P7 cho Pointage ngày
  2026-09-06 và [Proposal hiện tại](./proposal.md).
- Repository instructions: [`AGENTS.md`](../../../AGENTS.md),
  [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md),
  [`packages/db-cloud/AGENTS.md`](../../../packages/db-cloud/AGENTS.md),
  [`packages/contracts/AGENTS.md`](../../../packages/contracts/AGENTS.md),
  [`packages/tenant/AGENTS.md`](../../../packages/tenant/AGENTS.md) và
  [`packages/auth/AGENTS.md`](../../../packages/auth/AGENTS.md).
- [Documentation index](../../../docs/README.md),
  [Current State](../../../docs/CURRENT_STATE.md),
  [Authority Model](../../../docs/AUTHORITY_MODEL.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md) và
  [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [YUTA Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md)
  và
  [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- [Architecture Overview](../../../docs/architecture/OVERVIEW.md),
  [Authentication](../../../docs/architecture/AUTHENTICATION.md),
  [Identity and Membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
  [Tenancy](../../../docs/architecture/TENANCY.md),
  [Data Model](../../../docs/architecture/DATA_MODEL.md),
  [Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
  [ADR-001](../../../docs/decisions/ADR-001-modular-monolith.md) và
  [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md).
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md),
  [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
  và
  [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- Existing normative specs được dùng làm boundary/convention evidence, không làm
  Pointage Product authority:
  [`authorization/formalites`](../../specs/authorization/formalites/spec.md),
  [`authorization/restaurant-knowledge`](../../specs/authorization/restaurant-knowledge/spec.md)
  và
  [`personnel/reconstructable-value-history`](../../specs/personnel/reconstructable-value-history/spec.md).
- Current implementation evidence:
  [`apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx`](<../../../apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx>),
  [`apps/backoffice/src/server/auth/permissions.ts`](../../../apps/backoffice/src/server/auth/permissions.ts),
  [`apps/backoffice/src/server/auth/session.ts`](../../../apps/backoffice/src/server/auth/session.ts),
  [`packages/contracts/src/personnel/index.ts`](../../../packages/contracts/src/personnel/index.ts),
  [`packages/db-cloud/src/schema/personnel.ts`](../../../packages/db-cloud/src/schema/personnel.ts),
  [`packages/db-cloud/src/personnel-repository.ts`](../../../packages/db-cloud/src/personnel-repository.ts),
  [`packages/auth/src/session.ts`](../../../packages/auth/src/session.ts) và
  focused Personnel/authorization tests.
- Local POS credential behavior được kiểm tra chỉ như negative boundary evidence:
  POS/Site Agent/`@yuta/db-pos` là local-only và không phải authority hay reusable
  identity cho cloud Pointage.

## Authority and Product Decision

Control Tower P1-P7 là accepted current-user Product/authority decision cho
bounded change này:

- Personnel sở hữu employee dossier và employment lifecycle; Pointage chỉ tham
  chiếu scoped dossier và sở hữu immutable raw actual-work evidence. Sessions và
  totals là Pointage-derived values; future correction không được overwrite hoặc
  xóa raw evidence.
- Dedicated Pointage credential tách khỏi POS PIN và YUTA cloud-user login,
  scoped theo establishment, không lưu durable plaintext. Manager không có
  permanent plaintext access; issuance/reset/regeneration làm credential cũ mất
  hiệu lực. Crypto, rate limiting, lookup và recovery shape thuộc Sensitive
  Design.
- V1 là `CLOUD / ONLINE ONLY` trên dedicated web surface dùng shared tablet,
  mobile hoặc browser. Trusted establishment resolution là bắt buộc; exact entry
  mechanism thuộc Design. Không offline, POS, Site Agent, local database hoặc
  synchronization.
- Employment-period eligibility: upcoming không được tạo event trước entry date;
  active được phép; final departure day vẫn được phép; former không được tạo
  event mới.
- Employee credential chỉ được self-identify, đọc current Pointage state cần cho
  clocking và tạo operation của chính employee. OWNER/MANAGER có
  establishment-wide visibility qua dedicated Pointage grants; STAFF không có
  visibility đó chỉ do role.
- Mọi lookup và operation dùng trusted `organizationId + establishmentId +
personnel dossier id`; không có global employee identity hoặc cross-establishment
  dossier merge.
- Pointage records là personnel-related operational/legal data. Raw evidence phải
  durable và scoped; credential lifecycle và future corrections cần audit hooks.
  Exact retention, deletion, legal hold, backup, notice và audit visibility vẫn
  chờ Legal/Privacy review và không được suy đoán trong Specs.

Các quyết định này phù hợp với durable repository boundaries: cloud và local
persistence tách biệt, browser input không phải trusted tenant authority, và
Personnel là canonical employee/lifecycle source. Chúng cho phép lập behavioral
Specs nhưng không tự cập nhật Module Registry, lifecycle, environment hoặc
Production Readiness.

Pointage sở hữu business-operation semantics. Shared Authorization/Tenancy sẽ
biểu diễn và enforce grants/context; không được alias Pointage operations thành
Personnel permissions, cloud membership role hoặc POS PIN semantics.

## Current Implemented State

Repository hiện có:

- route Backoffice Pointage và navigation entry ở trạng thái placeholder, không
  có usable Pointage workflow;
- Personnel contracts, cloud schema và repositories scope dossier bằng
  organization và establishment, với employment entry/departure data làm nguồn
  lifecycle hiện tại;
- typed Backoffice permission maps và trusted server session/tenant guards cho
  các capability hiện hữu;
- cloud/local database ownership tách biệt và Site Agent là owner duy nhất của
  POS persistence;
- local POS PIN implementation trong local boundary, nhưng identity và state đó
  không sync lên cloud và không phải Pointage credential.

Repository chưa có:

- Pointage contract, cloud schema, repository, service/action hoặc focused tests;
- immutable raw Pointage event model hay derived session/total contract;
- dedicated Pointage employee credential hoặc employee authentication flow;
- Pointage operation vocabulary, employee self-scope grants, OWNER/MANAGER
  grants hoặc STAFF denial;
- trusted establishment-entry mechanism cho dedicated employee-facing surface;
- deployed/runtime evidence cho Pointage.

Current Personnel permissions không cung cấp Pointage authority. Current
cloud-user session model cũng không thể được coi là dedicated employee credential
flow. Code và tests chỉ chứng minh implemented state; chúng không thay thế P1-P7
hoặc approve một technical design.

## Affected Boundaries

- **Owning capability:** Pointage sở hữu raw actual-work evidence và Pointage
  operation semantics.
- **Personnel boundary:** read-only trusted reference tới scoped dossier và
  employment period; change không chuyển ownership hoặc sửa Personnel lifecycle.
- **Runtime:** cloud/online only. Exact existing cloud application placement và
  trusted establishment-entry mechanism phải được Sensitive Design quyết định.
  Nếu cần runtime/app mới ngoài approved topology, change phải quay lại Control
  Tower.
- **Persistence:** nếu approved implementation cần durable credential hoặc
  Pointage state, chỉ server-owned `@yuta/db-cloud` family được phép. Browser
  không nhận database driver, URL, secret hoặc tenant authority.
- **Tenancy:** mọi employee/manager lookup fail closed trên trusted
  organization + establishment + dossier scope; resource ID alone và
  browser-supplied membership/role/grant bị cấm.
- **Authorization:** dedicated Pointage grants tách khỏi Personnel permissions.
  Employee credential không tạo restaurant cloud-user session hoặc generic
  tenant authority.
- **Audit/privacy:** credential lifecycle và future correction paths cần audit
  boundary; exact legal retention/deletion/visibility vẫn là production gate.
- **Local/external boundaries:** POS, Site Agent, Display, local databases,
  offline/sync và external providers không bị ảnh hưởng.
- **Downstream consumers:** Planning, Today, payroll/TESE, export và corrections
  không được thêm trong foundation này.

### Mandatory Cross-Module Impact Check

| Check                                                             | Kết quả                                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1. Change có đọc/ghi entity do module khác sở hữu không?          | Có — đọc trusted Personnel dossier/lifecycle; không ghi Personnel.                                                 |
| 2. Có Product Decision unresolved làm thay đổi requirement không? | Không — P1-P7 giải quyết requirement-level decisions cho foundation.                                               |
| 3. Có shared authorization/tenancy boundary không?                | Có — dedicated Pointage grants và trusted establishment scope.                                                     |
| 4. Có durable data/security/privacy impact không?                 | Có — credential và personnel-related raw evidence boundary.                                                        |
| 5. Có nhiều runtime hoặc sync boundary không?                     | Không — cloud/online only; local và sync bị loại trừ.                                                              |
| 6. Có lifecycle/readiness gate liên quan không?                   | Có — Pointage chưa started/enabled/assessed và Legal/Privacy gates còn blocked.                                    |
| 7. Có accepted authority đủ cho bounded scope không?              | Có — current-user P1-P7 cùng durable repository boundaries.                                                        |
| 8. Ownership giữa các module đã rõ chưa?                          | Có — Personnel sở hữu dossier/lifecycle; Pointage sở hữu actual evidence; Shared Authorization hỗ trợ enforcement. |
| 9. Có Sensitive Design trigger không?                             | Có — credential, auth, tenancy, privacy và possible migration.                                                     |
| 10. Có final UI/UX delivery trong change không?                   | Không — dedicated surface requirement được giữ, final Pointage UI nằm ngoài scope.                                 |

Classification giữ nguyên là `CROSS_MODULE`.

## Lifecycle Baseline

Module Registry hiện ghi Pointage:

- Product Decision: `—`;
- Implementation: `NOT_STARTED`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NEEDS REVIEW`.

P1-P7 là authority input cho OpenSpec change này nhưng chưa phải Registry update
hay lifecycle promotion. Route placeholder không nâng Implementation state.

Personnel là canonical supporting module với status hiện tại riêng; việc đọc
dossier/lifecycle không chuyển Personnel ownership sang Pointage. Identity,
tenant và database primitives hiện hữu là supporting implementation evidence,
không chứng minh Pointage capability hoặc environment readiness.

`PRIV-04`, `HR-LEGAL-01`, `HR-RET-01`, `HR-AUDIT-01` và mọi production gate áp
dụng vẫn blocked/unresolved. Change này không triển khai, deploy, enable hay
promote bất kỳ lifecycle/readiness state nào.

## Requirement Readiness

Hai behavioral capability có thể được viết thành precise Specs mà không cần
đoán Product intent:

- `pointage/authority-foundation` cho ownership, Personnel reference,
  employment-period eligibility, immutable raw/derived distinction, cloud-only
  runtime, tenancy và privacy constraints;
- `authorization/pointage` cho dedicated credential, employee self-only scope,
  OWNER/MANAGER establishment grants, STAFF denial và fail-closed isolation.

Change có observable behavior nên không được dùng `skip_specs: true`. Specs phải
diễn đạt outcomes và invariants, không chốt credential format/hash, throttling,
lookup, audit schema, repository shape hoặc migration strategy trước Sensitive
Design.

Exact legal retention/deletion/notice rules không cản việc viết foundation
Specs vì production enablement và destructive deletion đều ngoài scope. Specs
phải giữ unresolved legal decisions explicit và không tạo default policy giả.

## UI / UX Applicability

`UI_AFFECTING: NO` cho bounded authority/access foundation hiện tại.

Change không thêm final clock UI, manager credential-management UI, route state,
visual design hoặc navigation behavior. Existing Pointage placeholder giữ nguyên.
Dedicated employee-facing web surface là requirement boundary cho future usable
workflow, không phải UI delivery được authorize trong change này.

Nếu Specs/Design cho thấy foundation bắt buộc phải thêm user-visible UI hoặc page
pack, đó là scope expansion: phải STOP, cập nhật UI classification và quay lại
Gate 1 review. Browser QA applicability chỉ được chốt trong Tasks sau approved
Sensitive Design; không được suy từ placeholder route.

## Conflicts and Unknowns

Không có requirement-level `CONFLICT`.

Các `NEEDS REVIEW` còn lại là Design hoặc later production-gate questions, không
làm thay đổi P1-P7:

- trusted establishment-entry mechanism và exact cloud application placement;
- credential format, entropy, hashing/storage, collision behavior, issuance,
  one-time plaintext display, reset/recovery và old-credential invalidation;
- non-enumerating lookup, throttling/brute-force protection, concurrent use và
  failure behavior;
- Pointage actor/context composition, operation identifiers, grant mapping và
  audit taxonomy;
- minimal schema/repository/migration/rollback shape nếu Apply cần durable state;
- exact retention, deletion, legal hold, backup retention, employee notice và
  audit visibility, vốn tiếp tục block production readiness chứ không được giải
  quyết ngầm ở foundation Specs.

Design phải giữ dedicated credential tách khỏi POS PIN và cloud-user login. Nếu
Design cần global employee identity, local/offline/sync behavior, browser-supplied
tenant authority, shared credential plaintext, destructive raw-evidence mutation,
new runtime/app topology hoặc grant ngoài P1-P7, change phải STOP và quay lại
Control Tower.

## Analysis Conclusion

Bounded scope đã đủ authority để tiến tới Specs cho hai new capabilities:
`pointage/authority-foundation` và `authorization/pointage`.

Specs chỉ được tạo sau explicit Gate 1 approval và phải giữ foundation không trở
thành usable Pointage workflow. Sau Specs approval, Sensitive Design Gate là bắt
buộc trước Tasks/Apply. Không implementation, sync/archive, lifecycle promotion
hoặc production decision nào được authorize bởi Analysis này.

`READY_FOR_SPECS`
