Change: preserve-establishment-owner-invariant

Gate: 1 — Proposal / Analysis

Review status: APPROVED

Created: 2026-09-05T23:29:10.0261603Z

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization invariant and concurrency integrity

# Gate 1 — Establishment OWNER Preservation

## Approval Record

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-05T23:43:41Z

Người dùng explicit APPROVE Gate 1 cho change này và exact Proposal SHA-256
`7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8`,
Analysis SHA-256
`637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2`.
Đã kiểm tra lại exact path set và hashes trước khi ghi approval; đều khớp.

Quyết định được chấp nhận: invariant theo từng
`organizationId + establishmentId`, giữ ít nhất một active OWNER membership;
bounded repair bao gồm existing-user attachment bypass và confirmed concurrent
membership-mutation race. Giữ nguyên exclusions: attach/reactivation Product
semantics, usable-OWNER policy, global account lifecycle, authorization grants,
schema/migrations, Personnel và local apps.

Approval cho phép tạo delta Specs của
`authorization/establishment-owner-preservation` và chỉ chuẩn bị Gate 2.
Cơ chế serialization/locking chưa được phê duyệt; phải review tại Design và
sensitive-design gate. Chưa cho phép Design, Tasks, Apply, deploy, sync hoặc
archive. Không promote lifecycle hoặc sửa current authority documents.

Các phần mô tả lượt tạo packet và exact Proposal/Analysis bên dưới được giữ
như historical review context; câu chưa có approval trong artifacts phản ánh
thời điểm soạn, không phủ định approval record này. Approved source bytes
không được viết lại để cập nhật trạng thái.

## Request and Bounded Change

Người dùng yêu cầu tiếp tục Analysis và chuẩn bị Gate 1 cho bounded Cloud
Access Management repair đã có proposal. Lượt này chỉ tạo Analysis và packet,
không sửa proposal có sẵn, không tạo Specs/Design/Tasks hoặc implementation.

Hai implementation gaps trong cùng invariant:

- Existing-user attachment có thể ghi đè active OWNER cuối cùng.
- Hai production membership edits đồng thời có thể cùng vượt guard và để
  establishment không còn active OWNER; diagnostic classification
  `CONFIRMED_RACE`.

Phạm vi review là edit và attach trong current organization/establishment
management scope, giữ active OWNER theo từng establishment, kể cả concurrency
và atomic batch failure. Không redesign attachment/reactivation, actor
permissions, global identity hoặc các module khác.

## Provenance and Adoption

- Repository: `D:\working\yuta\yuta-resto`.
- HEAD tại lúc bắt đầu:
  `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Đã chạy `git status --short`; checkout có nhiều thay đổi không thuộc change.
  Không cleanup, stage, commit hoặc sửa các thay đổi đó.
- Pre-existing artifacts: `.openspec.yaml`, `proposal.md`.
- Missing trước lượt này: `analysis.md`, mọi delta Specs, `design.md`,
  `tasks.md`, toàn bộ review packets của change.
- Được tạo trong lượt này: `analysis.md` và packet này.
- Proposal hash giữ nguyên so với lần tạo proposal:
  `7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8`.
- Hai production files chính được kiểm tra lại, giữ cùng SHA-256 với diagnostic:

| Path                                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/actions.ts` | `18974d11ce7a3d199ab66f1f12a62462370877957c9ebc34da2f7933bb532767` |
| `packages/db-cloud/src/tenant-user-repository.ts`                                  | `bedd4b2f7420eb7091d9c09b4a68a87fc725331da27db0616b74821b3cf03e59` |

## Decision Requested

Reviewer cần review ba điểm, không chỉ đọc trạng thái CLI:

1. Chấp nhận canonical scope cho bounded repair là từng establishment trong
   organization; active OWNER ở establishment khác không thay thế target.
   `WORDING CONFLICT` trong AUTHENTICATION được giữ lại để review, không dùng
   câu ở cấp organization để bỏ bảo vệ cụ thể ở DATA_MODEL và
   IDENTITY_AND_MEMBERSHIP.
