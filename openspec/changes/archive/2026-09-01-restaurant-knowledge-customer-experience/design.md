## Context

Xem [`proposal.md`](./proposal.md) - Why cho động cơ Product và xem delta spec
[`restaurant-knowledge/customer-experience`](./specs/restaurant-knowledge/customer-experience/spec.md)
cho behavioral contract. Đây là sensitive change vì bổ sung tenant-owned cloud
data trong capability có canonical ownership đã được chấp nhận.

Page `/etablissement/informations-generales` hiện compose Establishment Profile
với hai slice Restaurant Knowledge độc lập. Runtime `apps/backoffice` đã có
trusted tenant context, hai operation `restaurant-knowledge.read` và
`restaurant-knowledge.manage`, các loader/action fail-closed, cùng repository
`@yuta/db-cloud` dùng cả `organizationId` và `establishmentId`. Thiết kế mới phải
đi theo các boundary này nhưng không coi implementation của Concept/Histoire
hoặc Cuisine/savoir-faire là template bắt buộc.

Ba value mới là descriptive establishment knowledge. Organization vẫn chỉ là
tenancy/access envelope; browser không được chọn scope hoặc permission. Không có
module Reservations, Reputation, Today, Personnel, POS/orders, Marketing, CRM,
external provider hoặc runtime khác tham gia luồng đọc hay ghi.

Worktree có thay đổi tồn tại trước change này, gồm cả implementation của các
slice Restaurant Knowledge đã hoàn tất. Apply sau Gate 2b phải lấy exact bytes
hiện tại của các file dùng chung làm baseline, chỉ attribution phần tăng thêm
cho change này và không dùng diff so với `HEAD` đơn thuần để nhận ownership.

## Goals / Non-Goals

**Goals:**

- Tạo một persistence boundary riêng của Restaurant Knowledge cho đúng ba value
  `desiredExperience`, `welcomeAndService` và `customerAttention`, tương ứng với
  ba label Product đã phê duyệt.
- Giữ một row theo establishment scope, all-empty hợp lệ, và một atomic upsert
  cho toàn bộ slice.
- Tách READ-gated loading khỏi MANAGE-gated editing/saving trong boundary server
  hiện có.
- Giữ draft ở client cho tới một explicit submit; không phát sinh persistence
  từ change, blur, timer hoặc effect.
- Chứng minh tenant isolation, grant/denial, state combinations, no-autosave,
  non-relationship với các module bị loại trừ và regression của các capability
  hiện hữu.

**Non-Goals:**

- Không thay đổi permission, role, principal, tenant semantics, canonical
  ownership hoặc runtime topology.
- Không tạo shared transport contract, API công khai, cross-runtime contract
  hoặc dependency tới module khác.
- Không thêm Product validation, content limit, required field, taxonomy, enum,
  scoring, analytics, CRM/customer preference hay operational workflow.
- Không thiết kế AI, automatic learning, provenance/history, Marketing/social,
  provider, embeddings/vector DB hoặc Restaurant Knowledge family khác.
- Không promote Environment hoặc Production Readiness trong change này.

## Decisions

### 1. Dùng một bảng Restaurant Knowledge riêng cho slice

`@yuta/db-cloud` sẽ sở hữu bảng
`restaurant_knowledge_customer_experience`, với composite primary key
`(organization_id, establishment_id)` và composite foreign key tới
establishment hiện có. Foreign key dùng delete behavior hạn chế giống tenant-owned
Restaurant Knowledge boundary hiện tại. Bảng có đúng ba nullable text column:

- `desired_experience`;
- `welcome_and_service`;
- `customer_attention`.

Nullable text là technical representation tối thiểu cho ba value optional; nó
không áp đặt Product validation, taxonomy hoặc content semantics. Không có row
và row có cả ba column null đều project thành cùng valid all-empty state.

**Lý do:** một table theo slice giữ atomic whole-slice save, canonical ownership
và migration impact bounded. Composite scope ngăn lookup bằng resource ID riêng
lẻ và buộc mọi operation mang cả organization envelope lẫn establishment
semantic scope.

**Alternatives considered:** thêm column vào bảng Concept/Histoire hoặc
Cuisine/savoir-faire bị loại vì sẽ trộn các slice độc lập; một generic
key/value hoặc JSON knowledge store bị loại vì tạo data model rộng hơn ba value
đã phê duyệt; lưu trong Establishment Profile bị loại vì sai canonical
ownership; CRM/module table bị loại vì tạo dependency bị cấm.

### 2. Repository cung cấp projection và whole-slice upsert riêng

`@yuta/db-cloud` sẽ bổ sung input/projection type nội bộ package gồm đúng ba
`string | null` value, cùng hai operation:

- get theo trusted `TenantContext`;
- save toàn bộ projection theo cùng trusted `TenantContext`.

