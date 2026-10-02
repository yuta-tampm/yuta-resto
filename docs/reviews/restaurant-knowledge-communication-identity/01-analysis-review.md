# Gate 1 — Product / Authority Review

Change: `restaurant-knowledge-communication-identity`  
Gate: `GATE 1 — PRODUCT / AUTHORITY REVIEW`  
Review status: `APPROVED`  
Created: `2026-09-02T17:08:23.2936546+02:00`  
Schema: `yuta-spec-driven`  
Analysis conclusion: `READY_FOR_SPECS`  
Cross-Module classification: `PAGE_LOCAL`  
Sensitive change: `YES`  
UI_AFFECTING: `YES`  
BROWSER_QA_REQUIRED_LATER: `YES`

Approval source: explicit current-user instruction  
Approval recorded by: Codex workflow  
Approved: `2026-09-02T17:55:57.2761478+02:00`

## Request and Bounded-Change Summary

Gate 1 được yêu cầu cho capability mới
`restaurant-knowledge/communication-identity` trên existing page
`/etablissement/informations-generales`. Scope chỉ gồm đúng ba descriptive
values `Ton & style de communication`, `Façon de s’adresser aux clients` và
`Éléments de langage & choses à éviter`: manual view/edit, từng value optional
độc lập, all-empty hợp lệ, một explicit whole-slice save và no autosave.

Restaurant Knowledge giữ canonical ownership; semantic scope là establishment;
Organization chỉ là tenancy/access envelope. Change chỉ consume
`restaurant-knowledge.read` và `restaurant-knowledge.manage` với current
OWNER/MANAGER grants và STAFF default denial. Không có Profile/Marketing
permission substitution, cross-module consumer, shared contract, external
provider hoặc technical representation decision trong Gate 1.

## Exact Proposal Content

```markdown
## Why

Restaurant Knowledge đã được phê duyệt ở Product Intent cho family `Identité
de communication`, nhưng page `Informations générales` hiện chỉ triển khai bốn
slice khác. Change page-local này bổ sung tri thức mô tả về cách establishment
muốn giao tiếp và thể hiện bản thân mà không biến nội dung thành Marketing,
social publishing, review automation, CRM hoặc generated content.

## What Changes

- Bổ sung đúng ba descriptive Restaurant Knowledge values trong slice
  `Identité de communication`: `Ton & style de communication`, `Façon de