2. Giữ existing valid attach/upsert/reactivation behavior; không đổi phép đếm
   active membership thành usable-principal policy; không mở rộng Product,
   authorization mapping, schema, UI redesign hoặc account lifecycle.
3. Review cả attachment bypass và confirmed edit concurrency race trong cùng
   bounded repair, với regression contract cho edit/attach và atomic failure.
   Cơ chế serialization cụ thể chưa được chốt ở Gate 1.

Nếu đồng ý, explicit approval chỉ cho phép viết delta Specs của
`authorization/establishment-owner-preservation`, rồi dừng tại Gate 2.
Không cho phép Design, Tasks, Apply, deploy, normative sync hoặc archive.

Approval đề nghị phải nêu change/Gate 1, chấp nhận scope establishment,
exclusions và exact artifact version trong hash table bên dưới.
Tại thời điểm tạo packet chưa có approval; approval hiện tại được ghi ở
Approval Record. Từ “tiếp”, checks hoặc file existence không thay thế decision.

## Authority Review and Open Items

| Item                                         | Evidence / disposition                                                                                                                                                                                                                             |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWNER scope                                  | DATA_MODEL dòng 119 và IDENTITY_AND_MEMBERSHIP dòng 32–35 nói establishment. AUTHENTICATION dòng 127–128 nói organization. Đề xuất giữ yêu cầu cụ thể theo establishment; chưa tìm thấy requirement đối lập cho phép zero OWNER tại establishment. |
| `WORDING CONFLICT`                           | Non-blocking wording discrepancy theo Analysis, vẫn cần reviewer xác nhận scope; không normalize authority docs hoặc action copy trong lượt này.                                                                                                   |
| Broader Product `NEEDS REVIEW`               | Authentication và Access workflow approval vẫn chưa được established đầy đủ. Bounded invariant repair không promote broader Product Decision.                                                                                                      |
| Disabled global user                         | `RELATED SECURITY QUESTION / NEEDS SECURITY / PRODUCT DECISION`; scoped out. Không đổi active-membership invariant thành usable-principal invariant.                                                                                               |
| Attachment semantics                         | Có nên bỏ existing-membership upsert/reactivation là quyết định Product riêng; không giải quyết trong repair.                                                                                                                                      |
| Concurrency mechanism                        | Dành cho Design và sensitive-design gate sau approved Specs, không được mặc định shared validator đơn thuần đủ an toàn.                                                                                                                            |
| UI applicability                             | Không đề xuất layout/form/API redesign, nhưng outcome lỗi/thành công thay đổi. Phải đánh giá UI_AFFECTING/BROWSER_QA_REQUIRED trước Apply, không tự miễn Browser QA.                                                                               |
| Production incidence / existing damaged data | UNVERIFIED; không production claim, migration, backfill hoặc recovery operation.                                                                                                                                                                   |

Không có requirement-level blocker theo Analysis hiện tại. Nếu reviewer không
chấp nhận scope hoặc exclusions, chuyển thành `CHANGES_REQUESTED`, revise
chỉ theo authorization, lập packet với hashes mới và review lại trước Specs.

Authorities consulted gồm Authority Model, current Identity / Access Product
Knowledge, DATA_MODEL, IDENTITY_AND_MEMBERSHIP, AUTHENTICATION, Module Registry,
Lifecycle Status Model, root/db-cloud instructions, activation/normativity
policies và review/workflow protocol. Danh sách source links đầy đủ nằm trong
Analysis exact content bên dưới.

## Evidence Strength and Limits

Diagnostic ngày 2026-09-06 được ghi trong task, không rerun ở lượt planning này:

| Evidence                                    | Observed result                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Attachment, actual repository / valid actor | Target OWNER count 1 -> 0, role STAFF, other-establishment membership unchanged                                         |
| Sequential edit control                     | SUCCESS / LAST_OWNER_REQUIRED; one OWNER remains; one audit commit                                                      |
| Controlled concurrent edits                 | Two distinct backends observed waiting at actual UPDATE; after release SUCCESS / SUCCESS, zero OWNER, two audit commits |

