# Change Analysis

## Scope and Change Type

Change này bổ sung một capability hành vi mới,
`restaurant-knowledge/communication-identity`, trên existing page
`/etablissement/informations-generales`. Phạm vi Product được giới hạn ở đúng
ba descriptive Restaurant Knowledge values:

1. `Ton & style de communication`;
2. `Façon de s’adresser aux clients`;
3. `Éléments de langage & choses à éviter`.

Ba value được nhập, xem và sửa thủ công; từng value độc lập và optional; trạng
thái all-empty hợp lệ; toàn slice có đúng một explicit save và không autosave.
Đây là change `PAGE_LOCAL`, `UI_AFFECTING: YES`, data-affecting và
security-sensitive vì nó sẽ lưu tenant-owned cloud data qua authorization
boundary hiện có. Với khả năng cần schema/migration ở giai đoạn triển khai,
classification cho workflow là `Sensitive change: YES`. Gate 1 không chọn
technical persistence representation, API, contract, migration mechanics hoặc
component architecture.

Discovery / Shaping bổ sung không cần thiết (`NO`): Product scope, canonical
owner, semantic scope, authorization operations, grant matrix, save semantics
và các non-relationship đã đủ rõ để viết behavioral Specs mà không suy đoán.

## Sources Consulted

- Repository và workflow authority: [root AGENTS](../../../AGENTS.md),
  [backoffice AGENTS](../../../apps/backoffice/AGENTS.md),
  [db-cloud AGENTS](../../../packages/db-cloud/AGENTS.md),
  [Authority Model](../../../docs/AUTHORITY_MODEL.md),
  [Automated Change Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md)
  và [OpenSpec Normativity Policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).
- Product Intent và lifecycle: [Product Knowledge Home](../../../docs/PRODUCT_KNOWLEDGE.md),
  [Current State](../../../docs/CURRENT_STATE.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md),
  [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md),
  [Establishment Product Knowledge](../../../docs/features/establishment/README.md),
  [Informations générales Product Knowledge](../../../docs/features/establishment/general-information/README.md)
  và [ADR-007](../../../docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md).