s’adresser aux clients` và `Éléments de langage & choses à éviter`.
- Cho phép manual input, view và edit từng value; cả ba độc lập, optional và
  trạng thái all-empty hợp lệ.
- Cung cấp một explicit save duy nhất cho toàn bộ slice và không autosave.
- Giữ Restaurant Knowledge là canonical owner; dữ liệu có semantic scope theo
  establishment, còn Organization chỉ là tenancy/access envelope.
- Consume authorization contract hiện có: READ để view, MANAGE để edit/save;
  OWNER và MANAGER có cả hai operation, STAFF bị deny theo default policy.
- Giữ slice độc lập với Establishment Profile và không kế thừa
  `establishment.profile.read/manage` hoặc Marketing permission.
- Không tạo campaign, post, copy, template, schedule, publication setting,
  channel configuration hoặc Marketing repository dependency; Marketing không
  phải required source, consumer hoặc reactive dependency.
- Không đọc reviews/comments, derive identity từ Reputation, tạo/gửi review
  reply hoặc yêu cầu Reviews/Reputation consume các value.
- Không thêm AI generation, automatic learning/inference, prompts, provider,
  embeddings/vector storage, social/external channel integration, CRM/customer
  profile/segmentation hoặc customer-specific preference.
- Giữ `Éléments de langage & choses à éviter` là descriptive free text; không
  tạo moderation, prohibited-word enforcement, legal/compliance engine, claim
  approval hoặc automatic blocking.
- Không áp đặt required content, length, formatting, enum, taxonomy, preset,
  score, brand/sentiment rating, automatic classification hoặc template
  selection.
- Không định nghĩa table/repository representation, API, shared contract,
  migration mechanics hoặc component architecture trong Proposal; technical
  representation hợp lệ thuộc Design sau khi Specs được phê duyệt.

Không có breaking change được đề xuất.

## Capabilities

### New Capabilities

- `restaurant-knowledge/communication-identity`: Observable behavior của slice
  `Identité de communication`, gồm ownership/scope, READ/MANAGE, đúng ba
  descriptive values optional độc lập, manual view/edit, một whole-slice
  explicit save, no-autosave và các non-relationship bắt buộc với Marketing,
  Reviews/Reputation, AI, social/providers, CRM/customer data và runtime khác.

### Modified Capabilities

Không có. Change không sửa requirements của Restaurant Knowledge authorization,
Concept/Histoire, Cuisine/savoir-faire, Expérience client hoặc Équipe & culture
đã được chấp nhận.

## Impact

- Page được sở hữu: `apps/backoffice` route
  `/etablissement/informations-generales`.
- Domain/data boundary được sở hữu: Restaurant Knowledge trong cloud boundary
  hiện có; technical persistence representation chưa được chọn ở Gate 1.
- Authorization: chỉ consume `restaurant-knowledge.read` và
  `restaurant-knowledge.manage`; không thêm permission, role, principal hoặc
  admin/support bypass.
- Tenant boundary: giữ trusted server-derived organization + establishment
  context và active membership enforcement hiện tại.
- Existing capabilities phải được bảo toàn: Establishment Profile, Restaurant
  Knowledge authorization, Concept/Histoire, Cuisine/savoir-faire, Expérience
  client và Équipe & culture.
- Không có dependency hoặc consumer contract mới với Marketing,
  Reviews/Reputation, AI/automation, Social, CRM/customer data, POS/Site Agent,
  Display, public website hoặc external provider.
- UI bị ảnh hưởng trên một `EXISTING_PAGE`; Browser QA responsive,
  accessibility, role/state và screenshot-hash evidence sẽ bắt buộc trước Gate
  3, không thuộc Gate 1.
```

## Exact Analysis Content

```markdown
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
```

## Authorities Consulted

- Root, `apps/backoffice` và `packages/db-cloud` AGENTS instructions.
- `docs/AUTHORITY_MODEL.md`, `docs/CURRENT_STATE.md`,
  `docs/MODULE_REGISTRY.md`, `docs/LIFECYCLE_STATUS_MODEL.md`,
  OpenSpec normativity policy và current YUTA automated workflow.
- Product Knowledge Home, Establishment Product Knowledge,
  Informations générales Product Knowledge và accepted ADR-007.
- Tenancy, Authentication, Identity/Membership và Database Boundaries.
- Current normative Restaurant Knowledge authorization, Concept/Histoire,
  Cuisine/savoir-faire, Expérience client và Équipe & culture specs.
- Current Informations générales page pack.
- Current route composition, loaders, actions, page-local models/forms,
  authorization/tenant helpers, cloud schema/repository và relevant tests.
- Relevant Marketing/Content, Reviews/Reputation và AI/provider sources chỉ để
  kiểm tra non-relationships.

## Mandatory Cross-Module Check Result

Cả 10 dimensions đã được reassess trong Analysis:

1. không đọc/ghi data thuộc module khác;
2. canonical owner không đổi hoặc bị làm mờ;
3. không module khác bắt buộc consume/react/update;
4. không đổi shared permission/security/tenancy/identity contract;
5. không có multiple-runtime impact;
6. không legal/privacy/provider/external integration;
7. không đổi accepted ADR/architecture/data/runtime boundary;
8. không cần Product decisions phối hợp giữa capabilities;
9. không coordinated rollout/shared contract giữa modules/pages;
10. không multi-page UI/UX coordinated QA.

Kết luận: `PAGE_LOCAL`. Repository evidence không mâu thuẫn với initial
Product classification.

## Required Gate 1 Findings