Concurrency environment: disposable PostgreSQL 17.10, read committed.
Actor được actual sign-in/session/tenant validation; target thuộc
server-derived management allowlist trong cùng organization. Không cần
authentication bypass hoặc unauthorized cross-organization access.

Diagnostic containers đã bị hủy. Không có committed harness hoặc standalone
runtime log trong change. Packet ghi nhận bằng chứng từ task, không giả vờ
đã lưu hoặc chạy lại evidence đó. Những assertions này không thay thế future
deterministic regression tests, Browser QA hoặc production verification.

Current source search chỉ thấy foundation last-owner suspension tests;
không thấy production attach/concurrency coverage. Không chạy test suites
trong lượt này và không ghi chúng PASS.

## Checks Run for This Planning Step

| Command                                                                                                                                                                                                                                     | Result                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `openspec status --change preserve-establishment-owner-invariant --json`                                                                                                                                                                    | proposal/analysis done, specs ready, design/tasks blocked; schema yuta-spec-driven           |
| `openspec instructions analysis --change preserve-establishment-owner-invariant --json`                                                                                                                                                     | Read before creating Analysis; proposal dependency read and preserved                        |
| `pnpm docs:check`                                                                                                                                                                                                                           | Exit 0; 36 current documents checked                                                         |
| `pnpm architecture:check`                                                                                                                                                                                                                   | Exit 0                                                                                       |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                            | Exit 0                                                                                       |
| `pnpm exec prettier --check openspec/changes/preserve-establishment-owner-invariant/proposal.md openspec/changes/preserve-establishment-owner-invariant/analysis.md openspec/changes/preserve-establishment-owner-invariant/.openspec.yaml` | Exit 0                                                                                       |
| `openspec validate preserve-establishment-owner-invariant --strict`                                                                                                                                                                         | Exit 1: no delta specs yet; intentionally incomplete at Gate 1, not a strict-validation PASS |

Không thêm fake specs hoặc `skip_specs: true` để làm validation xanh.
Raw CLI specs-ready không cấp YUTA approval. Tests/builds, Browser QA và
repository-wide format check không chạy ở planning-only step; scoped format
được kiểm tra, không broaden cleanup.

## Reviewed Artifact Integrity

Hash algorithm: SHA-256, exact on-disk bytes, lowercase hexadecimal.
Exact command used for each path:

```powershell
(Get-FileHash -LiteralPath <repository-relative-path> -Algorithm SHA256).Hash.ToLowerInvariant()
```

Sorted exact reviewed path set:

| Artifact                                                              | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/preserve-establishment-owner-invariant/analysis.md` | `637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2` |
| `openspec/changes/preserve-establishment-owner-invariant/proposal.md` | `7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8` |

Trước mọi resume, phải kiểm tra lại path set và hashes; byte drift làm approval
không còn áp dụng. Các source excerpts bên dưới là exact artifact content,
không phải một bản rewrite của Proposal hoặc Analysis.

## Exact Proposal

<!-- BEGIN EXACT proposal.md -->

```text
## Why

Cloud Access Management chưa bảo vệ nhất quán invariant giữ active OWNER cuối
cùng của mỗi establishment: existing-user attachment có thể bỏ qua guard, còn
hai membership edits đồng thời có thể cùng vượt qua guard rồi để lại zero
active OWNER. Hai lỗi đã được diagnostic trên PostgreSQL dùng một lần xác
nhận; cần một bounded repair trước khi coi invariant này được bảo vệ đầy đủ.

## What Changes

- Bảo vệ active OWNER cuối cùng trong cùng `organizationId + establishmentId`
  trên cả membership edit và existing-user attachment; OWNER ở establishment
  khác không được tính thay.
- Áp dụng cùng quy tắc bảo vệ cho các transition hiện có, giữ nguyên attachment
  upsert/reactivation semantics đối với transition hợp lệ, không đổi actor
  permissions, management allowlist hoặc self-protection.