Cả hai operation gọi `requireEstablishment`, filter bằng đồng thời
`organizationId` và `establishmentId`, và không nhận tenant identifiers từ form.
Get trả ba null khi không có row. Save dùng một upsert với cả ba column trong
cùng database statement; vì vậy sửa một value vẫn submit trạng thái hiện tại
của cả slice và giữ hai value còn lại theo draft gửi lên.

**Lý do:** đây là data-access pattern đã được repository chấp nhận, không cần
shared contract hoặc API mới, đồng thời cung cấp atomicity phù hợp một explicit
whole-slice save.

**Alternatives considered:** ba operation save riêng bị loại vì phá whole-slice
atomicity và dễ tạo partial save; lookup theo establishment ID riêng bị loại vì
vi phạm tenant boundary; dùng repository của Profile hoặc module khác bị loại
vì sai ownership.

### 3. Loader kiểm tra READ trước khi truy cập repository

Page-local Restaurant Knowledge loader sẽ có một function riêng cho
`Expérience client`. Nếu tenant không có `restaurant-knowledge.read`, loader trả
`null` mà không gọi repository. Nếu có READ, loader lấy projection và tính
`canManage` bằng operation `restaurant-knowledge.manage` riêng biệt. Page chỉ
render section khi loader trả dữ liệu.

Page vẫn dùng trusted session và active organization/establishment/membership
validation hiện hữu. Requirement Profile READ đang bảo vệ route tổng thể không
được diễn giải thành Restaurant Knowledge READ; section chỉ được truy cập sau
permission check riêng.

**Lý do:** giữ READ/MANAGE tách biệt và ngăn STAFF hoặc principal không có READ
gây database read cho slice.

**Alternatives considered:** dựa vào `establishment.profile.read/manage`, chỉ
ẩn control ở client hoặc load rồi mới che UI đều bị loại vì không enforce
Restaurant Knowledge authorization ở server.

### 4. Server action tái lập tenant context và require MANAGE trước persistence

Một page-local server action riêng sẽ:

1. lấy lại authenticated tenant context cho route hiện tại;
2. require active establishment;
3. require `restaurant-knowledge.manage`;
4. parse đúng ba form value như `string | null`, normalize chuỗi rỗng thành
   null ở technical boundary;
5. gọi đúng một repository whole-slice save;
6. revalidate route sau success.

Shape parsing và empty-to-null normalization chỉ bảo vệ technical boundary,
không thêm required content, length, format, taxonomy hay Product validation.
Permission được kiểm tra trước parse/persistence để STAFF và principal chỉ có
READ không thể ghi.

**Lý do:** browser form là untrusted input; action phải tự xác định scope và
permission thay vì tin props hoặc hidden fields.

**Alternatives considered:** client-side persistence, API route mới, reuse
Profile action hoặc permission, và shared contract mới đều không cần thiết và
không phù hợp boundary đã duyệt.

### 5. Form page-local giữ một draft và một submit duy nhất

Section `Expérience client` sẽ là route-local component với đúng ba labeled
textarea. Một page-local model giữ ba value độc lập. Form khởi tạo draft từ
server projection, cập nhật từng property trong local state và tính dirty state
so với projection ban đầu.

Khi `canManage` là false, fields ở read-only/disabled presentation và không có
save control. Khi `canManage` là true, form có đúng một submit control cho cả
slice; control chỉ khả dụng khi draft khác initial projection. Không có
`useEffect` persistence, on-change action, on-blur action, timer, optimistic
write hoặc background request. Thành công revalidate page để server projection
trở lại làm canonical displayed state.

Section được compose độc lập trong page hiện hữu, sau các Restaurant Knowledge
slice đã có. Việc cùng route hoặc cùng visual stack không thay đổi ownership và
không tạo data dependency giữa các form.

**Lý do:** local draft thể hiện rõ explicit-save contract và cho phép ba value
optional thay đổi độc lập trước một atomic submit.

**Alternatives considered:** autosave per field, ba form/save button, merge vào
GeneralInformationForm hoặc merge với slice khác đều bị loại vì phá save hoặc
ownership boundary.

### 6. Không tạo module relationship ngầm

Implementation chỉ được import từ page-local Backoffice code, authorization/
tenant infrastructure hiện hữu, `@yuta/db-cloud` và reusable presentation
primitives. Không thêm read, write, event, link, foreign key, sync job, consumer
hook hoặc contract cho Reservations, Reputation/reviews, Today,
Personnel/Gestion équipe, POS/Site Agent/orders, Marketing/social, CRM hoặc
provider.

Verification sẽ kết hợp tests hành vi với source/dependency inspection. Việc
người dùng tự nhập descriptive text không được diễn giải thành structured
customer preference hoặc operational datum.

### 7. Verification dựa trên boundary và observable behavior

Apply phải bổ sung focused evidence sau:

- migration chạy trên disposable PostgreSQL và schema có composite scope/FK;
- repository: missing/all-null, mỗi single-value state, full round-trip,
  whole-slice overwrite và denial/isolation cho sai organization hoặc
  establishment scope;
- loader/action: OWNER và MANAGER có READ/MANAGE, STAFF không read/write,
  READ-only không save, Profile permission không thay thế Restaurant Knowledge
  permission, unauthorized path không gọi repository;
- form/model: all-empty và từng single-value state, edit độc lập, đúng một
  submit, một action invocation cho whole slice, không action khi change/blur
  và không autosave mechanism;
- page behavior: section visibility/read-only/editable states và regression cho
  Profile, Concept/Histoire, Cuisine/savoir-faire;
- source/dependency evidence xác nhận không đọc, ghi, link hoặc synchronize với
  các module bị loại trừ;
- required repository checks, với exact commands và truthful results.

Không dùng mock permission/client behavior làm bằng chứng thay thế cho focused
server-boundary tests. Nếu disposable database không khả dụng, Gate 3 phải ghi
đúng giới hạn thay vì tuyên bố migration/tenant isolation đã được thực thi.

### 8. Attribution trong dirty worktree là change-scoped

Ngay trước Apply, workflow phải lưu hash của các shared files dự kiến sửa và
snapshot `git status`. New files dành riêng cho Customer Experience được
attribution trực tiếp; với shared files, Gate 3 diff phải được tạo từ saved
pre-Apply bytes tới post-Apply bytes. Mọi drift ngoài edits do change này trong
quá trình Apply phải được dừng và phân loại trước khi tiếp tục.

Design/Gate 2b chỉ được phép tạo `design.md`, cập nhật review packet được duyệt
và tạo `02b-design-review.md`. Không tạo `tasks.md`, migration, schema,
repository, UI, test hoặc documentation implementation trước approval Gate 2b.

## Risks / Trade-offs

- **[Risk] Một row nullable khiến “chưa có row” và “đã lưu all-empty” có cùng
  projection** → Đây là chủ ý vì Product coi all-empty hợp lệ; tests xác nhận
  observable state giống nhau và save vẫn atomic.
- **[Risk] Shared schema/repository/page/action files đang có thay đổi trước đó**
  → Hash exact pre-Apply bytes, patch additively và báo cáo change-scoped diff;
  không reset hoặc nhận ownership toàn file.
- **[Risk] Route tổng thể hiện còn Profile READ guard** → Giữ route contract
  hiện tại để tránh regression, đồng thời enforce Restaurant Knowledge READ
  trước section repository access; không diễn giải Profile permission là quyền
  của slice.
- **[Risk] Additive table tăng migration surface** → Dùng generated migration
  kế tiếp journal hiện tại, transaction/migration validation và disposable DB
  evidence trước Gate 3.
- **[Risk] UI text có thể bị dùng như operational/customer-specific data** →
  Chỉ lưu unclassified descriptive text; không thêm relation, structured field,
  consumer hoặc inference.
- **[Trade-off] Dedicated table lặp composite tenant columns** → Chấp nhận sự
  lặp nhỏ để giữ slice ownership, atomic save và isolation rõ ràng thay vì tạo
  abstraction/generalized store ngoài scope.

## Migration Plan

1. Sau Gate 2b, snapshot hashes và trạng thái worktree cho exact attribution.
2. Bổ sung schema export và tạo migration Drizzle additive kế tiếp journal hiện
   tại cho dedicated table; không sửa dữ liệu của Profile hoặc slice hiện hữu.
3. Chạy migration trên disposable database, kiểm tra composite key/FK và các
   existing migrations trước khi dựa vào repository evidence.
4. Bổ sung repository, server loader/action, page-local model/form/fields và
   page composition theo các decision trên.
5. Chạy focused tests rồi required docs, architecture, typecheck và relevant
   Backoffice/cloud checks; cập nhật current Product/page-pack documentation mà
   không promote lifecycle ngoài trạng thái được duyệt.
6. Tạo Gate 3 packet với full change-scoped implementation/migration diff và
   exact results; dừng trước normative sync/archive.

Rollback application có thể ngừng reference dedicated additive table trong một
change được review, trong khi để table/data ở trạng thái dormant nhằm tránh mất
dữ liệu. Change này không tạo destructive down migration hoặc tự động drop
table. Việc xóa table/data, nếu từng cần, phải là một quyết định và workflow
riêng. Migration failure phải fail deployment transaction trước khi application
phụ thuộc vào table.

## Open Questions

Không có open question ảnh hưởng Specs, approach hoặc task breakdown. Tên vật
lý của generated migration/snapshot sẽ do Drizzle tạo theo journal tại thời
điểm Apply; đây là chi tiết tooling không thay đổi thiết kế.