- Current implementation: page hiện có Establishment Profile và bốn implemented
  Restaurant Knowledge slices; current Restaurant Knowledge permission helpers
  đã có READ/MANAGE và accepted grants.
- Communication Identity already exists anywhere: `NO` trong implementation,
  tests, schema, repository và migration; chỉ xuất hiện dưới dạng approved
  future/unimplemented Product Intent trong docs.
- Canonical owner: `Restaurant Knowledge`.
- Semantic scope: `establishment`; Organization là tenancy/access envelope.
- Authorization reuse: `restaurant-knowledge.read` để view và
  `restaurant-knowledge.manage` để edit/save; OWNER/MANAGER có cả hai, STAFF
  bị deny theo default.
- Establishment Profile: cùng composed page/trusted tenant context nhưng không
  chia sẻ owner, repository, schema hoặc permission.
- Marketing: không source, consumer, reactive dependency, campaign/content/
  template/publishing behavior hoặc repository dependency.
- Reviews/Reputation: không ingestion, derivation, reply generation,
  synchronization hoặc consumer relationship.
- AI/automatic learning: không generation, inference, learning, prompt/provider,
  embeddings/vector hoặc automatic canonical update.
- Social/external providers: không integration, credentials, channel config,
  publishing hoặc sync.
- CRM/customer data: không customer profile/preference/segmentation/linkage.
- Runtime impact: chỉ authenticated `apps/backoffice` và cloud boundary hiện
  có nếu triển khai; POS/Site Agent/Display/public runtime không bị ảnh hưởng.
- Legal/privacy: không implication mới được phát hiện; “choses à éviter” chỉ là
  descriptive free text, không compliance/moderation/approval engine.
- Lifecycle baseline: Product Decision `APPROVED`, Implementation `PARTIAL`,
  Environment `NOT_ENABLED`, Production Readiness `NOT_ASSESSED`, External
  Dependency `NOT_ASSESSED`.
- Documentation drift: `NONE` ảnh hưởng Gate 1.
- Remaining `CONFLICT`: `NONE`.
- Remaining `NEEDS REVIEW`: `NONE`.
- OpenSpec readiness: `READY_FOR_SPECS` sau explicit human Gate 1 approval.

## Sensitive and UI Classification

`Sensitive change: YES` vì một implementation tương lai có khả năng thay đổi
tenant-owned cloud schema/migration và đi qua authorization/persistence
boundary, dù Gate 1 không thay đổi permission hoặc tenancy contract.

`UI_AFFECTING: YES`. Nếu workflow đi đến implementation, Browser QA thực trên
existing authenticated route là bắt buộc trước Gate 3, với responsive,
accessibility, role/state và screenshot-hash evidence. Không có QA trong Gate 1.

## Conflicts, Needs Review, and Questions

- `CONFLICT: NONE`
- `NEEDS REVIEW: NONE`
- Product/authority questions requiring answers: `NONE`
- Deferrable Design-only questions: persistence/table/repository representation,
  migration/rollback mechanics và component structure. Chúng không được quyết
  định trong Gate 1.

## Artifact Integrity

Hash command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath <path>
```

- Proposal:
  `openspec/changes/restaurant-knowledge-communication-identity/proposal.md`
  - SHA-256:
    `a58e71eef2dbce764191dc0250cc812e00123fcb31fc2b7c98b5016db0e2d6c4`
- Analysis:
  `openspec/changes/restaurant-knowledge-communication-identity/analysis.md`
  - SHA-256:
    `6203a25f11b83f80af89ec5f20cfa4d98df23659ff1b82f9c8c86a17f4fa35fb`

## Repository Provenance

- Repository root: `D:\working\yuta\yuta-resto`
- HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`
- Worktree state before Gate 1 packet: dirty, 72 status entries.
- Pre-existing/unrelated dirty work was preserved. Gate 1 writes are limited to
  the new change directory and this review directory.

Exact `git status --short` snapshot before creating this packet:

```text
 M .agents/skills/yuta-finish-change/SKILL.md
 M .agents/skills/yuta-run-change/SKILL.md
 M apps/backoffice/next-env.d.ts
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx
 M apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts
 M apps/backoffice/test/concept-history-action.test.ts
 M apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json
 M apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json
 M apps/backoffice/test/restaurant-knowledge-loader.test.ts
 M docs/MODULE_REGISTRY.md
 M docs/PRODUCT_KNOWLEDGE.md
 M docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md
 M docs/features/establishment/README.md
 M docs/features/establishment/general-information/README.md
 M docs/reviews/README.md
 M docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md
 M docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md
 M docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md
 M docs/ui/pages/establishment-general-information/README.md
 M docs/ui/pages/establishment-general-information/UI_SPEC.md
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/restaurant-knowledge-repository.ts
 M packages/db-cloud/src/schema/restaurant-knowledge.ts
 M packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts
 M packages/db-cloud/test/schema.test.ts
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-fields.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-fields.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-fields.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/cuisine-know-how-model.ts
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/customer-experience-model.ts
?? apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/team-culture-model.ts
?? apps/backoffice/test/cuisine-know-how-action.test.ts
?? apps/backoffice/test/cuisine-know-how-fields.test.tsx
?? apps/backoffice/test/cuisine-know-how-form.test.tsx
?? apps/backoffice/test/cuisine-know-how-model.test.ts
?? apps/backoffice/test/customer-experience-action.test.ts
?? apps/backoffice/test/customer-experience-fields.test.tsx
?? apps/backoffice/test/customer-experience-form.test.tsx
?? apps/backoffice/test/customer-experience-model.test.ts
?? apps/backoffice/test/team-culture-action.test.ts
?? apps/backoffice/test/team-culture-fields.test.tsx
?? apps/backoffice/test/team-culture-form.test.tsx
?? apps/backoffice/test/team-culture-model.test.ts
?? docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md
?? docs/YUTA_QA_PROTOCOL.md
?? docs/YUTA_WORKFLOW_V3_UPDATE_REPORT.md
?? docs/chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md
?? docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md
?? docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md
?? docs/chatGPT/YuTa_Workflow_v3.pdf
?? docs/reviews/restaurant-knowledge-cuisine-know-how/
?? docs/reviews/restaurant-knowledge-customer-experience/
?? docs/reviews/restaurant-knowledge-team-culture/
?? docs/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
?? openspec/changes/archive/2026-08-31-restaurant-knowledge-cuisine-know-how/
?? openspec/changes/archive/2026-09-01-restaurant-knowledge-customer-experience/
?? openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture/
?? openspec/changes/restaurant-knowledge-communication-identity/
?? openspec/specs/restaurant-knowledge/cuisine-know-how/
?? openspec/specs/restaurant-knowledge/customer-experience/
?? openspec/specs/restaurant-knowledge/team-culture/
?? output/
?? packages/db-cloud/drizzle/0012_restaurant_knowledge_cuisine_know_how.sql
?? packages/db-cloud/drizzle/0013_restaurant_knowledge_customer_experience.sql
?? packages/db-cloud/drizzle/0014_restaurant_knowledge_team_culture.sql
?? packages/db-cloud/drizzle/meta/0012_snapshot.json
?? packages/db-cloud/drizzle/meta/0013_snapshot.json
?? packages/db-cloud/drizzle/meta/0014_snapshot.json
```

## Recommendation and Stop State

Recommendation:
`APPROVE_GATE_1_FOR_SPECS_IF_READY`.

Current stop state:
`GATE 1 — AWAITING_HUMAN_REVIEW`.

Specs, Design, Tasks, implementation plan, schema, migration, code, tests, QA,
sync, archive và Knowledge Consolidation không được tạo/thực hiện. Chỉ explicit
human Gate 1 approval cho đúng named change mới cho phép workflow tiến tới
Specs.