- Bảo đảm các membership mutations đồng thời trong cùng establishment không
  cùng thành công nếu kết quả tổng hợp loại bỏ mọi active OWNER. Với hai OWNER
  ban đầu và hai yêu cầu loại bỏ họ, kỳ vọng một `SUCCESS`, một
  `LAST_OWNER_REQUIRED`, và còn một active OWNER.
- Giữ transaction atomicity: batch nhiều establishments có một target vi phạm
  phải rollback toàn bộ; không để lại success audit hoặc side effects từ
  transaction bị rollback. Membership ngoài requested scope không đổi.
- Bổ sung deterministic regression coverage qua production repository cho
  edit, attach, edit–edit, edit–attach và attach–attach, cùng allowed/denied
  scope, batch rollback và existing-user identity/password preservation.
- Đề xuất cập nhật documentation trong implementation change để mô tả chính
  xác invariant và transaction semantics đã được review; không tạo Product
  policy mới. Wording conflict phải được review trước khi chỉnh authority.

## Capabilities

### New Capabilities

- `authorization/establishment-owner-preservation`: behavioral contract hẹp
  cho việc giữ active OWNER cuối cùng qua Cloud Access Management mutations,
  bao gồm concurrency và atomic failure. Đây là spec coverage mới cho một
  invariant hiện hữu, không phải một Product workflow mới. Main-spec inventory
  hiện chưa có capability tương ứng; chỉ có các authorization specs riêng của
  Restaurant Knowledge và Formalités.

### Modified Capabilities

Không có main-spec capability hiện hữu cần sửa trong phạm vi đề xuất này.
Không dùng `skip_specs: true`: repair thay đổi kết quả quan sát được của các
thao tác hiện đang thành công sai, và cần contract bảo vệ có thể kiểm chứng.

## Impact

### Ownership and boundaries

- Classification đề xuất: `PAGE_LOCAL`, thuộc Cloud Identity & Access / Access
  Management tại `/parametres/utilisateurs-acces`. Đây không phải change của
  module Establishment Profile dù invariant được partition theo establishment.
- Production boundary dự kiến:
  [tenant-user-repository.ts](../../../packages/db-cloud/src/tenant-user-repository.ts).
  Backoffice action hiện có là consumer; không dự kiến đổi action signature,
  transport schema, UI hoặc role/permission mapping.
- Test boundary dự kiến: thêm focused integration coverage trong
  `packages/db-cloud/test/tenant-user-repository.integration.test.ts`, dùng
  disposable PostgreSQL và integration-test guard hiện có.
- Không đổi database schema, migrations, global identity model, authentication
  contract, tenancy, dependencies hoặc runtime ownership. Không thay đổi
  Personnel, các domain modules khác, POS, Site Agent hoặc Display.
- Cơ chế serialization cụ thể, lock ordering và rollback/deployment risks
  thuộc Design sau các prerequisite/gate; proposal này chưa chốt implementation.
  Nếu thiết kế đòi mở rộng shared permission/security semantics, schema hoặc
  owner khác, phải dừng và phân loại lại scope.

### Authority and evidence

- [DATA_MODEL](../../../docs/architecture/DATA_MODEL.md) và
  [IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md)
  yêu cầu giữ active OWNER theo establishment.
- `WORDING CONFLICT`: [AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md)
  dùng organization trong câu last-owner; action error cũng dùng organization.
  Diagnostic đề xuất establishment là scope chuẩn, phù hợp hai architecture
  sources trên và query hiện tại. Analysis/Gate 1 phải ghi nhận và review rõ
  kết luận này; proposal không tự sửa hoặc thay thế authority.
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md)
  giữ broader Access workflow Product Decision ở `NEEDS REVIEW`. Bounded
  invariant repair không phê duyệt toàn bộ workflow hoặc nâng lifecycle status.
