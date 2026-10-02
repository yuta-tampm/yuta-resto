# Change Analysis

## Scope and Change Type

Change này bổ sung behavioral capability mới
`restaurant-knowledge/team-culture` cho page hiện có
`/etablissement/informations-generales`, gồm đúng ba descriptive knowledge
values:

1. `Valeurs & état d’esprit`;
2. `Façon de travailler ensemble`;
3. `Transmission & intégration`.

Đây là change ảnh hưởng UI, tenant-owned cloud data và authorization
consumption. Nó không thay đổi authorization contract, tenancy boundary,
canonical ownership, runtime ownership hay module contract hiện có. Change có
thể dẫn tới persistence decision trong Design, nhưng Analysis không chọn
schema, table, repository representation, API, shared contract hoặc Product
validation.

Phân loại cross-module impact: `PAGE_LOCAL`. Personnel, Planning, Pointage,
Today, Tâches du jour, Formalités, onboarding/training, POS, Site Agent,
Display và external provider không phải source, consumer hoặc dependency của
initial slice.

## Sources Consulted

### Repository và workflow authority

- [`AGENTS.md`](../../../AGENTS.md)
- [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md)
- [`packages/db-cloud/AGENTS.md`](../../../packages/db-cloud/AGENTS.md)
- [`docs/README.md`](../../../docs/README.md)
- [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md)
- [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md)
- [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md)
- [OpenSpec normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)

### Product, lifecycle và durable boundaries