- Security và data boundary: [Tenancy](../../../docs/architecture/TENANCY.md),
  [Authentication](../../../docs/architecture/AUTHENTICATION.md),
  [Identity and Membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
  và [Database Boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md).
- Normative behavioral authority: [Restaurant Knowledge authorization](../../../openspec/specs/authorization/restaurant-knowledge/spec.md),
  [Concept/Histoire](../../../openspec/specs/restaurant-knowledge/concept-history/spec.md),
  [Cuisine/savoir-faire](../../../openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md),
  [Expérience client](../../../openspec/specs/restaurant-knowledge/customer-experience/spec.md)
  và [Équipe & culture](../../../openspec/specs/restaurant-knowledge/team-culture/spec.md).
- Existing-page UI authority: [page-pack index](../../../docs/ui/pages/establishment-general-information/README.md),
  [Product Scope](../../../docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md),
  [Data and Interaction Spec](../../../docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md),
  [UI Spec](../../../docs/ui/pages/establishment-general-information/UI_SPEC.md)
  và [Acceptance Checklist](../../../docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md).
- Implemented State evidence: current page composition, Restaurant Knowledge
  loaders/actions/page-local models and forms, authorization helpers, cloud
  schema/repository, and their focused tests under `apps/backoffice` and
  `packages/db-cloud`. Marketing/Content, Reviews/Reputation và current
  AI/provider documentation were inspected only to test the proposed
  non-relationships.

## Authority and Product Decision

ADR-007 cùng Establishment và Informations générales Product Knowledge là
controlling Product Intent authority cho family `Identité de communication`.
Bounded request hiện tại phê duyệt chính xác initial slice behavior nêu trên;
Analysis không mở rộng nó sang những Restaurant Knowledge families khác.

Restaurant Knowledge là canonical owner của cả ba value và của semantic
meaning của chúng. Semantic scope là establishment. Organization chỉ là
tenancy/access envelope, không phải semantic owner. Page composition không
chuyển ownership cho Establishment Profile, Marketing hoặc module khác.

Capability consume authorization contract hiện có:

- view yêu cầu `restaurant-knowledge.read`;
- edit và explicit save yêu cầu `restaurant-knowledge.manage`;
- `OWNER` và `MANAGER` có READ + MANAGE;
- `STAFF` không có Restaurant Knowledge access theo default policy.

READ và MANAGE vẫn là hai logical operations riêng. Profile permissions,
Marketing permissions, browser-supplied organization/establishment/role/
permission, hoặc admin/support identity không thay thế Restaurant Knowledge
authorization và active tenant membership. Change không thêm permission,
role, principal, bypass hoặc tenant semantics.

## Current Implemented State

Repository hiện compose Establishment Profile và bốn Restaurant Knowledge
slices trên route này: Concept/Histoire, Cuisine/savoir-faire, Expérience
client và Équipe & culture. Các slice đó có page-local forms/models/actions,
loaders, focused tests và dedicated cloud persistence/repository operations.
Permission helpers hiện đã biểu diễn `restaurant-knowledge.read` và
`restaurant-knowledge.manage` với grant matrix OWNER/MANAGER và default denial
cho STAFF.

Communication Identity chưa tồn tại trong current implementation: không có
page section/form/model, loader, save action, focused test, schema object,
repository operation hoặc migration cho slice này. Những lần xuất hiện của
`Identité de communication` trong current documentation chỉ mô tả approved
future Product Intent/unimplemented family; chúng không phải implementation
hoặc deployment evidence.

Không có runtime/deployment evidence chứng minh capability này đã được enable.
Analysis cũng không xác nhận Production Readiness.

## Affected Boundaries

### Runtime, data, tenancy và authorization

- Runtime bị ảnh hưởng về sau chỉ là authenticated `apps/backoffice` page và
  cloud server boundary hiện có.
- Canonical data boundary vẫn thuộc Restaurant Knowledge trong cloud
  persistence; technical representation là câu hỏi cho Design sau Specs.
- Mọi read/write tenant-owned data phải dùng trusted server-derived
  `organizationId` + `establishmentId`, active membership và fail-closed
  authorization trước repository access/persistence.
- Public website, `apps/yuta-pos`, `apps/site-agent` và `apps/yuta-display`
  không bị ảnh hưởng. Không có external provider/device boundary.

### Mandatory Cross-Module second-line check

| #   | Dimension                                                | Repository finding                                                                                                                                                                       |
| --- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Read/write data do module khác sở hữu?                   | Không. Slice chỉ đọc/ghi canonical Restaurant Knowledge của chính nó; không đọc/ghi Profile, Marketing, Reviews, CRM/customer hoặc operational data.                                     |
| 2   | Canonical ownership bị đổi hoặc làm mờ?                  | Không. Restaurant Knowledge giữ ownership; establishment là semantic scope; Organization chỉ là tenancy/access envelope.                                                                 |
| 3   | Module khác bắt buộc consume/react/update?               | Không. Không có required consumer, reactive update hoặc synchronization.                                                                                                                 |
| 4   | Shared permission/security/tenancy/identity bị tác động? | Không thay đổi contract. Change chỉ consume READ/MANAGE và trusted TenantContext hiện có; Profile/Marketing permission không thay thế.                                                   |
| 5   | Multiple runtime impact?                                 | Không. Chỉ `apps/backoffice` và cloud persistence boundary hiện có; POS/Site Agent/Display/public runtime bị loại trừ.                                                                   |
| 6   | Legal/privacy/provider/external integration?             | Không được phát hiện trong approved scope. `Choses à éviter` chỉ là descriptive free text, không phải compliance/moderation/claim-approval engine; không provider hoặc external channel. |
| 7   | Accepted ADR/architecture/data/runtime boundary đổi?     | Không. ADR-007 và cloud/tenant boundaries được giữ nguyên; lựa chọn representation chưa được đưa ra.                                                                                     |
| 8   | Cần Product decision phối hợp giữa capabilities?         | Không. Marketing, Reviews/Reputation, AI, CRM/customer và other Restaurant Knowledge families đều là explicit non-relationships.                                                         |
| 9   | Cần coordinated rollout/contract giữa module/page?       | Không. Không shared API/contract, provider rollout hoặc cross-page contract trong scope.                                                                                                 |
| 10  | Cần coordinated multi-page UI/UX QA?                     | Không. Đây là một section độc lập trên existing page; Browser QA later chỉ cần bảo toàn composed page và current sections.                                                               |

Kết quả second-line check: `PAGE_LOCAL`. Không có repository evidence nào buộc
phải chuyển thành `CROSS_MODULE`.

### Explicit relationships and non-relationships

- **Establishment Profile:** chỉ cùng page và cùng trusted tenant context;
  không chia sẻ canonical owner, repository, schema hoặc permission.
- **Marketing / Content:** không campaign, post, copy generation, template,
  schedule, publishing, channel configuration, repository dependency, required
  source hoặc consumer.
- **Reviews / Reputation:** không đọc/ingest reviews/comments, derive identity,
  generate/send reply, synchronize hoặc required consumer relationship.
- **AI / automatic learning:** không generation, suggestion, learning,
  inference, prompt/provider, embeddings, vector storage hoặc automatic
  canonical update.
- **Social / external providers:** không Facebook, Instagram, Google Business,
  TikTok, website publishing, credentials hoặc external synchronization.
- **CRM / customer data:** không profile, preference, segmentation, linkage
  hoặc personalization rule theo customer.
- **Legal / privacy:** không legal validation, regulatory enforcement,
  prohibited-word moderation, claim approval hoặc automatic blocking. Nếu một
  implementation tương lai cần authority này, workflow phải dừng ở
  `NEEDS REVIEW`/Control Tower thay vì mở rộng change.
- **POS / Site Agent / Display và other Restaurant Knowledge families:** không
  dependency, copy, synchronization hoặc runtime impact.

## Lifecycle Baseline

Current bounded lifecycle row cho Restaurant Knowledge là:

- Product Decision: `APPROVED`;
- Implementation: `PARTIAL`;
- Environment: `NOT_ENABLED`;
- Production Readiness: `NOT_ASSESSED`;
- External Dependency: `NOT_ASSESSED`.

`PARTIAL` phản ánh bốn implemented slices hiện tại trong khi Communication
Identity và các family còn lại chưa được triển khai. Gate 1 không promote bất
kỳ lifecycle dimension nào.

## Requirement Readiness

Behavioral Specs có thể được viết chính xác mà không đoán: labels, cardinality,
optionality, all-empty state, manual view/edit, whole-slice explicit save,
no-autosave, canonical owner, establishment scope, tenant envelope,
READ/MANAGE operations, current grants và các prohibited relationships đều đã
được quyết định.

Spec sau Gate 1 phải giữ đúng descriptive behavior và không đưa vào required
content, length/format validation, enum, taxonomy, preset, score, rating,
classification, analytics, template selection, generated suggestions hoặc
technical representation.

Workflow conclusion: `READY_FOR_SPECS`.

## UI / UX Applicability

`UI_AFFECTING: YES`. Slice thuộc existing page pack
`docs/ui/pages/establishment-general-information/`; nó phải là một page-local,
independent section và phải bảo toàn Establishment Profile cùng bốn Restaurant
Knowledge sections hiện hữu. Không fixture hóa auth/data/mutations.

Nếu change đi đến implementation, real Browser QA trước Gate 3 là bắt buộc,
gồm responsive coverage, basic accessibility, relevant role/state coverage và
screenshot evidence kèm hashes. Gate 1 không tạo UI design, tests hoặc QA.

## Conflicts and Unknowns

- Remaining `CONFLICT`: `NONE`.
- Remaining `NEEDS REVIEW`: `NONE` ở requirement/Product/authority level.
- Documentation drift: `NONE` ảnh hưởng Gate 1. Current Product Knowledge và
  Module Registry mô tả đúng bốn implemented slices và Communication Identity
  là future/unimplemented; current page pack chưa mô tả section này là phù hợp
  với Implemented State hiện tại.
- Deferrable Design-only unknowns: exact persistence representation,
  table/repository form, migration/rollback mechanics và component structure.
  Chúng không thay đổi Product behavior và không được quyết định trong
  Analysis.

## Analysis Conclusion

Bounded scope được xác nhận là `PAGE_LOCAL`. Capability mới
`restaurant-knowledge/communication-identity` có thể tiến tới behavioral Specs
sau explicit human Gate 1 approval. Không có blocker Product, authority,
security, ownership, tenancy, compatibility hoặc cross-module đang mở.

Kết luận: `READY_FOR_SPECS`.

Change này không dùng `skip_specs: true`. Analysis không phê duyệt Specs,
không chọn implementation architecture và không cho phép tiến tới Design,
Tasks hoặc Apply.