- Diagnostic trong task ngày 2026-09-06 xác nhận attachment làm OWNER count
  `1 -> 0`. Diagnostic concurrency dùng PostgreSQL 17.10, `read committed`,
  actual repository và actor/context hợp lệ: sequential control trả
  `SUCCESS / LAST_OWNER_REQUIRED`, còn hai UPDATE được quan sát cùng chờ tại
  row-lock barrier trả `SUCCESS / SUCCESS`, OWNER count `2 -> 0`, hai audit
  commits sau khi thả khóa.
- Runtime evidence trên là disposable diagnostic được ghi trong task, không
  phải production observation, browser QA hoặc committed regression tests.
  Containers đã bị hủy; các tests bảo vệ fix vẫn phải được bổ sung và chạy sau
  khi có implementation authorization.

### Non-goals and approval boundary

- Không quyết định attach có nên trở thành create-only/no-op/reject, không
  redesign reactivation hoặc ownership transfer.
- Không nâng invariant từ active OWNER membership thành usable OWNER principal.
  Việc count membership của DISABLED global user vẫn là câu hỏi Security /
  Product riêng, chưa được giải quyết bởi repair này.
- Không quyết định account lifecycle, invitation, recovery delivery,
  multiple-active-reset-token policy, custom roles hoặc audit requirements mới.
- Không repair/backfill dữ liệu đã có zero OWNER; không chạy trên persistent
  development data, deploy, sync/archive hoặc sửa unrelated working-tree work.
- Artifact này là proposal chưa được duyệt, không phải authority hoặc quyền
  triển khai. Theo [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), cần Analysis
  và Gate 1, Specs và Gate 2 trước Design; security/concurrency design cần
  sensitive-design review trước Tasks/Apply.
```

<!-- END EXACT proposal.md -->

## Exact Analysis

<!-- BEGIN EXACT analysis.md -->

```text
# Change Analysis

## Scope and Change Type

Change: `preserve-establishment-owner-invariant`.

Behavior-changing, security-sensitive repair trong Cloud Identity & Access /
Access Management. Phạm vi là các production membership mutations tại
`/parametres/utilisateurs-acces`: edit và existing-user attachment. Không phải
refactor thuần túy; thao tác đang thành công sai sẽ bị từ chối khi làm mất active
OWNER cuối cùng. Không tạo Product workflow mới hoặc mở rộng quyền quản trị.

Classification: `PAGE_LOCAL` trong owning Access Management capability.
`Sensitive change: YES` vì authorization invariant và concurrency integrity.
Không quyết định cơ chế khóa, kiến trúc implementation hoặc tasks ở Analysis.

## Sources Consulted

- [Proposal hiện tại](proposal.md), giữ nguyên byte khi tiếp nhận change.
- Root [AGENTS.md](../../../AGENTS.md), [documentation index](../../../docs/README.md),
  [CURRENT_STATE](../../../docs/CURRENT_STATE.md) và
  [db-cloud instructions](../../../packages/db-cloud/AGENTS.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), đặc biệt Authorization /
  Security, conflict handling và specificity.