- [Establishment Product Knowledge](../../../docs/features/establishment/README.md)
- [`Informations générales` Product Knowledge](../../../docs/features/establishment/general-information/README.md)
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md)
- [Today Product Knowledge](../../../docs/features/today/README.md)
- [ADR-007](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
- [Module Registry](../../../docs/MODULE_REGISTRY.md)
- [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md)
- [Tenancy architecture](../../../docs/architecture/TENANCY.md)
- [Authentication architecture](../../../docs/architecture/AUTHENTICATION.md)
- [Identity and membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
- [Database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md)

### Normative behavior và UI sources

- [Restaurant Knowledge authorization spec](../../../openspec/specs/authorization/restaurant-knowledge/spec.md)
- [Concept/Histoire spec](../../../openspec/specs/restaurant-knowledge/concept-history/spec.md)
- [Cuisine/savoir-faire spec](../../../openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md)
- [Expérience client spec](../../../openspec/specs/restaurant-knowledge/customer-experience/spec.md)
- [`Informations générales` page pack](../../../docs/ui/pages/establishment-general-information/README.md)
- [Page Product Scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md)
- [Page Data and Interaction Spec](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md)
- [Page UI Spec](../../../docs/ui/pages/establishment-general-information/UI_SPEC.md)
- [Page Acceptance Checklist](../../../docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md)

### Implemented State evidence

- Current page, loaders and server actions under
  `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/`
- `apps/backoffice/src/server/auth/permissions.ts`
- `packages/db-cloud/src/schema/restaurant-knowledge.ts`
- `packages/db-cloud/src/restaurant-knowledge-repository.ts`
- Restaurant Knowledge permission, loader, action, form/model, schema và
  repository tests dưới `apps/backoffice/test/` và `packages/db-cloud/test/`

## Authority and Product Decision

ADR-007 phê duyệt `team and culture` trong initial Restaurant Knowledge Product
Intent và giữ Restaurant Knowledge tách biệt khỏi Establishment Profile. Brief
Product hiện tại cho change bounded này giải quyết chính xác ý nghĩa của ba
value và initial behavior mà không thêm Personnel, HR hoặc operational
semantics.

Các boundary đã được chấp nhận:

- Restaurant Knowledge là canonical owner của ba descriptive values và domain/
  persistence boundary của chúng.
- Semantic scope là một establishment. Organization chỉ là tenancy/access
  envelope, không phải semantic owner.
- Establishment Profile không sở hữu các value và permission của Profile không
  được kế thừa.
- `restaurant-knowledge.read` kiểm soát view;
  `restaurant-knowledge.manage` kiểm soát edit và explicit save.
- OWNER và MANAGER nhận READ + MANAGE; STAFF không có Restaurant Knowledge
  access theo default policy.
- Ba value độc lập và optional; all-empty hợp lệ.
- Input là manual, với một whole-slice explicit save và không autosave.
- Không có required content, limit, format, enum, taxonomy, checklist, score,
  competency, HR classification, employee evaluation hoặc operational
  workflow nào được phê duyệt.

Brief không thay đổi durable boundary của ADR-007, normative authorization spec
hoặc tenancy architecture.

## Current Implemented State

Workspace snapshot hiện tại triển khai ba Restaurant Knowledge slices riêng
trên composed page:

- Concept/Histoire;
- Cuisine/savoir-faire;
- Expérience client.

Các slice hiện tại có page-local model/form, READ-gated loader, MANAGE-gated
save action và Restaurant Knowledge repository operations. Repository dùng
trusted `organizationId` và `establishmentId`; missing persistence được chiếu
thành valid empty state. Form giữ draft phía browser đến một explicit submit.
Focused tests bao phủ OWNER/MANAGER access, STAFF denial, Profile
non-inheritance, empty states, whole-slice save và tenant isolation.

Authorization implementation định nghĩa hai operation typed riêng biệt, cấp
cả hai cho OWNER/MANAGER, deny STAFF, public/service actors và system-role
bypass, đồng thời không reuse Profile permissions.

Scoped scan không tìm thấy dependency từ Restaurant Knowledge hiện tại sang
Personnel, Planning, Pointage, Today, Tâches du jour, Formalités, POS/Site
Agent, Display, provider, embeddings hoặc vector processing.

`Équipe & culture` chưa được triển khai. Không có schema field, repository
operation, loader, action, form, model hoặc test hiện tại đại diện cho ba value
của slice này.

Repository-state caveat: HEAD tại thời điểm Analysis là
`01e6ca74186f5cda389f5ca8c0700274b29d18d0`. Implementation, normative spec và
archive của Cuisine/savoir-faire và Expérience client có mặt trong shared dirty
worktree nhưng chưa thuộc HEAD này. Chúng là pre-existing work, được giữ nguyên
trong Gate 1 và không chứng minh deployment hoặc environment enablement.

## Affected Boundaries

### Runtime và page ownership

- Runtime owner vẫn là `apps/backoffice` cho authenticated page.
- Page vẫn là composed page; route placement không hợp nhất Profile và
  Restaurant Knowledge ownership.
- Public runtime, POS/Site Agent và Display không bị ảnh hưởng.

### Data ownership

- Restaurant Knowledge sở hữu ba descriptive values mới và domain/persistence
  boundary của chúng.
- Establishment Profile, Personnel, Planning, Pointage, Today, Tâches du jour
  và Formalités không sở hữu, cung cấp hoặc tiêu thụ các value này.
- Technical persistence representation là Design decision. Các slice hiện tại
  là compatibility evidence, không phải yêu cầu copy table/form shape.

### Tenancy và authorization

- Active user, organization, establishment và matching membership tiếp tục
  được derive server-side và fail closed.
- Establishment-owned cloud access tiếp tục yêu cầu cả organization và
  establishment scope.
- READ/MANAGE được consume không đổi; không cần permission, role, principal,
  section-specific tier hoặc admin/support bypass mới.

### Cross-module second-line check — 10 dimensions v3

| #   | Impact dimension                                     | Finding                                                                                                                     |
| --- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Read/write data owned by another module              | Không. Slice chỉ đọc/ghi descriptive Restaurant Knowledge của establishment; không đọc/ghi Personnel hoặc operational data. |
| 2   | Change or blur canonical ownership                   | Không. Restaurant Knowledge giữ canonical ownership; Establishment Profile và Personnel được giữ tách biệt.                 |
| 3   | Another module must consume/react/update             | Không. Không có consumer/reactive contract với Planning, Pointage, Today, Tâches du jour, Formalités hoặc module khác.      |
| 4   | Shared permission/security/tenancy/identity          | Chỉ consume contract READ/MANAGE đã accepted; không thay đổi grant matrix, trusted context hoặc identity semantics.         |
| 5   | Multiple runtimes                                    | Không. Chỉ cloud Backoffice; không có POS, Site Agent hoặc Display behavior.                                                |
| 6   | Legal/privacy/provider/external integration          | Không phát hiện impact mới vì slice không có employee-specific, training/onboarding state, provider hoặc external data.     |
| 7   | Accepted ADR/architecture/runtime/data boundary      | Không thay đổi. Change nằm trong ADR-007, cloud database và tenancy boundaries hiện có.                                     |
| 8   | Coordinated Product decisions across capabilities    | Không. Các non-relationship được explicit; không cần quyết định Product của Personnel hay operational module.               |
| 9   | Coordinated rollout/contract across pages/modules    | Không. Capability page-local, không thêm shared API/contract hay cross-page consumer.                                       |
| 10  | UI/UX across multiple pages requiring coordinated QA | Không. Chỉ page hiện có `Informations générales`; Browser QA sau này vẫn bắt buộc cho page này.                             |

Kết quả second-line check xác nhận classification `PAGE_LOCAL`. Nếu Design hoặc
Apply sau này cần bất kỳ dependency bị loại trừ nào, change phải dừng và trả về
`CROSS_MODULE` / `NEEDS REVIEW`.

### Quan hệ explicit với các module lân cận

- **Personnel/Salariés:** không employee dossier/field, role, contract, salary,
  acompte, congé, evaluation, discipline, competency, training history hoặc
  employee link.
- **Planning:** không schedule, shift, assignment, staffing rule hoặc template.
- **Pointage:** không attendance record, rule, anomaly hoặc inference.
- **Today / Tâches du jour:** không task, checklist, card, alert, handover hoặc
  follow-up item.
- **Formalités / onboarding / training:** `Transmission & intégration` chỉ là
  mô tả; không workflow, completion/progress state, acknowledgement, signature
  hoặc document generation.
- **Local/external boundaries:** không POS, Site Agent, Display, provider, AI,
  Marketing/social, embeddings hoặc vector DB.

## Lifecycle Baseline

Restaurant Knowledge hiện giữ nguyên:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

`PARTIAL` bao phủ ba slice đã triển khai; `Équipe & culture` và các family còn
lại chưa triển khai. Proposal, Analysis, future Specs hoặc implementation SHALL
NOT tự động promote bất kỳ lifecycle dimension nào.

## Requirement Readiness

Precise behavioral Specs có thể được viết mà không cần Product hoặc
durable-boundary decision mới. Scope đã xác định:

- đúng ba value và ý nghĩa descriptive, non-operational, non-HR;
- ownership và establishment semantic scope;
- optionality và valid all-empty state;
- manual view/edit, một explicit whole-slice save và no autosave;
- accepted READ/MANAGE behavior và grant matrix;
- explicit non-relationships và exclusions.

Không cần chọn schema, repository/table, API, shared contract hoặc Product
validation để mô tả các observable requirements đó. Những câu hỏi kỹ thuật hợp
lệ còn lại thuộc Design khi không thay đổi approved behavior.

Workflow conclusion: `READY_FOR_SPECS`.

## UI / UX Applicability

UI/UX bị ảnh hưởng vì composed page hiện có sẽ expose thêm một Restaurant
Knowledge section. Current page-pack governance vẫn áp dụng: route là
`EXISTING_PAGE`; real loaders, authorization, tenant scope, Profile behavior và
ba knowledge slices hiện có phải được bảo toàn. Specs có thể yêu cầu ba label,
view/edit states và một explicit save, nhưng SHALL NOT suy ra layout, counter,
validation, taxonomy, HR control hoặc operational control từ example content.

Page pack hiện chưa mô tả `Équipe & culture`. Page-pack update thuộc later
approved implementation/documentation scope, không thuộc Gate 1. Vì
`UI_AFFECTING: YES`, Browser QA với responsive, accessibility, role/state và
hashed screenshot evidence sẽ bắt buộc trước Gate 3.

## Conflicts and Unknowns

### Requirement-level conflicts

Không có remaining requirement-level `CONFLICT` hoặc `NEEDS REVIEW`.

### Non-blocking documentation drift

- `docs/PRODUCT_KNOWLEDGE.md` vẫn mô tả Restaurant Knowledge là not-started với
  ownership/permissions chưa giải quyết. Module Registry, page Product
  Knowledge, normative specs và current code cho thấy state hiện tại đã tiến
  xa hơn.

Đây là `CONFLICT` về broad routing/current-state documentation, không phải về
requirements của slice mới, nên không block Specs. Chỉ later approved
documentation scope mới được sửa source này; Analysis không chỉnh authority
document.

### Design-only unknowns

- Exact persistence shape/table/repository representation.
- Exact page-local component và server-boundary composition.
- Migration và rollback mechanics nếu persistence cần schema change.

Các lựa chọn này phải giữ approved boundaries. Nếu Design cần shared contract,
permission mới, tenant semantics hoặc canonical ownership thay đổi, employee
data/state, prohibited module dependency, legal/privacy decision, provider hoặc
cross-runtime behavior, workflow phải dừng và quay lại review.

## Analysis Conclusion

`READY_FOR_SPECS`

Bounded capability `restaurant-knowledge/team-culture` có thể chuyển sang delta
Specs sau explicit Gate 1 approval. Specs phải giới hạn ở ba descriptive values
đã phê duyệt, manual view/edit, independent optionality, valid all-empty state,
một explicit whole-slice save, no autosave, current READ/MANAGE authorization
và explicit HR/cross-module exclusions.

Đây là behavior-changing path và SHALL NOT dùng `skip_specs: true`. Không có
Specs, Design, Tasks hoặc implementation nào được phép trước Gate 1 approval.