- [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md), các dòng Authentication,
  Tenancy và Access / membership; [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [DATA_MODEL](../../../docs/architecture/DATA_MODEL.md), mục Tenant roles;
  [IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
  mục Implemented scope; [AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md),
  mục User and membership administration.
- [Production membership repository](../../../packages/db-cloud/src/tenant-user-repository.ts),
  [Backoffice actions](<../../../apps/backoffice/src/app/(authenticated)/parametres/utilisateurs-acces/actions.ts>)
  và [server session boundary](../../../apps/backoffice/src/server/auth/session.ts).
- [Membership schema](../../../packages/db-cloud/src/schema/tenancy.ts),
  [foundation repository](../../../packages/db-cloud/src/tenant-foundation-repository.ts),
  [foundation integration tests](../../../packages/db-cloud/test/tenant-foundation.integration.test.ts)
  và [foundation unit tests](../../../packages/tenant/test/foundation.test.ts).
- [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
  và [review-packet protocol](../../../docs/reviews/README.md).

Main-spec path inventory được kiểm tra; chưa có owner-preservation spec.
Hai authorization capabilities đang có là Restaurant Knowledge và Formalités,
không phải authority cho việc thay đổi membership lifecycle trong change này.

## Authority and Product Decision

Controlling question: Authorization / Security, không chỉ Product Intent.

DATA_MODEL dòng 119 cấm downgrade/suspend active OWNER cuối cùng của
establishment. IDENTITY_AND_MEMBERSHIP dòng 32–35 yêu cầu mỗi establishment
giữ một active OWNER. Đây là authority hiện hữu cho bounded repair; code hoặc
diagnostic chỉ chứng minh implementation không bảo vệ đầy đủ yêu cầu đó.

AUTHENTICATION dòng 127–128 diễn đạt last-owner theo organization.
Ghi `WORDING CONFLICT` về cách mô tả scope, nhưng chưa tìm thấy requirement nào
cho phép establishment có zero active OWNER khi organization vẫn còn OWNER.
Giữ OWNER theo từng establishment trong organization đáp ứng yêu cầu cụ thể
hơn; câu ở cấp organization không được dùng để bỏ bảo vệ establishment.
Analysis không sửa các nguồn authority hoặc thông báo UI để tự giải quyết wording.

Scope đề xuất cho review là `organizationId + establishmentId`, đếm
`role = OWNER AND membership.status = active`. OWNER tại establishment khác
không thay thế OWNER của target establishment. Khái niệm usable principal,
global account disable hoặc availability của một con người không được thêm
vào invariant trong change này.

Broader Authentication / Access workflow Product Decision vẫn chưa rõ trong
Module Registry. Khôi phục security invariant không phê duyệt toàn bộ attach,
invitation, reactivation, account lifecycle hoặc support workflow. Yêu cầu
giữ compatibility của các transition hợp lệ là giới hạn của repair, không
biến implementation hiện có thành Product authority mới.

User đã cho phép diagnostic và soạn planning. Chưa có Gate 1 approval cho
exact proposal/analysis bytes, Specs approval hoặc implementation authorization.

## Current Implemented State

### Production paths

- `createOrAttachUser`, repository dòng 112–235: kiểm tra requested role,
  requested establishments trong allowlist và active organization-scoped
  establishment rows; existing global user phải ACTIVE; chặn self-attachment;
  MANAGER không được sửa existing OWNER/MANAGER.
- Existing-membership conflict branch dòng 212–219 ghi đè role và status active
  trên khóa user/organization/establishment, không thực thi last-owner check.
  Membership suspended có thể được reactivate qua nhánh này.
- `updateMembership`, dòng 237–368: chặn current-session membership; kiểm tra
  target trong organization/establishment allowlist và role restrictions;
  đếm OWNER active khác theo đúng target establishment trước demotion/suspension.
  Không có OWNER khác thì ném `LAST_OWNER_REQUIRED`.
- Edit update, scoped session revocation khi suspend và
  `tenant.membership.updated` audit cùng transaction. Attach ghi
  `tenant.user.attached`; existing identity/password không được thay thế.
- Action lấy actor, organization, current membership và management scope từ
  trusted context. OWNER có scope các active establishments trong current
  organization; MANAGER chỉ STAFF tại selected establishment. System role
  không tự cấp quyền và browser claims không phải authority.

Membership schema có composite uniqueness user/organization/establishment,
không có constraint bảo vệ tổng số OWNER. Owner-count không join global users.
Foundation repository có target-row lock và guard tương tự qua tenant service,
nhưng không phải production mutation path được Backoffice action gọi.

### Existing test evidence

Tìm thấy last-owner suspension tests qua foundation unit/integration paths.
Không tìm thấy focused tests cho `createTenantUserRepository`,
`createOrAttachUser`, production last-owner demotion hoặc concurrency của hai
production mutation paths. Test coverage ở foundation không thay thế bằng
chứng cho production Access Management repository.

Không chạy lại test suites trong bước Analysis; không tuyên bố chúng PASS.

### Dated diagnostic evidence and limits

Diagnostic trong task ngày 2026-09-06, sử dụng fixtures tổng hợp và database
dùng một lần, đã ghi nhận:

| Scenario                             | Observed result                                                  |
| ------------------------------------ | ---------------------------------------------------------------- |
| Attach sole OWNER thành STAFF        | OWNER count `1 -> 0`; membership khác của target user không đổi  |
| Hai edits tuần tự, ban đầu hai OWNER | `SUCCESS / LAST_OWNER_REQUIRED`; còn một OWNER; một audit commit |
| Hai edits đồng thời có kiểm soát     | `SUCCESS / SUCCESS`; OWNER count `2 -> 0`; hai audit commits     |

Concurrency diagnostic chạy actual production repository trên PostgreSQL
17.10, isolation `read committed`, với actor được sign-in, session validation
và trusted tenant resolution. Actor OWNER tại A được phép quản lý targets tại B
trong cùng organization; không cần membership của actor tại B.

PostgreSQL quan sát hai backend riêng cùng chờ tại actual UPDATE trước khi
khóa tạm do diagnostic giữ được thả. Hai guard đã đi qua trước khi mutations
hoàn tất. Vì vậy classification là `CONFIRMED_RACE`, không chỉ suy luận từ
count-then-update hoặc một stress loop ngẫu nhiên.

Đây là bằng chứng runtime disposable đã ghi trong task và được tóm tắt vào
planning; không có standalone diagnostic script/log artifact được commit.
Containers đã bị hủy. Không phải production observation, HTTP-action/browser
QA hoặc regression coverage đã được lưu trong repository.

Attach STAFF và edit–edit đã được runtime kiểm chứng. Attach MANAGER,
edit–attach và attach–attach chưa chạy riêng; chúng cần future regression
coverage, không được ghi như kết quả đã PASS.

## Affected Boundaries

| Boundary                     | Assessment                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Runtime / data owner         | Cloud Backoffice server / db-cloud; không thay owner                                                        |
| Tenant scope                 | Giữ trusted organization và establishment scope, fail closed                                                |
| Membership authorization     | Giữ role enum, grant mapping, MANAGER restrictions và self-protection                                       |
| Identity / authentication    | Không đổi global user, credential, reset, session hoặc selection contract                                   |
| Persistence                  | Giữ schema/migration; chỉ bounded membership transaction behavior dự kiến thay đổi                          |
| Audit / session side effects | Giữ event semantics và scoped revocation hiện có; failed transaction không để lại committed success effects |
| Other modules                | Không đổi Personnel, Booking, Reputation, Establishment Profile hoặc authorization operations của chúng     |
| Public / local / provider    | Không public surface mới, local runtime, provider hoặc external delivery                                    |

`PAGE_LOCAL` là routing theo capability, không phải khẳng định chỉ sửa một file
UI. Nếu Design đòi thay shared permission semantics, data ownership, schema
hoặc module khác, phải dừng và reclassify; Analysis không cấp quyền mở rộng.

## Lifecycle Baseline

Giữ nguyên các giá trị hiện tại của Module Registry:

| Bounded capability                 | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review marker |
| ---------------------------------- | ---------------- | -------------- | ----------- | -------------------- | ------------------- | ------------- |
| Authentication foundation          | —                | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | NEEDS REVIEW  |
| Tenant / membership boundary       | APPROVED         | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | OK            |
| Access / membership administration | —                | IMPLEMENTED    | UNVERIFIED  | NOT_READY            | NOT_ASSESSED        | NEEDS REVIEW  |

Dấu `—` không được tự chuyển thành `APPROVED` hoặc một lifecycle value khác.
`IMPLEMENTED` của broader capability không có nghĩa invariant này đã an toàn.
Diagnostic synthetic không promote Environment hoặc Production Readiness.
Không sửa Registry hoặc Product Knowledge trong bước này.

## Requirement Readiness

`READY_FOR_SPECS`, nhưng chỉ sau explicit Gate 1 approval trên exact artifacts.

Có thể mô tả behavioral requirements mà không chọn cơ chế implementation:
giữ active OWNER của target establishment; áp dụng nhất quán cho edit/attach;
không để các concurrent successful transitions loại bỏ tất cả OWNER; failed
batch không commit một phần; giữ existing authorization và identity boundaries.

Capability duy nhất: `authorization/establishment-owner-preservation`.
Đây là main-spec coverage mới cho invariant hiện hữu. Không dùng
`skip_specs: true`; không thêm requirement cho unresolved Product workflows.

## UI / UX Applicability

Không có thay đổi layout, component, navigation, form fields hoặc action
signature được đề xuất. Tuy nhiên các thao tác trước đây thành công sai sẽ
nhận error hiện có: có ảnh hưởng tới kết quả tương tác, cần đánh giá
`UI_AFFECTING` / `BROWSER_QA_REQUIRED` theo QA protocol trước Apply, không tự
miễn Browser QA chỉ vì production diff có thể nằm ở repository.

Gate 1 không tạo page pack hoặc UX artifact, không sửa error copy từ
organization sang establishment. Bất kỳ copy/interaction redesign nào cần
được bound và review riêng trước khi đưa vào implementation allowlist.

## Conflicts and Unknowns

1. `WORDING CONFLICT` — establishment versus organization: retained for
   explicit Gate 1 review. Kết luận đề xuất là bảo vệ từng establishment;
   không tìm thấy opposing requirement cho phép zero OWNER tại establishment.
   Không âm thầm chuẩn hóa authority docs hoặc error copy.
2. `NEEDS REVIEW` — broader Access Product Decision: scoped out. Gate 1 chỉ
   review bounded invariant repair và compatibility, không approve lifecycle.
3. `RELATED SECURITY QUESTION / NEEDS SECURITY / PRODUCT DECISION` — active
   OWNER membership của DISABLED global user vẫn được count. Scoped out;
   không đổi phép đếm thành usable-principal policy.
4. Attach có nên thay đổi/reactivate existing membership: Product workflow
   decision riêng. Repair giữ behavior hợp lệ hiện tại, không quyết định lại.
5. Cơ chế concurrency control và lock ordering: technical decision dành cho
   Design sau approved requirements, không phải authority blocker cho việc
   mô tả observable invariant.
6. Production incidence, tần suất race và dữ liệu đã zero OWNER:
   `UNVERIFIED` và ngoài scope. Không có remediation/backfill được cho phép.

Không có unresolved requirement-level conflict bắt buộc chọn một policy mới
để viết bounded invariant. Nếu reviewer bác scope establishment hoặc đòi đổi
các exclusions trên, phải revise Analysis và review lại trước Specs.

## Analysis Conclusion

`READY_FOR_SPECS`.

Bounded scope được xác định cho review: `PAGE_LOCAL`, Cloud Access Management,
security-sensitive, cả attachment bypass lẫn confirmed edit concurrency race.
Chỉ capability `authorization/establishment-owner-preservation` có thể đi tiếp
sau Gate 1 approval; `skip_specs: true` không phù hợp.

Khuyến nghị review xác nhận establishment-scoped active-membership invariant,
giữ compatibility và exclusions đã nêu, rồi cho phép viết delta Specs.
Không viết Specs/Design/Tasks, implement, sync/archive hoặc promote lifecycle
trong lượt này. Gate 1 packet phải giữ `AWAITING_HUMAN_REVIEW`.
```

<!-- END EXACT analysis.md -->

## Recommendation and Stop

Recommendation: review and approve Gate 1 only if the recorded establishment
scope, preserved compatibility and separate Product questions are accepted.

`RAW OPENSPEC STATUS`: Specs ready; planning incomplete.

`YUTA OPERATIONAL READINESS`: Gate 1 — APPROVED trên exact source hashes.

Cho phép tạo delta Specs và chuẩn bị Gate 2 theo approval record, rồi dừng.
Không có Design/Tasks/implementation authorization, lifecycle promotion hoặc
sync/archive authorization được cấp bởi Gate 1.
